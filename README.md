# QuLearn AI — AI-Powered Quantum Algorithm Learning Platform

QuLearn AI is an interactive, pedagogical quantum computing learning platform designed to bridge the gap between abstract quantum mechanics, visual circuit design, and production quantum programming.

---

## 🏛️ System Architecture

To ensure technical transparency and rigorous engineering standards, QuLearn AI strictly separates its **current client-side simulation runtime**, its **backend service layer**, and **planned future simulation backends**.

```text
========================================================================================
CURRENT CLIENT RUNTIME (Circuit Lab)
========================================================================================
User
  ↓
Circuit Lab UI
  ↓
LabPage.tsx
  ↓
frontend/src/services/quantumSimulator.ts
  ↓
Custom TypeScript State-Vector Simulator
  ↓
State Vector (2^n Complex Amplitudes)
  ↓
Theoretical Probabilities & Born's Rule
  ↓
Measurement Sampling / Shots (Simulated Shot Noise)
  ↓
Interactive Visualizations (Histograms, State Vectors, Bloch Spheres)

========================================================================================
BACKEND SERVICES & EXTENSIBILITY LAYER (FastAPI)
========================================================================================
FastAPI Backend
  ├── AI Tutor Service (Gemini API & Contextual Pedagogical Engine)
  ├── Static Syntax & Circuit Inspection
  └── QuantumSimulationService (Extensibility Abstraction Layer)
        └── MockSimulationService (Default Endpoint Mock)

========================================================================================
FUTURE EXTENSIBILITY (Planned / Optional)
========================================================================================
Backend Simulation Plugins (Planned):
  └── Qiskit / Qiskit Aer Backend Integration
        └── Note: Qiskit/Aer is a planned future integration option for the backend
            abstraction layer. It is NOT currently a runtime dependency of Circuit Lab.
```

---

## 🔬 Quantum Simulation Details

### Current Simulation Engine: Custom TypeScript State-Vector Simulator
- **File**: `frontend/src/services/quantumSimulator.ts`
- **Execution Model**: Runs directly in the browser with zero network latency.
- **Mathematical Accuracy**:
  - Full complex-number statevector evolution using exact $2 \times 2$ unitary matrices for single-qubit gates ($H$, $X$, $Y$, $Z$, $S$, $T$) and multi-qubit gates ($CNOT$, $SWAP$).
  - Exact theoretical probabilities computed via Born's rule ($P(s) = |\alpha_s|^2$).
  - Projective measurement sampling across user-selected shots (e.g., 1,024 shots) using cumulative distribution sampling to simulate physical shot noise.
  - Single-qubit Bloch sphere coordinate derivation $(\theta, \phi, x, y, z)$.

### 5-Qubit Educational Limit
- The browser simulator supports up to **5 qubits** ($2^5 = 32$ complex amplitudes).
- **Reason**: A state-vector simulation of $n$ qubits requires $2^n$ complex amplitudes. Limiting the in-browser simulator to five qubits keeps the educational experience responsive and predictable with instant client-side execution.
- *Note*: This limit is a deliberate design and resource choice of the educational simulator, not a fundamental limitation of quantum computing itself.

### Circuit ↔ Code Translation (Qiskit & OpenQASM)
- QuLearn AI features a **Circuit ↔ Code** pedagogical bridge that dynamically translates visual circuit configurations into:
  1. **Python Qiskit Scripts**: Code containing `QuantumCircuit`, gate applications, and AerSimulator run setups that students can copy into Jupyter notebooks or IBM Quantum Lab.
  2. **OpenQASM 2.0**: Standard quantum assembly language representation.
- *Distinction*: This translation is an export and educational mapping tool. It does not mean the in-browser Circuit Lab executes Python or Qiskit.

---

## 🚀 Getting Started

### Prerequisites
- Node.js $\ge$ 18
- Python $\ge$ 3.10 (for backend AI Tutor & API services)

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Backend Setup
```bash
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
uvicorn backend.app.main:app --reload --port 8000
```

---

## 🧪 Testing

### Frontend Simulator & State Isolation Tests
Run the automated verification suite covering mathematical accuracy, reversibility, Bell state entanglement, and experiment state isolation:
```bash
cd frontend
npx tsx src/tests/test_quantum_lab_2.ts
npx tsx src/tests/test_state_isolation.ts
npx tsx src/tests/test_onboarding_demo.ts
```

### Tests Covered:
- **Ground State**: $|0\rangle \to 100\%$ theoretical probability, $1,024/1,024$ shots.
- **Pauli-X Inversion**: $X|0\rangle \to |1\rangle$ ($100\%$).
- **Hadamard Superposition**: $H|0\rangle \to 50/50$ theoretical probability, balanced measurement shots.
- **Reversibility**: $H \cdot H = I \to 100\% |0\rangle$.
- **Phase-to-Bit Inversion**: $H \cdot Z \cdot H = X \to 100\% |1\rangle$.
- **Bell State Entanglement**: $H + CNOT \to ( |00\rangle + |11\rangle ) / \sqrt{2}$, zero shots for $|01\rangle$ and $|10\rangle$.
- **Experiment State Isolation**: Guided experiments maintain independent state and do not pollute Circuit Lab freeform canvas.
