import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

const canvas = document.getElementById('bunny-bg');
if (canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0.23, 0.35);
  camera.lookAt(0, 0, 0);

  let pivot = null;
  let targetRotX = 0;
  let targetRotY = 0;
  let currentRotX = 0;
  let currentRotY = 0;

  const loader = new OBJLoader();
  loader.load('/assets/models/bunny_0_1.obj', function (obj) {
    obj.traverse(function (child) {
      if (child.isMesh) {
        child.material = new THREE.MeshBasicMaterial({
          color: 0x888888,
          wireframe: true,
          transparent: true,
          opacity: 0.15,
        });
      }
    });

    obj.scale.set(2.3, 2.3, 2.3);

    const box = new THREE.Box3().setFromObject(obj);
    const center = box.getCenter(new THREE.Vector3());

    obj.position.set(-center.x, -center.y, -center.z);

    pivot = new THREE.Group();
    pivot.position.set(center.x - 0.03, center.y - 0.285, center.z);
    // Face the bunny toward the user
    pivot.rotation.y = Math.PI / 18;
    pivot.add(obj);
    scene.add(pivot);
  });

  // Track mouse position for subtle sway
  document.addEventListener('mousemove', function (e) {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    targetRotY = Math.PI / 18 + x * 0.15;
    targetRotX = -y * 0.08;
  });

  function animate() {
    requestAnimationFrame(animate);
    if (pivot) {
      // Smooth lerp toward target
      currentRotY += (targetRotY - currentRotY) * 0.02;
      currentRotX += (targetRotX - currentRotX) * 0.02;
      pivot.rotation.y = currentRotY;
      pivot.rotation.x = currentRotX;
    }
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}
