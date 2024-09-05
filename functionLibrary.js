import * as THREE from 'three';

export default class FunctionLibrary{
    constructor(funcNum){
        this.funcNum = funcNum;
    }

    Morph(u,v,t,from,to,progress){
        return THREE.Vector3.lerpVectors(from(u,v,t),to(u,v,t),Math.smoothstep(progress,0,1));
    }

    Wave(u,v,t){
        let p = new THREE.Vector3();
        p.x = u;
        p.y = Math.sin(Math.PI * (u+v+t));
        p.z = v;
        return p;
    }
    MultiWave(u,v,t){
        let p = new THREE.Vector3();
        p.x = u
        p.y = Math.sin(Math.PI * (u+0.5*t));
        p.y += Math.sin(2 * Math.PI * (v+t)) * (1/2);
        p.y += Math.sin(Math.PI * (u + v + 0.25 * t));
        p.y *= 1 / 2.5;
        p.z = v;
        return p;
    }
    Ripple(u,v,t){
        let d = Math.sqrt(u*u+v*v);
		let p = new THREE.Vector3();
		p.x = u;
		p.y = Math.sin(Math.PI * (4 * d - t));
		p.y /= 1 + 10 * d;
		p.z = v;
		return p;
    }
    Sphere(u,v,t){
        let p = new THREE.Vector3();
        let r = 0.9 + 0.1 * Math.sin(Math.PI * (6 * u + 4 * v + t));
        let s = r * Math.cos(0.5 * Math.PI * v);

        p.x = s * (Math.sin(Math.PI * u));
        p.y = r * Math.sin(Math.PI * 0.5 * v);
        p.z = s * (Math.cos(Math.PI * u));
        return p;
    }
    Torus(u,v,t){
        let p = new THREE.Vector3();
        let r1 = 0.7 + 0.1 * Math.sin(Math.PI * (6 * u + 0.5 * t));
        let r2 = 0.15 + 0.05 * Math.sin(Math.PI * (8 * u + 4 * v + 2 * t));
        let s = r1 + r2 * Math.cos(Math.PI * v);

        p.x = s * (Math.sin(Math.PI * u));
        p.y = r2 * Math.sin(Math.PI * v);
        p.z = s * (Math.cos(Math.PI * u));
        return p;
    }
    Exp(u,v,t){
        let p = new THREE.Vector3();
        p.x = u;
        p.y = Math.sin(Math.PI * (u+0.5*t));
        p.y += Math.tan(t + Math.PI);
        p.y += Math.sin(Math.PI * (u + v + 0.25 * t));
        p.y *= 1 / 3;
        p.z = v;
        return p;
    }
}