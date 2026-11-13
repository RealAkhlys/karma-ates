/* =============================================================
   11. 3D ISS FIRE SPREAD SIMULATION ENGINE (THREE.JS + FBX)
   ============================================================= */

// 11.1 Compartment Graph & Physics State
const issModules = {
  us_lab: {
    id: 'us_lab',
    name: 'US Lab (Destiny)',
    pos: [0, 0, 0],
    dim: [4.2, 4.2, 8.5],
    volume: 106,
    temp: 22.0,
    o2: 21.0,
    co: 0.0,
    smoke: 0.0,
    isBurning: false,
    intensity: 0.0,
    fuel: 250,
    hrr: 0,
    group: null,
    hullMesh: null,
    racks: [],
    label: 'CIR / EXPRESS Racks'
  },
  node2: {
    id: 'node2',
    name: 'Node 2 (Harmony)',
    pos: [0, 0, 7.5],
    dim: [4.2, 4.2, 7.2],
    volume: 75,
    temp: 22.0,
    o2: 21.0,
    co: 0.0,
    smoke: 0.0,
    isBurning: false,
    intensity: 0.0,
    fuel: 180,
    hrr: 0,
    group: null,
    hullMesh: null,
    racks: [],
    label: 'Crew Sleep Quarters / PMA-2'
  },
  columbus: {
    id: 'columbus',
    name: 'Columbus (ESA)',
    pos: [6.8, 0, 7.5],
    dim: [6.8, 4.2, 4.2],
    volume: 75,
    temp: 22.0,
    o2: 21.0,
    co: 0.0,
    smoke: 0.0,
    isBurning: false,
    intensity: 0.0,
    fuel: 210,
    hrr: 0,
    group: null,
    hullMesh: null,
    racks: [],
    label: 'European Science Laboratory'
  },
  kibo: {
    id: 'kibo',
    name: 'Kibo JPM (JAXA)',
    pos: [-7.8, 0, 7.5],
    dim: [11.2, 4.2, 4.2],
    volume: 130,
    temp: 22.0,
    o2: 21.0,
    co: 0.0,
    smoke: 0.0,
    isBurning: false,
    intensity: 0.0,
    fuel: 290,
    hrr: 0,
    group: null,
    hullMesh: null,
    racks: [],
    label: 'Japanese Experiment Module'
  },
  node1: {
    id: 'node1',
    name: 'Node 1 (Unity)',
    pos: [0, 0, -7.5],
    dim: [4.2, 4.2, 5.5],
    volume: 70,
    temp: 22.0,
    o2: 21.0,
    co: 0.0,
    smoke: 0.0,
    isBurning: false,
    intensity: 0.0,
    fuel: 160,
    hrr: 0,
    group: null,
    hullMesh: null,
    racks: [],
    label: 'Galley & Wardroom Dining'
  },
  node3: {
    id: 'node3',
    name: 'Node 3 (Tranquility)',
    pos: [-5.8, 0, -7.5],
    dim: [6.7, 4.2, 4.2],
    volume: 75,
    temp: 22.0,
    o2: 21.0,
    co: 0.0,
    smoke: 0.0,
    isBurning: false,
    intensity: 0.0,
    fuel: 200,
    hrr: 0,
    group: null,
    hullMesh: null,
    racks: [],
    label: 'ECLSS Life Support & Gym'
  },
  airlock: {
    id: 'airlock',
    name: 'Quest Airlock',
    pos: [5.8, 0, -7.5],
    dim: [5.5, 4.0, 4.0],
    volume: 34,
    temp: 22.0,
    o2: 21.0,
    co: 0.0,
    smoke: 0.0,
    isBurning: false,
    intensity: 0.0,
    fuel: 110,
    hrr: 0,
    group: null,
    hullMesh: null,
    racks: [],
    label: 'EVA Equipment & Lock'
  },
  cupola: {
    id: 'cupola',
    name: 'Cupola Dome',
    pos: [-5.8, -3.2, -7.5],
    dim: [3.0, 2.0, 3.0],
    volume: 8,
    temp: 22.0,
    o2: 21.0,
    co: 0.0,
    smoke: 0.0,
    isBurning: false,
    intensity: 0.0,
    fuel: 40,
    hrr: 0,
    group: null,
    hullMesh: null,
    racks: [],
    label: 'Earth Observation Dome'
  }
};

// Bulkhead Hatches
const issHatches = {
  hatch_n1_lab: { id: 'hatch_n1_lab', name: 'Node 1 ↔ US Lab', modA: 'node1', modB: 'us_lab', isOpen: true, pos: [0, 0, -3.8], mesh: null },
  hatch_lab_n2: { id: 'hatch_lab_n2', name: 'US Lab ↔ Node 2', modA: 'us_lab', modB: 'node2', isOpen: true, pos: [0, 0, 4.2], mesh: null },
  hatch_n2_col: { id: 'hatch_n2_col', name: 'Node 2 ↔ Columbus', modA: 'node2', modB: 'columbus', isOpen: true, pos: [2.5, 0, 7.5], mesh: null },
  hatch_n2_kibo: { id: 'hatch_n2_kibo', name: 'Node 2 ↔ Kibo', modA: 'node2', modB: 'kibo', isOpen: true, pos: [-2.5, 0, 7.5], mesh: null },
  hatch_n1_n3: { id: 'hatch_n1_n3', name: 'Node 1 ↔ Node 3', modA: 'node1', modB: 'node3', isOpen: true, pos: [-2.5, 0, -7.5], mesh: null },
  hatch_n1_air: { id: 'hatch_n1_air', name: 'Node 1 ↔ Quest Airlock', modA: 'node1', modB: 'airlock', isOpen: true, pos: [2.5, 0, -7.5], mesh: null }
};

// 3D Global State
const iss3DState = {
  viewMode: 'pbr', // 'pbr', 'flir', 'smoke', 'airflow', 'xray'
  selectedModule: 'us_lab',
  fanTripped: false,
  flowVelocity: 0.15, // m/s
  fbxLoaded: false,
  fbxRoot: null,
  proceduralRoot: null,
  fbxMeshesByModule: {},
  firePosition: new THREE.Vector3(0, 0, 0),
  isAnyFire: false,
  simTimeSeconds: 0,
  activeFireSpreadVelocity: 0,
  cameraTarget: new THREE.Vector3(0, 0, 0),
  cameraDesiredPos: new THREE.Vector3(22, 14, 25),
  isLerpingCamera: false,
  raycaster: new THREE.Raycaster(),
  mouse: new THREE.Vector2()
};

// 11.2 Initialize Three.js Engine
let issScene, issCamera, issRenderer, issControls;
let flameParticles, smokeParticles, airflowParticles, extinguisherParticles;
let fireLight, emergencyStrobeLight;
let earthMesh;

