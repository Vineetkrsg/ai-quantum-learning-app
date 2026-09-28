import { Circuit, CircuitStepState, GateOperation, SimulationResult, StateVectorElement } from '../types/quantum';

interface Complex {
  r: number;
  i: number;
}

const cAdd = (a: Complex, b: Complex): Complex => ({ r: a.r + b.r, i: a.i + b.i });
const cSub = (a: Complex, b: Complex): Complex => ({ r: a.r - b.r, i: a.i - b.i });
const cMul = (a: Complex, b: Complex): Complex => ({
  r: a.r * b.r - a.i * b.i,
  i: a.r * b.i + a.i * b.r
});
const cAbsSq = (a: Complex): number => a.r * a.r + a.i * a.i;

const SQRT1_2 = Math.SQRT1_2;

// Standard 2x2 unitary matrices for single-qubit gates
const SINGLE_GATES: Record<string, [Complex, Complex, Complex, Complex]> = {
  H: [
    { r: SQRT1_2, i: 0 }, { r: SQRT1_2, i: 0 },
    { r: SQRT1_2, i: 0 }, { r: -SQRT1_2, i: 0 }
  ],
  X: [
    { r: 0, i: 0 }, { r: 1, i: 0 },
    { r: 1, i: 0 }, { r: 0, i: 0 }
  ],
  Y: [
    { r: 0, i: 0 }, { r: 0, i: -1 },
    { r: 0, i: 1 }, { r: 0, i: 0 }
  ],
  Z: [
    { r: 1, i: 0 }, { r: 0, i: 0 },
    { r: 0, i: 0 }, { r: -1, i: 0 }
  ],
  S: [
    { r: 1, i: 0 }, { r: 0, i: 0 },
    { r: 0, i: 0 }, { r: 0, i: 1 }
  ],
  T: [
    { r: 1, i: 0 }, { r: 0, i: 0 },
    { r: 0, i: 0 }, { r: SQRT1_2, i: SQRT1_2 }
  ]
};

/**
 * Custom TypeScript state-vector quantum circuit simulator.
 * 
 * Simulates up to 5 qubits (2^n = 32 complex state amplitudes) with theoretical fidelity,
 * exact state evolution, and projective measurement shot sampling.
 * 
 * Note on the 5-qubit limit:
 * A state-vector simulation of n qubits requires 2^n complex amplitudes. Limiting the browser
 * simulator to five qubits keeps the educational experience responsive and predictable with
 * zero client-side latency. This is a deliberate design and resource limit of the current
 * educational in-browser simulator, not a fundamental limitation of quantum computing itself.
 */
