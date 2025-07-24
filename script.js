
const container = document.getElementById('globe-container');

// Сцена
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera();
camera.aspect = window.innerWidth / window.innerHeight;
camera.updateProjectionMatrix();
camera.position.z = 300;

// Рендер
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

// Глобус
const globe = new ThreeGlobe()
  .globeImageUrl('earth-dark.jpg') // текстура Земли
  .showGraticules(true);           // сетка долгот/широт

scene.add(globe);

// Освещение
scene.add(new THREE.AmbientLight(0xbbbbbb));
scene.add(new THREE.DirectionalLight(0xffffff, 0.6));

// Анимация
function animate() {
  requestAnimationFrame(animate);
  globe.rotation.y += 0.0015;
  renderer.render(scene, camera);
}
animate();

// Подгружаем субъекты РФ
fetch('regions.geojson')
  .then(res => res.json())
  .then(data => {
    globe
      .polygonsData(data.features)
      .polygonCapColor(() => 'rgba(213, 199, 177, 0.8)') // айдентика
      .polygonSideColor(() => 'rgba(150, 131, 112, 0.3)')
      .polygonStrokeColor(() => '#ABAAB5')
      .polygonAltitude(0.01);
  });
