import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

const $ = (selector) => document.querySelector(selector);
// ==================================
// LETTER OVERLAY SYSTEM
// ==================================

const letterOverlay = $('#letterOverlay');
const letterOverlayTitle = $('#letterOverlayTitle');
const letterOverlayText = $('#letterOverlayText');
const closeLetterButton = $('#closeLetter');

function openLetterOverlay(title, message) {
    letterOverlayTitle.textContent = title;
    letterOverlayText.textContent = message;

    letterOverlay.classList.add('active');
}

function closeLetterOverlay() {
    letterOverlay.classList.remove('active');
}

closeLetterButton.addEventListener('click', closeLetterOverlay);

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        closeLetterOverlay();
    }
});
const canvas = $('#scene');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x30241c);
scene.fog = new THREE.Fog(0x38291f, 38, 100);

const camera = new THREE.PerspectiveCamera(67, innerWidth / innerHeight, 0.1, 140);
camera.position.set(0, 1.68, 5.4);
camera.rotation.order = 'YXZ';

const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.2));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = false;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.22;
renderer.outputColorSpace = THREE.SRGBColorSpace;

const hemi = new THREE.HemisphereLight(0xffe8cf, 0x35251b, 0.82);
scene.add(hemi);
const ambient = new THREE.AmbientLight(0xffd9b7, 0.25);
scene.add(ambient);

const keyLight = new THREE.DirectionalLight(0xffdfbd, 0.66);
keyLight.position.set(-7, 10, 8);
keyLight.castShadow = false;
scene.add(keyLight);


function makeWalnutTexture() {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 1024;
  const ctx = c.getContext('2d');
  const gradient = ctx.createLinearGradient(0, 0, c.width, 0);
  gradient.addColorStop(0, '#24150e');
  gradient.addColorStop(0.18, '#4a2d1b');
  gradient.addColorStop(0.42, '#392216');
  gradient.addColorStop(0.68, '#563722');
  gradient.addColorStop(1, '#2a190f');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, c.width, c.height);

  for (let i = 0; i < 190; i++) {
    const x = Math.random() * c.width;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    for (let y = 0; y <= c.height; y += 36) {
      ctx.lineTo(x + Math.sin(y * 0.012 + i) * (3 + Math.random() * 4), y);
    }
    ctx.strokeStyle = Math.random() > 0.5
      ? `rgba(12, 7, 4, ${0.035 + Math.random() * 0.075})`
      : `rgba(190, 137, 83, ${0.018 + Math.random() * 0.045})`;
    ctx.lineWidth = 0.4 + Math.random() * 1.8;
    ctx.stroke();
  }
  const texture = new THREE.CanvasTexture(c);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = 2;
  return texture;
}
const walnutTexture = makeWalnutTexture();

// Subtle hand-finished plaster: a fine, low-contrast mineral texture rather
// than extra framed geometry or decorative picture-like wall panels.
function makePlasterTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 14500; i++) {
    const shade = Math.random() > 0.5 ? 'rgba(80,68,48,' : 'rgba(255,250,235,';
    ctx.fillStyle = shade + (0.012 + Math.random() * 0.025) + ')';
    const size = 0.5 + Math.random() * 2.2;
    ctx.fillRect(Math.random() * 512, Math.random() * 512, size, size);
  }
  // Very soft vertical variation gives the plaster a hand-applied finish.
  for (let x = 0; x < 512; x += 4) {
    ctx.fillStyle = `rgba(100,88,65,${Math.random() * 0.012})`;
    ctx.fillRect(x, 0, 1 + Math.random() * 2, 512);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2.5, 1.4);
  texture.anisotropy = 2;
  return texture;
}
const plasterTexture = makePlasterTexture();

const mat = {
  // Muted sage / warm stone green: richer than plain cream, but restrained
  // enough to complement walnut, brass and the warm gallery lighting.
  wall: new THREE.MeshStandardMaterial({ color: 0x34302f, map: plasterTexture, roughness: 0.98 }),
  wallShade: new THREE.MeshStandardMaterial({ color: 0x40352d, roughness: 0.96 }),
  trim: new THREE.MeshStandardMaterial({ color: 0x785a35, roughness: 0.58, metalness: 0.12 }),
  trimLight: new THREE.MeshStandardMaterial({ color: 0xb08a50, roughness: 0.42, metalness: 0.35 }),
  floor: new THREE.MeshStandardMaterial({ color: 0x60432e, roughness: 0.54 }),
  floorAlt: new THREE.MeshStandardMaterial({ color: 0x39251d, roughness: 0.58 }),
  ceiling: new THREE.MeshStandardMaterial({ color: 0x211b19, roughness: 0.94 }),
  wood: new THREE.MeshStandardMaterial({ color: 0xffffff, map: walnutTexture, roughness: 0.34 }),
  woodPanel: new THREE.MeshStandardMaterial({ color: 0xffffff, map: walnutTexture, roughness: 0.39 }),
  woodEdge: new THREE.MeshStandardMaterial({ color: 0x24160f, roughness: 0.36 }),
  brass: new THREE.MeshStandardMaterial({ color: 0xb28d50, metalness: 0.72, roughness: 0.26 }),
  dark: new THREE.MeshStandardMaterial({ color: 0x1d1712, roughness: 0.7 })
};


const matExtra = {
  panelDark: new THREE.MeshStandardMaterial({ color: 0x49301f, roughness: 0.72 }),
  plaster: new THREE.MeshStandardMaterial({ color: 0x403632, roughness: 0.98 }),
  ceilingTrim: new THREE.MeshStandardMaterial({ color: 0x8b704d, roughness: 0.7 }),
  marble: new THREE.MeshStandardMaterial({ color: 0x9d8b70, roughness: 0.32, metalness: 0.04 }),
  brassSoft: new THREE.MeshStandardMaterial({ color: 0x9e7944, roughness: 0.38, metalness: 0.58 }),
  shade: new THREE.MeshStandardMaterial({ color: 0xf0d9a9, roughness: 0.85, emissive: 0x9b6428, emissiveIntensity: 0.28 }),
  darkWood: new THREE.MeshStandardMaterial({ color: 0x2c1b12, roughness: 0.58 })
};

function addSconce(x, z) {
  const fixture = new THREE.Group();
  fixture.position.set(x, 3.18, z);
  scene.add(fixture);

  const backplate = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.07, 12), matExtra.brassSoft);
  backplate.rotation.x = Math.PI / 2;
  backplate.position.z = 0.03;
  fixture.add(backplate);

  const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.34, 8), matExtra.brassSoft);
  arm.rotation.x = Math.PI / 2;
  arm.position.set(0, -0.02, 0.19);
  fixture.add(arm);

  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.045, 0.34, 8), matExtra.brassSoft);
  stem.position.y = -0.20;
  fixture.add(stem);

  const shade = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.22, 0.27, 12, 1, true), matExtra.shade);
  shade.position.y = -0.31;
  fixture.add(shade);

  const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.075, 10, 8),
    new THREE.MeshBasicMaterial({ color: 0xffe2ad }));
  bulb.position.set(0, -0.43, 0.02);
  fixture.add(bulb);

}

