import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { Compass, RotateCw, Eye, Zap, Info, Layers } from 'lucide-react';
import { Button } from '../../ui/Button';

export interface BlochAngles {
  theta: number; // 0 to PI (polar angle)
  phi: number;   // 0 to 2*PI (azimuthal phase)
  x?: number;
  y?: number;
  z?: number;
}

interface InteractiveBlochSphereProps {
  // If provided, the sphere updates to reflect simulator output
  coordinates?: { theta: number; phi: number; x: number; y: number; z: number };
  initialTheta?: number;
  initialPhi?: number;
  isInteractive?: boolean;
  onStateChange?: (angles: BlochAngles) => void;
  showControls?: boolean;
  showPresets?: boolean;
  className?: string;
  size?: number; // size in px (e.g. 260)
  title?: string;
}

const PRESETS = [
  { label: '|0⟩ Ground', theta: 0, phi: 0, desc: 'North Pole: 100% |0⟩' },
  { label: '|1⟩ Excited', theta: Math.PI, phi: 0, desc: 'South Pole: 100% |1⟩' },
  { label: '|+⟩ Superpos', theta: Math.PI / 2, phi: 0, desc: 'Equator (+X): Equal Superposition (|0⟩+|1⟩)/√2' },
  { label: '|-⟩ Superpos', theta: Math.PI / 2, phi: Math.PI, desc: 'Equator (-X): Superposition with π phase (|0⟩-|1⟩)/√2' },
  { label: '|+i⟩ Phase', theta: Math.PI / 2, phi: Math.PI / 2, desc: 'Equator (+Y): Complex phase (|0⟩+i|1⟩)/√2' },
  { label: '|-i⟩ Phase', theta: Math.PI / 2, phi: (3 * Math.PI) / 2, desc: 'Equator (-Y): Complex phase (|0⟩-i|1⟩)/√2' }
];

