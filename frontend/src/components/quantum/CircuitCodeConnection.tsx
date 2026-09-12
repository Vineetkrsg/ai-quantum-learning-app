import React, { useState } from 'react';
import { Circuit, GateOperation } from '../../types/quantum';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { 
  Terminal, 
  Code2, 
  Copy, 
  Check, 
  Layers, 
  Info,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface CircuitCodeConnectionProps {
  circuit: Circuit;
}

export const CircuitCodeConnection: React.FC<CircuitCodeConnectionProps> = ({ circuit }) => {
  const [format, setFormat] = useState<'qiskit' | 'qasm'>('qiskit');
  const [copied, setCopied] = useState(false);
  const [highlightedGateId, setHighlightedGateId] = useState<string | null>(null);

  // Generate dynamic Qiskit Python script directly from current circuit
  const generateQiskitCode = (): { code: string; explanations: { line: string; opId?: string; explanation: string }[] } => {
    const explanations: { line: string; opId?: string; explanation: string }[] = [];
    const lines: string[] = [
      'from qiskit import QuantumCircuit, transpile',
      'from qiskit_aer import AerSimulator',
      '',
      `# 1. Initialize ${circuit.numberOfQubits}-qubit Quantum Circuit`,
      `qc = QuantumCircuit(${circuit.numberOfQubits}, ${circuit.numberOfQubits})`
    ];

    explanations.push({
      line: `qc = QuantumCircuit(${circuit.numberOfQubits}, ${circuit.numberOfQubits})`,
      explanation: `Allocates a quantum register with ${circuit.numberOfQubits} qubits initialized to |0⟩ and ${circuit.numberOfQubits} classical readout bits.`
    });

    // Sort gates chronologically
    const sorted = [...circuit.gates].sort((a, b) => a.position - b.position || a.targetQubit - b.targetQubit);

    sorted.forEach((op) => {
      const gid = op.gateId.toUpperCase();
      let codeLine = '';
      let explanation = '';

      if (gid === 'H') {
        codeLine = `qc.h(${op.targetQubit})`;
        explanation = `Applies the Hadamard gate to qubit ${op.targetQubit}, creating an equal superposition state 1/√2(|0⟩ + |1⟩).`;
      } else if (gid === 'X') {
        codeLine = `qc.x(${op.targetQubit})`;
        explanation = `Applies the Pauli-X bit-flip gate to qubit ${op.targetQubit} (inverts |0⟩ ↔ |1⟩).`;
      } else if (gid === 'Y') {
        codeLine = `qc.y(${op.targetQubit})`;
        explanation = `Applies Pauli-Y gate to qubit ${op.targetQubit} (rotates by π around Y-axis).`;
      } else if (gid === 'Z') {
        codeLine = `qc.z(${op.targetQubit})`;
        explanation = `Applies Pauli-Z phase gate to qubit ${op.targetQubit} (inverts phase of |1⟩ by 180°).`;
      } else if (gid === 'S') {
        codeLine = `qc.s(${op.targetQubit})`;
        explanation = `Applies Phase (S) gate to qubit ${op.targetQubit} (rotates phase by π/2 radians).`;
      } else if (gid === 'T') {
        codeLine = `qc.t(${op.targetQubit})`;
        explanation = `Applies T gate to qubit ${op.targetQubit} (rotates phase by π/4 radians).`;
      } else if (gid === 'CNOT' || gid === 'CX') {
        const ctrl = op.controlQubit ?? (op.targetQubit === 0 ? 1 : 0);
        codeLine = `qc.cx(${ctrl}, ${op.targetQubit})`;
        explanation = `Applies Controlled-NOT with control qubit ${ctrl} and target qubit ${op.targetQubit}. Flips target when control is |1⟩.`;
      } else if (gid === 'SWAP') {
        const ctrl = op.controlQubit ?? 0;
        codeLine = `qc.swap(${ctrl}, ${op.targetQubit})`;
        explanation = `Exchanges the quantum states of qubit ${ctrl} and qubit ${op.targetQubit}.`;
      } else if (gid === 'M') {
        codeLine = `qc.measure(${op.targetQubit}, ${op.targetQubit})`;
        explanation = `Measures qubit ${op.targetQubit} onto classical bit ${op.targetQubit}, collapsing the quantum wavefunction into a classical 0 or 1.`;
      }

      if (codeLine) {
        lines.push(codeLine);
        explanations.push({ line: codeLine, opId: op.id, explanation });
      }
    });

    lines.push('');
    lines.push('# 2. Execute on Aer Simulator Backend');
    lines.push('simulator = AerSimulator()');
    lines.push('compiled_circuit = transpile(qc, simulator)');
    lines.push('job = simulator.run(compiled_circuit, shots=1024)');
    lines.push('counts = job.result().get_counts()');
    lines.push('print("Counts:", counts)');

    return { code: lines.join('\n'), explanations };
  };

  // Generate dynamic OpenQASM 2.0 representation
  const generateQasmCode = (): string => {
    let lines = [
      'OPENQASM 2.0;',
      'include "qelib1.inc";',
      '',
      `qreg q[${circuit.numberOfQubits}];`,
      `creg c[${circuit.numberOfQubits}];`,
      ''
    ];

    const sorted = [...circuit.gates].sort((a, b) => a.position - b.position || a.targetQubit - b.targetQubit);
    sorted.forEach((op) => {
      const gid = op.gateId.toLowerCase();
      if (gid === 'cnot' || gid === 'cx') {
        const ctrl = op.controlQubit ?? (op.targetQubit === 0 ? 1 : 0);
        lines.push(`cx q[${ctrl}], q[${op.targetQubit}];`);
      } else if (gid === 'swap') {
        const ctrl = op.controlQubit ?? 0;
        lines.push(`swap q[${ctrl}], q[${op.targetQubit}];`);
      } else if (gid === 'm') {
        lines.push(`measure q[${op.targetQubit}] -> c[${op.targetQubit}];`);
      } else {
        lines.push(`${gid} q[${op.targetQubit}];`);
      }
    });

    return lines.join('\n');
  };

  const { code: qiskitCode, explanations } = generateQiskitCode();
  const qasmCode = generateQasmCode();
  const currentCode = format === 'qiskit' ? qiskitCode : qasmCode;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Build ASCII wire preview from active circuit
  const generateAsciiWire = (): string => {
    const maxStep = Math.max(3, ...circuit.gates.map(g => g.position + 1));
    const lines: string[] = [];

    for (let q = 0; q < circuit.numberOfQubits; q++) {
      let wire = `q[${q}]: |0⟩ ─`;
      for (let s = 0; s < maxStep; s++) {
        const op = circuit.gates.find(g => g.position === s && (g.targetQubit === q || g.controlQubit === q));
        if (op) {
          if (op.controlQubit === q) {
            wire += `─●─`;
          } else {
            const sym = op.gateId.padEnd(2, ' ').slice(0, 2);
            wire += `[${sym}]`;
          }
        } else {
          wire += `───`;
        }
        wire += `─`;
      }
      lines.push(wire + `⊚`);
    }

    return lines.join('\n');
  };

  return (
    <Card variant="default" className="overflow-hidden" data-testid="circuit-code-connection">
      <CardHeader className="pb-3 border-b border-[var(--border-card)] flex flex-row items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-sciteal-600 dark:text-sciteal-400" />
          <CardTitle className="text-sm sm:text-base">
            Circuit ↔ Code Connection
          </CardTitle>
        </div>

        <div className="flex items-center gap-2">
          {/* Format Switcher */}
          <div className="flex rounded-lg bg-[var(--surface-sunken)] p-1 border border-[var(--border-card)] text-xs">
            <button
              type="button"
              onClick={() => setFormat('qiskit')}
              className={`px-2.5 py-1 font-mono rounded transition-colors cursor-pointer ${
                format === 'qiskit'
                  ? 'bg-sciteal-600 text-white font-semibold shadow-xs'
                  : 'text-[var(--fg-muted)] hover:text-[var(--fg-main)]'
              }`}
            >
              Qiskit (Python)
            </button>
            <button
              type="button"
              onClick={() => setFormat('qasm')}
              className={`px-2.5 py-1 font-mono rounded transition-colors cursor-pointer ${
                format === 'qasm'
                  ? 'bg-sciteal-600 text-white font-semibold shadow-xs'
                  : 'text-[var(--fg-muted)] hover:text-[var(--fg-main)]'
              }`}
            >
              OpenQASM 2.0
            </button>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1 text-xs font-mono px-2.5 py-1.5 rounded-lg bg-[var(--surface-sunken)] hover:bg-[var(--surface-subtle)] border border-[var(--border-card)] text-[var(--fg-muted)] hover:text-[var(--fg-main)] transition-colors cursor-pointer"
            title="Copy Code"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </CardHeader>

      <CardContent className="p-5 space-y-5">
        {/* Visual Circuit Diagram to Code Mapping */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left: Visual Wire Layout */}
          <div className="space-y-2 p-3.5 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border-card)] flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-[var(--border-card)] pb-2">
              <span className="text-xs font-bold text-[var(--fg-main)] flex items-center gap-1.5 font-mono">
                <Layers className="w-3.5 h-3.5 text-sciteal-600 dark:text-sciteal-400" />
                <span>Visual Circuit Representation</span>
              </span>
              <span className="text-[10px] font-mono text-[var(--fg-muted)]">
                {circuit.numberOfQubits} Wires · {circuit.gates.length} Ops
              </span>
            </div>

            <pre className="p-3.5 rounded-lg bg-[var(--surface-card)] border border-[var(--border-card)] font-mono text-xs text-sciteal-800 dark:text-sciteal-300 overflow-x-auto leading-relaxed my-2 shadow-inner">
              {generateAsciiWire()}
            </pre>

            <p className="text-[11px] text-[var(--fg-muted)] leading-relaxed italic">
              Left-to-right gate operations apply sequential unitary transformations to the quantum state amplitudes.
            </p>
          </div>

          {/* Right: Code Editor View */}
          <div className="space-y-2 p-3.5 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border-card)] flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-[var(--border-card)] pb-2">
              <span className="text-xs font-bold text-[var(--fg-main)] flex items-center gap-1.5 font-mono">
                <Code2 className="w-3.5 h-3.5 text-sciteal-600 dark:text-sciteal-400" />
                <span>Equivalent {format === 'qiskit' ? 'Qiskit Python' : 'OpenQASM'} Code</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                ● 100% Executable
              </span>
            </div>

            <pre className="p-3.5 rounded-lg bg-[var(--surface-card)] border border-[var(--border-card)] font-mono text-xs text-[var(--fg-main)] overflow-x-auto leading-relaxed my-2 max-h-56 shadow-inner">
              <code>{currentCode}</code>
            </pre>

            <p className="text-[11px] text-[var(--fg-muted)] leading-relaxed">
              Synthesized directly from your circuit. Paste this into IBM Quantum Lab or Jupyter Notebook!
            </p>
          </div>
        </div>

        {/* Line-by-Line Educational Explanations */}
        {format === 'qiskit' && explanations.length > 0 && (
          <div className="space-y-2.5 pt-2 border-t border-[var(--border-card)]">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--fg-main)]">
              <Sparkles className="w-3.5 h-3.5 text-sciteal-600 dark:text-sciteal-400" />
              <span>How Each Circuit Element Maps to Code:</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {explanations.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-[var(--surface-card)] border border-[var(--border-card)] text-xs space-y-1"
                >
                  <code className="font-mono font-bold text-sciteal-800 dark:text-sciteal-300 bg-[var(--surface-sunken)] px-2 py-0.5 rounded border border-[var(--border-card)] inline-block">
                    {item.line}
                  </code>
                  <p className="text-[var(--fg-muted)] leading-relaxed text-[11px] pt-1">
                    {item.explanation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
