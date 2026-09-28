from abc import ABC, abstractmethod
import time
import random
from backend.app.models.quantum import CircuitModel, SimulationResultModel

class QuantumSimulationService(ABC):
    """
    Abstract interface for quantum circuit simulation in the FastAPI backend extensibility layer.

    Architecture Note:
    QuLearn AI currently uses a custom TypeScript state-vector simulator for Circuit Lab
    (frontend/src/services/quantumSimulator.ts). The FastAPI backend provides service abstractions
    and API infrastructure that can support planned future simulation-engine integrations
    (such as Qiskit/Aer or external quantum backends).
    """
    @abstractmethod
    async def simulate(self, circuit: CircuitModel, shots: int = 1024) -> SimulationResultModel:
        pass

class MockSimulationService(QuantumSimulationService):
    """
    Mock quantum simulation service providing realistic state distributions for the
    backend simulation endpoint abstraction.

    Planned future integrations (such as Qiskit/Aer) can implement QuantumSimulationService here.
    """
    async def simulate(self, circuit: CircuitModel, shots: int = 1024) -> SimulationResultModel:
        start_time = time.time()
        n_qubits = circuit.numberOfQubits
        num_states = 2 ** n_qubits
        
        # Determine if circuit has Hadamard or CNOT gates for characteristic distributions
        gate_ids = [g.gateId.lower() for g in circuit.gates]
        has_hadamard = any("h" in gid for gid in gate_ids)
        has_cnot = any("cnot" in gid or "cx" in gid for gid in gate_ids)
        
        counts = {}
        probabilities = {}
        
        if not circuit.gates:
            # All qubits remain |0...0>
            zero_state = "0" * n_qubits
            counts[zero_state] = shots
            probabilities[zero_state] = 1.0
        elif has_hadamard and has_cnot and n_qubits >= 2:
            # Bell state like distribution: |00> and |11>
            half_shots = shots // 2
            state0 = "0" * n_qubits
            state1 = "1" * 2 + "0" * (n_qubits - 2)
            counts[state0] = half_shots + random.randint(-15, 15)
            counts[state1] = shots - counts[state0]
            probabilities[state0] = round(counts[state0] / shots, 4)
            probabilities[state1] = round(counts[state1] / shots, 4)
        elif has_hadamard:
            # Superposition across outcomes
            active_states = [f"{i:0{n_qubits}b}" for i in range(min(4, num_states))]
            total = 0
            for idx, st in enumerate(active_states):
                if idx == len(active_states) - 1:
                    c = shots - total
                else:
                    c = shots // len(active_states) + random.randint(-10, 10)
                    total += c
                counts[st] = max(0, c)
                probabilities[st] = round(counts[st] / shots, 4)
        else:
            # Single deterministic or bitflip state
            target_state = "1" * min(1, n_qubits) + "0" * (n_qubits - min(1, n_qubits))
            counts[target_state] = shots
            probabilities[target_state] = 1.0
            
        elapsed_ms = round((time.time() - start_time) * 1000 + 42.5, 2)
        
        return SimulationResultModel(
            circuitId=circuit.id,
            counts=counts,
            probabilities=probabilities,
            executionTimeMs=elapsed_ms,
            shots=shots
        )

# Factory singleton
quantum_simulation_service: QuantumSimulationService = MockSimulationService()
