import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';
import * as speeds from "./src/js/constants/speedConstants.js";
import * as sizes from "./src/js/constants/sizeConstants";
import * as distances from "./src/js/constants/distanceConstants";

import starsTexture from './src/img/stars.jpg';
import sunTexture from './src/img/sun.jpg';
import mercuryTexture from './src/img/mercury.jpg';
import venusTexture from './src/img/venus.jpg';
import earthTexture from './src/img/earth.jpg';
import marsTexture from './src/img/mars.jpg';
import jupiterTexture from './src/img/jupiter.jpg';
import saturnTexture from './src/img/saturn.jpg';
import saturnRingTexture from './src/img/saturn ring.png';
import uranusTexture from './src/img/uranus.jpg';
import uranusRingTexture from './src/img/uranus ring.png';
import neptuneTexture from './src/img/neptune.jpg';
import plutoTexture from './src/img/pluto.jpg';
import ioTexture from './src/img/Io.jpg';

import moonTexture from './src/img/moon.jpg';

import fs from 'fs';
const rawFacts = fs.readFileSync('./src/js/constants/facts.json', { encoding: 'utf-8' });
const facts = JSON.parse(rawFacts);

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
let factButtons = {
    sun: false,
    mars: false,
    earth: false,
    none: false
}

const init = async() => { 
    await initGui();

    try {
    solarSystemGui = gui.addFolder("Solar System");
    } catch {
    }
    solarSystemGui.add(scale, 'value').name("Easy View").listen;
    factFolder = gui.addFolder("Facts");
    factFolder.add(factButtons, 'sun').name('Sun').listen().onChange(function(){buttonChange('sun')});
    factFolder.add(factButtons, 'none').name('None').listen().onChange(function(){buttonChange('none')});

}
init();

function buttonChange(buttonName) {
    console.log('running');
    for( let param in factButtons){
        factButtons[param] = false;
    }
    factButtons[buttonName] = true;
    if(buttonName === 'none'){
        p.className = 'tooltip hide';
        p.textContent = '';
    } else {
        p.className = 'tooltip show';
        cPointLabel.position.set(-6, 0.8, 4);
        p.textContent = facts[buttonName];
    }
  
}

const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0px';
labelRenderer.domElement.style.pointerEvents = 'none';
document.body.appendChild(labelRenderer.domElement);

// create the element to hold the text
const p = document.createElement('p');
p.style = "color: white; white-space: pre";
p.className = 'tooltip';
const pContainer = document.createElement('div');
pContainer.appendChild(p);
const cPointLabel = new CSS2DObject(pContainer);
scene.add(cPointLabel);

// window.addEventListener('mousemove', function(e) {
//     console.log(sunButton.value);
//     if(sunButton.value == true){
//         p.className = 'tooltip show';
//         cPointLabel.position.set(-6, 0.8, 4);
//         p.textContent = 'Sun';
//     } else if(earthButton.value == true) {
//         p.className = 'tooltip show';
//         cPointLabel.position.set(-6, 0.8, 4);
//         p.textContent = 'Earth';
//     } else {
//         p.className = 'tooltip hide';
//         p.textContent = "";
//     }
// })

let sizeSwitch = sizes.sun;
const sunGeo = new THREE.SphereGeometry(sizeSwitch, 30, 30);
const sunMat = new THREE.MeshBasicMaterial({
    map: textureLoader.load(sunTexture)
});
const mesh = new THREE.Mesh(sunGeo, sunMat);
mesh.name = 'Sun';
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
scene.add(pointLight);

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
    moon.obj.rotateY(scale.value ? .12 : speeds.moonSpeed);
    mars.obj.rotateY(speeds.marsSpeed);
    jupiter.obj.rotateY(speeds.jupiterSpeed);
    saturn.obj.rotateY(speeds.saturnSpeed);
    uranus.obj.rotateY(speeds.uranusSpeed);
    neptune.obj.rotateY(speeds.neptuneSpeed);
    pluto.obj.rotateY(speeds.plutoSpeed);

    //change size and position based on view type
    rotationGroup.rotateY(speeds.earthSpeed); //makes earth/moon rotate sun
    sun.scale.set(scale.value ? 2.9 : 1, scale.value ? 2.9 : 1, scale.value ? 2.9 : 1);
    mercury.mesh.scale.set(scale.value ? 16.8 : 1, scale.value ? 16.8 : 1, scale.value ? 16.8 : 1);
    mercury.mesh.position.x = scale.value ? 28 : distances.mercury;
    venus.mesh.scale.set(scale.value ? 12.3 : 1, scale.value ? 12.3 : 1, scale.value ? 12.3 : 1);
    venus.mesh.position.x = scale.value ? 44 : distances.venus;
    earth.mesh.scale.set(scale.value ? 6 : 1, scale.value ? 6 : 1, scale.value ? 6 : 1);
    earthGroup.position.x = scale.value ? 62 : distances.earth;
    moon.mesh.scale.set(scale.value ? 2.9 : 1, scale.value ? 2.9 : 1, scale.value ? 2.9 : 1);
    moon.mesh.position.x = scale.value ? 10 : distances.moon;
    mars.mesh.scale.set(scale.value ? 8 : 1, scale.value ? 8 : 1, scale.value ? 8 : 1);
    mars.mesh.position.x = scale.value ? 78 : distances.mars;
    jupiter.mesh.scale.set(scale.value ? 2 : 1, scale.value ? 2 : 1, scale.value ? 2 : 1);
    jupiter.mesh.position.x = scale.value ? 100 : distances.jupiter
    saturn.mesh.scale.set(scale.value ? 2 : 1, scale.value ? 2 : 1, scale.value ? 2 : 1);
    saturn.mesh.position.x = scale.value ? 138 : distances.saturn;
    saturn.obj.children[1].position.x = scale.value ? 138 : distances.saturn;
    uranus.mesh.scale.set(scale.value ? 3.5 : 1, scale.value ? 3.5 : 1, scale.value ? 3.5 : 1);
    uranus.mesh.position.x = scale.value ? 176 : distances.uranus;
    uranus.obj.children[1].position.x = scale.value ? 176 : distances.uranus;
    neptune.mesh.scale.set(scale.value ? 8 : 1, scale.value ? 8 : 1, scale.value ? 8 : 1);//todo
    neptune.mesh.position.x = scale.value ? 200 : distances.neptune
    pluto.mesh.scale.set(scale.value ? 8 : 1, scale.value ? 8 : 1, scale.value ? 8 : 1);
    pluto.mesh.position.x = scale.value ? 216 : distances.pluto
   
    pointLight.intensity = scale.value ? 2 : 8;

    labelRenderer.render(scene, camera);
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.setSize(this.window.innerWidth, this.window.innerHeight);
});