function addRoomEnvironment(start, end) {
  const middle = (start + end) / 2;
  const length = start - end;

  // Deep walnut wainscoting, divided into classical wall panels.
  for (const side of [-1, 1]) {
    box(0.075, 1.42, length - 0.2, matExtra.darkWood, side * 6.29, 0.82, middle);
    for (let z = end + 0.85; z < start - 0.4; z += 2.8) {
      box(0.045, 1.12, 1.48, mat.trimLight, side * 6.235, 0.88, z);
      box(0.035, 0.98, 1.33, matExtra.panelDark, side * 6.205, 0.88, z);
      box(0.025, 0.84, 1.18, matExtra.darkWood, side * 6.18, 0.88, z);
    }

    // Fine horizontal chair rail and upper picture rail.
    box(0.11, 0.10, length, mat.trimLight, side * 6.19, 1.58, middle);
    box(0.10, 0.075, length, mat.trim, side * 6.20, 4.78, middle);
  }

  // Ceiling coffers and cross-beams create depth overhead.
  for (let z = end + 1.15; z < start - 0.2; z += 3.4) {
    box(12.55, 0.12, 0.16, matExtra.ceilingTrim, 0, 5.70, z);
    box(0.14, 0.10, length > 8 ? 3.0 : length, matExtra.ceilingTrim, -5.95, 5.69, z + 1.5);
    box(0.14, 0.10, length > 8 ? 3.0 : length, matExtra.ceilingTrim, 5.95, 5.69, z + 1.5);
  }

  // Parquet rhythm: narrow dark seams and brass pinstripes along the runner.
  for (let z = end + 0.55; z < start - 0.35; z += 1.15) {
    box(4.9, 0.012, 0.025, matExtra.darkWood, 0, 0.002, z);
  }
  for (const x of [-2.58, 2.58]) {
    box(0.025, 0.018, length - 0.8, matExtra.brassSoft, x, 0.012, middle);
  }
}

function box(w, h, d, material, x, y, z, parent = scene, options = {}) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
  mesh.position.set(x, y, z);
  mesh.castShadow = false;
  mesh.receiveShadow = false;
  parent.add(mesh);
  return mesh;
}

const rooms = [
  ['THE FOYER', 'Welcome', 2, -7, 'The beginning', 'Take in the quiet of the entrance hall.'],
  ['ROOM 01', 'The first chapter', -7, -17, 'The first chapterawaaaa', 'The first chapter of our little world.'],
  ['ROOM 02', 'Little Things', -17, -27, 'Little Things', 'Small details can hold the biggest meanings.'],
  ['ROOM 03', 'My Favorite Room', -27, -37, 'My favorite', 'Five moments in time, one shared story.'],
  ['ROOM 04', 'Letters Never Forgotten', -37, -47, 'Letters Never Forgotten', 'Some words deserve to be kept.'],
  ['ROOM 05', 'The Next Chapter', -47, -57, 'The Next Chapter', 'The story continues beyond this room.']
];

function makeTextPlane(label, z, y = 4.15) {
  const textureCanvas = document.createElement('canvas');
  textureCanvas.width = 1024;
  textureCanvas.height = 160;
  const ctx = textureCanvas.getContext('2d');
  ctx.fillStyle = '#e4d3ae';
  ctx.font = '600 48px Georgia';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label.toUpperCase(), 512, 80, 980);
  const texture = new THREE.CanvasTexture(textureCanvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const sign = new THREE.Mesh(
    new THREE.PlaneGeometry(3.1, 0.48),
    new THREE.MeshBasicMaterial({ map: texture, transparent: true })
  );
  sign.position.set(0, y, z);
  scene.add(sign);
}

function buildRoomShells() {
  const width = 13;
  const height = 5.8;
  for (const room of rooms) {
    const start = room[2];
    const end = room[3];
    const middle = (start + end) / 2;
    const length = start - end;

    box(width, 0.34, length, mat.floor, 0, -0.2, middle);
    box(width, 0.24, length, mat.ceiling, 0, height, middle);
    box(0.34, height, length, mat.wall, -6.5, height / 2, middle);
    box(0.34, height, length, mat.wall, 6.5, height / 2, middle);

    // Decorative skirting and cornice run continuously along both side walls.
    for (const side of [-1, 1]) {
      box(0.13, 0.24, length, mat.trim, side * 6.28, 0.13, middle);
      box(0.18, 0.18, length, mat.trimLight, side * 6.25, 5.48, middle);
      box(0.12, 0.16, length, mat.trim, side * 6.18, 5.32, middle);
    }

    // Alternating parquet-like central runner and brass border.
    box(5.15, 0.035, length - 0.7, mat.floorAlt, 0, -0.015, middle);
    box(5.28, 0.025, length - 0.55, mat.trimLight, 0, -0.04, middle);

    addRoomEnvironment(start, end);

    for (const z of [middle - 2.8, middle + 2.8]) {
      for (const x of [-5.7, 5.7]) {
        addSconce(x, z);
      }
    }

    if (room[0] === 'ROOM 05') {

    // Letrero elevado para dejar visible el árbol.
    box(
        3.4, 0.72, 0.12,
        mat.wood,
        0, 5.05, end + 0.32
    );

    makeTextPlane(
        'MUSEUM OF JONALYN',
        end + 0.40,
        5.05
    );

} else {

    // Mantener los letreros originales.
    box(3.4, 0.72, 0.12, mat.wood, 0, 4.15, end + 0.32);
    makeTextPlane(room[4], end + 0.245);

}
  }

  // Build each shared partition once. A real opening is left in the centre.
  const partitionZ = [-7, -17, -27, -37, -47];
  for (const z of partitionZ) {
    const openingWidth = 3.6;
    const openingHeight = 4.45;
    const sideWidth = (width - openingWidth) / 2;
    box(sideWidth, height, 0.38, mat.wall, -(openingWidth + sideWidth) / 2, height / 2, z);
    box(sideWidth, height, 0.38, mat.wall, (openingWidth + sideWidth) / 2, height / 2, z);
    box(openingWidth, height - openingHeight, 0.38, mat.wall, 0, openingHeight + (height - openingHeight) / 2, z);

    // Door casing: two pilasters, a lintel and layered trim.
    box(0.22, 4.65, 0.58, mat.trim, -1.92, 2.325, z);
    box(0.22, 4.65, 0.58, mat.trim, 1.92, 2.325, z);
    box(4.05, 0.24, 0.62, mat.trim, 0, 4.58, z);
    box(3.82, 0.10, 0.68, mat.trimLight, 0, 4.72, z);
    box(3.68, 0.10, 0.48, mat.woodEdge, 0, 4.43, z);
    box(3.72, 0.08, 0.55, mat.trimLight, 0, 0.08, z);

    // Stone-and-walnut threshold and extra depth in the architrave.
    box(3.52, 0.10, 0.72, mat.floorAlt, 0, 0.015, z);
    box(3.44, 0.035, 0.62, mat.trimLight, 0, 0.075, z);
    for (const side of [-1, 1]) {
      box(0.055, 4.34, 0.07, mat.trimLight, side * 1.70, 2.22, z + 0.31);
      box(0.10, 0.16, 0.12, mat.woodEdge, side * 1.78, 4.43, z + 0.30);
    }
  }

  // End wall at the far end of the final gallery.
  box(width, height, 0.38, mat.wall, 0, height / 2, -57);
}
  // ==========================================
// ROOM 05 - THE NEXT CHAPTER
// Decorative golden tree installation
// ==========================================

