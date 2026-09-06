from fastapi import APIRouter
from backend.app.models.quantum import SimulationRequest, SimulationResultModel
from backend.app.services.quantum_service import quantum_simulation_service

router = APIRouter(prefix="/simulate", tags=["Quantum Simulation"])

@router.post("", response_model=SimulationResultModel)
async def run_simulation(request: SimulationRequest):
    """
    Simulate a quantum circuit.
    Currently backed by MockSimulationService, ready for Qiskit Aer backend swap.
    """
    return await quantum_simulation_service.simulate(request.circuit, shots=request.shots)
