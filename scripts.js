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
import europaTexture from './src/img/europa.jpg';
import ganymedeTexture from './src/img/ganymede.jpg';
import callistoTexture from './src/img/callisto.jpg';
import moonTexture from './src/img/moon.jpg';
import titanTexture from './src/img/Titan.png';
import enceladusTexture from './src/img/Enceladus.png';
import tritonTexture from './src/img/triton.jpg';

import fs from 'fs';
//read in planet facts from the JSON
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
let scale = { value: false }; // controls scaled or easy view of solar system
//controls which fact to show
let factButtons = {
    sun: false,
    mars: false,
    earth: false,
    mercury: false,
    venus: false,
    jupiter: false,
    saturn: false,
    uranus: false,
    neptune: false,
    pluto: false,
    none: false
}

const init = async() => { 
    await initGui();
    //create the folders to hold the controls
    try {
        solarSystemGui = gui.addFolder("Solar System");
    } catch {
    }
    // create the control for the view window
    solarSystemGui.add(scale, 'value').name("Easy View").listen;
    //create the controls for the facts
    factFolder = gui.addFolder("Facts");
    factFolder.add(factButtons, 'sun').name('Sun').listen().onChange(function(){buttonChange('sun')});
    factFolder.add(factButtons, 'mercury').name('Mercury').listen().onChange(function(){buttonChange('mercury')});
    factFolder.add(factButtons, 'venus').name('Venus').listen().onChange(function(){buttonChange('venus')});
    factFolder.add(factButtons, 'earth').name('Earth').listen().onChange(function(){buttonChange('earth')});
    factFolder.add(factButtons, 'mars').name('Mars').listen().onChange(function(){buttonChange('mars')});
    factFolder.add(factButtons, 'jupiter').name('Jupiter').listen().onChange(function(){buttonChange('jupiter')});
    factFolder.add(factButtons, 'saturn').name('Saturn').listen().onChange(function(){buttonChange('saturn')});
    factFolder.add(factButtons, 'uranus').name('Uranus').listen().onChange(function(){buttonChange('uranus')});
    factFolder.add(factButtons, 'neptune').name('Neptune').listen().onChange(function(){buttonChange('neptune')});
    factFolder.add(factButtons, 'pluto').name('Pluto').listen().onChange(function(){buttonChange('pluto')});
    factFolder.add(factButtons, 'none').name('None').listen().onChange(function(){buttonChange('none')});

}
init();

function buttonChange(buttonName) {
    //switches the fact shown based on the item selected
    for( let param in factButtons){
        factButtons[param] = false;
    }
    factButtons[buttonName] = true;
    if(buttonName === 'none'){
        p.className = 'tooltip hide';
        p.textContent = '';
    } else {
        p.className = 'tooltip show';
        //cPointLabel.position.set(-100, 10, 4);
        p.textContent = facts[buttonName];
    }
}

//create a render to render the text
const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = 'fixed';
labelRenderer.domElement.style.top = '0px';
labelRenderer.domElement.style.pointerEvents = 'none';
document.body.appendChild(labelRenderer.domElement);

// create the element to hold the text
const p = document.createElement('p');
p.style = "color: white; white-space: pre-line; max-width: 250px;";
p.className = 'tooltip';
const pContainer = document.createElement('div');
pContainer.style.position = 'fixed';
pContainer.style.left = "-500px";
pContainer.appendChild(p);
const cPointLabel = new CSS2DObject(pContainer);
scene.add(cPointLabel);

//create the sun
const sunGeo = new THREE.SphereGeometry(sizes.sun, 30, 30);
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
    //different from creating planet because the planet is not added to the
    //scene immediately, allowing grouping with a moon
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

//create all of the planets
const mercury = createPlanet(sizes.mercury, mercuryTexture, distances.mercury);
const venus = createPlanet(sizes.venus, venusTexture, distances.venus);
const earth = createPlanetWithMoon(sizes.earth, earthTexture, distances.earth);
const mars = createPlanet(sizes.mars, marsTexture, distances.mars);
const jupiter = createPlanetWithMoon(sizes.jupiter, jupiterTexture, distances.jupiter);
const saturn = createPlanetWithMoon(sizes.saturn, saturnTexture, 0, {
    innerRadius: 10,
    outerRadius: 20,
    texture: saturnRingTexture
});
const uranus = createPlanet(sizes.uranus, uranusTexture, distances.uranus, {
    innerRadius: 7,
    outerRadius: 12,
    texture: uranusRingTexture
});
const neptune = createPlanetWithMoon(sizes.neptune, neptuneTexture, distances.neptune);
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

//create the moon
const moon = createMoon(sizes.moon, moonTexture, distances.moon);
//create a group for earth and moon
const earthGroup = new THREE.Group();
earthGroup.add(earth.obj);
earthGroup.add(moon.obj);
//set the distance the group is from sun (based on earth as origin of group)
earthGroup.position.set(distances.earth, 0, 0);
//create a group to pivot the earth group around the sun
const rotationGroup = new THREE.Group();
rotationGroup.add(sun.obj);
rotationGroup.add(earthGroup);
scene.add(rotationGroup);

//create jupiter moons and form rotation group
const io = createMoon(sizes.io, ioTexture, distances.io);
const europa = createMoon(sizes.europa, europaTexture, distances.europa);
const ganymede = createMoon(sizes.ganymede, ganymedeTexture, distances.ganymede);
const callisto = createMoon(sizes.callisto, callistoTexture, distances.callisto);
const jupiterGroup = new THREE.Group();
jupiterGroup.add(jupiter.obj);
jupiterGroup.add(io.obj);
jupiterGroup.add(europa.obj);
jupiterGroup.add(ganymede.obj);
jupiterGroup.add(callisto.obj);
jupiterGroup.position.set(distances.jupiter, 0, 0);
const jupiterRotationGroup = new THREE.Group();
jupiterRotationGroup.add(sun.obj);
jupiterRotationGroup.add(jupiterGroup);
scene.add(jupiterRotationGroup);

