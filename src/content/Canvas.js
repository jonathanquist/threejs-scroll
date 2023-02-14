import { useEffect } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/all";

import bear from "../inc/bear.gltf";
import witch from "../inc/witch.gltf";

export default function Canvas() {
  gsap.registerPlugin(ScrollTrigger);

  // const refContainer = useRef(null);
  useEffect(() => {
    const COLORS = {
      background: "white",
      light: "#ffffff",
      sky: "#aaaaff",
      ground: "#88ff88",
      blue: "steelblue",
    };

    const PI = Math.PI;

    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: "white",
      wireframe: true,
    });

    // --- SCENE
    const scenes = {
      real: new THREE.Scene(),
      wire: new THREE.Scene(),
    };

    let size = { width: 0, height: 0 };

    scenes.real.background = new THREE.Color(COLORS.background);
    scenes.real.fog = new THREE.Fog(COLORS.background, 15, 20);

    scenes.wire.background = new THREE.Color(COLORS.blue);
    scenes.wire.overrideMaterial = wireframeMaterial;

    const views = [
      { height: 1, bottom: 0, scene: scenes.real, camera: null },
      { height: 0, bottom: 0, scene: scenes.wire, camera: null },
    ];

    // --- RENDERER

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
    });

    renderer.physicallyCorrectLights = true;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ReinhardToneMapping;
    renderer.toneMappingExposure = 5;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const container = document.querySelector(".canvas-container");
    container.appendChild(renderer.domElement);

    // --- CAMERA
    let cameraTarget = new THREE.Vector3(0, 4, 0);

    views.forEach((view) => {
      view.camera = new THREE.PerspectiveCamera(
        40,
        size.width / size.height,
        0.1,
        100
      );
      view.camera.position.set(0, 1, 3);

      view.scene.add(view.camera);
    });

    // --- LIGHTS

    const directionalLight = new THREE.DirectionalLight(COLORS.light, 2);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.far = 10;
    directionalLight.shadow.mapSize.set(1024, 1024);
    directionalLight.shadow.normalBias = 0.05;
    directionalLight.position.set(2, 5, 3);

    scenes.real.add(directionalLight);

    const hemisphereLight = new THREE.HemisphereLight(
      COLORS.sky,
      COLORS.ground,
      0.5
    );
    scenes.real.add(hemisphereLight);

    // --- FLOOR

    const plane = new THREE.PlaneGeometry(100, 100);
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: COLORS.ground,
    });
    const floor = new THREE.Mesh(plane, floorMaterial);
    floor.receiveShadow = true;
    floor.rotateX(-Math.PI * 0.5);

    scenes.real.add(floor);

    // --- ON RESIZE

    const onResize = () => {
      size.width = container.clientWidth;
      size.height = container.clientHeight;

      views.forEach((view) => {
        view.camera.aspect = size.width / size.height;
        view.camera.updateProjectionMatrix();
      });

      renderer.setSize(size.width, size.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener("resize", onResize);
    onResize();

    // --- TICK

    const tick = () => {
      views.forEach((view) => {
        let bottom = size.height * view.bottom;
        let height = size.height * view.height;
        renderer.setViewport(0, 0, size.width, size.height);
        renderer.setScissor(0, bottom, size.width, height);
        renderer.setScissorTest(true);
        view.camera.lookAt(cameraTarget);
        renderer.render(view.scene, view.camera);
      });

      window.requestAnimationFrame(() => tick());
    };

    tick();

    const toLoad = [
      {
        name: "witch",
        group: new THREE.Group(),
        file: witch,
      },
      {
        name: "bear",
        group: new THREE.Group(),
        file: bear,
      },
    ];

    const models = {};
    const clones = {};
    let cameras = null;
    let bears = null;
    let witches = null;

    const setupAnimation = () => {
      cameras = {
        positions: [views[0].camera.position, views[1].camera.position],
      };
      bears = {
        position: [models.bear.position, clones.bear.position],
        rotation: [models.bear.rotation, clones.bear.rotation],
      };
      witches = {
        position: [models.witch.position, clones.witch.position],
        rotation: [models.witch.rotation, clones.witch.rotation],
      };
      gsap.set(bears.position, { x: -5 });
      gsap.set(witches.position, { x: 5 });

      desktopAnimation();
      // gsap.matchMedia({
      //   "(prefers-reduced-motion: no-preferences)": desktopAnimation,
      // });
    };

    const LoadingManager = new THREE.LoadingManager(() => {
      setupAnimation();
    });

    const desktopAnimation = () => {
      let section = 0;
      const tl = gsap.timeline({
        default: {
          duration: 1,
          ease: "power2.inOut",
        },
        scrollTrigger: {
          trigger: ".page",
          start: "top top",
          end: "bottom bottom",
          scrub: 0.1,
          marker: true,
        },
      });
      tl.to(bears.position, { x: -1 }, section);
      tl.to(witches.position, { x: 1 }, section);
      tl.to(cameraTarget, { y: 1 }, section);
      tl.to(views[0].camera.position, { z: 5 }, section);
      tl.to(views[1].camera.position, { z: 5 }, section);

      //Section 2
      section += 1;
      tl.to(bears.position, { x: -1.1, z: 2 }, section);
      tl.to(bears.rotation, { y: 1.7 }, section);
      tl.to(witches.position, { x: 5, ease: "power4.in" }, section);
      tl.to(views[1], { height: 1, ease: "none" }, section);

      //Section 3
      section += 1;
      tl.to(bears.position, { x: -5, z: 0, ease: "power4.in" }, section);
      tl.to(witches.position, { x: 1.3, z: 2, ease: "power4.out" }, section);
      tl.to(witches.rotation, { y: -1.7 }, section);

      //Section 4
      section += 1;
      tl.to(bears.position, { x: -1, z: 0 }, section);
      tl.to(bears.rotation, { y: 0, ease: "power1.in" }, section);
      tl.to(witches.position, { x: 1, z: 0 }, section);
      tl.to(witches.rotation, { y: 0, ease: "power1.in" }, section);
      tl.to(views[1], { bottom: 1, ease: "none" }, section);
    };

    const gltfLoader = new GLTFLoader(LoadingManager);
    toLoad.forEach((item) => {
      gltfLoader.load(item.file, (model) => {
        model.scene.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.receiveShadow = true;
            child.castShadow = true;
          }
        });
        item.group.add(model.scene);
        scenes.real.add(item.group);
        models[item.name] = item.group;
        const clone = item.group.clone();
        clones[item.name] = clone;
        scenes.wire.add(clone);
      });
    });
  });
  return <div className="canvas-container"></div>;
}