export function simulateQuantumCircuit(circuit: Circuit, shots: number = 1024): SimulationResult {
  const startTime = performance.now();
  const n = Math.max(1, Math.min(5, circuit.numberOfQubits));
  const numStates = 1 << n;

  // Initialize statevector in computational ground state |0...0>
  let state: Complex[] = Array.from({ length: numStates }, (_, i) =>
    i === 0 ? { r: 1, i: 0 } : { r: 0, i: 0 }
  );

  // Sort gates chronologically by position, then by id/target
  const sortedGates = [...circuit.gates].sort((a, b) => {
    if (a.position !== b.position) return a.position - b.position;
    return a.targetQubit - b.targetQubit;
  });

  // Apply quantum operations sequentially
  for (const op of sortedGates) {
    const gateId = op.gateId.toUpperCase();
    if (gateId === 'M') {
      // Measurement is projective readout, handled after unitary evolution
      continue;
    }

    if (gateId in SINGLE_GATES) {
      const matrix = SINGLE_GATES[gateId];
      const target = op.targetQubit;
      if (target < 0 || target >= n) continue;

      const targetMask = 1 << (n - 1 - target);
      const nextState: Complex[] = [...state];

      for (let j = 0; j < numStates; j++) {
        if ((j & targetMask) === 0) {
          const j0 = j;
          const j1 = j | targetMask;
          const v0 = state[j0];
          const v1 = state[j1];

          // v0' = u00 * v0 + u01 * v1
          // v1' = u10 * v0 + u11 * v1
          nextState[j0] = cAdd(cMul(matrix[0], v0), cMul(matrix[1], v1));
          nextState[j1] = cAdd(cMul(matrix[2], v0), cMul(matrix[3], v1));
        }
      }
      state = nextState;
    } else if (gateId === 'CNOT' || gateId === 'CX') {
      const ctrl = op.controlQubit ?? (op.targetQubit === 0 ? 1 : 0);
      const target = op.targetQubit;
      if (ctrl < 0 || ctrl >= n || target < 0 || target >= n || ctrl === target) continue;

      const ctrlMask = 1 << (n - 1 - ctrl);
      const targetMask = 1 << (n - 1 - target);
      const nextState: Complex[] = [...state];

      for (let j = 0; j < numStates; j++) {
        // Only flip target if control is 1 and target is 0
        if ((j & ctrlMask) !== 0 && (j & targetMask) === 0) {
          const j0 = j;
          const j1 = j | targetMask;
          nextState[j0] = state[j1];
          nextState[j1] = state[j0];
        }
      }
      state = nextState;
    } else if (gateId === 'SWAP') {
      const qA = op.controlQubit ?? 0;
      const qB = op.targetQubit;
      if (qA < 0 || qA >= n || qB < 0 || qB >= n || qA === qB) continue;

      const maskA = 1 << (n - 1 - qA);
      const maskB = 1 << (n - 1 - qB);
      const nextState: Complex[] = [...state];

      for (let j = 0; j < numStates; j++) {
        const bitA = (j & maskA) !== 0 ? 1 : 0;
        const bitB = (j & maskB) !== 0 ? 1 : 0;
        if (bitA !== bitB && bitA === 0) {
          const jA0B1 = j;
          const jA1B0 = (j ^ maskA) ^ maskB;
          nextState[jA0B1] = state[jA1B0];
          nextState[jA1B0] = state[jA0B1];
        }
      }
      state = nextState;
    }
  }

  // Calculate theoretical probabilities from statevector amplitudes
  const theoreticalProbabilities: Record<string, number> = {};
  const stateVectorElements: StateVectorElement[] = [];
  const cumulativeDistribution: { stateStr: string; cumProb: number }[] = [];
  let cumProb = 0;

  for (let i = 0; i < numStates; i++) {
    const stateStr = i.toString(2).padStart(n, '0');
    const prob = cAbsSq(state[i]);
    theoreticalProbabilities[stateStr] = Number(prob.toFixed(6));

    stateVectorElements.push({
      state: stateStr,
      real: Number(state[i].r.toFixed(4)),
      imag: Number(state[i].i.toFixed(4)),
      probability: Number(prob.toFixed(4))
    });

    cumProb += prob;
    cumulativeDistribution.push({ stateStr, cumProb });
  }

  // Perform projective measurement sampling over requested shots
  const counts: Record<string, number> = {};
  for (let i = 0; i < numStates; i++) {
    const stateStr = i.toString(2).padStart(n, '0');
    counts[stateStr] = 0;
  }

  // Finite sample draws using cumulative distribution (simulating physical shot noise)
  const actualShots = Math.max(1, shots);
  for (let s = 0; s < actualShots; s++) {
    const r = Math.random() * cumProb;
    let selectedState = cumulativeDistribution[cumulativeDistribution.length - 1].stateStr;
    for (const entry of cumulativeDistribution) {
      if (r <= entry.cumProb) {
        selectedState = entry.stateStr;
        break;
      }
    }
    counts[selectedState] = (counts[selectedState] || 0) + 1;
  }

  // Calculate measured probabilities from sampled counts
  const measuredProbabilities: Record<string, number> = {};
  for (const [k, v] of Object.entries(counts)) {
    measuredProbabilities[k] = Number((v / actualShots).toFixed(4));
  }

  // Filter out states with 0 theoretical probability and 0 counts for clean display when states are many,
  // but always retain active basis states or states with non-zero counts
  const filteredCounts: Record<string, number> = {};
  const filteredProbs: Record<string, number> = {};
  const filteredTheoretical: Record<string, number> = {};

  const activeKeys = Object.keys(counts).filter(
    (k) => counts[k] > 0 || (theoreticalProbabilities[k] && theoreticalProbabilities[k] > 0.0001)
  );

  // If no state has count, at least show |0...0>
  if (activeKeys.length === 0) {
    const zero = '0'.repeat(n);
    filteredCounts[zero] = actualShots;
    filteredProbs[zero] = 1.0;
    filteredTheoretical[zero] = 1.0;
  } else {
    for (const k of activeKeys) {
      filteredCounts[k] = counts[k];
      filteredProbs[k] = measuredProbabilities[k];
      filteredTheoretical[k] = theoreticalProbabilities[k] || 0;
    }
  }

  // Compute single-qubit Bloch sphere coordinates if 1 qubit
  let blochCoordinates: { theta: number; phi: number; x: number; y: number; z: number } | undefined;
  if (n === 1) {
    const a = state[0];
    const b = state[1];
    const magA = Math.sqrt(cAbsSq(a));
    const theta = 2 * Math.acos(Math.min(1, Math.max(0, magA)));
    // Relative phase phi = arg(b) - arg(a)
    const phaseA = Math.atan2(a.i, a.r);
    const phaseB = Math.atan2(b.i, b.r);
    let phi = phaseB - phaseA;
    while (phi < 0) phi += 2 * Math.PI;
    while (phi >= 2 * Math.PI) phi -= 2 * Math.PI;

    const x = Number((Math.sin(theta) * Math.cos(phi)).toFixed(4));
    const y = Number((Math.sin(theta) * Math.sin(phi)).toFixed(4));
    const z = Number(Math.cos(theta).toFixed(4));

    blochCoordinates = {
      theta: Number(theta.toFixed(4)),
      phi: Number(phi.toFixed(4)),
      x,
      y,
      z
    };
  }

  const executionTimeMs = Number(Math.max(0.5, performance.now() - startTime).toFixed(2));

  return {
    circuitId: circuit.id,
    counts: filteredCounts,
    probabilities: filteredProbs,
    theoreticalProbabilities: filteredTheoretical,
    blochCoordinates,
    stateVector: stateVectorElements,
    executionTimeMs,
    shots: actualShots,
    timestamp: new Date().toISOString()
  };
}

