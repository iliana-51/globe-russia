
const container = document.getElementById('globe-container');
const tooltip = document.getElementById('tooltip');

// Сцена и камера
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.z = 280;

// Рендер
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

// Глобус
const globe = new ThreeGlobe()
  .globeImageUrl('earth-dark.jpg')
  .showGraticules(false)
  .showAtmosphere(false);

scene.add(globe);

// Подсветка
scene.add(new THREE.AmbientLight(0x888888));
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

// Управление вращением мышью
const controls = new THREE.TrackballControls(camera, renderer.domElement);
controls.noZoom = false;
controls.noPan = true;
controls.rotateSpeed = 1.2;
controls.staticMoving = true;

// Размер глобуса
globe.scale.set(2.1, 2.1, 2.1);

// Обработка изменения размера окна
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  controls.handleResize();
});

// Tooltip при наведении
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onMouseMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(globe);

  if (intersects.length && intersects[0].object.__data) {
    const region = intersects[0].object.__data.properties.name;
    tooltip.style.display = 'block';
    tooltip.style.left = event.clientX + 10 + 'px';
    tooltip.style.top = event.clientY + 10 + 'px';
    tooltip.textContent = region;
  } else {
    tooltip.style.display = 'none';
  }
}
window.addEventListener('mousemove', onMouseMove);

// Анимация
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

// Загрузка субъектов РФ
fetch('regions.geojson')
  .then(res => res.json())
  .then(data => {
    globe
      .polygonsData(data.features)
      .polygonCapColor(() => 'rgba(60, 60, 60, 1)')
      .polygonSideColor(() => 'rgba(45, 45, 45, 0.5)')
      .polygonStrokeColor(() => '#5E5E5E')
      .polygonAltitude(0.01)
      .onPolygonHover(hoverD => {
        globe
          .polygonCapColor(d => d === hoverD ? 'rgba(213, 199, 177, 0.9)' : 'rgba(60, 60, 60, 1)');
      });
  });
