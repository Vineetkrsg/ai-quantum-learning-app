import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { SimulationResult, Circuit } from '../../../types/quantum';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { 
  Activity, 
  BarChart3, 
  Table, 
  Play, 
  Pause, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  Info, 
  Sparkles, 
  Compass, 
  Eye, 
  Atom, 
  CheckCircle2,
  Maximize2
} from 'lucide-react';

export interface WaveAmplitudeVisualizerProps {
  result: SimulationResult | null;
  circuit?: Circuit;
  className?: string;
  title?: string;
  onExploreInLab?: () => void;
}

export interface StateAmplitudePoint {
  index: number;
  state: string;
  dirac: string;
  real: number;
  imag: number;
  magnitude: number;
  probability: number;
  phaseRad: number;
  phaseDeg: number;
}

/**
 * Wave / Amplitude View
 * Scientifically grounded 3D and 2D visualization of the simulated quantum state's
 * complex amplitude vector, phase orientation, and theoretical Born probability distribution.
 */
export const WaveAmplitudeVisualizer: React.FC<WaveAmplitudeVisualizerProps> = ({
  result,
  circuit,
  className = '',
  title = 'Wave / Amplitude View',
  onExploreInLab
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<'3d' | '2d' | 'table'>('3d');
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedStateIndex, setSelectedStateIndex] = useState<number>(0);
  const [hoveredStateIndex, setHoveredStateIndex] = useState<number | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // Compute exact amplitudes from simulator's stateVector
  const amplitudes: StateAmplitudePoint[] = useMemo(() => {
    if (!result) return [];
    if (result.stateVector && result.stateVector.length > 0) {
      return result.stateVector.map((sv, idx) => {
        const real = sv.real;
        const imag = sv.imag;
        const magnitude = Math.sqrt(real * real + imag * imag);
        const probability = sv.probability ?? Number((magnitude * magnitude).toFixed(4));
        const phaseRad = Math.atan2(imag, real);
        let phaseDeg = Math.round((phaseRad * 180) / Math.PI);
        if (phaseDeg < 0) phaseDeg += 360;

        return {
          index: idx,
          state: sv.state,
          dirac: `|${sv.state}⟩`,
          real,
          imag,
          magnitude: Number(magnitude.toFixed(4)),
          probability: Number(probability.toFixed(4)),
          phaseRad,
          phaseDeg
        };
      });
    }

    // Fallback if stateVector was somehow empty
    return Object.entries(result.probabilities).map(([state, prob], idx) => {
      const mag = Math.sqrt(prob);
      return {
        index: idx,
        state,
        dirac: `|${state}⟩`,
        real: Number(mag.toFixed(4)),
        imag: 0,
        magnitude: Number(mag.toFixed(4)),
        probability: Number(prob.toFixed(4)),
        phaseRad: 0,
        phaseDeg: 0
      };
    });
  }, [result]);

  const numQubits = useMemo(() => {
    if (circuit?.numberOfQubits) return circuit.numberOfQubits;
    if (amplitudes.length > 0) return Math.round(Math.log2(amplitudes.length)) || 1;
    return 1;
  }, [circuit, amplitudes]);

  // Keep selection in valid range
  useEffect(() => {
    if (selectedStateIndex >= amplitudes.length && amplitudes.length > 0) {
      setSelectedStateIndex(0);
    }
  }, [amplitudes.length, selectedStateIndex]);

  const activeInspectedPoint = useMemo(() => {
    if (hoveredStateIndex !== null && amplitudes[hoveredStateIndex]) {
      return amplitudes[hoveredStateIndex];
    }
    return amplitudes[selectedStateIndex] || amplitudes[0];
  }, [amplitudes, hoveredStateIndex, selectedStateIndex]);

  // Circuit contextual physics explanation
  const circuitContextExplanation = useMemo(() => {
    if (!circuit || !circuit.gates || circuit.gates.length === 0) {
      return {
        tag: 'Ground State |0...0⟩',
        text: 'The quantum register begins unperturbed in computational ground state |0...0⟩ with 100% amplitude magnitude and zero relative phase.'
      };
    }

    const gates = circuit.gates;
    if (circuit.numberOfQubits === 1) {
      if (gates.length === 1 && gates[0].gateId === 'H') {
        return {
          tag: 'Hadamard Equal Superposition',
          text: 'The Hadamard gate rotated the statevector to the equator, splitting the amplitude symmetrically into (|0⟩ + |1⟩)/√2 with equal 50% probability.'
        };
      }
      if (gates.length >= 2 && gates[0].gateId === 'H' && gates[1].gateId === 'H') {
        return {
          tag: 'Quantum Wave Interference (H · H = I)',
          text: 'Consecutive Hadamard gates cause wave interference: destructive wave interference completely cancels the |1⟩ amplitude to 0, while constructive interference restores 100% amplitude to |0⟩.'
        };
      }
      if (gates.length === 1 && gates[0].gateId === 'X') {
        return {
          tag: 'Pauli-X State Inversion',
          text: 'The Pauli-X unitary operation inverted the ground state |0⟩ to excited state |1⟩, shifting 100% of the wave amplitude to basis state |1⟩.'
        };
      }
      if (gates.some(g => g.gateId === 'Z' || g.gateId === 'S' || g.gateId === 'T')) {
        return {
          tag: 'Complex Phase Shift',
          text: 'Phase unitary rotation shifted the complex phase angle φ in the complex plane while preserving amplitude magnitudes and Born probabilities.'
        };
      }
    }

    if (circuit.numberOfQubits >= 2) {
      const hasH = gates.some(g => g.gateId === 'H');
      const hasCNOT = gates.some(g => g.gateId === 'CNOT' || g.gateId === 'CX');
      if (hasH && hasCNOT) {
        return {
          tag: 'Entangled Multi-Qubit State',
          text: 'Hadamard plus CNOT synthesized an entangled composite state. Notice the wave amplitude is concentrated strictly on correlated basis states with zero amplitude on orthogonal states.'
        };
      }
    }

    return {
      tag: 'Composite Quantum Circuit',
      text: `Unitary transformations produced this exact complex amplitude distribution across all ${amplitudes.length} computational basis states.`
    };
  }, [circuit, amplitudes.length]);

  // Three.js Scene Setup & Render
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const orbitGroupRef = useRef<THREE.Group | null>(null);
  const nodesGroupRef = useRef<THREE.Group | null>(null);
  const waveLineRef = useRef<THREE.Line | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const phaseAngleRef = useRef<number>(0);

  // Dragging / Orbit interaction
  const isDraggingRef = useRef(false);
  const prevMouseRef = useRef({ x: 0, y: 0 });
  const rotRef = useRef({ x: 0.38, y: -0.55 });

  useEffect(() => {
    if (viewMode !== '3d' || !mountRef.current || amplitudes.length === 0) return;

    const container = mountRef.current;
    const width = container.clientWidth || 600;
    const height = 340;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    const baseCamDist = 6.2 / zoomLevel;
    camera.position.set(0, 2.2 / zoomLevel, baseCamDist);
    camera.lookAt(0, 0.4, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Orbit group
    const orbitGroup = new THREE.Group();
    orbitGroup.rotation.x = rotRef.current.x;
    orbitGroup.rotation.y = rotRef.current.y;
    orbitGroupRef.current = orbitGroup;
    scene.add(orbitGroup);

    // Geometry parameters
    const N = amplitudes.length;
    const xSpan = Math.min(8.5, Math.max(3.6, N * 0.45));
    const yScale = 2.4;

    // Helper: X position for state i
    const getX = (idx: number) => {
      if (N <= 1) return 0;
      return -xSpan / 2 + (idx / (N - 1)) * xSpan;
    };

    // 1. Ground Grid / Reference Plane
    const gridHelper = new THREE.GridHelper(xSpan + 1.6, Math.min(32, Math.max(8, N)), 0x0d9488, 0x1f2e42);
    gridHelper.position.y = 0;
    orbitGroup.add(gridHelper);

    // 2. Central Reference Axis (Zero Amplitude Line)
    const axisGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-xSpan / 2 - 0.4, 0, 0),
      new THREE.Vector3(xSpan / 2 + 0.4, 0, 0)
    ]);
    const axisMat = new THREE.LineBasicMaterial({ color: 0x14b8a6, transparent: true, opacity: 0.7 });
    const axisLine = new THREE.Line(axisGeo, axisMat);
    orbitGroup.add(axisLine);

    // 3. Nodes and Phasors Group
    const nodesGroup = new THREE.Group();
    nodesGroupRef.current = nodesGroup;
    orbitGroup.add(nodesGroup);

    // Color by phase helper
    const getPhaseColor = (rad: number) => {
      // Smooth color wheel: 0 -> Cyan/Teal, PI/2 -> Emerald, PI -> Amber, 3PI/2 -> Purple
      const hue = ((rad % (2 * Math.PI)) + (2 * Math.PI)) % (2 * Math.PI);
      const color = new THREE.Color();
      color.setHSL(hue / (2 * Math.PI), 0.85, 0.55);
      return color;
    };

    // Populate basis state markers, stems, and probability pillars
    amplitudes.forEach((pt, idx) => {
      const x = getX(idx);
      const y = pt.real * yScale;
      const z = pt.imag * yScale;
      const isSelected = idx === selectedStateIndex;

      // Vertical phasor stem from ground (x, 0, 0) to complex point (x, y, z)
      const stemGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(x, 0, 0),
        new THREE.Vector3(x, y, z)
      ]);
      const stemMat = new THREE.LineBasicMaterial({
        color: isSelected ? 0xf59e0b : 0x0d9488,
        transparent: true,
        opacity: pt.magnitude > 0.01 ? 0.85 : 0.25,
        linewidth: isSelected ? 2 : 1
      });
      const stem = new THREE.Line(stemGeo, stemMat);
      nodesGroup.add(stem);

      // Probability pillar (semi-transparent volume showing Born rule P = |α|²)
      if (pt.probability > 0.005) {
        const pillarHeight = Math.max(0.04, pt.probability * yScale * 0.75);
        const pillarGeo = new THREE.CylinderGeometry(0.08, 0.08, pillarHeight, 16);
        const pillarMat = new THREE.MeshBasicMaterial({
          color: 0x0d9488,
          transparent: true,
          opacity: isSelected ? 0.45 : 0.25
        });
        const pillarMesh = new THREE.Mesh(pillarGeo, pillarMat);
        pillarMesh.position.set(x, pillarHeight / 2, 0);
        nodesGroup.add(pillarMesh);
      }

      // Amplitude Node Sphere at (x, y, z)
      const sphereRadius = Math.max(0.06, Math.min(0.20, 0.08 + pt.magnitude * 0.12));
      const sphereGeo = new THREE.SphereGeometry(sphereRadius, 16, 16);
      const sphereMat = new THREE.MeshBasicMaterial({
        color: isSelected ? 0xf59e0b : getPhaseColor(pt.phaseRad),
        wireframe: false
      });
      const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
      sphereMesh.position.set(x, y, z);
      sphereMesh.userData = { stateIndex: idx };
      nodesGroup.add(sphereMesh);

      // Selected Highlight Ring
      if (isSelected) {
        const ringGeo = new THREE.RingGeometry(sphereRadius * 1.35, sphereRadius * 1.6, 24);
        const ringMat = new THREE.MeshBasicMaterial({
          color: 0xf59e0b,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.9
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.position.set(x, y, z);
        ringMesh.lookAt(camera.position);
        nodesGroup.add(ringMesh);
      }

      // Base footprint marker at Y=0
      const baseGeo = new THREE.CircleGeometry(0.1, 16);
      baseGeo.rotateX(-Math.PI / 2);
      const baseMat = new THREE.MeshBasicMaterial({
        color: isSelected ? 0xf59e0b : 0x223043,
        transparent: true,
        opacity: 0.6
      });
      const baseMesh = new THREE.Mesh(baseGeo, baseMat);
      baseMesh.position.set(x, 0.01, 0);
      nodesGroup.add(baseMesh);
    });

    // 4. Continuous Wave Curve (Interpolated Spline Connecting Complex Amplitudes)
    if (amplitudes.length >= 2) {
      const curvePoints: THREE.Vector3[] = [];
      const numInterpolated = Math.max(64, amplitudes.length * 8);

      for (let s = 0; s <= numInterpolated; s++) {
        const t = s / numInterpolated;
        const exactIdx = t * (amplitudes.length - 1);
        const lowerIdx = Math.floor(exactIdx);
        const upperIdx = Math.min(amplitudes.length - 1, Math.ceil(exactIdx));
        const fraction = exactIdx - lowerIdx;

        const ptA = amplitudes[lowerIdx];
        const ptB = amplitudes[upperIdx];

        // Smooth cosine interpolation between consecutive basis states
        const smoothF = (1 - Math.cos(fraction * Math.PI)) / 2;
        const curReal = ptA.real * (1 - smoothF) + ptB.real * smoothF;
        const curImag = ptA.imag * (1 - smoothF) + ptB.imag * smoothF;
        const curX = getX(lowerIdx) * (1 - smoothF) + getX(upperIdx) * smoothF;

        curvePoints.push(new THREE.Vector3(curX, curReal * yScale, curImag * yScale));
      }

      const waveGeo = new THREE.BufferGeometry().setFromPoints(curvePoints);
      const waveMat = new THREE.LineBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.85
      });
      const waveLine = new THREE.Line(waveGeo, waveMat);
      waveLineRef.current = waveLine;
      orbitGroup.add(waveLine);
    }

    // Animation Loop
    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);

      if (isPlaying) {
        phaseAngleRef.current += 0.025;
        const curPhaseOffset = phaseAngleRef.current;

        // Rotate phasors in Y-Z plane according to global phase e^(-i*omega*t)
        // Note: magnitude and probability remain 100% constant!
        nodesGroup.children.forEach((child) => {
          if (child.userData && child.userData.stateIndex !== undefined) {
            const idx = child.userData.stateIndex;
            const pt = amplitudes[idx];
            if (pt) {
              const x = getX(idx);
              const dynamicPhase = pt.phaseRad - curPhaseOffset;
              const y = pt.magnitude * Math.cos(dynamicPhase) * yScale;
              const z = pt.magnitude * Math.sin(dynamicPhase) * yScale;
              child.position.set(x, y, z);
            }
          }
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    // Mouse drag rotation listeners
    const handlePointerDown = (e: PointerEvent) => {
      isDraggingRef.current = true;
      prevMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDraggingRef.current || !orbitGroupRef.current) return;
      const dx = e.clientX - prevMouseRef.current.x;
      const dy = e.clientY - prevMouseRef.current.y;
      prevMouseRef.current = { x: e.clientX, y: e.clientY };

      rotRef.current.y += dx * 0.008;
      rotRef.current.x = Math.max(-0.4, Math.min(1.2, rotRef.current.x + dy * 0.008));
      orbitGroupRef.current.rotation.x = rotRef.current.x;
      orbitGroupRef.current.rotation.y = rotRef.current.y;
    };

    const handlePointerUp = () => {
      isDraggingRef.current = false;
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    // Resize observer
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries[0] || !rendererRef.current) return;
      const newWidth = entries[0].contentRect.width;
      camera.aspect = newWidth / height;
      camera.updateProjectionMatrix();
      rendererRef.current.setSize(newWidth, height);
    });
    resizeObserver.observe(container);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      resizeObserver.disconnect();
      domElement.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      renderer.dispose();
      container.innerHTML = '';
    };
  }, [viewMode, amplitudes, isPlaying, selectedStateIndex, zoomLevel]);

  // Reset 3D camera & orbit orientation
  const handleResetOrbit = () => {
    rotRef.current = { x: 0.38, y: -0.55 };
    setZoomLevel(1);
    if (orbitGroupRef.current) {
      orbitGroupRef.current.rotation.x = 0.38;
      orbitGroupRef.current.rotation.y = -0.55;
    }
  };

  if (!result || amplitudes.length === 0) {
    return (
      <Card variant="default" className="p-8 text-center flex flex-col items-center justify-center min-h-[220px]" data-testid="wave-amplitude-visualizer">
        <Activity className="w-10 h-10 text-[var(--fg-muted)] mb-2 opacity-50 animate-pulse" />
        <p className="text-sm font-medium text-[var(--fg-main)]">Awaiting Simulation</p>
        <p className="text-xs text-[var(--fg-muted)] mt-1 max-w-sm">
          Run your quantum circuit to compute the exact statevector and visualize its complex amplitude wave.
        </p>
      </Card>
    );
  }

  return (
    <Card variant="default" className={`overflow-hidden space-y-0 ${className}`} data-testid="wave-amplitude-visualizer">
      {/* Visualizer Header */}
      <CardHeader className="py-3 px-4 sm:px-5 border-b border-[var(--border-card)] bg-[var(--surface-sunken)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-sciteal-500/15 text-sciteal-700 dark:text-sciteal-300 border border-sciteal-500/30 flex items-center justify-center font-bold shrink-0">
            <Activity className="w-4 h-4 text-sciteal-600 dark:text-sciteal-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <CardTitle className="text-sm font-bold text-[var(--fg-main)]">{title}</CardTitle>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold border bg-sciteal-500/15 text-sciteal-700 dark:text-sciteal-300 border-sciteal-500/30">
                {numQubits} Qubit{numQubits > 1 ? 's' : ''} ({amplitudes.length} Basis States)
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--surface-card)] border border-[var(--border-card)] text-[var(--fg-muted)]">
                Σ |α|² = 1.0000
              </span>
            </div>
            <p className="text-[11px] text-[var(--fg-muted)]">
              Simulated quantum state's complex amplitudes, phase angles, and theoretical probabilities
            </p>
          </div>
        </div>

        {/* View Switcher Controls */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto flex-wrap">
          <div className="flex items-center rounded-lg bg-[var(--surface-card)] border border-[var(--border-card)] p-0.5 text-xs font-mono">
            <button
              type="button"
              onClick={() => setViewMode('3d')}
              className={`px-2.5 py-1 rounded transition-all flex items-center gap-1 ${
                viewMode === '3d'
                  ? 'bg-sciteal-600 text-white font-bold'
                  : 'text-[var(--fg-muted)] hover:text-[var(--fg-main)]'
              }`}
            >
              <Activity className="w-3 h-3" />
              <span>3D Wave</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('2d')}
              className={`px-2.5 py-1 rounded transition-all flex items-center gap-1 ${
                viewMode === '2d'
                  ? 'bg-sciteal-600 text-white font-bold'
                  : 'text-[var(--fg-muted)] hover:text-[var(--fg-main)]'
              }`}
            >
              <BarChart3 className="w-3 h-3" />
              <span>2D Spectrum</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`px-2.5 py-1 rounded transition-all flex items-center gap-1 ${
                viewMode === 'table'
                  ? 'bg-sciteal-600 text-white font-bold'
                  : 'text-[var(--fg-muted)] hover:text-[var(--fg-main)]'
              }`}
            >
              <Table className="w-3 h-3" />
              <span>Data Table</span>
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-5 space-y-4">
        {/* Educational Principle Callout (Section 6 & 13) */}
        <div className="p-3.5 rounded-xl bg-sciteal-500/10 border border-sciteal-500/25 text-xs text-[var(--fg-main)] space-y-1.5">
          <div className="flex items-center gap-2 font-bold font-mono text-sciteal-800 dark:text-sciteal-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>What you're seeing:</span>
          </div>
          <p className="leading-relaxed text-[var(--fg-muted)]">
            A visual representation of the simulated quantum state's complex amplitudes across its basis states.
            Wave height represents amplitude magnitude (<span className="font-mono text-[var(--fg-main)] font-semibold">|αᵢ|</span>), while
            radial angle represents the complex phase (<span className="font-mono text-[var(--fg-main)] font-semibold">φᵢ = arg(αᵢ)</span>).
            Measurement probabilities (<span className="font-mono text-[var(--fg-main)] font-semibold">P(i) = |αᵢ|²</span>) are obtained from
            the squared amplitude magnitude according to the Born rule.
          </p>
        </div>

        {/* Circuit Context Explanation Banner (Section 11 & 14) */}
        <div className="p-3 rounded-lg bg-[var(--surface-sunken)] border border-[var(--border-card)] flex items-start gap-2.5 text-xs">
          <Atom className="w-4 h-4 text-sciteal-600 dark:text-sciteal-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold text-[var(--fg-main)] mr-1.5">{circuitContextExplanation.tag}:</span>
            <span className="text-[var(--fg-muted)]">{circuitContextExplanation.text}</span>
          </div>
        </div>

        {/* MODE 1: 3D INTERACTIVE WAVE VIEW */}
        {viewMode === '3d' && (
          <div className="space-y-3">
            <div className="relative rounded-xl border border-[var(--border-card)] bg-[var(--surface-sunken)] overflow-hidden shadow-inner">
              {/* 3D Canvas Mount */}
              <div 
                ref={mountRef} 
                className="w-full h-[340px] cursor-grab active:cursor-grabbing touch-none select-none"
              />

              {/* 3D Overlay Toolbar (Zoom, Rotate, Animate) */}
              <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-[var(--surface-card)]/90 backdrop-blur-md border border-[var(--border-card)] rounded-lg p-1 text-xs shadow-sm">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsPlaying(!isPlaying)}
                  title={isPlaying ? 'Pause Time Evolution' : 'Animate Global Phase Rotation (e^(-iωt))'}
                  className="px-2 py-1 h-auto text-xs"
                >
                  {isPlaying ? (
                    <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-mono font-semibold">
                      <Pause className="w-3 h-3" /> Pause
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-sciteal-700 dark:text-sciteal-300 font-mono font-semibold">
                      <Play className="w-3 h-3" /> Phase Motion
                    </span>
                  )}
                </Button>

                <div className="w-[1px] h-4 bg-[var(--border-card)]" />

                <button
                  type="button"
                  onClick={() => setZoomLevel(prev => Math.min(1.6, prev + 0.15))}
                  title="Zoom In"
                  className="p-1.5 hover:bg-[var(--surface-subtle)] text-[var(--fg-muted)] hover:text-[var(--fg-main)] rounded transition-colors"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => setZoomLevel(prev => Math.max(0.65, prev - 0.15))}
                  title="Zoom Out"
                  className="p-1.5 hover:bg-[var(--surface-subtle)] text-[var(--fg-muted)] hover:text-[var(--fg-main)] rounded transition-colors"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={handleResetOrbit}
                  title="Reset 3D Perspective"
                  className="p-1.5 hover:bg-[var(--surface-subtle)] text-[var(--fg-muted)] hover:text-[var(--fg-main)] rounded transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* 3D Legend & Interaction Hint */}
              <div className="absolute bottom-2.5 left-3 flex items-center gap-3 text-[10px] font-mono text-[var(--fg-muted)] bg-[var(--surface-card)]/80 backdrop-blur-sm px-2.5 py-1 rounded-md border border-[var(--border-card)]">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" /> Complex Amplitude Wave
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-sm bg-teal-600/60" /> Probability Pillar (|α|²)
                </span>
                <span className="text-[9px] text-[var(--fg-subtle)] hidden sm:inline">
                  • Drag to Orbit • Scroll to Zoom
                </span>
              </div>
            </div>
          </div>
        )}

        {/* MODE 2: 2D PHASE & AMPLITUDE SPECTRUM */}
        {viewMode === '2d' && (
          <div className="space-y-4 p-4 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border-card)]">
            <div className="flex items-center justify-between border-b border-[var(--border-card)] pb-2 text-xs font-mono font-semibold">
              <span className="text-[var(--fg-main)]">Computational Basis Amplitude & Phase Spectrum</span>
              <span className="text-[var(--fg-muted)]">P(i) = |αᵢ|²</span>
            </div>

            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {amplitudes.map((pt) => {
                const isSelected = pt.index === selectedStateIndex;
                const probPercent = (pt.probability * 100).toFixed(1);

                return (
                  <div
                    key={pt.state}
                    onClick={() => setSelectedStateIndex(pt.index)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer space-y-2 ${
                      isSelected
                        ? 'bg-[var(--surface-card)] border-sciteal-500 ring-1 ring-sciteal-500/30'
                        : 'bg-[var(--surface-card)]/60 border-[var(--border-card)] hover:border-sciteal-500/40'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-mono">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded font-bold bg-sciteal-500/15 text-sciteal-700 dark:text-sciteal-300 border border-sciteal-500/30">
                          {pt.dirac}
                        </span>
                        <span className="text-[11px] text-[var(--fg-muted)]">
                          α = {pt.real.toFixed(3)} {pt.imag >= 0 ? '+' : '-'} {Math.abs(pt.imag).toFixed(3)}i
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-right">
                        <span className="text-[11px] text-[var(--fg-muted)]">
                          |α| = <strong className="text-[var(--fg-main)]">{pt.magnitude.toFixed(3)}</strong>
                        </span>
                        <span className="text-xs font-bold text-sciteal-700 dark:text-sciteal-300">
                          {probPercent}%
                        </span>
                      </div>
                    </div>

                    {/* Dual Track: Magnitude (top) & Probability (bottom) */}
                    <div className="space-y-1">
                      <div className="w-full bg-[var(--surface-subtle)] h-2 rounded-full overflow-hidden flex">
                        <div
                          className="bg-sky-500 h-full rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(100, pt.magnitude * 100)}%` }}
                          title={`Amplitude Magnitude: ${pt.magnitude}`}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-[var(--fg-muted)] font-mono">
                        <span>Phase: {pt.phaseDeg}° ({pt.phaseRad.toFixed(2)} rad)</span>
                        <span>Born Probability: {probPercent}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* MODE 3: ACCESSIBLE DATA TABLE (Requirement 18) */}
        {viewMode === 'table' && (
          <div className="rounded-xl border border-[var(--border-card)] bg-[var(--surface-sunken)] overflow-hidden shadow-inner">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono" role="table" aria-label="Quantum Statevector Amplitudes Table">
                <thead className="bg-[var(--surface-card)] border-b border-[var(--border-card)] text-[var(--fg-muted)]">
                  <tr>
                    <th className="py-2.5 px-3">Basis State</th>
                    <th className="py-2.5 px-3">Complex Amplitude (α = a + bi)</th>
                    <th className="py-2.5 px-3 text-right">Magnitude (|α|)</th>
                    <th className="py-2.5 px-3 text-right">Probability (|α|²)</th>
                    <th className="py-2.5 px-3 text-right">Phase (φ)</th>
                    <th className="py-2.5 px-3">Quantum Physical Interpretation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-card)] text-[var(--fg-main)]">
                  {amplitudes.map((pt) => {
                    const isSelected = pt.index === selectedStateIndex;
                    const probPct = (pt.probability * 100).toFixed(2);
                    let role = 'Zero Probability Branch (Destructive Interference)';
                    if (pt.probability > 0.99) role = 'Deterministic State Output (100% Collapse Target)';
                    else if (pt.probability > 0.001) role = 'Active Superposition Branch';

                    return (
                      <tr 
                        key={pt.state}
                        onClick={() => setSelectedStateIndex(pt.index)}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? 'bg-sciteal-500/15' : 'hover:bg-[var(--surface-card)]'
                        }`}
                      >
                        <td className="py-2 px-3 font-bold text-sciteal-700 dark:text-sciteal-300">
                          {pt.dirac}
                        </td>
                        <td className="py-2 px-3 text-[var(--fg-muted)]">
                          {pt.real >= 0 ? '+' : ''}{pt.real.toFixed(4)} {pt.imag >= 0 ? '+' : '-'}{Math.abs(pt.imag).toFixed(4)}i
                        </td>
                        <td className="py-2 px-3 text-right font-semibold">
                          {pt.magnitude.toFixed(4)}
                        </td>
                        <td className="py-2 px-3 text-right font-bold text-sciteal-700 dark:text-sciteal-300">
                          {probPct}%
                        </td>
                        <td className="py-2 px-3 text-right text-[var(--fg-muted)]">
                          {pt.phaseDeg}° ({pt.phaseRad.toFixed(2)} rad)
                        </td>
                        <td className="py-2 px-3 text-[11px] text-[var(--fg-muted)] truncate max-w-xs">
                          {role}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* QUICK BASIS STATE SELECTOR CHIPS (Requirement 8 & 10) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[10px] font-mono text-[var(--fg-muted)] uppercase tracking-wider">
            <span>Inspect Computational Basis State:</span>
            <span>Click any state to highlight in 3D & inspect values</span>
          </div>

          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
            {amplitudes.map((pt) => {
              const isSelected = pt.index === selectedStateIndex;
              const probPct = (pt.probability * 100).toFixed(0);

              return (
                <button
                  key={pt.state}
                  type="button"
                  onClick={() => setSelectedStateIndex(pt.index)}
                  onMouseEnter={() => setHoveredStateIndex(pt.index)}
                  onMouseLeave={() => setHoveredStateIndex(null)}
                  className={`px-2.5 py-1 rounded-lg border text-xs font-mono transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-sciteal-500/20 border-sciteal-500 text-sciteal-900 dark:text-sciteal-100 font-bold ring-1 ring-sciteal-500/40'
                      : pt.probability > 0.001
                        ? 'bg-[var(--surface-card)] border-[var(--border-card)] text-[var(--fg-main)] hover:border-sciteal-500/40'
                        : 'bg-[var(--surface-sunken)] border-[var(--border-card)] text-[var(--fg-muted)] opacity-60'
                  }`}
                >
                  <span className="font-bold">{pt.dirac}</span>
                  <span className="text-[10px] opacity-80">{probPct}%</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* DETAILED STATE INSPECTOR CARD (Requirement 4, 9 & 10) */}
        {activeInspectedPoint && (
          <div className="p-4 rounded-xl bg-[var(--surface-card)] border border-[var(--border-card)] space-y-3 shadow-sm">
            <div className="flex items-center justify-between border-b border-[var(--border-card)] pb-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded font-mono font-bold text-sm bg-sciteal-500/20 text-sciteal-800 dark:text-sciteal-200 border border-sciteal-500/40">
                  {activeInspectedPoint.dirac}
                </span>
                <span className="text-xs font-medium text-[var(--fg-main)]">
                  Computational Basis Vector Inspection
                </span>
              </div>
              <span className="text-[11px] font-mono text-sciteal-700 dark:text-sciteal-300 font-bold">
                P({activeInspectedPoint.state}) = {(activeInspectedPoint.probability * 100).toFixed(2)}%
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-[var(--surface-sunken)] border border-[var(--border-card)] space-y-0.5">
                <span className="text-[10px] text-[var(--fg-muted)] block uppercase">Complex Amplitude α</span>
                <span className="font-bold text-[var(--fg-main)]">
                  {activeInspectedPoint.real.toFixed(4)} {activeInspectedPoint.imag >= 0 ? '+' : '-'} {Math.abs(activeInspectedPoint.imag).toFixed(4)}i
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-[var(--surface-sunken)] border border-[var(--border-card)] space-y-0.5">
                <span className="text-[10px] text-[var(--fg-muted)] block uppercase">Magnitude |α|</span>
                <span className="font-bold text-sky-600 dark:text-sky-400">
                  {activeInspectedPoint.magnitude.toFixed(4)}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-[var(--surface-sunken)] border border-[var(--border-card)] space-y-0.5">
                <span className="text-[10px] text-[var(--fg-muted)] block uppercase">Born Probability |α|²</span>
                <span className="font-bold text-sciteal-700 dark:text-sciteal-300">
                  {(activeInspectedPoint.probability * 100).toFixed(2)}%
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-[var(--surface-sunken)] border border-[var(--border-card)] space-y-0.5">
                <span className="text-[10px] text-[var(--fg-muted)] block uppercase">Complex Phase φ</span>
                <span className="font-bold text-amber-600 dark:text-amber-400">
                  {activeInspectedPoint.phaseDeg}° ({activeInspectedPoint.phaseRad.toFixed(3)} rad)
                </span>
              </div>
            </div>

            {/* Educational Concept Comparison */}
            <div className="text-[11px] text-[var(--fg-muted)] pt-1 flex items-center justify-between border-t border-[var(--border-card)]">
              <span>
                <strong>State Status:</strong>{' '}
                {activeInspectedPoint.probability > 0.001 
                  ? 'Non-zero amplitude contributes to quantum state vector' 
                  : 'Zero amplitude (destructive interference / orthogonal state)'}
              </span>
              <span className="font-mono text-[10px]">
                Norm Contribution: {(activeInspectedPoint.magnitude ** 2).toFixed(4)}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
