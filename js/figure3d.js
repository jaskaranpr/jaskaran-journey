// Him, in 3D: a rigged mannequin played with real motion-captured clips (Quaternius' Universal Animation Library,
// CC0), drawn as the film's soft white cut-out. Filled out a little so he reads as clothed, with a mop of curls.
// Everything sits on the same 1600 x 900 board as the line drawings, so a pose is placed in board units.
//
// A pose is {lib: 'a' | 'b', clip, ct (seconds into the clip), x, y (feet, board units), s (board units per metre),
//            yaw (degrees, 90 faces right), kid, far (a faint background figure), hold (clamp instead of loop)}.
// White on blue chapters; on pale chapters he's drawn in ink.
import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {MeshoptDecoder} from 'three/addons/libs/meshopt_decoder.module.js';
import {clone as cloneSkinned} from 'three/addons/utils/SkeletonUtils.js';

const HEAD = {a: 'DEF-head', b: 'Head'};
const FILL = .016;
const SPINE = {a: 'DEF-spine003', b: 'spine_03'};
// things he carries, built in the model's rest pose and then pinned to a bone: [bone, centre offset from it, size]
const HANDR = {a: 'DEF-handR', b: 'hand_r'};
const PROPS = {bag: [SPINE, [0, -.07, -.19], [.3, .36, .13]], phone: [HANDR, [0, .02, .05], [.075, .15, .012]]};                         // metres the body is filled out by, so he reads as wearing clothes

// average the normals of every vertex that shares a position, across both parts of the mannequin,
// so filling the body out along them doesn't open cracks at the seams
function smoothNormals(meshes) {
  const key = (p, i) => `${Math.round(p.getX(i) * 2000)},${Math.round(p.getY(i) * 2000)},${Math.round(p.getZ(i) * 2000)}`;
  const sum = new Map();
  for (const m of meshes) {
    const p = m.geometry.attributes.position, n = m.geometry.attributes.normal;
    for (let i = 0; i < p.count; i++) {
      const k = key(p, i), v = sum.get(k) || [0, 0, 0];
      v[0] += n.getX(i); v[1] += n.getY(i); v[2] += n.getZ(i); sum.set(k, v);
    }
  }
  for (const m of meshes) {
    const g = m.geometry = m.geometry.clone(), p = g.attributes.position, n = new THREE.Float32BufferAttribute(p.count * 3, 3);
    for (let i = 0; i < p.count; i++) { const v = sum.get(key(p, i)), l = Math.hypot(...v) || 1; n.setXYZ(i, v[0] / l, v[1] / l, v[2] / l); }
    g.setAttribute('normal', n);
  }
}

// curls over the top, sides and back of the skull, parented to the head bone so they move with it
function addHair(root, headName, seed = 7) {
  root.updateMatrixWorld(true);
  const head = root.getObjectByName(headName);
  const box = new THREE.Box3().setFromObject(root, true), hw = new THREE.Vector3();
  head.getWorldPosition(hw);
  const c = new THREE.Vector3(hw.x, box.max.y - .118, hw.z - .006), inv = head.matrixWorld.clone().invert();
  const ws = new THREE.Vector3(); head.getWorldScale(ws);
  const geo = new THREE.IcosahedronGeometry(1, 2), r = () => (seed = seed * 16807 % 2147483647) / 2147483647;
  let n = 0;
  while (n < 64) {
    const d = new THREE.Vector3(r() * 2 - 1, r() * 2 - 1, r() * 2 - 1);
    if (d.length() > 1 || d.length() < .2) continue;
    d.normalize();
    if (d.y < -.05 + (d.z < 0 ? -.28 : 0) || d.z > .55 - d.y * .35) continue;   // above the ears, lower at the back, clear of the face
    const top = Math.max(0, d.y), m = new THREE.Mesh(geo, root.userData.mat);
    m.position.copy(c.clone().add(d.multiplyScalar(.094 + top * .03 + r() * .014)).applyMatrix4(inv));
    m.scale.setScalar((.031 + r() * .022 + top * .008) / ws.x);
    head.add(m); n++;
  }
}

