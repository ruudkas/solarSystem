import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';

import * as speeds from "./constants/speedConstants.js";
import * as sizes from "./constants/sizeConstants";
import * as distances from "./constants/distanceConstants";

import starsTexture from '../img/stars.jpg';
import sunTexture from '../img/sun.jpg';
import mercuryTexture from '../img/mercury.jpg';
import venusTexture from '../img/venus.jpg';
import earthTexture from '../img/earth.jpg';
import marsTexture from '../img/mars.jpg';
import jupiterTexture from '../img/jupiter.jpg';
import saturnTexture from '../img/saturn.jpg';
import saturnRingTexture from '../img/saturn ring.png';
import uranusTexture from '../img/uranus.jpg';
import uranusRingTexture from '../img/uranus ring.png';
import neptuneTexture from '../img/neptune.jpg';
import plutoTexture from '../img/pluto.jpg';
import ioTexture from '../img/Io.jpg';

import moonTexture from '../img/moon.jpg';

const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);
const initGui = async () => {
    const dat = await import("dat.gui");
    gui = new dat.GUI();
  };

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

const orbit = new OrbitControls(camera, renderer.domElement);

camera.position.set(-90, 140, 140);
orbit.update();

const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture
]);

const textureLoader = new THREE.TextureLoader();
let scale = { value: false };
const init = async() => { 
      await initGui();

      try {
        solarSystemGui = gui.addFolder("solar system");
      } catch {
      }
      solarSystemGui.add(scale, 'value').name("Easy View").listen;
}
init();

let sizeSwitch = sizes.sun;
const sunGeo = new THREE.SphereGeometry(sizeSwitch, 30, 30);
const sunMat = new THREE.MeshBasicMaterial({
    map: textureLoader.load(sunTexture)
});
const mesh = new THREE.Mesh(sunGeo, sunMat);
const sun = new THREE.Object3D();
sun.add(mesh);
scene.add(sun);
mesh.position.x = 0;


function createPlanetWithMoon(size, texture, position, ring) {
    const geo = new THREE.SphereGeometry(size, 30, 30);
    const mat = new THREE.MeshStandardMaterial({
        map: textureLoader.load(texture)
    });
    const mesh = new THREE.Mesh(geo, mat);
    const obj = new THREE.Object3D();
    obj.add(mesh);
    if(ring) {
        const ringGeo = new THREE.RingGeometry(
            ring.innerRadius,
            ring.outerRadius,
            32);
        const ringMat = new THREE.MeshBasicMaterial({
            map: textureLoader.load(ring.texture),
            side: THREE.DoubleSide
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        obj.add(ringMesh);
        ringMesh.position.x = position;
        ringMesh.rotation.x = -0.5 * Math.PI;
    }
    return {mesh, obj}
}
function createPlanet(size, texture, position, ring) {
    const geo = new THREE.SphereGeometry(size, 30, 30);
    const mat = new THREE.MeshStandardMaterial({
        map: textureLoader.load(texture)
    });
    const mesh = new THREE.Mesh(geo, mat);
    const obj = new THREE.Object3D();
    obj.add(mesh);
    if(ring) {
        const ringGeo = new THREE.RingGeometry(
            ring.innerRadius,
            ring.outerRadius,
            32);
        const ringMat = new THREE.MeshBasicMaterial({
            map: textureLoader.load(ring.texture),
            side: THREE.DoubleSide
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        obj.add(ringMesh);
        ringMesh.position.x = position;
        ringMesh.rotation.x = -0.5 * Math.PI;
    }
    scene.add(obj);
    mesh.position.x = position;
    return {mesh, obj}
}

const mercury = createPlanet(sizes.mercury, mercuryTexture, distances.mercury);
const venus = createPlanet(sizes.venus, venusTexture, distances.venus);
const earth = createPlanetWithMoon(sizes.earth, earthTexture, distances.earth);
const mars = createPlanet(sizes.mars, marsTexture, distances.mars);
const jupiter = createPlanet(sizes.jupiter, jupiterTexture, distances.jupiter);
const saturn = createPlanet(sizes.saturn, saturnTexture, distances.saturn, {
    innerRadius: 10,
    outerRadius: 20,
    texture: saturnRingTexture
});
const uranus = createPlanet(sizes.uranus, uranusTexture, distances.uranus, {
    innerRadius: 7,
    outerRadius: 12,
    texture: uranusRingTexture
});
const neptune = createPlanet(sizes.neptune, neptuneTexture, distances.neptune);
const pluto = createPlanet(sizes.pluto, plutoTexture, distances.pluto);

function createMoon(size, texture, position) {
    const geo = new THREE.SphereGeometry(size, 30, 30);
    const mat = new THREE.MeshStandardMaterial({
        map: textureLoader.load(texture)
    });
    const mesh = new THREE.Mesh(geo, mat);
    const obj = new THREE.Object3D();
    obj.add(mesh);
    mesh.position.x = position;
    return {mesh, obj}
}

const moon = createMoon(sizes.moon, moonTexture, distances.moon);
const earthGroup = new THREE.Group();
earthGroup.add(earth.obj);
earthGroup.add(moon.obj);
earthGroup.position.set(62, 0, 0);
const rotationGroup = new THREE.Group();
rotationGroup.add(sun.obj);
rotationGroup.add(earthGroup);
scene.add(rotationGroup);

const io = createMoon(sizes.io, ioTexture, distances.io);
const jupiterGroup = new THREE.Group();
jupiterGroup.add(jupiter.obj);
jupiterGroup.add(io.obj);

const pointLight = new THREE.PointLight(0xFFFFFF, 10);
scene.add(pointLight)

function animate() {
    //Self-rotation
    sun.rotateY(speeds.sunRotation);
    mercury.mesh.rotateY(speeds.mercuryRotation);
    venus.mesh.rotateY(speeds.venusRotation);
    earth.mesh.rotateY(speeds.earthRotation);
    mars.mesh.rotateY(speeds.marsRotation);
    jupiter.mesh.rotateY(speeds.jupiterRotation);
    saturn.mesh.rotateY(speeds.saturnRotation);
    uranus.mesh.rotateY(speeds.uranusRotation);
    neptune.mesh.rotateY(speeds.neptuneRotation);
    pluto.mesh.rotateY(speeds.plutoRotation);

    moon.mesh.rotateY(speeds.moonRotation);

    //Around-sun-rotation
    mercury.obj.rotateY(speeds.mercurySpeed);
    venus.obj.rotateY(speeds.venusSpeed);
    moon.obj.rotateY(speeds.moonSpeed);
    mars.obj.rotateY(speeds.marsSpeed);
    jupiter.obj.rotateY(speeds.jupiterSpeed);
    saturn.obj.rotateY(scale.value ? speeds.saturnSpeed : 1);
    uranus.obj.rotateY(speeds.uranusSpeed);
    neptune.obj.rotateY(speeds.neptuneSpeed);
    pluto.obj.rotateY(speeds.plutoSpeed);

    rotationGroup.rotateY(speeds.earthSpeed); //makes earth/moon rotate sun
    sun.scale.set(scale.value ? 1 : 2, scale.value ? 1 : 2, scale.value ? 1 : 2);
   
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});