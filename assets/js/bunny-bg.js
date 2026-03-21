import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

const canvas = document.getElementById('bunny-bg');
if (canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0.1, 0.35);

  let pivot = null;

  const loader = new OBJLoader();
  loader.load('/assets/models/bunny.obj', function (obj) {
    obj.traverse(function (child) {
      if (child.isMesh) {
        child.material = new THREE.MeshBasicMaterial({
          color: 0x00A1D6,
          wireframe: true,
          transparent: true,
          opacity: 0.1,
        });
      }
    });

    obj.scale.set(1.8, 1.8, 1.8);

    // Get center of bunny after scaling
    const box = new THREE.Box3().setFromObject(obj);
    const center = box.getCenter(new THREE.Vector3());

    // Offset obj so its center is at pivot origin
    obj.position.set(-center.x, -center.y, -center.z);

    // Use a pivot group placed at bunny's intended position
    pivot = new THREE.Group();
    pivot.position.set(center.x - 0.05, center.y - 0.09, center.z);
    pivot.add(obj);
    scene.add(pivot);
  });

  function animate() {
    requestAnimationFrame(animate);
    if (pivot) {
      pivot.rotation.y += 0.0006;
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