function buildRoomFiveTree() {
    const installation = new THREE.Group();

    installation.position.set(0, 0.35, -56.72);
    scene.add(installation);

    const gold = new THREE.MeshStandardMaterial({
        color: 0xc6a064,
        metalness: 0.78,
        roughness: 0.28,
        emissive: 0x6b431c,
        emissiveIntensity: 0.22
    });

    const brightGold = new THREE.MeshBasicMaterial({
        color: 0xffd995
    });

    const glowGold = new THREE.MeshBasicMaterial({
        color: 0xffd18a,
        transparent: true,
        opacity: 0.22,
        depthWrite: false
    });

    // Marco circular detrás del árbol.
    const outerRing = new THREE.Mesh(
        new THREE.TorusGeometry(1.72, 0.025, 12, 100),
        gold
    );

    outerRing.position.set(0, 2.05, 0.025);
    installation.add(outerRing);

    const innerRing = new THREE.Mesh(
        new THREE.TorusGeometry(1.62, 0.009, 8, 100),
        brightGold
    );

    innerRing.position.set(0, 2.05, 0.04);
    installation.add(innerRing);

    // Función para crear las ramas curvas.
    function createBranch(points, radius) {
        const curve = new THREE.CatmullRomCurve3(
            points.map(point =>
                new THREE.Vector3(point[0], point[1], point[2])
            )
        );

        const branch = new THREE.Mesh(
            new THREE.TubeGeometry(curve, 32, radius, 8, false),
            gold
        );

        installation.add(branch);
    }

    // Tronco principal.
    createBranch([
        [0, 0.25, 0.12],
        [-0.10, 0.85, 0.12],
        [0.08, 1.45, 0.12],
        [-0.04, 2.05, 0.12],
        [0.12, 2.75, 0.12],
        [0.02, 3.35, 0.12]
    ], 0.055);

    // Ramas principales.
    createBranch([
        [-0.02, 1.05, 0.12],
        [-0.48, 1.35, 0.12],
        [-0.95, 1.48, 0.12],
        [-1.38, 1.85, 0.12]
    ], 0.035);

    createBranch([
        [0.02, 1.35, 0.12],
        [0.48, 1.62, 0.12],
        [0.98, 1.72, 0.12],
        [1.40, 2.10, 0.12]
    ], 0.035);

    createBranch([
        [-0.02, 1.85, 0.12],
        [-0.45, 2.15, 0.12],
        [-0.88, 2.48, 0.12],
        [-1.12, 2.85, 0.12]
    ], 0.03);

    createBranch([
        [0.04, 2.15, 0.12],
        [0.48, 2.38, 0.12],
        [0.85, 2.72, 0.12],
        [1.12, 3.02, 0.12]
    ], 0.03);

    createBranch([
        [0.05, 2.65, 0.12],
        [-0.30, 2.92, 0.12],
        [-0.48, 3.20, 0.12]
    ], 0.022);

    createBranch([
        [0.08, 2.75, 0.12],
        [0.42, 3.02, 0.12],
        [0.58, 3.30, 0.12]
    ], 0.022);

    // Pequeñas estrellas en los extremos de las ramas.
    const starPositions = [
        [-1.38, 1.85, 0.15],
        [1.40, 2.10, 0.15],
        [-1.12, 2.85, 0.15],
        [1.12, 3.02, 0.15],
        [-0.48, 3.20, 0.15],
        [0.58, 3.30, 0.15],
        [0.02, 3.48, 0.15],
        [-0.90, 1.48, 0.15],
        [0.98, 1.72, 0.15]
    ];

    for (const position of starPositions) {
        const star = new THREE.Mesh(
            new THREE.IcosahedronGeometry(0.075, 1),
            brightGold
        );

        star.position.set(...position);
        installation.add(star);

        const halo = new THREE.Mesh(
            new THREE.SphereGeometry(0.16, 16, 12),
            glowGold
        );

        halo.position.copy(star.position);
        installation.add(halo);
    }

    // Pequeños puntos luminosos alrededor del árbol.
    const floatingStars = [
        [-1.85, 2.55],
        [1.82, 2.65],
        [-1.65, 1.10],
        [1.68, 1.15],
        [-0.95, 3.55],
        [0.95, 3.60],
        [0, 0.75]
    ];

    for (const [x, y] of floatingStars) {
        const point = new THREE.Mesh(
            new THREE.SphereGeometry(0.045, 12, 10),
            brightGold
        );

        point.position.set(x, y, 0.13);
        installation.add(point);
    }

    // Texto superior.
    const textCanvas = document.createElement('canvas');
    textCanvas.width = 1024;
    textCanvas.height = 180;

    const ctx = textCanvas.getContext('2d');

    ctx.fillStyle = '#e7c995';
    ctx.font = 'italic 58px Georgia';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('ANG SUSOND NATING KABANATA', 512, 90);

    const textTexture = new THREE.CanvasTexture(textCanvas);
    textTexture.colorSpace = THREE.SRGBColorSpace;

    const title = new THREE.Mesh(
        new THREE.PlaneGeometry(3.5, 0.62),
        new THREE.MeshBasicMaterial({
            map: textTexture,
            transparent: true,
            depthWrite: false
        })
    );

    title.position.set(0, 4.15, 0.08);
    installation.add(title);

    // Pequeña inscripción inferior.
    const subtitleCanvas = document.createElement('canvas');
    subtitleCanvas.width = 1024;
    subtitleCanvas.height = 120;

    const subtitleCtx = subtitleCanvas.getContext('2d');

    subtitleCtx.fillStyle = '#c5a77a';
    subtitleCtx.font = '32px Georgia';
    subtitleCtx.textAlign = 'center';
    subtitleCtx.textBaseline = 'middle';

    subtitleCtx.fillText(
        'Two souls, one story',
        512,
        60
    );

    const subtitleTexture = new THREE.CanvasTexture(subtitleCanvas);
    subtitleTexture.colorSpace = THREE.SRGBColorSpace;

    const subtitle = new THREE.Mesh(
        new THREE.PlaneGeometry(3.1, 0.36),
        new THREE.MeshBasicMaterial({
            map: subtitleTexture,
            transparent: true,
            depthWrite: false
        })
    );

    subtitle.position.set(0, 0.12, 0.08);
    installation.add(subtitle);
}



function buildEntranceFacade(z) {
  // A complete architectural portal surrounds the entrance doors instead of leaving them floating.
  const opening = 3.72;
  const side = (13 - opening) / 2;
  box(side, 5.8, 0.42, mat.wall, -(opening + side) / 2, 2.9, z);
  box(side, 5.8, 0.42, mat.wall, (opening + side) / 2, 2.9, z);
  box(opening, 1.18, 0.42, mat.wall, 0, 5.21, z);

  // Layered walnut architrave and classical pilasters.
  for (const x of [-2.02, 2.02]) {
    box(0.30, 5.02, 0.68, mat.trim, x, 2.51, z + 0.02);
    box(0.12, 4.72, 0.72, mat.trimLight, x, 2.51, z + 0.10);
    box(0.18, 4.42, 0.76, mat.dark, x, 2.51, z + 0.16);
    box(0.42, 0.22, 0.82, mat.trimLight, x, 4.95, z + 0.12);
    box(0.42, 0.22, 0.82, mat.trimLight, x, 0.12, z + 0.12);
  }
  box(4.35, 0.30, 0.78, mat.woodEdge, 0, 5.00, z + 0.02);
  box(4.52, 0.13, 0.86, mat.trimLight, 0, 5.20, z + 0.04);
  box(4.10, 0.10, 0.78, mat.trim, 0, 4.78, z + 0.12);
  box(3.78, 0.09, 0.76, mat.brass, 0, 0.08, z + 0.10);

  // Shallow decorative wall panels flank the portal.
  for (const x of [-4.65, 4.65]) {
    box(2.35, 3.55, 0.08, mat.trim, x, 3.00, z + 0.235);
    box(2.16, 3.36, 0.06, mat.wallShade, x, 3.00, z + 0.29);
    box(1.92, 3.12, 0.035, mat.wall, x, 3.00, z + 0.33);
    box(2.35, 0.09, 0.10, mat.trimLight, x, 4.82, z + 0.30);
    box(2.35, 0.09, 0.10, mat.trimLight, x, 1.18, z + 0.30);
  }
}

