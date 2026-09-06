from typing import Optional, Dict, List
from pydantic import BaseModel, Field

class QuantumGateModel(BaseModel):
    id: str
    name: str
    symbol: str
    description: str
    numberOfQubits: int = 1
    category: str = "single"  # single, two-qubit, phase, measurement

class GateOperationModel(BaseModel):
    id: str
    gateId: str
    targetQubit: int
    controlQubit: Optional[int] = None
    position: int
    params: Optional[Dict[str, float]] = None

class CircuitModel(BaseModel):
    id: Optional[str] = None
    name: str = "Untitled Circuit"
    numberOfQubits: int = Field(default=3, ge=1, le=10)
    gates: List[GateOperationModel] = []
    measurements: List[int] = []

class SimulationRequest(BaseModel):
    circuit: CircuitModel
    shots: int = 1024
    includeStateVector: bool = True

class SimulationResultModel(BaseModel):
    circuitId: Optional[str] = None
    counts: Dict[str, int]
    probabilities: Dict[str, float]
    stateVector: Optional[List[Dict[str, float]]] = None  # [{real: float, imag: float}]
    executionTimeMs: float
    shots: int
