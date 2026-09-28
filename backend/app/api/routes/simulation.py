from fastapi import APIRouter
from backend.app.models.quantum import SimulationRequest, SimulationResultModel
from backend.app.services.quantum_service import quantum_simulation_service

router = APIRouter(prefix="/simulate", tags=["Quantum Simulation"])

@router.post("", response_model=SimulationResultModel)
async def run_simulation(request: SimulationRequest):
    """
    Simulate a quantum circuit via the backend service abstraction layer.

    Architecture Note:
    Circuit Lab currently uses the custom TypeScript state-vector simulator in the frontend
    (frontend/src/services/quantumSimulator.ts). This backend endpoint provides an extensibility
    layer for planned future simulation-engine integrations (such as Qiskit/Aer).
    """
    return await quantum_simulation_service.simulate(request.circuit, shots=request.shots)