function buildDoorLeaf(hinge, side) {
  const leaf = new THREE.Group();
  // Crucial geometry: centre of each leaf is half a leaf-width from its hinge.
  // Left leaf extends rightward; right leaf extends leftward.
  leaf.position.x = -side * 0.89;
  hinge.add(leaf);

  // Door slab and stepped edge mouldings.
  box(1.78, 4.28, 0.16, mat.wood, 0, 2.14, 0, leaf);
  box(1.64, 4.16, 0.055, mat.woodEdge, 0, 2.14, 0.105, leaf);
  box(1.52, 4.04, 0.045, mat.trim, 0, 2.14, 0.145, leaf);
  box(1.40, 3.92, 0.035, mat.woodPanel, 0, 2.14, 0.18, leaf);

  // Two raised panels with layered rails; all pieces move with the leaf.
  for (const y of [1.12, 3.13]) {
    box(1.25, 1.62, 0.045, mat.woodEdge, 0, y, 0.205, leaf);
    box(1.15, 1.52, 0.035, mat.trimLight, 0, y, 0.235, leaf);
    box(1.04, 1.40, 0.03, mat.woodPanel, 0, y, 0.26, leaf);
    box(0.92, 1.28, 0.018, mat.wood, 0, y, 0.28, leaf);
  }

  // Central stile and a subtle lower kick plate.
  box(0.13, 4.18, 0.12, mat.trim, -side * 0.79, 2.14, 0.19, leaf);
  box(1.35, 0.12, 0.035, mat.brass, 0, 0.23, 0.23, leaf);

  // Traditional rails create a deeper, more convincing panelled door.
  for (const y of [0.18, 2.14, 4.10]) {
    box(1.70, 0.09, 0.075, mat.trim, 0, y, 0.19, leaf);
    box(1.58, 0.025, 0.025, mat.trimLight, 0, y + 0.055, 0.235, leaf);
  }

  // Brass backplate and spherical knob close to the meeting stile.
  const handleX = -side * 0.70;
  box(0.13, 0.32, 0.045, mat.brass, handleX, 2.08, 0.30, leaf);
  const knob = new THREE.Mesh(new THREE.SphereGeometry(0.085, 20, 16), mat.brass);
  knob.position.set(handleX, 2.08, 0.39);
  knob.castShadow = true;
  leaf.add(knob);

  // Brass hinge plates and cylindrical knuckles on the outer stile.
  for (const y of [0.48, 2.14, 3.80]) {
    box(0.10, 0.42, 0.045, mat.brass, side * 0.035, y, 0.105, leaf);
    const knuckle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.045, 0.045, 0.30, 16),
      mat.brass
    );
    knuckle.position.set(side * 0.015, y, 0.17);
    knuckle.castShadow = true;
    leaf.add(knuckle);
  }

  // Small keyhole beneath the handle.
  const keyhole = new THREE.Mesh(
    new THREE.CircleGeometry(0.025, 16),
    mat.dark
  );
  keyhole.position.set(handleX, 1.82, 0.333);
  leaf.add(keyhole);

  // Fine brass inlays and a small ornamental rosette make the door feel handcrafted.
  box(1.42, 0.035, 0.025, mat.trimLight, 0, 0.36, 0.30, leaf);
  const rosette = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.018, 6, 20), mat.brass);
  rosette.position.set(0, 2.60, 0.315);
  leaf.add(rosette);
  return leaf;
}

const passageDoors = [];

function createDoubleDoor(z, index) {
  const leaves = [];
  for (const side of [-1, 1]) {
    const hinge = new THREE.Group();
    hinge.position.set(side * 1.78, 0, z);
    scene.add(hinge);
    const leaf = buildDoorLeaf(hinge, side);
    leaves.push({ hinge, leaf, side });
  }
  passageDoors.push({ z, index, leaves, open: false, angle: 0, target: 0 });
}

function buildDoorFrames() {
  [-7, -17, -27, -37, -47].forEach((z, i) => createDoubleDoor(z, i));
}

function buildEntranceDoors() {
  const entrance = { leaves: [], angle: 0, target: 0 };
  for (const side of [-1, 1]) {
    const hinge = new THREE.Group();
    hinge.position.set(side * 1.78, 0, 1.65);
    scene.add(hinge);
    const leaf = buildDoorLeaf(hinge, side);
    entrance.leaves.push({ hinge, leaf, side });
  }
  return entrance;
}

// Entrance hall focal pendant: restrained brass fixture with warm glass glow.
const pendant = new THREE.Group();
pendant.position.set(0, 5.05, -2.0);
scene.add(pendant);
const pendantStem = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.55, 12), matExtra.brassSoft);
pendantStem.position.y = 0.25;
pendant.add(pendantStem);
const pendantBody = new THREE.Mesh(new THREE.SphereGeometry(0.30, 24, 16), matExtra.shade);
pendantBody.position.y = -0.12;
pendant.add(pendantBody);

// Marble-like floor inlay at the centre of the foyer.
const foyerInlay = new THREE.Mesh(
  new THREE.CircleGeometry(1.65, 64),
  matExtra.marble
);
foyerInlay.rotation.x = -Math.PI / 2;
foyerInlay.position.set(0, -0.012, -2.0);
scene.add(foyerInlay);
const foyerRing = new THREE.Mesh(
  new THREE.RingGeometry(1.48, 1.57, 64),
  matExtra.brassSoft
);
foyerRing.rotation.x = -Math.PI / 2;
foyerRing.position.set(0, 0.006, -2.0);
scene.add(foyerRing);

buildRoomShells();
buildRoomFiveTree();
buildEntranceFacade(1.65);
buildDoorFrames();
const entranceDoors = buildEntranceDoors();

const exhibits = [];
// Animaciones físicas de las cartas.
const letterAnimations = [];