/**
 * Step-by-step state propagation simulator.
 * 
 * Computes exact statevector and theoretical probabilities after each sequential gate operation
 * in the circuit, enabling step-by-step educational propagation (play/pause/step forward/backward)
 * with mathematical fidelity using the custom TypeScript simulation engine.
 */
export function simulateCircuitSteps(circuit: Circuit): CircuitStepState[] {
  const n = Math.max(1, Math.min(5, circuit.numberOfQubits));
  const numStates = 1 << n;

  // Initial state |0...0>
  let state: Complex[] = Array.from({ length: numStates }, (_, i) =>
    i === 0 ? { r: 1, i: 0 } : { r: 0, i: 0 }
  );

  const steps: CircuitStepState[] = [];

  const extractStepData = (
    currentState: Complex[],
    stepIndex: number,
    gate: GateOperation | null,
    stepLabel: string,
    description: string
  ): CircuitStepState => {
    const theoreticalProbabilities: Record<string, number> = {};
    const stateVectorElements: StateVectorElement[] = [];

    for (let i = 0; i < numStates; i++) {
      const stateStr = i.toString(2).padStart(n, '0');
      const prob = cAbsSq(currentState[i]);
      theoreticalProbabilities[stateStr] = Number(prob.toFixed(4));
      stateVectorElements.push({
        state: stateStr,
        real: Number(currentState[i].r.toFixed(4)),
        imag: Number(currentState[i].i.toFixed(4)),
        probability: Number(prob.toFixed(4))
      });
    }

    let blochCoordinates: { theta: number; phi: number; x: number; y: number; z: number } | undefined;
    if (n === 1) {
      const a = currentState[0];
      const b = currentState[1];
      const magA = Math.sqrt(cAbsSq(a));
      const theta = 2 * Math.acos(Math.min(1, Math.max(0, magA)));
      const phaseA = Math.atan2(a.i, a.r);
      const phaseB = Math.atan2(b.i, b.r);
      let phi = phaseB - phaseA;
      while (phi < 0) phi += 2 * Math.PI;
      while (phi >= 2 * Math.PI) phi -= 2 * Math.PI;

      blochCoordinates = {
        theta: Number(theta.toFixed(4)),
        phi: Number(phi.toFixed(4)),
        x: Number((Math.sin(theta) * Math.cos(phi)).toFixed(4)),
        y: Number((Math.sin(theta) * Math.sin(phi)).toFixed(4)),
        z: Number(Math.cos(theta).toFixed(4))
      };
    }

    let isEntangled = false;
    if (n === 2) {
      const detR = currentState[0].r * currentState[3].r - currentState[0].i * currentState[3].i -
                   (currentState[1].r * currentState[2].r - currentState[1].i * currentState[2].i);
      const detI = currentState[0].r * currentState[3].i + currentState[0].i * currentState[3].r -
                   (currentState[1].r * currentState[2].i + currentState[1].i * currentState[2].r);
      const detMag = Math.sqrt(detR * detR + detI * detI);
      isEntangled = detMag > 0.05;
    }

    return {
      stepIndex,
      gate,
      stepLabel,
      description,
      stateVector: stateVectorElements,
      theoreticalProbabilities,
      blochCoordinates,
      isEntangled
    };
  };

  steps.push(
    extractStepData(
      state,
      0,
      null,
      'Initial Ground State',
      `Quantum register initialized in computational ground state |${'0'.repeat(n)}⟩.`
    )
  );

  const sortedGates = [...circuit.gates].sort((a, b) => {
    if (a.position !== b.position) return a.position - b.position;
    return a.targetQubit - b.targetQubit;
  });

  for (let stepIdx = 0; stepIdx < sortedGates.length; stepIdx++) {
    const op = sortedGates[stepIdx];
    const gateId = op.gateId.toUpperCase();

    if (gateId === 'M') {
      steps.push(
        extractStepData(
          state,
          stepIdx + 1,
          op,
          `Measurement (M) on Qubit ${op.targetQubit}`,
          `Projective readout on Qubit ${op.targetQubit}. Collapses quantum superposition into discrete classical bit output.`
        )
      );
      continue;
    }

    if (gateId in SINGLE_GATES) {
      const matrix = SINGLE_GATES[gateId];
      const target = op.targetQubit;
      if (target < 0 || target >= n) continue;

      const targetMask = 1 << (n - 1 - target);
      const nextState: Complex[] = [...state];

      for (let j = 0; j < numStates; j++) {
        if ((j & targetMask) === 0) {
          const j0 = j;
          const j1 = j | targetMask;
          const v0 = state[j0];
          const v1 = state[j1];

          nextState[j0] = cAdd(cMul(matrix[0], v0), cMul(matrix[1], v1));
          nextState[j1] = cAdd(cMul(matrix[2], v0), cMul(matrix[3], v1));
        }
      }
      state = nextState;

      let gateDesc = `Applied ${gateId} gate on Qubit ${target}.`;
      if (gateId === 'H') {
        gateDesc = `Hadamard gate applied to Qubit ${target}: Rotated state into equal superposition (|+⟩ = (|0⟩+|1⟩)/√2).`;
      } else if (gateId === 'X') {
        gateDesc = `Pauli-X (NOT) gate applied to Qubit ${target}: Inverts state vector across X-axis (|0⟩ ↔ |1⟩).`;
      } else if (gateId === 'Y') {
        gateDesc = `Pauli-Y gate applied to Qubit ${target}: Combines bit-flip with ±i phase rotation.`;
      } else if (gateId === 'Z') {
        gateDesc = `Pauli-Z gate applied to Qubit ${target}: Inverts phase of |1⟩ component (φ → π) while preserving measurement probabilities.`;
      } else if (gateId === 'S') {
        gateDesc = `Phase-S gate applied to Qubit ${target}: Advances relative phase by +π/2 (quarter turn around Z-axis).`;
      } else if (gateId === 'T') {
        gateDesc = `T gate (π/8) applied to Qubit ${target}: Advances relative phase by +π/4 around Z-axis.`;
      }

      steps.push(
        extractStepData(
          state,
          stepIdx + 1,
          op,
          `${gateId} Gate on Qubit ${target}`,
          gateDesc
        )
      );
    } else if (gateId === 'CNOT' || gateId === 'CX') {
      const ctrl = op.controlQubit ?? (op.targetQubit === 0 ? 1 : 0);
      const target = op.targetQubit;
      if (ctrl < 0 || ctrl >= n || target < 0 || target >= n || ctrl === target) continue;

      const ctrlMask = 1 << (n - 1 - ctrl);
      const targetMask = 1 << (n - 1 - target);
      const nextState: Complex[] = [...state];

      for (let j = 0; j < numStates; j++) {
        if ((j & ctrlMask) !== 0 && (j & targetMask) === 0) {
          const j0 = j;
          const j1 = j | targetMask;
          nextState[j0] = state[j1];
          nextState[j1] = state[j0];
        }
      }
      state = nextState;

      const stepData = extractStepData(
        state,
        stepIdx + 1,
        op,
        `CNOT (q${ctrl} → q${target})`,
        `Controlled-NOT gate applied. Qubit ${target} conditionally flips when Qubit ${ctrl} is |1⟩.`
      );
      if (stepData.isEntangled) {
        stepData.description += ' This operation produced quantum entanglement between wires.';
      }
      steps.push(stepData);
    } else if (gateId === 'SWAP') {
      const qA = op.controlQubit ?? 0;
      const qB = op.targetQubit;
      if (qA < 0 || qA >= n || qB < 0 || qB >= n || qA === qB) continue;

      const maskA = 1 << (n - 1 - qA);
      const maskB = 1 << (n - 1 - qB);
      const nextState: Complex[] = [...state];

      for (let j = 0; j < numStates; j++) {
        const bitA = (j & maskA) !== 0 ? 1 : 0;
        const bitB = (j & maskB) !== 0 ? 1 : 0;
        if (bitA !== bitB && bitA === 0) {
          const jA0B1 = j;
          const jA1B0 = (j ^ maskA) ^ maskB;
          nextState[jA0B1] = state[jA1B0];
          nextState[jA1B0] = state[jA0B1];
        }
      }
      state = nextState;

      steps.push(
        extractStepData(
          state,
          stepIdx + 1,
          op,
          `SWAP (q${qA} ↔ q${qB})`,
          `State amplitudes of Qubit ${qA} and Qubit ${qB} exchanged.`
        )
      );
    }
  }

  return steps;
}