export async function createFigure(canvas) {
  const renderer = new THREE.WebGLRenderer({canvas, alpha: true, antialias: false, premultipliedAlpha: false});
  renderer.setClearColor(0x000000, 0);
  const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
  const [ga, gb] = await Promise.all(['models/him-a.glb', 'models/him-b.glb'].map(u => loader.loadAsync(u)));
  const libs = {a: ga, b: gb};

  // red channel: him; green channel: faint figures far away
  const material = color => {
    const m = new THREE.MeshBasicMaterial({color});
    m.onBeforeCompile = sh => {
      sh.vertexShader = sh.vertexShader.replace('#include <skinning_vertex>',
        `#include <skinning_vertex>\n transformed += normalize(objectNormal) * ${FILL.toFixed(4)};`);
    };
    return m;
  };
  const mats = {near: material(0xff0000), far: material(0x00ff00)};
  const hairMats = {near: new THREE.MeshBasicMaterial({color: 0xff0000}), far: new THREE.MeshBasicMaterial({color: 0x00ff00})};

  // one rig per (library, kid, far) combination, made the first time it's asked for
  const scene = new THREE.Scene(), rigs = new Map();
  function rig(lib, kid, far, slot) {
    const k = `${lib}${kid ? 'k' : ''}${far ? 'f' : ''}${slot}`;
    if (rigs.has(k)) return rigs.get(k);
    const src = libs[lib], root = cloneSkinned(src.scene), meshes = [];
    root.userData.mat = hairMats[far ? 'far' : 'near'];
    root.traverse(n => { if (n.isMesh) { n.material = mats[far ? 'far' : 'near']; n.frustumCulled = false; meshes.push(n); } });
    smoothNormals(meshes);
    addHair(root, HEAD[lib], kid ? 11 : 7);
    const holder = new THREE.Group();
    holder.add(root);
    if (kid) { root.scale.setScalar(.74); root.getObjectByName(HEAD[lib]).scale.multiplyScalar(1.13); }
    const mixer = new THREE.AnimationMixer(root), actions = {};
    for (const c of src.animations) actions[c.name] = mixer.clipAction(c);
    // props, hidden until a pose asks for them
    const props = {};
    for (const [name, [bones, off, size]] of Object.entries(PROPS)) {
      root.updateMatrixWorld(true);
      const bone = root.getObjectByName(bones[lib]), at = new THREE.Vector3(), ws = new THREE.Vector3();
      bone.getWorldPosition(at); bone.getWorldScale(ws);
      const m = new THREE.Mesh(new THREE.BoxGeometry(size[0], size[1], size[2]), root.userData.mat);
      m.position.copy(at.add(new THREE.Vector3(...off)).applyMatrix4(bone.matrixWorld.clone().invert()));
      m.scale.setScalar(1 / ws.x); m.visible = false;
      bone.add(m); props[name] = m;
    }
    const r = {key: k, holder, mixer, actions, props, current: null};
    scene.add(holder); rigs.set(k, r);
    return r;
  }

  const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, -2000, 2000);
  cam.position.z = 1000;
  let W = 1, H = 1, dpr = 1, S = 1, view = {x: 800, y: 450, zoom: 1};

  // the film's soft frayed edge: blur the cut-out, threshold it (which melts the parts together), and wobble the
  // edge with noise fixed to the board, then paint him white and far figures pale blue
  const target = new THREE.WebGLRenderTarget(1, 1, {depthBuffer: true});
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.ShaderMaterial({
    transparent: true, depthTest: false,
    uniforms: {tMask: {value: target.texture}, uRes: {value: new THREE.Vector2()}, uPx: {value: 1}, uOrigin: {value: new THREE.Vector2()},
      uNear: {value: new THREE.Color('#fdfdfd')}, uFar: {value: new THREE.Color('#aed1ea')}, uFarA: {value: .55}},
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }',
    fragmentShader: `precision highp float;
      uniform sampler2D tMask; uniform vec2 uRes; uniform float uPx; uniform vec2 uOrigin; uniform vec3 uNear; uniform vec3 uFar; uniform float uFarA;
      varying vec2 vUv;
      float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
        return mix(mix(h(i), h(i + vec2(1., 0.)), f.x), mix(h(i + vec2(0., 1.)), h(i + vec2(1., 1.)), f.x), f.y); }
      float fbm(vec2 p){ return .62 * vn(p) + .38 * vn(p * 2.07 + 7.3); }
      void main(){
        vec2 board = uOrigin + vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y) / uPx;
        vec2 d = vec2(fbm(board * .6), fbm(board * .6 + 31.7)) - .5;
        vec2 uv = vUv + d * 3.4 * uPx / uRes;
        vec2 px = 1.6 * uPx * .5 / uRes, a = vec2(0.); float ws = 0.;
        for (int i = -2; i <= 2; i++) for (int j = -2; j <= 2; j++) {
          vec2 o = vec2(float(i), float(j)); float w = exp(-dot(o, o) * .35);
          a += texture2D(tMask, uv + o * px).rg * w; ws += w;
        }
        a /= ws;
        float m = smoothstep(.40, .56, a.r), f = smoothstep(.40, .56, a.g) * uFarA;
        float al = m + f * (1. - m);
        gl_FragColor = vec4(mix(uFar, uNear, m / max(al, 1e-4)), al);
      }`,
  }));
  const post = new THREE.Scene(), postCam = new THREE.Camera();
  post.add(quad);

  function resize(w, h, ratio = Math.min(devicePixelRatio, 2)) {
    W = w; H = h; dpr = ratio; S = Math.max(W / 1600, H / 900);
    renderer.setPixelRatio(dpr); renderer.setSize(W, H, false);
    target.setSize(Math.round(W * dpr), Math.round(H * dpr));
    quad.material.uniforms.uRes.value.set(W * dpr, H * dpr);
  }

  // pose every figure for this frame; poses not listed are hidden
  function set(poses, v = view, ink = false) {
    view = v;
    quad.material.uniforms.uNear.value.set(ink ? '#0b1d44' : '#fdfdfd');
    quad.material.uniforms.uFar.value.set(ink ? '#6f9fd3' : '#aed1ea');
    const used = new Set();
    for (const [i, p] of poses.entries()) {
      if (!p || p.o === 0) continue;
      const r = rig(p.lib, !!p.kid, !!p.far, p.slot ?? i);
      used.add(r.key);
      const act = r.actions[p.clip];
      if (r.current !== act) { r.mixer.stopAllAction(); act.reset().play(); r.current = act; }
      act.time = ((p.ct % act.getClip().duration) + act.getClip().duration) % act.getClip().duration;
      if (p.hold) act.time = Math.min(p.ct, act.getClip().duration - 1e-3);
      r.mixer.update(0);
      r.holder.position.set(p.x, -p.y, p.z || 0);
      r.holder.rotation.set(0, (p.yaw ?? 90) * Math.PI / 180, p.roll ? p.roll * Math.PI / 180 : 0);
      r.holder.scale.setScalar(p.s);
      r.holder.visible = true;
      for (const [name, m] of Object.entries(r.props)) m.visible = !!p.props?.includes(name);
    }
    for (const [k, r] of rigs) if (!used.has(k)) r.holder.visible = false;
  }

  function render() {
    const z = S * view.zoom, hw = W / 2 / z, hh = H / 2 / z;
    cam.left = view.x - hw; cam.right = view.x + hw; cam.top = -view.y + hh; cam.bottom = -view.y - hh;
    cam.updateProjectionMatrix();
    renderer.setRenderTarget(target); renderer.clear(); renderer.render(scene, cam);
    renderer.setRenderTarget(null);
    const u = quad.material.uniforms;
    u.uPx.value = z * dpr; u.uOrigin.value.set(view.x - hw, view.y - hh);
    renderer.clear(); renderer.render(post, postCam);
  }

  return {set, render, resize, clips: {a: ga.animations.map(c => c.name), b: gb.animations.map(c => c.name)}};
}