// Shared, low-cost warm light wash for framed artwork (no real-time lights).
function makePictureGlowTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 320;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(128, 52, 8, 128, 150, 158);
  gradient.addColorStop(0, 'rgba(255, 221, 157, 0.48)');
  gradient.addColorStop(0.38, 'rgba(255, 193, 112, 0.22)');
  gradient.addColorStop(1, 'rgba(255, 174, 91, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 256, 320);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
const pictureGlowTexture = makePictureGlowTexture();
const pictureGlowMaterial = new THREE.MeshBasicMaterial({
  map: pictureGlowTexture,
  transparent: true,
  opacity: 0.72,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
  side: THREE.DoubleSide
});
const pictureLampMetal = new THREE.MeshStandardMaterial({
  color: 0xb18b51, metalness: 0.72, roughness: 0.3
});
const pictureLampGlass = new THREE.MeshBasicMaterial({ color: 0xffd99b });

function addPictureLighting(group) {
  // A small traditional brass picture light mounted just above the frame.
  const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 1.22, 10), pictureLampMetal);
  bar.rotation.z = Math.PI / 2;
  bar.position.set(0, 3.53, 0.24);
  group.add(bar);

  const mount = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.16, 8), pictureLampMetal);
  mount.position.set(0, 3.48, 0.20);
  group.add(mount);

  for (const side of [-1, 1]) {
    const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.22, 7), pictureLampMetal);
    arm.rotation.x = Math.PI / 2;
    arm.position.set(side * 0.48, 3.48, 0.29);
    group.add(arm);
  }

  const diffuser = new THREE.Mesh(new THREE.BoxGeometry(1.28, 0.045, 0.075), pictureLampGlass);
  diffuser.position.set(0, 3.48, 0.37);
  group.add(diffuser);

  // A transparent warm wash gives the photograph its own pool of light.
  const glow = new THREE.Mesh(new THREE.PlaneGeometry(1.95, 2.28), pictureGlowMaterial);
  glow.position.set(0, 2.27, 0.235);
  glow.renderOrder = 2;
  group.add(glow);
}
function createLetterTexture(title, description) {
    const canvas = document.createElement('canvas');

    canvas.width = 768;
    canvas.height = 1024;

    const ctx = canvas.getContext('2d');

    // Papel envejecido.
    ctx.fillStyle = '#f2e5ce';
    ctx.fillRect(0, 0, 768, 1024);

    // Borde interior.
    ctx.strokeStyle = '#b99b78';
    ctx.lineWidth = 5;
    ctx.strokeRect(28, 28, 712, 968);

    // Encabezado.
    ctx.textAlign = 'center';
    ctx.fillStyle = '#79583e';
    ctx.font = 'italic 43px Georgia';
    ctx.fillText('A letter for you', 384, 112);

    ctx.strokeStyle = 'rgba(139,101,62,0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(85, 165);
    ctx.lineTo(683, 165);
    ctx.stroke();

    // Título.
    ctx.font = 'bold 38px Georgia';
    ctx.fillStyle = '#745039';
    ctx.fillText(title, 384, 235, 620);

    // Texto del cuerpo.
    ctx.textAlign = 'left';
    ctx.font = '29px Georgia';
    ctx.fillStyle = '#49382b';

    const paragraphs = String(description).split(/\n+/);
    let y = 315;

    for (const paragraph of paragraphs) {
        const words = paragraph.split(/\s+/);
        let line = '';

        for (const word of words) {
            const candidate = line
                ? `${line} ${word}`
                : word;

            if (ctx.measureText(candidate).width > 590 && line) {
                ctx.fillText(line, 88, y);
                line = word;
                y += 47;
            } else {
                line = candidate;
            }
        }

        if (line) {
            ctx.fillText(line, 88, y);
            y += 47;
        }

        y += 20;

        if (y > 790) break;
    }

    // Firma.
    ctx.textAlign = 'right';
    ctx.font = 'italic 34px Georgia';
    ctx.fillStyle = '#80583a';
    ctx.fillText('With love, always.', 675, 900);

    ctx.textAlign = 'center';
    ctx.font = '35px Georgia';
    ctx.fillText('♡', 384, 955);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;

    return texture;
}
function createExhibit(room, x, z, title, description, letter = false) {
  const group = new THREE.Group();
  group.position.set(x, 0, z);
  scene.add(group);

  if (!letter) {
    box(2.04, 2.39, 0.18, mat.brass, 0, 2.25, 0, group);
    box(1.8, 2.15, 0.12, mat.woodEdge, 0, 2.25, 0.11, group);
    box(1.62, 1.97, 0.04, new THREE.MeshStandardMaterial({
      color: [0x6d5140, 0x7b6952, 0x6b4b43, 0x8a765b, 0x625044][room % 5]
    }), 0, 2.25, 0.19, group);
    const medallion = new THREE.Mesh(
      new THREE.CircleGeometry(0.32, 32),
      new THREE.MeshStandardMaterial({ color: 0xc4a36d, metalness: 0.15, roughness: 0.55 })
    );
    medallion.position.set(0, 2.27, 0.23);
    medallion.userData.isPhotoPlaceholder = true;
    group.add(medallion);
    addPictureLighting(group);
  } else {
    box(1.6, 1.35, 0.13, mat.wood, 0, 1.45, 0, group);
    box(1.42, 1.17, 0.035, mat.wall, 0, 1.45, 0.09, group);
    box(0.18, 0.18, 0.06, mat.brass, 0, 1.45, 0.15, group);

    // Warm dedicated display treatment for letters: a small brass picture
    // light, softly illuminated paper and a translucent amber wall wash.
    const letterLamp = new THREE.Mesh(
      new THREE.BoxGeometry(0.78, 0.045, 0.075), pictureLampGlass
    );
    letterLamp.position.set(0, 2.20, 0.20);
    group.add(letterLamp);
    const letterGlow = new THREE.Mesh(
      new THREE.PlaneGeometry(1.85, 1.72), pictureGlowMaterial
    );
    letterGlow.position.set(0, 1.48, 0.205);
    letterGlow.renderOrder = 2;
    group.add(letterGlow);
    // Sobre de madera y papel.
const envelopeMaterial = new THREE.MeshStandardMaterial({
    color: 0x8a5934,
    roughness: 0.88,
    side: THREE.DoubleSide
});

// Parte trasera del sobre.
const envelopeBack = new THREE.Mesh(
    new THREE.PlaneGeometry(1.30, 1.08),
    envelopeMaterial
);

envelopeBack.position.set(0, 1.45, 0.14);
group.add(envelopeBack);

// Hoja con el texto personalizado.
const letterTexture = createLetterTexture(title, description);

const paperMaterial = new THREE.MeshBasicMaterial({
    map: letterTexture,
    transparent: true,
    opacity: 1,
    side: THREE.DoubleSide,
    depthWrite: false
});

const paper = new THREE.Group();

const paperSheet = new THREE.Mesh(
    new THREE.PlaneGeometry(1.12, 1.42),
    paperMaterial
);

paper.add(paperSheet);

// Posición inicial: la hoja queda parcialmente dentro del sobre.
paper.position.set(0, 1.50, 0.205);
paper.scale.set(1, 0.28, 1);

group.add(paper);

// Frente del sobre.
const envelopeFront = new THREE.Mesh(
    new THREE.PlaneGeometry(1.30, 0.62),
    envelopeMaterial
);

envelopeFront.position.set(0, 1.20, 0.24);
group.add(envelopeFront);

// Solapa triangular articulada.
const flapPivot = new THREE.Group();

flapPivot.position.set(0, 1.51, 0.255);
group.add(flapPivot);

const flapShape = new THREE.Shape();

flapShape.moveTo(-0.65, 0);
flapShape.lineTo(0.65, 0);
flapShape.lineTo(0, -0.43);
flapShape.closePath();

const flap = new THREE.Mesh(
    new THREE.ShapeGeometry(flapShape),
    envelopeMaterial
);

flap.position.z = 0.01;
flapPivot.add(flap);

// Sello de lacre.
const sealMaterial = new THREE.MeshStandardMaterial({
    color: 0x913e38,
    roughness: 0.65
});

const seal = new THREE.Mesh(
    new THREE.CircleGeometry(0.075, 24),
    sealMaterial
);

seal.position.set(0, -0.27, 0.025);
flapPivot.add(seal);

// Estado de animación de esta carta.
letterAnimations.push({
   group,
    paper,
    flapPivot,
    seal,
    target: 0,
    progress: 0
});
  }

  box(1.05, 0.75, 0.95, mat.wood, 0, 0.38, 0, group);
  box(1.12, 0.08, 1.02, mat.brass, 0, 0.78, 0, group);
  group.userData = { room, title, description, letter };
  exhibits.push(group);
}