function init3DISS() {
  const canvas = document.getElementById('iss-3d-canvas');
  if (!canvas) return;

  const rect = canvas.getBoundingClientRect();
  const width = canvas.clientWidth || rect.width || 800;
  const height = canvas.clientHeight || rect.height || 500;

  // Scene
  issScene = new THREE.Scene();
  issScene.background = new THREE.Color(0x030712); // Deep space
  issScene.fog = new THREE.FogExp2(0x030712, 0.0035);

  // Camera
  issCamera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  issCamera.position.set(22, 14, 25);

  // Renderer
  issRenderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
  issRenderer.setSize(width, height);
  issRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  issRenderer.toneMapping = THREE.ACESFilmicToneMapping;
  issRenderer.toneMappingExposure = 1.15;

  // Controls
  issControls = new THREE.OrbitControls(issCamera, canvas);
  issControls.enableDamping = true;
  issControls.dampingFactor = 0.05;
  issControls.maxDistance = 120;
  issControls.minDistance = 2;
  issControls.target.set(0, 0, 0);

  // Lighting
  const ambLight = new THREE.AmbientLight(0x223046, 0.85);
  issScene.add(ambLight);

  const sunLight = new THREE.DirectionalLight(0xfff5e6, 1.4);
  sunLight.position.set(45, 60, 40);
  issScene.add(sunLight);

  const earthShine = new THREE.DirectionalLight(0x1d4ed8, 0.6);
  earthShine.position.set(-30, -50, 30);
  issScene.add(earthShine);

  // Fire Dynamic Point Light
  fireLight = new THREE.PointLight(0xff6600, 0, 18);
  fireLight.position.set(0, 0, 0);
  issScene.add(fireLight);

  // Emergency Strobe Light (Flashes red during fire alert)
  emergencyStrobeLight = new THREE.PointLight(0xff0033, 0, 35);
  emergencyStrobeLight.position.set(0, 3, 0);
  issScene.add(emergencyStrobeLight);

  // Background Environment: Stars & Earth
  createSpaceEnvironment();

  // Build Procedural 3D ISS Station
  buildProceduralISS();

  // Initialize 3D Particle Systems
  initParticleSystems();

  // Setup Raycasting & Click-to-Ignite
  setupRaycasting(canvas);

  // Bind UI Buttons
  bind3DUI();

  // Populate Multi-Compartment Sensor Grid
  buildSensorGridUI();

  // Start Auto-check for FBX file
  checkAndAutoLoadFBX();

  // Animation Loop
  let lastTime = performance.now();
  function animate3D(time) {
    requestAnimationFrame(animate3D);
    const dt = Math.min((time - lastTime) / 1000, 0.1);
    lastTime = time;

    update3DPhysics(dt, time);
    update3DVisuals(time, dt);
    issControls.update();

    // Smooth camera lerp
    if (iss3DState.isLerpingCamera) {
      issCamera.position.lerp(iss3DState.cameraDesiredPos, 0.05);
      issControls.target.lerp(iss3DState.cameraTarget, 0.05);
      if (issCamera.position.distanceTo(iss3DState.cameraDesiredPos) < 0.2) {
        iss3DState.isLerpingCamera = false;
      }
    }

    issRenderer.render(issScene, issCamera);
  }
  requestAnimationFrame(animate3D);

  // Window resize
  window.addEventListener('resize', on3DResize);
}

function on3DResize() {
  const canvas = document.getElementById('iss-3d-canvas');
  if (!canvas || !issRenderer || !issCamera) return;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  if (width === 0 || height === 0) return;
  issCamera.aspect = width / height;
  issCamera.updateProjectionMatrix();
  issRenderer.setSize(width, height);
}

// 11.3 Space Background: Stars & Earth
function createSpaceEnvironment() {
  // Starfield
  const starGeo = new THREE.BufferGeometry();
  const starCount = 2000;
  const starPos = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount * 3; i += 3) {
    const r = 250 + Math.random() * 200;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    starPos[i] = r * Math.sin(phi) * Math.cos(theta);
    starPos[i + 1] = r * Math.sin(phi) * Math.sin(theta);
    starPos[i + 2] = r * Math.cos(phi);
  }
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  const starMat = new THREE.PointsMaterial({ color: 0x94a3b8, size: 1.2, transparent: true, opacity: 0.8 });
  const starField = new THREE.Points(starGeo, starMat);
  issScene.add(starField);

  // Earth Globe in the background
  const earthGeo = new THREE.SphereGeometry(180, 48, 48);
  const earthMat = new THREE.MeshStandardMaterial({
    color: 0x1d4ed8,
    roughness: 0.8,
    metalness: 0.1,
    emissive: 0x051b44,
    emissiveIntensity: 0.4
  });
  earthMesh = new THREE.Mesh(earthGeo, earthMat);
  earthMesh.position.set(0, -260, 160);
  earthMesh.rotation.z = 0.41; // 23.5 deg axial tilt
  issScene.add(earthMesh);

  // Earth Atmosphere Rim Glow
  const glowGeo = new THREE.SphereGeometry(184, 48, 48);
  const glowMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.15,
    side: THREE.BackSide
  });
  const glowMesh = new THREE.Mesh(glowGeo, glowMat);
  glowMesh.position.copy(earthMesh.position);
  issScene.add(glowMesh);
}

