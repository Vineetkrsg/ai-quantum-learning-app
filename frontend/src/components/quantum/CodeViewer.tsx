import React, { useState } from 'react';
import { Circuit } from '../../types/quantum';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Code, Copy, Check } from 'lucide-react';

interface CodeViewerProps {
  circuit: Circuit;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({ circuit }) => {
  const [format, setFormat] = useState<'qiskit' | 'qasm'>('qiskit');
  const [copied, setCopied] = useState(false);

  // Generate dynamic Qiskit Python script from circuit
  const generateQiskitCode = (): string => {
    let lines = [
      'from qiskit import QuantumCircuit, transpile',
      'from qiskit_aer import AerSimulator',
      '',
      `# Initialize ${circuit.numberOfQubits}-qubit Quantum Circuit`,
      `qc = QuantumCircuit(${circuit.numberOfQubits}, ${circuit.numberOfQubits})`,
      ''
    ];

    circuit.gates.forEach((op) => {
      const gid = op.gateId.toUpperCase();
      if (gid === 'H') {
        lines.push(`qc.h(${op.targetQubit})`);
      } else if (gid === 'X') {
        lines.push(`qc.x(${op.targetQubit})`);
      } else if (gid === 'Y') {
        lines.push(`qc.y(${op.targetQubit})`);
      } else if (gid === 'Z') {
        lines.push(`qc.z(${op.targetQubit})`);
      } else if (gid === 'S') {
        lines.push(`qc.s(${op.targetQubit})`);
      } else if (gid === 'T') {
        lines.push(`qc.t(${op.targetQubit})`);
      } else if (gid === 'CNOT' || gid === 'CX') {
        const ctrl = op.controlQubit ?? 0;
        lines.push(`qc.cx(${ctrl}, ${op.targetQubit})`);
      } else if (gid === 'SWAP') {
        const ctrl = op.controlQubit ?? 0;
        lines.push(`qc.swap(${ctrl}, ${op.targetQubit})`);
      } else if (gid === 'M') {
        lines.push(`qc.measure(${op.targetQubit}, ${op.targetQubit})`);
      }
    });

    lines.push('');
    lines.push('# Run on Aer Simulator backend');
    lines.push('simulator = AerSimulator()');
    lines.push('compiled_circuit = transpile(qc, simulator)');
    lines.push('job = simulator.run(compiled_circuit, shots=1024)');
    lines.push('result = job.result()');
    lines.push('counts = result.get_counts()');
    lines.push('print("Counts:", counts)');

    return lines.join('\n');
  };

  // Generate OpenQASM 2.0 representation
  const generateQasmCode = (): string => {
    let lines = [
      'OPENQASM 2.0;',
      'include "qelib1.inc";',
      '',
      `qreg q[${circuit.numberOfQubits}];`,
      `creg c[${circuit.numberOfQubits}];`,
      ''
    ];

    circuit.gates.forEach((op) => {
      const gid = op.gateId.toLowerCase();
      if (gid === 'cnot' || gid === 'cx') {
        lines.push(`cx q[${op.controlQubit ?? 0}], q[${op.targetQubit}];`);
      } else if (gid === 'm') {
        lines.push(`measure q[${op.targetQubit}] -> c[${op.targetQubit}];`);
      } else {
        lines.push(`${gid} q[${op.targetQubit}];`);
      }
    });

    return lines.join('\n');
  };

  const codeText = format === 'qiskit' ? generateQiskitCode() : generateQasmCode();

  const handleCopy = () => {
    navigator.clipboard.writeText(codeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card variant="default">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-sm">
          <Code className="w-4 h-4 text-teal-700 dark:text-teal-400" />
          <span>Circuit Code Export</span>
        </CardTitle>
        <div className="flex items-center gap-2">
          {/* Format Switcher */}
          <div className="flex rounded-lg bg-slate-100 dark:bg-[#0c111a] p-1 border border-slate-300 dark:border-[#223043]">
            <button
              onClick={() => setFormat('qiskit')}
              className={`px-2.5 py-1 text-xs font-mono rounded ${
                format === 'qiskit'
                  ? 'bg-teal-700 text-white font-semibold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Qiskit (Python)
            </button>
            <button
              onClick={() => setFormat('qasm')}
              className={`px-2.5 py-1 text-xs font-mono rounded ${
                format === 'qasm'
                  ? 'bg-teal-700 text-white font-semibold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              OpenQASM 2.0
            </button>
          </div>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 dark:bg-[#151e2b] border border-slate-300 dark:border-[#2b3a4f] transition-colors"
            title="Copy code"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        <div className="relative">
          <pre className="p-4 rounded-xl bg-slate-900 dark:bg-[#0b0f16] border border-slate-300 dark:border-[#223043] font-mono text-xs text-teal-100 dark:text-[#d8e2ed] overflow-x-auto leading-relaxed max-h-72">
            <code>{codeText}</code>
          </pre>
        </div>
      </CardContent>
    </Card>
  );
};