createExhibit(1, -3.5, -12.5, 'The first memory', 'This frame is reserved for a photograph from the beginning of the story.');
createExhibit(1, 3.5, -14.5, 'A moment to keep', 'Add a date, a photograph, and the memory behind it here.');
createExhibit(2, -3.5, -21.5, 'A little detail', 'An inside joke, a habit, or a favourite detail can live here.');
createExhibit(
    2,
    3.5,
    -24.5,
    'The Art of Finding You',
    `If someone had told me that a person could become such a beautiful part of my world without ever being beside me, I probably wouldn't have believed them.

And yet, here I am, writing to you.

There is something extraordinary about you, Jonalyn. Not merely in the way you look, nor in the sweetness of your voice, but in the little things that make you who you are. The way you express yourself, the thoughts you share, the moments when you are silly without even trying, and the quiet tenderness hidden in the smallest gestures.

I wish I could collect all those little moments and place them somewhere safe, like pressed flowers between the pages of an old book.

Perhaps that is what affection really is: learning to treasure the smallest details of another person until they become unforgettable.

I don't know what the future has written for us. I cannot promise that every day will be easy, or that distance will never feel heavy. But I know that what we are building deserves patience, honesty, and care.

And if I could choose one thing to preserve from all these months, it would be the simple fact that, among all the people I could have met, somehow, I met you.

You are my beautiful way of saying that even though time and distance are in the way, you are worth waiting for.

With all my affection,
Antony`,
    true
);
for (let i = 0; i < 5; i++) {
  createExhibit(3, (i - 2) * 2.25, -32, `Month ${i + 1}`, `Month ${i + 1}: add its date, photograph, and a short memory here.`);
}
createExhibit(
    4,
    -3.5,
    -41.5,
    'Still, I Choose Us',
    `To my love,

We have had our disagreements, our misunderstandings, and our moments when we fought over things that, looking back, were never worth holding on to for so long. But despite all of that, there is something that makes me genuinely happy: we are still here.

Still learning about each other. Still correcting our mistakes. Still discovering how to understand one another a little better. And, most importantly, still standing side by side, choosing not to give up on what we are building.

I don't expect us to be perfect. I don't want a love without disagreements; I want a love in which we learn how to face them together. A love where pride becomes understanding, where mistakes become lessons, and where two people never stop trying to meet each other halfway.

Sometimes, I wish I could simply close the distance between us. I wish I could hold you in my arms, kiss you, and finally feel your lips against mine. I want to look into your eyes and let all the worries, all the arguments, and all the things that once made us sad fade into the background.

For once, I don't want to think about the distance, the misunderstandings, or tomorrow's uncertainties. I just want a moment where there is nothing else to worry about — just you and me, together, exactly where we have always wanted to be.

I love you, and I hope to keep loving you through every season of our story.

No matter how much we still have to learn, I am grateful that we are learning together.

Forever yours,
Antony.`,
    true
);
createExhibit(
    4,
    3.5,
    -44.5,
    'In Every Little Thing',
    `To my dearest Jonalyn,

I wonder if you will ever understand how beautiful you are through my eyes.

And I don't mean only the beauty that someone notices at first glance. I mean the beauty that reveals itself slowly, in the little things you probably don't even realize you do.

It's in the way you speak about something you love, the way your personality shines through your messages, the expressions you make, and the little moments when you make me laugh without even trying.

I wish you could see yourself from my perspective, even for just a minute. Perhaps then you would understand why I find so many reasons to admire you.

You don't have to be perfect to be wonderful. You don't have to look beautiful every day, say the right things all the time, or pretend to be someone you're not. I want you to feel comfortable being yourself around me, even on your quietest, messiest, and most ordinary days.

Because I don't want to love only the extraordinary moments. I want to appreciate the ordinary ones, too.

And when the day finally comes when distance is no longer part of our story, I hope I can remind you of all these things without needing a screen between us.

Until then, never forget that somewhere in this world, there is someone who finds beauty in the smallest details of you.

If I could write a thousand poems about beauty, somehow, I think they would all lead me back to you.

With love,
Antony.`,
    true
);
createExhibit(
    5,
    0,
    -52,
    'The Next Chapter',
    `To my once-in-a-lifetime kind of love, Jonalyn,

If I had to put everything I feel for you into a single letter, I fear that even a thousand pages would not be enough.

How could I possibly fit every thought, every memory, every little moment, and every dream into a handful of words? How could I explain something that has become so important to me that sometimes I find myself searching for the right words and discovering that none of them seem quite enough?

So perhaps I should begin with something simple.

Thank you for being part of my story.

Thank you for the conversations that made ordinary days special, for the laughter that found its way through a screen, for the memories we have created, and even for the difficult moments that taught us how much we still have to learn about each other.

I know we are not perfect. We have made mistakes, misunderstood one another, and sometimes allowed little things to become bigger than they needed to be. But I hope we never forget that loving someone is not about finding a person who never makes mistakes. It is about learning to understand, listening even when it is difficult, apologizing when we are wrong, and choosing kindness when pride would be easier.

I don't want us to become two people who simply remember how beautiful everything used to be. I want us to keep creating beautiful things together.

And there is one thought that visits me more often than you might imagine: the day I finally get to see you.

I wonder what that first moment will feel like. After all the messages, all the calls, all the photographs, and all the nights spent wishing the distance were smaller, what will it be like to finally stand in front of you?

I imagine looking at you and realizing that the person who has occupied so many of my thoughts is finally there, within reach. No screen, no time zones, no goodbye at the end of a call. Just a moment that belongs entirely to us.

I want to hold your hand, look into your eyes, embrace you, and remind you that every mile between us was never the measure of how much you meant to me.

But until that day arrives, I don't want us to forget to live the little moments we have now. I want to know your thoughts, hear about your days, celebrate your achievements, support your dreams, and continue discovering all the things that make you who you are.

I hope you achieve everything your heart has ever wished for. I hope life gives you countless reasons to smile, opportunities to grow, and the courage to pursue everything you dream of becoming. And I hope that, along the way, I can be someone who encourages you, believes in you, and reminds you of your worth whenever you need it.

If the future allows us to look back on these days together, I hope we will smile at how far we have come. I hope we will remember this distance not simply as something that kept us apart, but as one of the chapters that taught us patience, trust, and appreciation.

And if there is one thing I want you to take from this entire museum, it is this:

Among all the photographs, letters, little symbols, and memories you have found here, the most meaningful part has never been the things I created. It has always been the person who inspired me to create them.

You.

I cannot tell you exactly what every tomorrow will look like. But I can tell you what I wish to keep doing: learning with you, growing with you, laughing with you, and making memories that we will one day be able to hold instead of simply look at through a screen.

I love you, Jonalyn. Not because our story is perfect, but because it is ours, and because there is still so much left for us to discover.

If I could return to the beginning, knowing everything I know now, I would still hope to find you.

And if life gave me a thousand different stories to live, I would still be grateful that one of them brought me to you.

With all the love I have to give,

Antony

P.S. This is not the end of our story. It is simply the last letter in this little museum. The rest is waiting for us to live it.`,
    true
);


