# 🛰️ NASA ISS 3D Fire Spread Simulation & Microgravity Safety Intelligence
**NASA Space Apps Challenge 2026 | Physical Sciences Informatics (PSI) & Combustion Physics**

---

## 🚀 Overview

This interactive application is a **high-fidelity 3D Fire Spread Simulation inside the International Space Station (ISS)**, built to explore the physics of microgravity combustion, forced ventilation dynamics, compartment isolation, and autonomous astronaut life-safety countermeasures.

The simulation directly supports the official NASA 3D CAD/PBR interior model:
`International Space Station (ISS) (E) [internal].fbx` (315 MB, 303 meshes, 41 materials).

---

## ⚡ Quick Start

### Option 1: One-Click Local Server (Recommended)
Double-click `start_simulation.bat` in this folder:
1. It automatically starts a local HTTP server on port 8080 (via Python or Node).
2. It launches your default web browser to `http://localhost:8080/index.html`.
3. In this mode, the 315 MB FBX file (`International Space Station (ISS) (E) [internal].fbx`) is detected and fetched automatically with a live loading progress indicator!

### Option 2: Direct Double-Click (`file:///`)
Double-click `index.html` directly in File Explorer:
- The app immediately launches with an interactive **High-Fidelity 3D CAD Station Model** (8 pressurized modules).
- To load the full 315 MB FBX interior model, simply click **`Load ISS FBX (315 MB)`** in the top bar or drag-and-drop the FBX file onto the 3D viewport. (Uses native `FileReader` / `URL.createObjectURL` to bypass browser local file CORS restrictions).

---

## 🔬 Core Simulation Physics & Features

### 1. Multi-Compartment Reaction-Diffusion Engine
The ISS interior is modeled as an interconnected network of 8 primary pressurized modules:
- **US Lab (Destiny)**: Houses the Combustion Integrated Rack (CIR) and EXPRESS Racks 1–5 ($106\text{ m}^3$).
- **Node 2 (Harmony)**: Forward hub, crew sleeping quarters, and docking connection to Crew Dragon ($75\text{ m}^3$).
- **Columbus Laboratory (ESA)**: European science laboratory module ($75\text{ m}^3$).
- **Kibo JPM (JAXA)**: Japanese Experiment Module, largest pressurized volume ($130\text{ m}^3$).
- **Node 1 (Unity)**: Aft hub, galley, and dining wardroom ($70\text{ m}^3$).
- **Node 3 (Tranquility)**: ECLSS water recovery, oxygen generation, and gym ($75\text{ m}^3$).
- **Quest Joint Airlock**: High-pressure EVA equipment and airlock ($34\text{ m}^3$).
- **Cupola Dome**: 360° Earth-viewing panoramic observation dome ($8\text{ m}^3$).

### 2. Microgravity Combustion & Forced Airflow Mechanics
- **Buoyancy Suppression ($g \approx 0$)**: Without natural gravity, hot air does not rise. Natural chimney convection is absent.
- **ECLSS Forced Ventilation ($v_{flow} = 0.15\text{ m/s}$)**: The Environmental Control and Life Support System circulates air to prevent stagnant $CO_2$ pockets.
  - **Concurrent (Forward) Flame Spread**: Flames elongate downstream along ventilation ducts, preheating unburned cables and polymers.
  - **Quiescent Flame**: When fans are tripped, flame collapses into an isotropic spherical blue chemiluminescence core (CH* radicals at 431nm).
- **Limiting Oxygen Concentration (LOC $\approx 13.5\%$)**: As fire consumes $O_2$, burn rate drops. When $O_2 \le 13.5\%$, the fire starves and self-extinguishes.
- **Toxic Gas Build-up ($CO, CO_2, \text{Smoke}$)**: Incomplete combustion in oxygen-lean microgravity produces toxic Carbon Monoxide spikes ($> 1500\text{ ppm}$) and dense optical obscuration.

### 3. Bulkhead Hatch Containment Matrix
6 inter-module hatches can be individually toggled **OPEN** or **SEALED**:
- `Hatch 01`: Node 1 ↔ US Lab
- `Hatch 02`: US Lab ↔ Node 2
- `Hatch 03`: Node 2 ↔ Columbus
- `Hatch 04`: Node 2 ↔ Kibo
- `Hatch 05`: Node 1 ↔ Node 3
- `Hatch 06`: Node 1 ↔ Quest Airlock

**Tactical Principle**: When a hatch is **SEALED**, smoke and heat transmission to adjacent modules drops to **0.0**. The fire exhausts remaining oxygen within that compartment and suffocates. If left **OPEN**, flashover temperatures ($> 420^\circ\text{C}$) can ignite adjacent modules!

### 4. Life-Safety Countermeasures
- **🚨 ECLSS Emergency Fan Trip**: Cuts forced ventilation ducts ($v_{vent} \to 0\text{ m/s}$), slowing smoke migration by 80%.
- **🧯 Portable Fire Extinguisher (PFE)**: Injects fine water mist (PBW) or $CO_2$ to quench flame and drop compartment temperature.
- **💨 Emergency Vacuum Vent**: Vents target module to space vacuum (0 kPa), instantly eliminating oxygen.
- **🔄 Reset Station Atmosphere**: Restores nominal 21.0% $O_2$, 101.3 kPa, 22.0°C.

### 5. Multi-Spectral 3D View Modes
- **🎨 PBR Architectural**: Realistic interior cabin lighting, equipment rack LEDs, and emergency red strobe beacons.
- **🌡️ FLIR Thermal Heatmap**: False-color infrared shader displaying real-time wall temperatures from dark navy (22°C) to incandescent white-hot ($> 500^\circ\text{C}$).
- **💨 Smoke Optical Density**: Visualizes volumetric smoke clouds billowing through corridors.
- **🌀 ECLSS Airflow Streamlines**: Animated glowing cyan particles showing duct circulation velocity.
- **🔍 X-Ray Hull**: Translucent hull to inspect interior spread from any exterior 3D angle.

---

## 🎮 Interactive Features & Controls
- **Click in 3D to Ignite**: Click anywhere on the 3D model to spark a fire at that exact 3D coordinate.
- **Mission Incident Presets**:
  - `Destiny CIR Rack Fuel Leak Fire`
  - `Node 2 Crew Quarters Li-ion Thermal Runaway`
  - `Columbus EXPRESS Rack 3 Electrical Arc`
  - `Kibo JEM Experiment Locker Flare`
- **Camera Bookmarks**: Smooth transitions to Overview, US Lab, Node 2, Columbus, Kibo, and Cupola.
- **SI Crew Survivability & Escape Route**: Real-time evaluation of safe evacuation corridors to the docked Crew Dragon / Soyuz capsule.