// 11.4 Procedural 3D ISS Station Generator
function buildProceduralISS() {
  iss3DState.proceduralRoot = new THREE.Group();
  issScene.add(iss3DState.proceduralRoot);

  // Standard materials
  const hullMat = new THREE.MeshStandardMaterial({
    color: 0x8a99a8,
    metalness: 0.85,
    roughness: 0.35,
    name: 'hull_mat'
  });
  const ribMat = new THREE.MeshStandardMaterial({
    color: 0x475569,
    metalness: 0.9,
    roughness: 0.25
  });
  const rackMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    metalness: 0.6,
    roughness: 0.5
  });
  const ledMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8
  });

  // Generate each module
  Object.values(issModules).forEach(mod => {
    const modGroup = new THREE.Group();
    modGroup.position.set(...mod.pos);
    modGroup.userData = { moduleId: mod.id };

    const [dx, dy, dz] = mod.dim;
    const radius = Math.min(dx, dy) * 0.5;
    const length = Math.max(dx, dz);
    const isAlongX = dx > dz;

    // Cylindrical Pressure Hull
    const hullGeo = new THREE.CylinderGeometry(radius, radius, length, 24, 1, true);
    if (isAlongX) {
      hullGeo.rotateZ(Math.PI / 2);
    } else {
      hullGeo.rotateX(Math.PI / 2);
    }
    const hullMesh = new THREE.Mesh(hullGeo, hullMat.clone());
    hullMesh.userData = { moduleId: mod.id, isHull: true };
    modGroup.add(hullMesh);
    mod.hullMesh = hullMesh;

    // Reinforcement Rings / Ribs
    const ringGeo = new THREE.TorusGeometry(radius + 0.04, 0.06, 8, 24);
    if (isAlongX) ringGeo.rotateY(Math.PI / 2);
    for (let rOffset = -length * 0.4; rOffset <= length * 0.4; rOffset += length * 0.25) {
      const ringMesh = new THREE.Mesh(ringGeo, ribMat);
      if (isAlongX) ringMesh.position.x = rOffset;
      else ringMesh.position.z = rOffset;
      modGroup.add(ringMesh);
    }

    // Internal Equipment Racks (Lining the interior corridor)
    const rackGeo = new THREE.BoxGeometry(0.7, dy * 0.65, 1.2);
    for (let side = -1; side <= 1; side += 2) {
      for (let zpos = -length * 0.35; zpos <= length * 0.35; zpos += 1.6) {
        const rack = new THREE.Mesh(rackGeo, rackMat.clone());
        if (isAlongX) {
          rack.position.set(zpos, 0, side * (radius - 0.5));
        } else {
          rack.position.set(side * (radius - 0.5), 0, zpos);
        }
        modGroup.add(rack);
        mod.racks.push(rack);

        // Tiny LED status strip on rack
        const led = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.4, 0.08), ledMat);
        led.position.copy(rack.position);
        if (isAlongX) led.position.z += side * 0.38;
        else led.position.x += side * 0.38;
        modGroup.add(led);
      }
    }

    // Interior Ceiling Fluorescent Strip
    const lightStripGeo = new THREE.BoxGeometry(isAlongX ? length * 0.8 : 0.15, 0.05, isAlongX ? 0.15 : length * 0.8);
    const lightStrip = new THREE.Mesh(lightStripGeo, new THREE.MeshBasicMaterial({ color: 0xe2e8f0 }));
    lightStrip.position.set(0, radius - 0.15, 0);
    modGroup.add(lightStrip);

    // Cupola Specific: 7 Observation Windows
    if (mod.id === 'cupola') {
      const cupolaDomeGeo = new THREE.SphereGeometry(1.6, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.5);
      const glassMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.35,
        metalness: 0.9,
        roughness: 0.1
      });
      const cupolaDome = new THREE.Mesh(cupolaDomeGeo, glassMat);
      cupolaDome.position.set(0, -0.2, 0);
      cupolaDome.rotation.x = Math.PI;
      modGroup.add(cupolaDome);
    }

    mod.group = modGroup;
    iss3DState.proceduralRoot.add(modGroup);
  });

  // Build Bulkhead Hatches
  Object.values(issHatches).forEach(hatch => {
    const hatchGroup = new THREE.Group();
    hatchGroup.position.set(...hatch.pos);

    // Outer circular hatch bulkhead ring
    const frameGeo = new THREE.TorusGeometry(1.2, 0.15, 12, 24);
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8, roughness: 0.3 });
    const frameMesh = new THREE.Mesh(frameGeo, frameMat);
    hatchGroup.add(frameMesh);

    // Hatch Door Leaf (Rotates when opened/closed)
    const doorGeo = new THREE.CylinderGeometry(1.05, 1.05, 0.12, 24);
    doorGeo.rotateX(Math.PI / 2);
    const doorMat = new THREE.MeshStandardMaterial({
      color: 0x10b981, // Green = OPEN
      metalness: 0.7,
      roughness: 0.4,
      transparent: true,
      opacity: 0.3
    });
    const doorMesh = new THREE.Mesh(doorGeo, doorMat);
    doorMesh.userData = { hatchId: hatch.id };
    hatchGroup.add(doorMesh);
    hatch.mesh = doorMesh;

    // Align hatch orientation
    if (hatch.id.includes('col') || hatch.id.includes('kibo') || hatch.id.includes('n3') || hatch.id.includes('air')) {
      hatchGroup.rotation.y = Math.PI / 2;
    }

    iss3DState.proceduralRoot.add(hatchGroup);
  });

  // Integrated Truss & Solar Arrays
  buildStationSolarTruss();
}

function buildStationSolarTruss() {
  const trussMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.9, roughness: 0.3 });
  const solarMat = new THREE.MeshStandardMaterial({
    color: 0x1e3a8a,
    metalness: 0.7,
    roughness: 0.2,
    emissive: 0x0c214d,
    emissiveIntensity: 0.3
  });

  // Main Integrated Truss Structure (ITS) Backbone along X
  const trussGeo = new THREE.BoxGeometry(60, 1.5, 1.5);
  const trussMesh = new THREE.Mesh(trussGeo, trussMat);
  trussMesh.position.set(0, 5.5, 0);
  iss3DState.proceduralRoot.add(trussMesh);

  // Solar Array Wings (Port & Starboard)
  const wingGeo = new THREE.BoxGeometry(14, 0.1, 7);
  for (const side of [-22, 22]) {
    for (const zOffset of [-4.5, 4.5]) {
      const wing = new THREE.Mesh(wingGeo, solarMat);
      wing.position.set(side, 5.5, zOffset);
      iss3DState.proceduralRoot.add(wing);
    }
  }
}

