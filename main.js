import './style.css'
import * as THREE from 'three';
import FunctionLibrary from '../functionLibrary';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import { Sky } from 'three/examples/jsm/objects/Sky.js';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';

//SCENE SETUP
const clock = new THREE.Clock();
const scene = new THREE.Scene();
const fLib = new FunctionLibrary(0);


const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
scene.add( camera );

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
})

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth,window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
camera.position.setZ(4);


let position;
let resolutionU = 50;
let step = 2/resolutionU;
let color;

//LIGHTS
const light = new THREE.DirectionalLight(0xffffff,5);
light.position.set(2,1,2);
light.castShadow = true;
scene.add( light );

//Set up shadow properties for the light
light.shadow.mapSize.width = 1080; // default
light.shadow.mapSize.height = 1080; // default
light.shadow.camera.near = 0.5; // default
light.shadow.camera.far = 500; // default

//SKY

function initSky(){
  
  const sky = new Sky();
  sky.scale.setScalar(450000);
  scene.add( sky );

  //sun = new THREE.Vector3();

  const phi = THREE.MathUtils.degToRad(88);
  const theta = THREE.MathUtils.degToRad( 180 );
  const sunPosition = new THREE.Vector3().setFromSphericalCoords( 1, phi, theta );

  const effectController = {
    turbidity: 10,
    rayleigh: 4,
    mieCoefficient: 0.005,
    mieDirectionalG: 0.7,
    elevation: 2,
    azimuth: 88,
    exposure: renderer.toneMappingExposure,
    function: 0
  };

  const uniforms = sky.material.uniforms;
  
  function guiChanged(){
    uniforms[ 'turbidity' ].value = effectController.turbidity;
    uniforms[ 'rayleigh' ].value = effectController.rayleigh;
    uniforms[ 'mieCoefficient' ].value = effectController.mieCoefficient;
    uniforms[ 'mieDirectionalG' ].value = effectController.mieDirectionalG;
    fLib.funcNum = effectController.function;

    const phi = THREE.MathUtils.degToRad( 90 - effectController.elevation );
    const theta = THREE.MathUtils.degToRad( effectController.azimuth );
    const sunPosition = new THREE.Vector3().setFromSphericalCoords( 1, phi, theta );
    uniforms.sunPosition.value = sunPosition;

    renderer.toneMappingExposure = effectController.exposure;
    renderer.render( scene, camera );
    
  }

  const gui = new GUI();

  gui.add( effectController, 'turbidity', 0.0, 20.0, 0.1 ).onChange( guiChanged );
  gui.add( effectController, 'rayleigh', 0.0, 4, 0.001 ).onChange( guiChanged );
  gui.add( effectController, 'mieCoefficient', 0.0, 0.1, 0.001 ).onChange( guiChanged );
  gui.add( effectController, 'mieDirectionalG', 0.0, 1, 0.001 ).onChange( guiChanged );
  gui.add( effectController, 'elevation', 0, 90, 0.1 ).onChange( guiChanged );
  gui.add( effectController, 'azimuth', - 180, 180, 0.1 ).onChange( guiChanged );
  //gui.add( effectController, 'exposure', 0, 1, 0.0001 ).onChange( guiChanged );
  gui.add( effectController, 'function', {Wave:0,MultiWave:1,Ripple:2,Sphere:3,Torus:4,Exp:5}).onChange( guiChanged );
  guiChanged();
}

initSky();

//GEOMETRY
const pointsz = new Array(resolutionU*resolutionU);

function points(){

  function initPoints(){
    const geometry = new THREE.BoxGeometry(step,step,step);
    const material = new THREE.MeshStandardMaterial(0xffffff);
    const cube = new THREE.Mesh(geometry,material);
    cube.castShadow = true;
    cube.receiveShadow = true;
    
    scene.add(cube);

    return cube;
  }
  
  for (let i = 0; i < pointsz.length; i++){
    let point = pointsz[i] = initPoints();
  }
  
}

//ANIMATE
const controls = new OrbitControls(camera, renderer.domElement);

let tmpRes = 20;

function animate(){
  requestAnimationFrame(animate);

  controls.update();
  step = 2/resolutionU;
  let v = 0.5 * step - 1;

  for(let i = 0, x = 0, z = 0; i < pointsz.length; i++, x++){
    if (x == resolutionU){
      x = 0;
      z += 1;
      v = (z + 0.5) * step - 1;
    }
    let point = pointsz[i];
    position = point.position;
    let u = (x + 0.5) * step - 1;
    let time = clock.getElapsedTime();
    
    if(fLib.funcNum == 0){
      let p = fLib.Wave(u,v,time)
      point.position.set(p.x,p.y,p.z);
    }

    else if(fLib.funcNum == 1){
      let p = fLib.MultiWave(u,v,time)
      point.position.set(p.x,p.y,p.z);
    }

    else if(fLib.funcNum == 2){
      let p = fLib.Ripple(u,v,time)
      point.position.set(p.x,p.y,p.z);
    }

    else if(fLib.funcNum == 3){
      let p = fLib.Sphere(u,v,time)
      point.position.set(p.x,p.y,p.z);
    }
    else if(fLib.funcNum == 4){
      let p = fLib.Torus(u,v,time)
      point.position.set(p.x,p.y,p.z);
    }
    else if(fLib.funcNum == 5){
      let p = fLib.Exp(u,v,time)
      point.position.set(p.x,p.y,p.z);
    }
    point.material.color.set((point.position.x*.5+.5),(point.position.y*.5+.5),(point.position.z*.5+.5));
  }
  
  if(tmpRes != resolutionU){
    tmpRes = resolutionU;
    step = 2/tmpRes;
  }


  renderer.render(scene,camera);
}
points();
animate();