//create saturn moons and form rotation group
const titan = createMoon(sizes.titan, titanTexture, distances.titan);
const enceladus = createMoon(sizes.enceladus, enceladusTexture, distances.enceladus);
const saturnGroup = new THREE.Group();
saturnGroup.add(saturn.obj);
saturnGroup.add(saturn.obj.ringMesh);
saturnGroup.add(titan.obj);
saturnGroup.add(enceladus.obj);
saturnGroup.position.set(distances.saturn, 0, 0);
const saturnRotationGroup = new THREE.Group();
saturnRotationGroup.add(sun.obj);
saturnRotationGroup.add(saturnGroup);
scene.add(saturnRotationGroup);


// create neptune moon and form rotation group
const triton = createMoon(sizes.triton, tritonTexture, distances.triton);
const neptuneGroup = new THREE.Group();
neptuneGroup.add(neptune.obj);
neptuneGroup.add(triton.obj);
neptuneGroup.position.set(distances.neptune, 0, 0);
const neptuneRotationGroup = new THREE.Group();
neptuneRotationGroup.add(sun.obj);
neptuneRotationGroup.add(neptuneGroup);
scene.add(neptuneRotationGroup);

// make the light come from the sun
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
    io.mesh.rotateY(speeds.ioRotation);

    //Around-sun-rotation
    mercury.obj.rotateY(speeds.mercurySpeed);
    venus.obj.rotateY(speeds.venusSpeed);
    mars.obj.rotateY(speeds.marsSpeed);
    //saturn.obj.rotateY(speeds.saturnSpeed);
    uranus.obj.rotateY(speeds.uranusSpeed);
    //neptune.obj.rotateY(speeds.neptuneSpeed);
    pluto.obj.rotateY(speeds.plutoSpeed);
    rotationGroup.rotateY(speeds.earthSpeed); //makes earth/moon rotate sun
    jupiterRotationGroup.rotateY(speeds.jupiterSpeed);
    saturnRotationGroup.rotateY(speeds.saturnSpeed);
    neptuneRotationGroup.rotateY(speeds.neptuneSpeed);

    //around planet rotation
    moon.obj.rotateY(scale.value ? .12 : speeds.moonSpeed);
    io.obj.rotateY(scale.value? .062 : speeds.ioSpeed);
    europa.obj.rotateY(scale.value? .049 : speeds.europaSpeed);
    ganymede.obj.rotateY(scale.value? .039 : speeds.ganymedeSpeed);
    callisto.obj.rotateY(scale.value? .029 : speeds.callistoSpeed);
    titan.obj.rotateY(scale.value ? .05 : speeds.titanSpeed);
    enceladus.obj.rotateY(scale.value ? .1 : speeds.enceladusSpeed);
    triton.obj.rotateY(scale.value ? .05 : speeds.tritonSpeed);

    //change size and position based on view type
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
    jupiterGroup.position.x = scale.value ? 100 : distances.jupiter;
    io.mesh.scale.set(scale.value ? 3 : 1, scale.value ? 3 : 1, scale.value ? 3 : 1);
    io.mesh.position.x = scale.value ? 12 : distances.io;
    europa.mesh.scale.set(scale.value ? 3 : 1, scale.value ? 3 : 1, scale.value ? 3 : 1);
    europa.mesh.position.x = scale.value ? 15 : distances.europa;
    ganymede.mesh.scale.set(scale.value ? 3 : 1, scale.value ? 3 : 1, scale.value ? 3 : 1);
    ganymede.mesh.position.x = scale.value ? 18 : distances.ganymede;
    callisto.mesh.scale.set(scale.value ? 3 : 1, scale.value ? 3 : 1, scale.value ? 3 : 1);
    callisto.mesh.position.x = scale.value ? 21 : distances.callisto;

    saturn.mesh.scale.set(scale.value ? 2 : 1, scale.value ? 2 : 1, scale.value ? 2 : 1);
    saturnGroup.position.x = scale.value ? 138 : distances.saturn;
    titan.mesh.scale.set(scale.value ? 4 : 1, scale.value ? 4 : 1, scale.value ?  4 : 1);
    titan.mesh.position.x = scale.value ? 25 : distances.titan;
    enceladus.mesh.scale.set(scale.value ? 10 : 1, scale.value ? 10 : 1, scale.value ? 10 : 1);
    enceladus.mesh.position.x = scale.value ? 22 : distances.enceladus;

    uranus.mesh.scale.set(scale.value ? 3.5 : 1, scale.value ? 3.5 : 1, scale.value ? 3.5 : 1);
    uranus.mesh.position.x = scale.value ? 176 : distances.uranus;
    uranus.obj.children[1].position.x = scale.value ? 176 : distances.uranus;

    neptune.mesh.scale.set(scale.value ? 5 : 1, scale.value ? 5 : 1, scale.value ? 5 : 1);//todo
    neptuneGroup.position.x = scale.value ? 200 : distances.neptune;
    triton.mesh.scale.set(scale.value ? 3 : 1, scale.value ? 3 : 1, scale.value ? 3 : 1);
    triton.mesh.position.x = scale.value ? 12 : distances.triton;

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