// User photographs are loaded from photos.json. Add files to the fotos/ folder
// and describe their placement in that JSON file; no Three.js code changes needed.

async function loadPersonalPhotographs() {
    let manifest;

    try {
        const response = await fetch('./photos.json', { cache: 'no-store' });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        manifest = await response.json();
    } catch (error) {
        console.warn('Could not load photos.json.', error);
        return;
    }

    const loader = new THREE.TextureLoader();

    for (const item of (manifest.photos || [])) {
        const room = Number(item.room);

        if (!item.file || !Number.isInteger(room) || room < 1 || room > 5) {
            continue;
        }

        try {
            const texture = await loader.loadAsync(
                `./fotos/${encodeURIComponent(item.file).replace(/%2F/g, '/')}`
            );

            texture.colorSpace = THREE.SRGBColorSpace;
            texture.anisotropy = 2;

            const material = new THREE.MeshBasicMaterial({
                map: texture,
                toneMapped: false
            });

            // SYSTEM 1: Place photograph inside an existing frame.
            if (item.slot !== undefined) {
                const slot = Number(item.slot);

                if (!Number.isInteger(slot) || slot < 1) continue;

                const roomFrames = exhibits.filter(exhibit =>
                    exhibit.userData.room === room &&
                    !exhibit.userData.letter
                );

                const targetFrame = roomFrames[slot - 1];

                if (!targetFrame) {
                    console.warn(`No frame ${slot} in Room ${room}:`, item.file);
                    continue;
                }

                const photo = new THREE.Mesh(
                    new THREE.PlaneGeometry(1.62, 1.97),
                    material
                );

                photo.position.set(0, 2.25, 0.235);
                photo.userData.isPersonalPhoto = true;
                targetFrame.add(photo);

                targetFrame.traverse(object => {
                    if (object.userData?.isPhotoPlaceholder) {
                        object.visible = false;
                    }
                });

                targetFrame.userData.title =
                    item.title || targetFrame.userData.title;

                targetFrame.userData.description =
                    item.description || targetFrame.userData.description;

                continue;
            }

            // SYSTEM 2: Create a new frame using wall coordinates.
            if (item.wall === 'left' || item.wall === 'right') {
                const width = Number(item.width) || 1.6;
                const height = Number(item.height) || 1.9;
                const y = Number(item.y) || 2.5;
                const z = Number(item.z);

                if (!Number.isFinite(z)) {
                    console.warn('Invalid z coordinate:', item.file);
                    continue;
                }

                const group = new THREE.Group();

                // Side walls are at x = -6.5 and x = 6.5.
                const isLeft = item.wall === 'left';

                group.position.set(
                    isLeft ? -6.34 : 6.34,
                    y - 2.25,
                    z
                );

                // Face the photograph toward the room.
                group.rotation.y = isLeft
                    ? Math.PI / 2
                    : -Math.PI / 2;

                // Frame and wooden inner border.
                const outerFrame = new THREE.Mesh(
                    new THREE.BoxGeometry(width + 0.42, height + 0.42, 0.18),
                    mat.brass
                );
                outerFrame.position.set(0, 2.25, 0);
                group.add(outerFrame);

                const innerFrame = new THREE.Mesh(
                    new THREE.BoxGeometry(width + 0.18, height + 0.18, 0.12),
                    mat.woodEdge
                );
                innerFrame.position.set(0, 2.25, 0.11);
                group.add(innerFrame);

                // Photograph.
                const photo = new THREE.Mesh(
                    new THREE.PlaneGeometry(width, height),
                    material
                );
                photo.position.set(0, 2.25, 0.19);
                photo.userData.isPersonalPhoto = true;
                group.add(photo);

                // Picture lighting.
                addPictureLighting(group);

                group.userData = {
                    room,
                    title: item.title || item.file,
                    description: item.description || '',
                    letter: false,
                    isPersonalPhotoFrame: true
                };

                scene.add(group);
                exhibits.push(group);
            }
        } catch (error) {
            console.warn(`Could not load photograph: ${item.file}`, error);
        }
    }
}

loadPersonalPhotographs();


for (const room of rooms.slice(1)) {
  const middle = (room[2] + room[3]) / 2;
  for (const z of [middle - 3.2, middle + 3.2]) {
    for (const x of [-5.9, 5.9]) {
      box(0.42, 4.7, 0.42, mat.trim, x, 2.35, z);
      box(0.68, 0.22, 0.68, mat.trimLight, x, 4.75, z);
      box(0.68, 0.22, 0.68, mat.trimLight, x, 0.12, z);
    }
  }
}

let currentRoom = 0;
let entered = false;
let yaw = 0;
let pitch = 0;
let targetYaw = 0;
let targetPitch = 0;

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const keys = new Set();
const playerSpeed = 4.0;
const playerRadius = 0.34;
const doorOpenAngle = 1.48;

function updateRoomUI() {
  const z = camera.position.z;
  currentRoom = 0;
  for (let i = 1; i < rooms.length; i++) {
    if (z <= rooms[i][2]) currentRoom = i;
  }
  currentRoom = Math.min(currentRoom, rooms.length - 1);
  $('#roomNo').textContent = rooms[currentRoom][0];
  $('#roomName').textContent = rooms[currentRoom][1];
  $('#hint').textContent = 'WASD / arrows to walk · Move mouse to look';
}

function showPanel(id) {
  $('#' + id).classList.remove('hidden');
}
function hidePanel(id) {
  $('#' + id).classList.add('hidden');
}

document.querySelectorAll('[data-close]').forEach((button) => {
  button.addEventListener('click', () => hidePanel(button.dataset.close));
});
$('#music').addEventListener('click', () => showPanel('musicPanel'));
$('#help').addEventListener('click', () => showPanel('helpPanel'));