export const InteractiveBlochSphere: React.FC<InteractiveBlochSphereProps> = ({
  coordinates,
  initialTheta = 0,
  initialPhi = 0,
  isInteractive = true,
  onStateChange,
  showControls = true,
  showPresets = true,
  className = '',
  size = 280,
  title = 'Interactive Bloch Sphere'
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<'3d' | '2d'>('3d');
  const [webGlSupported, setWebGlSupported] = useState(true);

  // State angles (theta: [0, PI], phi: [0, 2*PI])
  const [theta, setTheta] = useState<number>(() => coordinates?.theta ?? initialTheta);
  const [phi, setPhi] = useState<number>(() => coordinates?.phi ?? initialPhi);

  // Synchronize when external coordinates change
  useEffect(() => {
    if (coordinates) {
      setTheta(coordinates.theta);
      setPhi(coordinates.phi);
    }
  }, [coordinates]);

  // Derived Cartesian vector coordinates
  const x = Math.sin(theta) * Math.cos(phi);
  const y = Math.sin(theta) * Math.sin(phi);
  const z = Math.cos(theta);

  // Probabilities from Born rule
  const prob0 = Math.cos(theta / 2) ** 2;
  const prob1 = Math.sin(theta / 2) ** 2;

  // Degrees for human-readable display
  const thetaDeg = Math.round((theta * 180) / Math.PI);
  const phiDeg = Math.round((phi * 180) / Math.PI);

  const handleAngleUpdate = useCallback((newTheta: number, newPhi: number) => {
    const clampedTheta = Math.max(0, Math.min(Math.PI, newTheta));
    let normPhi = newPhi;
    while (normPhi < 0) normPhi += 2 * Math.PI;
    while (normPhi >= 2 * Math.PI) normPhi -= 2 * Math.PI;

    setTheta(clampedTheta);
    setPhi(normPhi);

    if (onStateChange) {
      onStateChange({
        theta: clampedTheta,
        phi: normPhi,
        x: Math.sin(clampedTheta) * Math.cos(normPhi),
        y: Math.sin(clampedTheta) * Math.sin(normPhi),
        z: Math.cos(clampedTheta)
      });
    }
  }, [onStateChange]);

  // Quick gate application on current state
  const applyGate = (gate: 'X' | 'Y' | 'Z' | 'H') => {
    if (gate === 'X') {
      // Rotation by pi around X axis: theta -> pi - theta, phi -> -phi
      handleAngleUpdate(Math.PI - theta, -phi);
    } else if (gate === 'Z') {
      // Rotation by pi around Z axis: theta stays, phi -> phi + pi
      handleAngleUpdate(theta, phi + Math.PI);
    } else if (gate === 'Y') {
      // Rotation by pi around Y axis
      handleAngleUpdate(Math.PI - theta, Math.PI - phi);
    } else if (gate === 'H') {
      // Hadamard: swaps X and Z on Bloch sphere
      // |0> (theta=0) -> |+> (theta=pi/2, phi=0)
      // |1> (theta=pi) -> |-> (theta=pi/2, phi=pi)
      // |+> (theta=pi/2, phi=0) -> |0> (theta=0)
      // |-> (theta=pi/2, phi=pi) -> |1> (theta=pi)
      if (Math.abs(theta) < 0.1) {
        handleAngleUpdate(Math.PI / 2, 0);
      } else if (Math.abs(theta - Math.PI) < 0.1) {
        handleAngleUpdate(Math.PI / 2, Math.PI);
      } else if (Math.abs(theta - Math.PI / 2) < 0.2 && Math.abs(phi) < 0.2) {
        handleAngleUpdate(0, 0);
      } else if (Math.abs(theta - Math.PI / 2) < 0.2 && Math.abs(phi - Math.PI) < 0.2) {
        handleAngleUpdate(Math.PI, 0);
      } else {
        // General H transformation
        const newZ = x;
        const newX = z;
        const newY = -y;
        const newTheta = Math.acos(Math.max(-1, Math.min(1, newZ)));
        const newPhi = Math.atan2(newY, newX);
        handleAngleUpdate(newTheta, newPhi);
      }
    }
  };

  // Three.js 3D WebGL Scene Setup & Render
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const arrowGroupRef = useRef<THREE.Group | null>(null);
  const orbitGroupRef = useRef<THREE.Group | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Mouse orbit dragging state
  const isDraggingRef = useRef(false);
  const prevMouseRef = useRef({ x: 0, y: 0 });
  const rotRef = useRef({ x: 0.35, y: -0.65 });

  useEffect(() => {
    if (viewMode !== '3d' || !mountRef.current) return;

    try {
      const container = mountRef.current;
      const width = container.clientWidth || size;
      const height = size;

      const scene = new THREE.Scene();
      sceneRef.current = scene;

      const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
      camera.position.set(0, 0, 4.4);

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      rendererRef.current = renderer;

      // Clear container and attach
      container.innerHTML = '';
      container.appendChild(renderer.domElement);

      // Orbit container group
      const orbitGroup = new THREE.Group();
      orbitGroup.rotation.x = rotRef.current.x;
      orbitGroup.rotation.y = rotRef.current.y;
      orbitGroupRef.current = orbitGroup;
      scene.add(orbitGroup);

      // 1. Transparent Unit Sphere
      const sphereRadius = 1.35;
      const sphereGeo = new THREE.SphereGeometry(sphereRadius, 32, 24);
      const sphereMat = new THREE.MeshBasicMaterial({
        color: 0x0d9488,
        wireframe: true,
        transparent: true,
        opacity: 0.12
      });
      const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
      orbitGroup.add(sphereMesh);

      // 2. Solid Equator Circle Ring
      const circlePoints: THREE.Vector3[] = [];
      const segs = 64;
      for (let i = 0; i <= segs; i++) {
        const a = (i / segs) * Math.PI * 2;
        circlePoints.push(new THREE.Vector3(Math.cos(a) * sphereRadius, 0, Math.sin(a) * sphereRadius));
      }
      const ringGeo = new THREE.BufferGeometry().setFromPoints(circlePoints);
      const ringMat = new THREE.LineBasicMaterial({ color: 0x14b8a6, transparent: true, opacity: 0.55 });
      const equatorRing = new THREE.Line(ringGeo, ringMat);
      orbitGroup.add(equatorRing);

      // 3. Coordinate Axes (X: Cyan, Y: Amber, Z: Teal)
      const axisLen = 1.75;
      const createAxisLine = (p1: THREE.Vector3, p2: THREE.Vector3, color: number) => {
        const geo = new THREE.BufferGeometry().setFromPoints([p1, p2]);
        const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.65 });
        return new THREE.Line(geo, mat);
      };

      // Z-axis (North |0> to South |1>) - Points Up along Y in standard 3D scene
      orbitGroup.add(createAxisLine(new THREE.Vector3(0, -axisLen, 0), new THREE.Vector3(0, axisLen, 0), 0x0d9488));
      // X-axis (East |+> to West |->)
      orbitGroup.add(createAxisLine(new THREE.Vector3(-axisLen, 0, 0), new THREE.Vector3(axisLen, 0, 0), 0x06b6d4));
      // Y-axis (+i to -i)
      orbitGroup.add(createAxisLine(new THREE.Vector3(0, 0, -axisLen), new THREE.Vector3(0, 0, axisLen), 0xd97706));

      // 4. State Vector Arrow Group
      const arrowGroup = new THREE.Group();
      arrowGroupRef.current = arrowGroup;
      orbitGroup.add(arrowGroup);

      // Vector cylinder shaft
      const shaftMat = new THREE.MeshBasicMaterial({ color: 0x14b8a6 });
      const shaftGeo = new THREE.CylinderGeometry(0.022, 0.022, sphereRadius, 16);
      shaftGeo.translate(0, sphereRadius / 2, 0); // origin at base
      const shaftMesh = new THREE.Mesh(shaftGeo, shaftMat);

      // Vector cone arrowhead
      const coneMat = new THREE.MeshBasicMaterial({ color: 0x2dd4bf });
      const coneGeo = new THREE.ConeGeometry(0.08, 0.22, 16);
      coneGeo.translate(0, sphereRadius + 0.1, 0);
      const coneMesh = new THREE.Mesh(coneGeo, coneMat);

      // Origin center sphere
      const originMat = new THREE.MeshBasicMaterial({ color: 0x0d9488 });
      const originMesh = new THREE.Mesh(new THREE.SphereGeometry(0.06, 16, 16), originMat);

      arrowGroup.add(shaftMesh);
      arrowGroup.add(coneMesh);
      arrowGroup.add(originMesh);

      // Ambient fill
      scene.add(new THREE.AmbientLight(0xffffff, 0.9));

      const render = () => {
        if (rendererRef.current && sceneRef.current) {
          rendererRef.current.render(sceneRef.current, camera);
        }
      };

      render();

      // Mouse drag controls for rotating 3D view
      const handlePointerDown = (e: PointerEvent) => {
        isDraggingRef.current = true;
        prevMouseRef.current = { x: e.clientX, y: e.clientY };
      };

      const handlePointerMove = (e: PointerEvent) => {
        if (!isDraggingRef.current || !orbitGroupRef.current) return;
        const dx = e.clientX - prevMouseRef.current.x;
        const dy = e.clientY - prevMouseRef.current.y;
        prevMouseRef.current = { x: e.clientX, y: e.clientY };

        rotRef.current.y += dx * 0.01;
        rotRef.current.x += dy * 0.01;
        orbitGroupRef.current.rotation.y = rotRef.current.y;
        orbitGroupRef.current.rotation.x = rotRef.current.x;
        render();
      };

      const handlePointerUp = () => {
        isDraggingRef.current = false;
      };

      const domElem = renderer.domElement;
      domElem.style.touchAction = 'none';
      domElem.addEventListener('pointerdown', handlePointerDown);
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);

      return () => {
        domElem.removeEventListener('pointerdown', handlePointerDown);
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', handlePointerUp);
        const animId = animFrameRef.current;
        if (animId) cancelAnimationFrame(animId);
        renderer.dispose();
        if (container.contains(domElem)) {
          container.removeChild(domElem);
        }
      };
    } catch (err) {
      console.warn('WebGL initialization failed, falling back to 2D scientific projection:', err);
    }
  }, [viewMode, size]);

  // Update arrow rotation whenever theta/phi changes
  useEffect(() => {
    if (!arrowGroupRef.current) return;

    // Convert physics spherical coordinates (theta from +Z, phi around Z)
    // to Three.js coordinates (where Z-axis is Up = +Y)
    const arrow = arrowGroupRef.current;
    
    // In physics:
    // Z = cos(theta) (Three.js Y)
    // X = sin(theta)*cos(phi) (Three.js X)
    // Y = sin(theta)*sin(phi) (Three.js Z)
    const px = Math.sin(theta) * Math.cos(phi);
    const py = Math.cos(theta); // Physics Z is Scene Y
    const pz = Math.sin(theta) * Math.sin(phi);

    const targetDir = new THREE.Vector3(px, py, pz).normalize();
    const upDir = new THREE.Vector3(0, 1, 0);

    const quaternion = new THREE.Quaternion().setFromUnitVectors(upDir, targetDir);
    arrow.setRotationFromQuaternion(quaternion);

    if (rendererRef.current && sceneRef.current) {
      const camera = new THREE.PerspectiveCamera(40, (mountRef.current?.clientWidth || size) / size, 0.1, 100);
      camera.position.set(0, 0, 4.4);
      rendererRef.current.render(sceneRef.current, camera);
    }
  }, [theta, phi, size, viewMode]);

  return (
    <div
      className={`p-4 rounded-2xl bg-[var(--surface-sunken)] border border-[var(--border-card)] space-y-4 ${className}`}
      data-testid="interactive-bloch-sphere"
      role="region"
      aria-label={`${title}: Current state |psi> = ${Math.sqrt(prob0).toFixed(2)}|0> + ${Math.sqrt(prob1).toFixed(2)}|1>`}
    >
      {/* Header with Title and Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-card)] pb-2.5">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-sciteal-600 dark:text-sciteal-400" />
          <h4 className="text-xs sm:text-sm font-bold text-[var(--fg-main)] font-mono">{title}</h4>
        </div>

        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          {webGlSupported && (
            <div className="flex items-center rounded-lg bg-[var(--surface-card)] border border-[var(--border-card)] p-0.5 text-[11px] font-mono">
              <button
                type="button"
                onClick={() => setViewMode('3d')}
                className={`px-2 py-0.5 rounded transition-all ${
                  viewMode === '3d'
                    ? 'bg-sciteal-600 text-white font-bold'
                    : 'text-[var(--fg-muted)] hover:text-[var(--fg-main)]'
                }`}
                aria-pressed={viewMode === '3d'}
              >
                3D WebGL
              </button>
              <button
                type="button"
                onClick={() => setViewMode('2d')}
                className={`px-2 py-0.5 rounded transition-all ${
                  viewMode === '2d'
                    ? 'bg-sciteal-600 text-white font-bold'
                    : 'text-[var(--fg-muted)] hover:text-[var(--fg-main)]'
                }`}
                aria-pressed={viewMode === '2d'}
              >
                2D Projection
              </button>
            </div>
          )}

          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--surface-card)] border border-[var(--border-card)] text-sciteal-700 dark:text-sciteal-300">
            θ={thetaDeg}° φ={phiDeg}°
          </span>
        </div>
      </div>

      {/* Sphere Visualizer Area */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Sphere Container */}
        <div className="md:col-span-6 flex flex-col items-center justify-center relative">
          {viewMode === '3d' && webGlSupported ? (
            <div className="relative w-full flex flex-col items-center">
              <div
                ref={mountRef}
                style={{ width: '100%', height: `${size}px`, maxWidth: `${size}px` }}
                className="cursor-grab active:cursor-grabbing mx-auto relative select-none"
                tabIndex={0}
                role="img"
                aria-label={`3D Bloch Sphere. Polar angle theta is ${thetaDeg} degrees, phase phi is ${phiDeg} degrees.`}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowUp') handleAngleUpdate(theta - 0.1, phi);
                  if (e.key === 'ArrowDown') handleAngleUpdate(theta + 0.1, phi);
                  if (e.key === 'ArrowLeft') handleAngleUpdate(theta, phi - 0.1);
                  if (e.key === 'ArrowRight') handleAngleUpdate(theta, phi + 0.1);
                }}
              />
              <span className="text-[10px] text-[var(--fg-muted)] font-mono mt-1 flex items-center gap-1">
                <span>Drag to orbit 3D view • Arrow keys rotate vector</span>
              </span>
            </div>
          ) : (
            /* 2D Orthographic Projection Fallback */
            <div className="w-56 h-56 rounded-full border-2 border-dashed border-sciteal-500/40 relative flex items-center justify-center bg-[var(--surface-card)] shadow-inner my-2">
              {/* Axes */}
              <div className="absolute top-0 bottom-0 w-[1px] bg-[var(--border-strong)]" />
              <div className="absolute left-0 right-0 h-[1px] bg-[var(--border-strong)]" />

              {/* Equator Ellipse */}
              <div className="absolute w-full h-16 rounded-full border border-teal-500/30 border-dashed" />

              {/* Poles */}
              <span className="absolute -top-3 text-[10px] font-mono font-bold text-teal-600 dark:text-teal-400 bg-[var(--surface-card)] px-1 rounded border border-[var(--border-card)]">
                |0⟩ (θ=0°)
              </span>
              <span className="absolute -bottom-3 text-[10px] font-mono font-bold text-teal-600 dark:text-teal-400 bg-[var(--surface-card)] px-1 rounded border border-[var(--border-card)]">
                |1⟩ (θ=180°)
              </span>
              <span className="absolute -right-3 text-[10px] font-mono text-[var(--fg-muted)] bg-[var(--surface-card)] px-1 rounded border border-[var(--border-card)]">
                |+⟩
              </span>
              <span className="absolute -left-3 text-[10px] font-mono text-[var(--fg-muted)] bg-[var(--surface-card)] px-1 rounded border border-[var(--border-card)]">
                |-⟩
              </span>

              {/* 2D Rotating Vector */}
              <div
                className="absolute w-1.5 h-24 bg-sciteal-600 dark:bg-sciteal-400 rounded-full origin-bottom transition-transform duration-300 shadow-md"
                style={{
                  bottom: '50%',
                  transform: `rotate(${thetaDeg}deg)`
                }}
              />
              <div className="w-3 h-3 rounded-full bg-sciteal-700 dark:bg-sciteal-300 z-10" />
            </div>
          )}
        </div>

        {/* State Breakdown & Live Born Rule Readout */}
        <div className="md:col-span-6 space-y-3">
          {/* Mathematical Dirac Representation */}
          <div className="p-3 rounded-xl bg-[var(--surface-card)] border border-[var(--border-card)] font-mono text-xs text-center space-y-1">
            <span className="text-[10px] text-[var(--fg-muted)] uppercase tracking-wider block font-sans">
              State Vector in Dirac Notation
            </span>
            <div className="text-sm font-bold text-sciteal-700 dark:text-sciteal-300">
              |ψ⟩ = {Math.sqrt(prob0).toFixed(3)}|0⟩ + {Math.sqrt(prob1).toFixed(3)}
              {phiDeg !== 0 ? `e^{i(${phiDeg}°)}` : ''}|1⟩
            </div>
            <div className="text-[10px] text-[var(--fg-muted)]">
              (x: {x.toFixed(2)}, y: {y.toFixed(2)}, z: {z.toFixed(2)})
            </div>
          </div>

          {/* Probability Bars (Born Rule) */}
          <div className="space-y-2">
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="font-semibold text-teal-700 dark:text-teal-400">Prob(|0⟩) = cos²(θ/2)</span>
                <span className="font-bold text-[var(--fg-main)]">{(prob0 * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-[var(--surface-card)] border border-[var(--border-card)] overflow-hidden">
                <div
                  className="h-full bg-teal-600 dark:bg-teal-500 rounded-full transition-all duration-300"
                  style={{ width: `${prob0 * 100}%` }}
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="font-semibold text-amber-700 dark:text-amber-400">Prob(|1⟩) = sin²(θ/2)</span>
                <span className="font-bold text-[var(--fg-main)]">{(prob1 * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-[var(--surface-card)] border border-[var(--border-card)] overflow-hidden">
                <div
                  className="h-full bg-amber-600 dark:bg-amber-500 rounded-full transition-all duration-300"
                  style={{ width: `${prob1 * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Quick Gate Operators */}
          {isInteractive && (
            <div className="pt-2 border-t border-[var(--border-card)] space-y-2">
              <div className="flex items-center justify-between text-[11px] text-[var(--fg-muted)] font-mono">
                <span className="flex items-center gap-1">
                  <Zap className="w-3 h-3 text-sciteal-600" />
                  <span>Apply Gate to Vector:</span>
                </span>
                <span className="text-[10px]">Rotates in Bloch Space</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => applyGate('H')}
                  className="p-1.5 rounded-lg border border-[var(--border-card)] bg-[var(--surface-card)] hover:border-sciteal-500 hover:bg-sciteal-500/10 text-[var(--fg-main)] font-bold transition-all text-center"
                >
                  H Gate
                </button>
                <button
                  type="button"
                  onClick={() => applyGate('X')}
                  className="p-1.5 rounded-lg border border-[var(--border-card)] bg-[var(--surface-card)] hover:border-sciteal-500 hover:bg-sciteal-500/10 text-[var(--fg-main)] font-bold transition-all text-center"
                >
                  X Gate
                </button>
                <button
                  type="button"
                  onClick={() => applyGate('Z')}
                  className="p-1.5 rounded-lg border border-[var(--border-card)] bg-[var(--surface-card)] hover:border-sciteal-500 hover:bg-sciteal-500/10 text-[var(--fg-main)] font-bold transition-all text-center"
                >
                  Z Gate
                </button>
                <button
                  type="button"
                  onClick={() => applyGate('Y')}
                  className="p-1.5 rounded-lg border border-[var(--border-card)] bg-[var(--surface-card)] hover:border-sciteal-500 hover:bg-sciteal-500/10 text-[var(--fg-main)] font-bold transition-all text-center"
                >
                  Y Gate
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Preset State Buttons */}
      {showPresets && isInteractive && (
        <div className="space-y-1.5 pt-2 border-t border-[var(--border-card)]">
          <span className="text-[10px] text-[var(--fg-muted)] uppercase tracking-wider font-mono block">
            Canonical Quantum Basis States:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {PRESETS.map((p) => {
              const isSelected =
                Math.abs(theta - p.theta) < 0.05 &&
                (p.theta === 0 || p.theta === Math.PI || Math.abs(phi - p.phi) < 0.05);

              return (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => handleAngleUpdate(p.theta, p.phi)}
                  className={`p-2 rounded-lg border text-left text-xs transition-all ${
                    isSelected
                      ? 'bg-sciteal-500/20 border-sciteal-500 text-[var(--fg-main)] font-bold shadow-sm'
                      : 'bg-[var(--surface-card)] border-[var(--border-card)] text-[var(--fg-muted)] hover:border-sciteal-500/50 hover:text-[var(--fg-main)]'
                  }`}
                >
                  <div className="font-mono text-sciteal-700 dark:text-sciteal-300 font-bold">{p.label}</div>
                  <div className="text-[10px] text-[var(--fg-muted)] truncate">{p.desc}</div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Angle Slider Controls */}
      {showControls && isInteractive && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[var(--border-card)] text-xs">
          <div className="space-y-1">
            <div className="flex justify-between font-mono text-[11px]">
              <span className="text-[var(--fg-muted)]">Polar Angle θ (Z-axis tilt)</span>
              <span className="font-bold text-sciteal-700 dark:text-sciteal-300">{thetaDeg}°</span>
            </div>
            <input
              type="range"
              min="0"
              max="180"
              value={thetaDeg}
              onChange={(e) => handleAngleUpdate((Number(e.target.value) * Math.PI) / 180, phi)}
              className="w-full accent-teal-600 cursor-pointer"
              aria-label="Polar angle theta"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between font-mono text-[11px]">
              <span className="text-[var(--fg-muted)]">Azimuth Phase φ (XY equator)</span>
              <span className="font-bold text-amber-700 dark:text-amber-400">{phiDeg}°</span>
            </div>
            <input
              type="range"
              min="0"
              max="360"
              value={phiDeg}
              onChange={(e) => handleAngleUpdate(theta, (Number(e.target.value) * Math.PI) / 180)}
              className="w-full accent-amber-600 cursor-pointer"
              aria-label="Azimuth angle phi"
            />
          </div>
        </div>
      )}
    </div>
  );
};