// 11.5 Particle Systems: Flames, Smoke, ECLSS Airflow, Extinguisher
function initParticleSystems() {
  // 1. Dynamic Flame Particles (Spherical Core in 0G)
  const flameGeo = new THREE.BufferGeometry();
  const flameCount = 350;
  const flamePositions = new Float32Array(flameCount * 3);
  const flameColors = new Float32Array(flameCount * 3);
  for (let i = 0; i < flameCount; i++) {
    flamePositions[i * 3] = 0;
    flamePositions[i * 3 + 1] = 0;
    flamePositions[i * 3 + 2] = 0;
    flameColors[i * 3] = 0.2 + Math.random() * 0.8;
    flameColors[i * 3 + 1] = 0.4 + Math.random() * 0.6;
    flameColors[i * 3 + 2] = 1.0;
  }
  flameGeo.setAttribute('position', new THREE.BufferAttribute(flamePositions, 3));
  flameGeo.setAttribute('color', new THREE.BufferAttribute(flameColors, 3));
  const flameMat = new THREE.PointsMaterial({
    size: 0.45,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  flameParticles = new THREE.Points(flameGeo, flameMat);
  flameParticles.visible = false;
  issScene.add(flameParticles);

  // 2. Volumetric Smoke Particles
  const smokeGeo = new THREE.BufferGeometry();
  const smokeCount = 500;
  const smokePositions = new Float32Array(smokeCount * 3);
  const smokeSizes = new Float32Array(smokeCount);
  for (let i = 0; i < smokeCount; i++) {
    smokePositions[i * 3] = 0;
    smokePositions[i * 3 + 1] = -100;
    smokePositions[i * 3 + 2] = 0;
    smokeSizes[i] = 0.8 + Math.random() * 1.6;
  }
  smokeGeo.setAttribute('position', new THREE.BufferAttribute(smokePositions, 3));
  const smokeMat = new THREE.PointsMaterial({
    color: 0x475569,
    size: 1.5,
    transparent: true,
    opacity: 0.4,
    depthWrite: false
  });
  smokeParticles = new THREE.Points(smokeGeo, smokeMat);
  issScene.add(smokeParticles);

  // 3. ECLSS Ventilation Streamlines
  const flowGeo = new THREE.BufferGeometry();
  const flowCount = 250;
  const flowPos = new Float32Array(flowCount * 3);
  for (let i = 0; i < flowCount; i++) {
    flowPos[i * 3] = (Math.random() - 0.5) * 3;
    flowPos[i * 3 + 1] = (Math.random() - 0.5) * 2;
    flowPos[i * 3 + 2] = (Math.random() - 0.5) * 24;
  }
  flowGeo.setAttribute('position', new THREE.BufferAttribute(flowPos, 3));
  const flowMat = new THREE.PointsMaterial({
    color: 0x06b6d4,
    size: 0.22,
    transparent: true,
    opacity: 0.75,
    blending: THREE.AdditiveBlending
  });
  airflowParticles = new THREE.Points(flowGeo, flowMat);
  issScene.add(airflowParticles);

  // 4. Extinguisher Mist Spray
  const extGeo = new THREE.BufferGeometry();
  const extCount = 200;
  const extPos = new Float32Array(extCount * 3);
  for (let i = 0; i < extCount; i++) {
    extPos[i * 3] = 0;
    extPos[i * 3 + 1] = -100;
    extPos[i * 3 + 2] = 0;
  }
  extGeo.setAttribute('position', new THREE.BufferAttribute(extPos, 3));
  const extMat = new THREE.PointsMaterial({
    color: 0xe0f2fe,
    size: 0.6,
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending
  });
  extinguisherParticles = new THREE.Points(extGeo, extMat);
  issScene.add(extinguisherParticles);
}

// 11.6 Physical Combustion & Reaction-Diffusion Solver
function update3DPhysics(dt, time) {
  iss3DState.isAnyFire = false;
  let totalHRR = 0;
  let maxTemp = 22.0;
  let worstCO = 0;
  let worstO2 = 21.0;
  let activeBurningMod = null;

  const flow = iss3DState.fanTripped ? 0.0 : iss3DState.flowVelocity;

  // 1. Process each module's internal fire chemistry
  Object.values(issModules).forEach(mod => {
    if (mod.isBurning) {
      iss3DState.isAnyFire = true;
      activeBurningMod = mod;

      // Oxygen limitation factor (LOC = 13.5% in microgravity)
      const loc = 13.5;
      const o2Excess = Math.max(0, mod.o2 - loc);
      const burnFactor = o2Excess / (21.0 - loc);

      // If oxygen depleted below LOC, fire starves
      if (burnFactor <= 0.01) {
        mod.intensity = Math.max(0, mod.intensity - dt * 0.15);
        if (mod.intensity <= 0.02) {
          mod.isBurning = false;
          mod.intensity = 0;
        }
      } else {
        mod.intensity = Math.min(1.0, mod.intensity + dt * 0.25);
      }

      // Flame spread velocity
      const spreadVel = 1.25 * Math.pow(mod.o2 / 21.0, 1.35) * (1.0 + 2.5 * (flow / 0.15));
      iss3DState.activeFireSpreadVelocity = spreadVel;

      // Heat Release Rate (HRR in kW)
      mod.hrr = 45.0 * mod.intensity * burnFactor;
      totalHRR += mod.hrr;

      // Oxygen consumption
      const o2BurnRate = 0.18 * mod.intensity * burnFactor * (mod.hrr / 40.0);
      mod.o2 = Math.max(0, mod.o2 - o2BurnRate * dt);

      // Carbon Monoxide generation
      const coGenRate = 95.0 * mod.intensity * (1.0 + (21.0 - mod.o2) / 6.0);
      mod.co += coGenRate * dt;

      // Smoke Optical Density generation
      const smokeGenRate = 0.045 * mod.intensity * (1.0 + (21.0 - mod.o2) / 8.0);
      mod.smoke = Math.min(4.5, mod.smoke + smokeGenRate * dt);

      // Temperature rise
      const heatInput = (mod.hrr * 0.85) / (mod.volume * 1.2);
      const heatLoss = 0.025 * (mod.temp - 22.0);
      mod.temp += (heatInput - heatLoss) * dt * 2.5;

      // Fuel consumption
      mod.fuel = Math.max(0, mod.fuel - 0.035 * mod.intensity * dt);
      if (mod.fuel <= 0) {
        mod.isBurning = false;
      }
    } else {
      mod.hrr = 0;
      if (mod.temp > 22.0) {
        mod.temp = Math.max(22.0, mod.temp - dt * 0.35);
      }
      if (flow > 0) {
        if (mod.smoke > 0.005) mod.smoke = Math.max(0, mod.smoke - dt * 0.02 * (flow / 0.15));
        if (mod.co > 1.0) mod.co = Math.max(0, mod.co - dt * 5.0 * (flow / 0.15));
        if (mod.o2 < 21.0 && !mod.isBurning) mod.o2 = Math.min(21.0, mod.o2 + dt * 0.08);
      }
    }

    if (mod.temp > maxTemp) maxTemp = mod.temp;
    if (mod.co > worstCO) worstCO = mod.co;
    if (mod.o2 < worstO2) worstO2 = mod.o2;
  });

  // 2. Inter-Module Gas Exchange & Smoke Diffusion across Bulkhead Hatches
  Object.values(issHatches).forEach(hatch => {
    const modA = issModules[hatch.modA];
    const modB = issModules[hatch.modB];
    if (!modA || !modB) return;

    if (hatch.isOpen) {
      const exchangeRate = (0.04 + (flow / 0.15) * 0.08) * dt;

      const dSmoke = (modA.smoke - modB.smoke) * exchangeRate;
      modA.smoke -= dSmoke;
      modB.smoke += dSmoke;

      const dCO = (modA.co - modB.co) * exchangeRate;
      modA.co -= dCO;
      modB.co += dCO;

      const dTemp = (modA.temp - modB.temp) * exchangeRate * 0.5;
      modA.temp -= dTemp;
      modB.temp += dTemp;

      const dO2 = (modA.o2 - modB.o2) * exchangeRate * 0.6;
      modA.o2 -= dO2;
      modB.o2 += dO2;

      // Flashover through open hatch
      if (modA.isBurning && modA.temp > 420 && !modB.isBurning && modB.o2 > 15.5 && modA.intensity > 0.55) {
        modB.isBurning = true;
        modB.intensity = 0.25;
        playBeep(1100, 0.2, 'sawtooth');
      } else if (modB.isBurning && modB.temp > 420 && !modA.isBurning && modA.o2 > 15.5 && modB.intensity > 0.55) {
        modA.isBurning = true;
        modA.intensity = 0.25;
        playBeep(1100, 0.2, 'sawtooth');
      }
    }
  });

  // 3. Update Mission HUD & Telemetry
  if (iss3DState.isAnyFire) {
    iss3DState.simTimeSeconds += dt;
    const mins = Math.floor(iss3DState.simTimeSeconds / 60);
    const secs = Math.floor(iss3DState.simTimeSeconds % 60);
    const timeEl = document.getElementById('iss-sim-time');
    if (timeEl) timeEl.innerText = `T+${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    const fireStateEl = document.getElementById('iss-fire-state');
    if (fireStateEl) {
      fireStateEl.innerText = `CRITICAL ALERT: FIRE IN PROGRESS`;
      fireStateEl.className = 'font-bold text-rose-400 animate-pulse';
    }
    const burnModEl = document.getElementById('iss-burning-module');
    if (burnModEl) burnModEl.innerText = activeBurningMod ? activeBurningMod.name : 'MULTIPLE';
    const hrrEl = document.getElementById('iss-hrr');
    if (hrrEl) hrrEl.innerText = `${totalHRR.toFixed(1)} kW`;
    const spdEl = document.getElementById('iss-spread-vel');
    if (spdEl) spdEl.innerText = `${iss3DState.activeFireSpreadVelocity.toFixed(2)} mm/s`;

    // Crew Survivability Index calculation
    const crewNode2 = issModules['node2'];
    let crewIndex = 100;
    if (crewNode2.co > 50) crewIndex -= (crewNode2.co - 50) * 0.15;
    if (crewNode2.temp > 45) crewIndex -= (crewNode2.temp - 45) * 1.5;
    if (crewNode2.o2 < 18) crewIndex -= (18 - crewNode2.o2) * 8.0;
    crewIndex = Math.max(0, Math.min(100, crewIndex));

    const crewEl = document.getElementById('iss-crew-status');
    if (crewEl) {
      if (crewIndex > 80) {
        crewEl.innerText = `${Math.round(crewIndex)}% NOMINAL`;
        crewEl.className = 'font-bold text-emerald-400';
      } else if (crewIndex > 40) {
        crewEl.innerText = `${Math.round(crewIndex)}% CAUTION (SMOKE/CO)`;
        crewEl.className = 'font-bold text-amber-400';
      } else {
        crewEl.innerText = `${Math.round(crewIndex)}% LETHAL THREAT (EVACUATE!)`;
        crewEl.className = 'font-bold text-rose-500 animate-pulse';
      }
    }

    // Escape route check
    const escEl = document.getElementById('iss-escape-status');
    if (escEl) {
      if (crewNode2.smoke < 1.0 && crewNode2.temp < 80) {
        escEl.innerText = 'CLEAR TO DRAGON/PMA2';
        escEl.className = 'font-bold text-cyan-400';
      } else {
        escEl.innerText = 'WARNING: ESCAPE VESTIBULE INUNDATED';
        escEl.className = 'font-bold text-rose-400 animate-pulse';
      }
    }

    const alarmOverlay = document.getElementById('iss-alarm-overlay');
    if (alarmOverlay) alarmOverlay.classList.remove('hidden');

    if (!state.audioMuted && Math.floor(time * 0.002) % 2 === 0) {
      playBeep(880, 0.08, 'sawtooth');
    }
  } else {
    const fireStateEl = document.getElementById('iss-fire-state');
    if (fireStateEl) {
      fireStateEl.innerText = 'NOMINAL (NO FIRE)';
      fireStateEl.className = 'font-bold text-emerald-400';
    }
    const burnModEl = document.getElementById('iss-burning-module');
    if (burnModEl) burnModEl.innerText = 'NONE';
    const hrrEl = document.getElementById('iss-hrr');
    if (hrrEl) hrrEl.innerText = '0.0 kW';
    const spdEl = document.getElementById('iss-spread-vel');
    if (spdEl) spdEl.innerText = '0.00 mm/s';
    const alarmOverlay = document.getElementById('iss-alarm-overlay');
    if (alarmOverlay) alarmOverlay.classList.add('hidden');
  }

  // Update Inspector panel for selected module
  const selMod = issModules[iss3DState.selectedModule];
  if (selMod) {
    const mName = document.getElementById('insp-module-name');
    if (mName) mName.innerText = selMod.name;
    const mTemp = document.getElementById('insp-temp');
    if (mTemp) mTemp.innerText = `${selMod.temp.toFixed(1)} °C`;
    const mO2 = document.getElementById('insp-o2');
    if (mO2) mO2.innerText = `${selMod.o2.toFixed(1)} %`;
    const mCO = document.getElementById('insp-co');
    if (mCO) mCO.innerText = `${selMod.co.toFixed(1)}`;
    const mSmoke = document.getElementById('insp-smoke');
    if (mSmoke) mSmoke.innerText = `${selMod.smoke.toFixed(2)}`;

    const badge = document.getElementById('insp-module-badge');
    if (badge) {
      if (selMod.isBurning) {
        badge.innerText = 'BURNING';
        badge.className = 'px-1.5 py-0.5 rounded text-[9px] bg-rose-950 text-rose-300 border border-rose-800 animate-pulse';
      } else if (selMod.temp > 50 || selMod.smoke > 0.5) {
        badge.innerText = 'CAUTION';
        badge.className = 'px-1.5 py-0.5 rounded text-[9px] bg-amber-950 text-amber-300 border border-amber-800';
      } else {
        badge.innerText = 'NOMINAL';
        badge.className = 'px-1.5 py-0.5 rounded text-[9px] bg-slate-800 text-slate-300';
      }
    }
  }

  // Update Sensor Grid Cards
  updateSensorGridUI();
}

// 11.7 Dynamic 3D Visuals & Shaders
function update3DVisuals(time, dt) {
  const isFire = iss3DState.isAnyFire;
  const burningMod = Object.values(issModules).find(m => m.isBurning);

  // 1. Fire Particle Animation
  if (isFire && burningMod && flameParticles) {
    flameParticles.visible = true;
    const posAttr = flameParticles.geometry.attributes.position;
    const colAttr = flameParticles.geometry.attributes.color;
    const count = posAttr.count;

    const [mx, my, mz] = burningMod.pos;
    const flow = iss3DState.fanTripped ? 0.0 : iss3DState.flowVelocity;

    for (let i = 0; i < count; i++) {
      const r = 0.2 + (i / count) * 0.85;
      const theta = (time * 0.003 + i) * 2.39;
      const phi = Math.acos(2 * ((i * 17) % count) / count - 1);

      let px = mx + r * Math.sin(phi) * Math.cos(theta);
      let py = my + r * Math.sin(phi) * Math.sin(theta);
      let pz = mz + r * Math.cos(phi);

      if (flow > 0.01) {
        const drag = (flow / 0.15) * 1.6 * (r / 0.85);
        pz += drag * (1.0 + Math.sin(time * 0.01 + i) * 0.3);
        py += Math.sin(time * 0.015 + i) * 0.15;
      }

      posAttr.setXYZ(i, px, py, pz);

      if (r < 0.45) {
        colAttr.setXYZ(i, 0.1, 0.5, 1.0);
      } else {
        colAttr.setXYZ(i, 1.0, 0.5 + Math.random() * 0.3, 0.05);
      }
    }
    posAttr.needsUpdate = true;
    colAttr.needsUpdate = true;

    fireLight.intensity = 2.5 + Math.sin(time * 0.03) * 1.2;
    fireLight.position.set(mx, my + 0.2, mz);
    fireLight.color.setHex(flow > 0.01 ? 0xff6600 : 0x00ccff);
  } else if (flameParticles) {
    flameParticles.visible = false;
    fireLight.intensity = 0;
  }

  // Emergency Strobe Light Pulsing
  if (isFire) {
    emergencyStrobeLight.intensity = Math.sin(time * 0.008) > 0.2 ? 3.5 : 0;
    emergencyStrobeLight.position.set(0, 3, 0);
  } else {
    emergencyStrobeLight.intensity = 0;
  }

  // 2. Smoke Particles Billowing & Corridor Drifting
  if (smokeParticles) {
    const sPos = smokeParticles.geometry.attributes.position;
    const count = sPos.count;
    const activeSmokeMods = Object.values(issModules).filter(m => m.smoke > 0.05);

    if (activeSmokeMods.length > 0) {
      smokeParticles.visible = true;
      for (let i = 0; i < count; i++) {
        const mod = activeSmokeMods[i % activeSmokeMods.length];
        const [mx, my, mz] = mod.pos;
        const [dx, dy, dz] = mod.dim;

        const speed = (iss3DState.fanTripped ? 0.02 : iss3DState.flowVelocity) * 1.2;
        let sz = sPos.getZ(i);
        let sy = sPos.getY(i);
        let sx = sPos.getX(i);

        if (Math.abs(sz - mz) > Math.max(dx, dz) * 0.6 || Math.abs(sx - mx) > 3.0 || sy < -10) {
          sx = mx + (Math.random() - 0.5) * (dx * 0.5);
          sy = my + (Math.random() - 0.5) * (dy * 0.5);
          sz = mz + (Math.random() - 0.5) * (dz * 0.2);
        } else {
          sz += speed * dt * 1.5;
          sx += (Math.random() - 0.5) * 0.08;
          sy += (Math.random() - 0.5) * 0.08;
        }
        sPos.setXYZ(i, sx, sy, sz);
      }
      sPos.needsUpdate = true;
      smokeParticles.material.opacity = Math.min(0.65, 0.15 + (activeSmokeMods[0].smoke / 3.0) * 0.5);
    } else {
      smokeParticles.visible = false;
    }
  }

  // 3. ECLSS Airflow Streamlines Animation
  if (airflowParticles && iss3DState.viewMode === 'airflow') {
    airflowParticles.visible = true;
    const fPos = airflowParticles.geometry.attributes.position;
    const speed = iss3DState.fanTripped ? 0.0 : iss3DState.flowVelocity * 4.0;
    for (let i = 0; i < fPos.count; i++) {
      let z = fPos.getZ(i) + speed * dt;
      if (z > 14) z = -14;
      fPos.setZ(i, z);
    }
    fPos.needsUpdate = true;
  } else if (airflowParticles) {
    airflowParticles.visible = false;
  }

  // 4. Update Module Visual Styles based on View Mode
  updateModuleMaterialStyles();

  // Earth rotation
  if (earthMesh) {
    earthMesh.rotation.y += dt * 0.015;
  }
}

function updateModuleMaterialStyles() {
  const mode = iss3DState.viewMode;

  Object.values(issModules).forEach(mod => {
    const temp = mod.temp;
    const smoke = mod.smoke;

    if (mod.hullMesh) {
      if (mode === 'flir') {
        const tNorm = Math.min(1.0, Math.max(0, (temp - 22.0) / 500.0));
        const flirColor = getFLIRColor(tNorm);
        mod.hullMesh.material.color.setHex(flirColor);
        mod.hullMesh.material.emissive.setHex(flirColor);
        mod.hullMesh.material.emissiveIntensity = tNorm * 0.7;
        mod.hullMesh.material.transparent = false;
        mod.hullMesh.material.opacity = 1.0;
      } else if (mode === 'smoke') {
        const sNorm = Math.min(1.0, smoke / 2.5);
        const gray = Math.max(0.08, 0.6 - sNorm * 0.5);
        mod.hullMesh.material.color.setRGB(gray, gray * 0.9, gray * 0.85);
        mod.hullMesh.material.emissive.setHex(0x000000);
        mod.hullMesh.material.transparent = false;
      } else if (mode === 'xray') {
        mod.hullMesh.material.color.setHex(0x38bdf8);
        mod.hullMesh.material.emissive.setHex(0x082f49);
        mod.hullMesh.material.emissiveIntensity = 0.2;
        mod.hullMesh.material.transparent = true;
        mod.hullMesh.material.opacity = 0.22;
      } else {
        mod.hullMesh.material.color.setHex(0x8a99a8);
        if (mod.isBurning) {
          mod.hullMesh.material.emissive.setHex(0xff3300);
          mod.hullMesh.material.emissiveIntensity = 0.45;
        } else {
          mod.hullMesh.material.emissive.setHex(0x000000);
          mod.hullMesh.material.emissiveIntensity = 0;
        }
        mod.hullMesh.material.transparent = false;
        mod.hullMesh.material.opacity = 1.0;
      }
    }

    const fbxMeshes = iss3DState.fbxMeshesByModule[mod.id] || [];
    fbxMeshes.forEach(mesh => {
      if (mesh.material) {
        if (mode === 'flir') {
          const tNorm = Math.min(1.0, Math.max(0, (temp - 22.0) / 500.0));
          mesh.material.color.setHex(getFLIRColor(tNorm));
          mesh.material.emissive.setHex(getFLIRColor(tNorm));
          mesh.material.emissiveIntensity = tNorm * 0.75;
        } else {
          if (mesh.userData.origColor) {
            mesh.material.color.copy(mesh.userData.origColor);
          }
          if (mod.isBurning) {
            mesh.material.emissive.setHex(0xff3300);
            mesh.material.emissiveIntensity = 0.4;
          } else {
            mesh.material.emissive.setHex(0x000000);
            mesh.material.emissiveIntensity = 0;
          }
        }
      }
    });

  });
}

function getFLIRColor(t) {
  if (t < 0.25) return 0x1e3a8a;
  if (t < 0.5) return 0x0891b2;
  if (t < 0.75) return 0xf59e0b;
  return 0xef4444;
}

// 11.8 Raycasting: Click Anywhere to Ignite or Inspect
function setupRaycasting(canvas) {
  canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    iss3DState.mouse.x = ((event.clientX - rect.left) / canvas.clientWidth) * 2 - 1;
    iss3DState.mouse.y = -((event.clientY - rect.top) / canvas.clientHeight) * 2 + 1;

    iss3DState.raycaster.setFromCamera(iss3DState.mouse, issCamera);
    const intersects = iss3DState.raycaster.intersectObjects(issScene.children, true);

    if (intersects.length > 0) {
      let target = intersects[0].object;
      let hitModuleId = null;

      while (target) {
        if (target.userData && target.userData.moduleId) {
          hitModuleId = target.userData.moduleId;
          break;
        }
        if (target.userData && target.userData.hatchId) {
          toggleHatch(target.userData.hatchId);
          return;
        }
        target = target.parent;
      }

      if (hitModuleId && issModules[hitModuleId]) {
        iss3DState.selectedModule = hitModuleId;
        igniteModule(hitModuleId, intersects[0].point);
        playBeep(980, 0.1, 'square');
      }
    }
  });

  const dropZone = document.getElementById('iss-drop-zone');
  window.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.remove('hidden');
    dropZone.classList.add('flex');
  });
  dropZone.addEventListener('dragleave', (e) => {
    e.preventDefault();
    dropZone.classList.add('hidden');
    dropZone.classList.remove('flex');
  });
  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.add('hidden');
    dropZone.classList.remove('flex');
    if (e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.name.toLowerCase().endsWith('.fbx')) {
        loadFBXFromFile(file);
      } else {
        alert('Please drop the ISS 3D model FBX file.');
      }
    }
  });
}

// 11.9 Ignition & Countermeasure Triggers
function igniteModule(modId, point = null) {
  const mod = issModules[modId];
  if (!mod) return;
  mod.isBurning = true;
  mod.intensity = 0.45;
  iss3DState.selectedModule = modId;

  if (point) {
    iss3DState.firePosition.copy(point);
  } else {
    iss3DState.firePosition.set(...mod.pos);
  }

  playBeep(780, 0.15, 'sawtooth');
  console.log(`[IGNITION] Fire triggered in ${mod.name}`);
}

function toggleHatch(hatchId) {
  const hatch = issHatches[hatchId];
  if (!hatch) return;
  hatch.isOpen = !hatch.isOpen;

  if (hatch.mesh) {
    if (hatch.isOpen) {
      hatch.mesh.material.color.setHex(0x10b981);
      hatch.mesh.material.opacity = 0.25;
      hatch.mesh.rotation.y = 0;
    } else {
      hatch.mesh.material.color.setHex(0xef4444);
      hatch.mesh.material.opacity = 0.95;
      hatch.mesh.rotation.y = Math.PI * 0.5;
    }
  }

  const btn = document.querySelector(`[data-hatch="${hatchId}"]`);
  if (btn) {
    if (hatch.isOpen) {
      btn.innerText = 'OPEN';
      btn.className = 'hatch-toggle-btn px-2.5 py-1 rounded text-[10px] font-bold transition bg-emerald-950/80 text-emerald-300 border border-emerald-700/60';
    } else {
      btn.innerText = 'SEALED';
      btn.className = 'hatch-toggle-btn px-2.5 py-1 rounded text-[10px] font-bold transition bg-rose-950/80 text-rose-300 border border-rose-700/60';
    }
  }

  playBeep(hatch.isOpen ? 660 : 440, 0.08, 'triangle');
}

function dischargeExtinguisher(modId) {
  const mod = issModules[modId];
  if (!mod) return;
  mod.isBurning = false;
  mod.intensity = 0;
  mod.temp = Math.max(22.0, mod.temp - 180.0);
  mod.o2 = Math.max(12.0, mod.o2 - 3.5);
  playBeep(320, 0.4, 'triangle');
}

function vacuumVentModule(modId) {
  const mod = issModules[modId];
  if (!mod) return;
  mod.isBurning = false;
  mod.intensity = 0;
  mod.o2 = 0.0;
  mod.temp = Math.max(0.0, mod.temp - 250.0);
  playBeep(180, 0.6, 'sawtooth');
}

function resetStationAtmosphere() {
  Object.values(issModules).forEach(mod => {
    mod.temp = 22.0;
    mod.o2 = 21.0;
    mod.co = 0.0;
    mod.smoke = 0.0;
    mod.isBurning = false;
    mod.intensity = 0.0;
    mod.fuel = 200;
    mod.hrr = 0;
  });
  Object.values(issHatches).forEach(h => {
    h.isOpen = true;
    if (h.mesh) {
      h.mesh.material.color.setHex(0x10b981);
      h.mesh.material.opacity = 0.25;
    }
  });
  document.querySelectorAll('.hatch-toggle-btn').forEach(btn => {
    btn.innerText = 'OPEN';
    btn.className = 'hatch-toggle-btn px-2.5 py-1 rounded text-[10px] font-bold transition bg-emerald-950/80 text-emerald-300 border border-emerald-700/60';
  });
  iss3DState.fanTripped = false;
  const fanInd = document.getElementById('fan-trip-indicator');
  if (fanInd) fanInd.className = 'w-2 h-2 rounded-full bg-emerald-400';
  const eclssStatus = document.getElementById('iss-eclss-status');
  if (eclssStatus) eclssStatus.innerText = 'FORCED (0.15 m/s)';
  iss3DState.simTimeSeconds = 0;
  playBeep(880, 0.1);
}

// 11.10 FBX Loader Integration
function checkAndAutoLoadFBX() {
  fetch('International Space Station (ISS) (E) [internal].fbx', { method: 'HEAD' })
    .then(res => {
      if (res.ok) {
        console.log('[FBX LOADER] Loading FBX model from server...');
        loadFBXFromUrl('International Space Station (ISS) (E) [internal].fbx');
      }
    })
    .catch(() => {
      console.log('[FBX LOADER] Running locally via file://.');
    });
}

function loadFBXFromFile(file) {
  const blobUrl = URL.createObjectURL(file);
  loadFBXFromUrl(blobUrl, file.name);
}

function loadFBXFromUrl(url, label = 'ISS Interior Model') {
  const pContainer = document.getElementById('fbx-progress-container');
  const pBar = document.getElementById('fbx-progress-bar');
  const pLabel = document.getElementById('fbx-progress-label');
  const pBytes = document.getElementById('fbx-progress-bytes');
  if (pContainer) pContainer.classList.remove('hidden');

  const loader = new THREE.FBXLoader();
  loader.load(url, (object) => {
    if (pContainer) pContainer.classList.add('hidden');
    iss3DState.fbxLoaded = true;
    iss3DState.fbxRoot = object;

    const box = new THREE.Box3().setFromObject(object);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 28.0 / (maxDim || 1);
    object.scale.set(scale, scale, scale);
    object.position.set(-center.x * scale, -center.y * scale, -center.z * scale);

    object.traverse((child) => {
      if (child.isMesh) {
        const name = child.name.toLowerCase();
        let mId = 'us_lab';
        if (name.includes('node2') || name.includes('harmony')) mId = 'node2';
        else if (name.includes('node1') || name.includes('unity')) mId = 'node1';
        else if (name.includes('node3') || name.includes('tranquility')) mId = 'node3';
        else if (name.includes('columbus')) mId = 'columbus';
        else if (name.includes('jpm') || name.includes('kibo') || name.includes('jlp')) mId = 'kibo';
        else if (name.includes('airlock')) mId = 'airlock';
        else if (name.includes('cupola')) mId = 'cupola';

        child.userData.moduleId = mId;
        if (child.material) {
          child.userData.origColor = child.material.color.clone();
        }
        if (!iss3DState.fbxMeshesByModule[mId]) {
          iss3DState.fbxMeshesByModule[mId] = [];
        }
        iss3DState.fbxMeshesByModule[mId].push(child);
      }
    });

    issScene.add(object);

    if (iss3DState.proceduralRoot) {
      Object.values(issModules).forEach(m => {
        if (m.hullMesh) m.hullMesh.visible = false;
        m.racks.forEach(r => { r.visible = false; });
      });
    }

    const srcText = document.getElementById('model-source-text');
    if (srcText) srcText.innerText = 'FBX Model Active (303 Meshes, PBR)';
    const srcDot = document.getElementById('model-status-dot');
    if (srcDot) srcDot.className = 'w-2 h-2 rounded-full bg-cyan-400 animate-ping';
    playBeep(980, 0.2);
  }, (xhr) => {
    if (xhr.lengthComputable && pBar && pLabel && pBytes) {
      const pct = Math.round((xhr.loaded / xhr.total) * 100);
      pBar.style.width = pct + '%';
      pLabel.innerText = `Downloading & Parsing FBX Model: ${pct}%`;
      pBytes.innerText = `${(xhr.loaded / 1024 / 1024).toFixed(1)} MB / ${(xhr.total / 1024 / 1024).toFixed(1)} MB`;
    } else if (pLabel && pBytes) {
      const mb = (xhr.loaded / 1024 / 1024).toFixed(1);
      pLabel.innerText = `Parsing FBX Model: ${mb} MB loaded...`;
      pBytes.innerText = `${mb} MB`;
    }
  }, (err) => {
    console.error('[FBX LOADER ERROR]', err);
    if (pContainer) pContainer.classList.add('hidden');
  });
}

// 11.11 UI Bindings
function bind3DUI() {
  const fbxInput = document.getElementById('iss-fbx-file-input');
  const btnLoad = document.getElementById('btn-load-fbx');
  if (btnLoad && fbxInput) {
    btnLoad.addEventListener('click', () => {
      fbxInput.click();
    });
    fbxInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        loadFBXFromFile(e.target.files[0]);
      }
    });
  }

  document.querySelectorAll('.view-mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.view-mode-btn').forEach(b => {
        b.className = 'view-mode-btn px-2.5 py-1 rounded text-slate-400 hover:text-slate-200 transition';
      });
      btn.className = 'view-mode-btn active px-2.5 py-1 rounded bg-cyan-600/30 text-cyan-300 font-medium transition';
      iss3DState.viewMode = btn.getAttribute('data-mode');
    });
  });

  document.querySelectorAll('.cam-preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const cam = btn.getAttribute('data-cam');
      setCameraPreset(cam);
    });
  });

  document.querySelectorAll('.iss-scenario-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const scn = btn.getAttribute('data-scenario');
      igniteModule(scn);
      setCameraPreset(scn);
    });
  });

  const btnFan = document.getElementById('btn-fan-trip');
  if (btnFan) {
    btnFan.addEventListener('click', () => {
      iss3DState.fanTripped = !iss3DState.fanTripped;
      const ind = document.getElementById('fan-trip-indicator');
      const stat = document.getElementById('iss-eclss-status');
      if (iss3DState.fanTripped) {
        if (ind) ind.className = 'w-2 h-2 rounded-full bg-rose-500 animate-ping';
        if (stat) {
          stat.innerText = 'TRIPPED / ISOLATED (0.00 m/s)';
          stat.className = 'font-bold text-rose-400';
        }
        playBeep(440, 0.2);
      } else {
        if (ind) ind.className = 'w-2 h-2 rounded-full bg-emerald-400';
        if (stat) {
          stat.innerText = 'FORCED (0.15 m/s)';
          stat.className = 'font-bold text-indigo-400';
        }
        playBeep(880, 0.1);
      }
    });
  }

  const btnExt = document.getElementById('btn-extinguish-active');
  if (btnExt) {
    btnExt.addEventListener('click', () => {
      dischargeExtinguisher(iss3DState.selectedModule);
    });
  }

  const btnVac = document.getElementById('btn-vacuum-vent');
  if (btnVac) {
    btnVac.addEventListener('click', () => {
      vacuumVentModule(iss3DState.selectedModule);
    });
  }

  const btnReset = document.getElementById('btn-reset-station');
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      resetStationAtmosphere();
    });
  }

  document.querySelectorAll('.hatch-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const hid = btn.getAttribute('data-hatch');
      toggleHatch(hid);
    });
  });

  const btnSealAll = document.getElementById('btn-seal-all-hatches');
  if (btnSealAll) {
    btnSealAll.addEventListener('click', () => {
      Object.keys(issHatches).forEach(hid => {
        if (issHatches[hid].isOpen) toggleHatch(hid);
      });
    });
  }

  const btnIgniteSel = document.getElementById('btn-ignite-selected');
  if (btnIgniteSel) {
    btnIgniteSel.addEventListener('click', () => {
      igniteModule(iss3DState.selectedModule);
    });
  }

  const btnQuenchSel = document.getElementById('btn-quench-selected');
  if (btnQuenchSel) {
    btnQuenchSel.addEventListener('click', () => {
      dischargeExtinguisher(iss3DState.selectedModule);
    });
  }
}

function setCameraPreset(cam) {
  iss3DState.isLerpingCamera = true;
  if (cam === 'overview') {
    iss3DState.cameraDesiredPos.set(22, 14, 25);
    iss3DState.cameraTarget.set(0, 0, 0);
  } else if (cam === 'us_lab') {
    iss3DState.cameraDesiredPos.set(8, 4, 3);
    iss3DState.cameraTarget.set(0, 0, 0);
    iss3DState.selectedModule = 'us_lab';
  } else if (cam === 'node2') {
    iss3DState.cameraDesiredPos.set(6, 4, 11);
    iss3DState.cameraTarget.set(0, 0, 7.5);
    iss3DState.selectedModule = 'node2';
  } else if (cam === 'columbus') {
    iss3DState.cameraDesiredPos.set(12, 4, 10);
    iss3DState.cameraTarget.set(6.8, 0, 7.5);
    iss3DState.selectedModule = 'columbus';
  } else if (cam === 'kibo') {
    iss3DState.cameraDesiredPos.set(-13, 4, 11);
    iss3DState.cameraTarget.set(-7.8, 0, 7.5);
    iss3DState.selectedModule = 'kibo';
  } else if (cam === 'cupola') {
    iss3DState.cameraDesiredPos.set(-7, -5, -6);
    iss3DState.cameraTarget.set(-5.8, -3.2, -7.5);
    iss3DState.selectedModule = 'cupola';
  }
}

// 11.12 Multi-Compartment Sensor Grid UI
function buildSensorGridUI() {
  const grid = document.getElementById('module-cards-grid');
  if (!grid) return;
  grid.innerHTML = '';

  Object.values(issModules).forEach(mod => {
    const card = document.createElement('div');
    card.id = `sensor-card-${mod.id}`;
    card.className = 'bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-xs font-mono space-y-1.5 cursor-pointer hover:border-cyan-500/60 transition';
    card.innerHTML = `
      <div class="flex items-center justify-between border-b border-slate-800 pb-1">
        <span class="font-bold text-[10px] text-slate-200 truncate">${mod.name}</span>
        <span id="sc-dot-${mod.id}" class="w-2 h-2 rounded-full bg-emerald-400"></span>
      </div>
      <div class="space-y-0.5 text-[10px]">
        <div class="flex justify-between">
          <span class="text-slate-500">T:</span>
          <span id="sc-t-${mod.id}" class="text-amber-400 font-bold">22°C</span>
        </div>
        <div class="flex justify-between">
          <span class="text-slate-500">O₂:</span>
          <span id="sc-o2-${mod.id}" class="text-emerald-400 font-bold">21.0%</span>
        </div>
        <div class="flex justify-between">
          <span class="text-slate-500">CO:</span>
          <span id="sc-co-${mod.id}" class="text-rose-400 font-bold">0.0</span>
        </div>
      </div>
    `;
    card.addEventListener('click', () => {
      iss3DState.selectedModule = mod.id;
      setCameraPreset(mod.id);
    });
    grid.appendChild(card);
  });
}

function updateSensorGridUI() {
  Object.values(issModules).forEach(mod => {
    const tEl = document.getElementById(`sc-t-${mod.id}`);
    const o2El = document.getElementById(`sc-o2-${mod.id}`);
    const coEl = document.getElementById(`sc-co-${mod.id}`);
    const dotEl = document.getElementById(`sc-dot-${mod.id}`);
    const card = document.getElementById(`sensor-card-${mod.id}`);

    if (tEl) tEl.innerText = `${mod.temp.toFixed(0)}°C`;
    if (o2El) o2El.innerText = `${mod.o2.toFixed(1)}%`;
    if (coEl) coEl.innerText = `${mod.co.toFixed(0)}`;

    if (dotEl) {
      if (mod.isBurning) {
        dotEl.className = 'w-2 h-2 rounded-full bg-rose-500 animate-ping';
        if (card) card.style.borderColor = '#ef4444';
      } else if (mod.temp > 50 || mod.smoke > 0.5) {
        dotEl.className = 'w-2 h-2 rounded-full bg-amber-400';
        if (card) card.style.borderColor = '#f59e0b';
      } else {
        dotEl.className = 'w-2 h-2 rounded-full bg-emerald-400';
        if (card) card.style.borderColor = '#1e293b';
      }
    }
  });
}

// Initialize 3D ISS on window load
window.addEventListener('load', () => {
  setTimeout(init3DISS, 100);
});