function animateEntranceDoors() {
  return new Promise((resolve) => {
    entranceDoors.target = doorOpenAngle;
    const started = performance.now();
    function frame(now) {
      const t = Math.min((now - started) / 2100, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      entranceDoors.angle = doorOpenAngle * eased;
      for (const leaf of entranceDoors.leaves) {
        leaf.hinge.rotation.y = leaf.side * entranceDoors.angle;
      }
      if (t < 1) requestAnimationFrame(frame);
      else resolve();
    }
    requestAnimationFrame(frame);
  });
}

$('#enter').addEventListener('click', async () => {
  if (entered) return;
  entered = true;
  $('#intro').classList.add('leaving');
  await animateEntranceDoors();
  $('#intro').classList.add('hidden');
  $('#hud').classList.remove('hidden');
  $('#bottom').classList.remove('hidden');
  camera.position.set(0, 1.68, -3.8);
  updateRoomUI();
});

const keyMap = {
  KeyW: 'forward', ArrowUp: 'forward',
  KeyS: 'back', ArrowDown: 'back',
  KeyA: 'left', ArrowLeft: 'left',
  KeyD: 'right', ArrowRight: 'right'
};

function nearestDoor() {
  let nearest = null;
  let nearestDistance = Infinity;
  for (const door of passageDoors) {
    const dx = camera.position.x;
    const dz = camera.position.z - door.z;
    const distance = Math.hypot(dx, dz);
    if (Math.abs(dx) < 2.8 && distance < 2.75 && distance < nearestDistance) {
      nearest = door;
      nearestDistance = distance;
    }
  }
  return nearest;
}

function toggleNearestDoor() {
  const door = nearestDoor();
  if (!door || !entered) return;
  door.open = !door.open;
  door.target = door.open ? doorOpenAngle : 0;
}

$('#doorAction').addEventListener('click', toggleNearestDoor);

function animateInteriorDoors(dt) {
  for (const door of passageDoors) {
    door.angle = THREE.MathUtils.damp(door.angle, door.target, 4.5, dt);
    for (const leaf of door.leaves) {
      leaf.hinge.rotation.y = leaf.side * door.angle;
    }
  }

  const door = entered ? nearestDoor() : null;
  const prompt = $('#doorPrompt');
  const panelOpen = !$('#exhibit').classList.contains('hidden') ||
    !$('#musicPanel').classList.contains('hidden') ||
    !$('#helpPanel').classList.contains('hidden');

  if (door && !panelOpen) {
    prompt.classList.remove('hidden');
    $('#doorPromptText').textContent = door.open ? 'The doors are open' : 'A pair of doors stands before you';
    $('#doorAction').textContent = door.open ? 'Close doors' : 'Open doors';
  } else {
    prompt.classList.add('hidden');
  }
}

addEventListener('keydown', (event) => {
  if (event.code === 'KeyE' && !event.repeat) {
    toggleNearestDoor();
    event.preventDefault();
  }
  if (keyMap[event.code] && entered) {
    keys.add(keyMap[event.code]);
    event.preventDefault();
  }
  if (event.code === 'Escape') {
    hidePanel('exhibit');
    hidePanel('helpPanel');
    hidePanel('musicPanel');
  }
});
addEventListener('keyup', (event) => {
  if (keyMap[event.code]) keys.delete(keyMap[event.code]);
});
addEventListener('blur', () => keys.clear());

document.querySelectorAll('.move-key').forEach((button) => {
  const direction = button.dataset.move;
  const down = (event) => {
    event.preventDefault();
    keys.add(direction);
    button.classList.add('pressed');
  };
  const up = (event) => {
    event.preventDefault();
    keys.delete(direction);
    button.classList.remove('pressed');
  };
  button.addEventListener('pointerdown', down);
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach((name) => {
    button.addEventListener(name, up);
  });
});

function canMove(x, z) {
  if (x < -6.08 + playerRadius || x > 6.08 - playerRadius) return false;
  if (z > 5.5 || z < -56.5) return false;

  // The opening is 3.6 m wide. The side wall remains solid outside it.
  for (const wallZ of [-7, -17, -27, -37, -47]) {
    if (Math.abs(z - wallZ) < 0.19 + playerRadius && Math.abs(x) > 1.8 - playerRadius) {
      return false;
    }
  }

  // A closed leaf pair blocks the opening. Once almost fully open, the passage clears.
  for (const door of passageDoors) {
    if (Math.abs(z - door.z) < 0.18 + playerRadius &&
        Math.abs(x) < 1.8 - playerRadius &&
        door.angle < 1.18) {
      return false;
    }
  }
  return true;
}

function walk(dt) {
  const panelOpen = !$('#exhibit').classList.contains('hidden') ||
    !$('#musicPanel').classList.contains('hidden') ||
    !$('#helpPanel').classList.contains('hidden');

  if (!entered || panelOpen || keys.size === 0) return;

  let forward = (keys.has('forward') ? 1 : 0) - (keys.has('back') ? 1 : 0);
  let strafe = (keys.has('right') ? 1 : 0) - (keys.has('left') ? 1 : 0);
  if (!forward && !strafe) return;

  const magnitude = Math.hypot(forward, strafe);
  forward /= magnitude;
  strafe /= magnitude;

  const speed = playerSpeed * dt;
  const sin = Math.sin(yaw);
  const cos = Math.cos(yaw);
  const dx = (strafe * cos - forward * sin) * speed;
  const dz = (-forward * cos - strafe * sin) * speed;

  const nextX = camera.position.x + dx;
  if (canMove(nextX, camera.position.z)) camera.position.x = nextX;

  const nextZ = camera.position.z + dz;
  if (canMove(camera.position.x, nextZ)) camera.position.z = nextZ;

  updateRoomUI();
}

// Mouse-look without clicking, dragging or pointer lock:
// the camera smoothly follows the cursor's position relative to the canvas centre.
canvas.addEventListener('pointermove', (event) => {
  if (!entered || event.pointerType === 'touch') return;
  const rect = canvas.getBoundingClientRect();
  const nx = THREE.MathUtils.clamp(((event.clientX - rect.left) / rect.width) * 2 - 1, -1, 1);
  const ny = THREE.MathUtils.clamp(((event.clientY - rect.top) / rect.height) * 2 - 1, -1, 1);
  targetYaw = -nx * 0.88;
  targetPitch = THREE.MathUtils.clamp(-ny * 0.42, -0.42, 0.42);
});

canvas.addEventListener('click', (event) => {
  if (!entered) return;
  const rect = canvas.getBoundingClientRect();
  pointer.set(
    ((event.clientX - rect.left) / rect.width) * 2 - 1,
    -(((event.clientY - rect.top) / rect.height) * 2 - 1)
  );
  raycaster.setFromCamera(pointer, camera);
  const intersections = raycaster.intersectObjects(exhibits, true);
  if (!intersections.length) return;

  let object = intersections[0].object;
  while (object && !object.userData.title) object = object.parent;
  if (!object || object.userData.room !== currentRoom) return;
  // Si es una carta, mostrarla delante de la cámara.
if (object.userData.letter) {
    openLetterOverlay(
        object.userData.title,
        object.userData.description
    );

    return;
}

  $('#exhibitKicker').textContent = `${rooms[currentRoom][0]} · EXHIBIT`;
  $('#exhibitTitle').textContent = object.userData.title;
  $('#exhibitText').textContent = object.userData.description;
  showPanel('exhibit');
});

const clock = new THREE.Clock();
function animateLetters(dt) {
    for (const letter of letterAnimations) {

        letter.progress = THREE.MathUtils.damp(
            letter.progress,
            letter.target,
            3.5,
            dt
        );

        const t = THREE.MathUtils.smoothstep(
            letter.progress,
            0,
            1
        );

        // La hoja emerge progresivamente.
        letter.paper.position.y = THREE.MathUtils.lerp(
            1.50,
            2.15,
            t
        );

        letter.paper.scale.y = THREE.MathUtils.lerp(
            0.28,
            1,
            t
        );

        // La solapa se pliega hacia atrás.
        letter.flapPivot.rotation.x = THREE.MathUtils.lerp(
            0,
            2.75,
            t
        );

        // El sello acompaña el movimiento.
        letter.seal.scale.setScalar(
            THREE.MathUtils.lerp(1, 0.35, t)
        );
    }
}
function animate() {
  requestAnimationFrame(animate);
  if (document.hidden) return;
  const dt = Math.min(clock.getDelta(), 0.04);
  walk(dt);
  yaw = THREE.MathUtils.damp(yaw, targetYaw, 7.5, dt);
  pitch = THREE.MathUtils.damp(pitch, targetPitch, 7.5, dt);
  camera.rotation.set(pitch, yaw, 0, 'YXZ');
  animateInteriorDoors(dt);
  animateLetters(dt);
  renderer.render(scene, camera);
}
animate();

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.2));
});

$('#loading').style.opacity = '0';
setTimeout(() => $('#loading').remove(), 650);
