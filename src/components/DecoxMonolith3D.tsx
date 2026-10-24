import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  Layers,
  Eye,
  Camera,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Maximize2,
  Minimize2,
  RotateCw,
  Sliders,
  Shield,
  ArrowRight
} from 'lucide-react';
import { ActiveView } from '../types';

interface DecoxMonolith3DProps {
  setActiveView?: (view: ActiveView) => void;
  standalone?: boolean;
}

type FinishStyle = 'obsidian_gold' | 'titanium_cyan' | 'emerald_biohack';

export default function DecoxMonolith3D({ setActiveView, standalone = true }: DecoxMonolith3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [explodedFactor, setExplodedFactor] = useState<number>(0);
  const [activeFinish, setActiveFinish] = useState<FinishStyle>('obsidian_gold');
  const [cameraPreset, setCameraPreset] = useState<'orbit' | 'core' | 'top'>('orbit');
  const [isZenMode, setIsZenMode] = useState<boolean>(false);
  const [isAutoRotate, setIsAutoRotate] = useState<boolean>(true);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Mutable refs to pass state to animation loop without re-instantiating WebGL
  const animStateRef = useRef({
    exploded: 0,
    targetExploded: 0,
    targetCameraPos: new THREE.Vector3(0, 3, 9),
    targetLookAt: new THREE.Vector3(0, 1.2, 0),
    isAutoRotate: true,
    activeFinish: 'obsidian_gold' as FinishStyle
  });

  // Keep animStateRef in sync with React state
  useEffect(() => {
    animStateRef.current.targetExploded = explodedFactor;
  }, [explodedFactor]);

  useEffect(() => {
    animStateRef.current.isAutoRotate = isAutoRotate;
  }, [isAutoRotate]);

  useEffect(() => {
    animStateRef.current.activeFinish = activeFinish;
  }, [activeFinish]);

  useEffect(() => {
    if (cameraPreset === 'orbit') {
      animStateRef.current.targetCameraPos.set(0, 3.2, 8.5);
      animStateRef.current.targetLookAt.set(0, 1.2, 0);
    } else if (cameraPreset === 'core') {
      animStateRef.current.targetCameraPos.set(0, 1.6, 4.2);
      animStateRef.current.targetLookAt.set(0, 1.5, 0);
    } else if (cameraPreset === 'top') {
      animStateRef.current.targetCameraPos.set(0, 9.5, 0.2);
      animStateRef.current.targetLookAt.set(0, 1.2, 0);
    }
  }, [cameraPreset]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software GL
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020617); // Slate-950
    scene.fog = new THREE.FogExp2(0x020617, 0.035);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 3.2, 8.5);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // 2. RoomEnvironment Studio Reflections
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 3. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 + 0.05; // Prevent camera sinking under floor
    controls.minDistance = 2.5;
    controls.maxDistance = 18;
    controls.target.set(0, 1.2, 0);

    // 4. Procedural Textures (Dial & Chapter Ring)
    const createDialTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#050811';
        ctx.fillRect(0, 0, 1024, 1024);

        // Concentric circles
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(512, 512, 480, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(512, 512, 420, 0, Math.PI * 2);
        ctx.stroke();

        // Radial tick marks
        for (let i = 0; i < 72; i++) {
          const angle = (i * Math.PI * 2) / 72;
          const r1 = i % 6 === 0 ? 440 : 460;
          const r2 = 480;
          const x1 = 512 + Math.cos(angle) * r1;
          const y1 = 512 + Math.sin(angle) * r1;
          const x2 = 512 + Math.cos(angle) * r2;
          const y2 = 512 + Math.sin(angle) * r2;

          ctx.strokeStyle = i % 6 === 0 ? '#fbbf24' : '#78350f';
          ctx.lineWidth = i % 6 === 0 ? 4 : 2;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }

        // Text markings
        ctx.fillStyle = '#f59e0b';
        ctx.font = 'bold 22px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('DECOX MAGISTRAL • SISTEMA OPERATIVO SRAP 3.2', 512, 512 - 280);
        ctx.fillText('DESAFÍO • PATRONES • 7 HACKS • EXPERIMENTOS • MAPA', 512, 512 + 280);
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
      return texture;
    };

    const dialTexture = createDialTexture();

    // 5. Studio Lighting Rig (Balanced Warm/Cool)
    // Key Light
    const keyLight = new THREE.DirectionalLight(0xffecd2, 2.6);
    keyLight.position.set(5, 8, 5);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 25;
    keyLight.shadow.camera.left = -5;
    keyLight.shadow.camera.right = 5;
    keyLight.shadow.camera.top = 5;
    keyLight.shadow.camera.bottom = -5;
    scene.add(keyLight);

    // Cool Fill Light
    const fillLight = new THREE.HemisphereLight(0x38bdf8, 0x0f172a, 1.2);
    fillLight.position.set(0, 10, 0);
    scene.add(fillLight);

    // Subtle Cyan Rim Light
    const rimLight = new THREE.DirectionalLight(0x06b6d4, 1.8);
    rimLight.position.set(-6, 4, -6);
    scene.add(rimLight);

    // Warm Accent Spotlight
    const accentSpot = new THREE.SpotLight(0xf59e0b, 3.5, 12, Math.PI / 4, 0.4);
    accentSpot.position.set(0, 6, 0);
    accentSpot.target.position.set(0, 1.5, 0);
    scene.add(accentSpot);
    scene.add(accentSpot.target);

    // 6. Ground & Contact Shadow
    const floorGeo = new THREE.PlaneGeometry(30, 30);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x030712,
      roughness: 0.85,
      metalness: 0.2
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    floor.receiveShadow = !isSoftwareGl;
    scene.add(floor);

    // Soft Radial Contact Shadow Plane
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const sCtx = shadowCanvas.getContext('2d');
    if (sCtx) {
      const grad = sCtx.createRadialGradient(128, 128, 10, 128, 128, 120);
      grad.addColorStop(0, 'rgba(0, 0, 0, 0.85)');
      grad.addColorStop(0.5, 'rgba(0, 0, 0, 0.35)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      sCtx.fillStyle = grad;
      sCtx.fillRect(0, 0, 256, 256);
    }
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(5, 5),
      new THREE.MeshBasicMaterial({
        map: shadowTex,
        transparent: true,
        opacity: 0.75,
        depthWrite: false
      })
    );
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = 0.01; // Avoid Z-fighting
    scene.add(shadowPlane);

    // 7. COMPOSITE 3D MONOLITH (3-12 Part Procedural THREE.Group)
    const monolithRoot = new THREE.Group();
    scene.add(monolithRoot);

    // Part 1: Pedestal Base (Primary Silhouette)
    const baseGeo = new THREE.CylinderGeometry(1.4, 1.6, 0.3, 32);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.3,
      metalness: 0.85,
      map: dialTexture
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = 0.15;
    baseMesh.castShadow = !isSoftwareGl;
    baseMesh.receiveShadow = !isSoftwareGl;
    monolithRoot.add(baseMesh);

    // Part 2: Inner Chapter Ring Platter
    const ringPlatterGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.08, 32);
    const ringPlatterMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.2,
      metalness: 0.95
    });
    const ringPlatter = new THREE.Mesh(ringPlatterGeo, ringPlatterMat);
    ringPlatter.position.y = 0.34;
    ringPlatter.castShadow = !isSoftwareGl;
    monolithRoot.add(ringPlatter);

    // Part 3: Middle Column Pylon (Lower Stem)
    const pylonGeo = new THREE.CylinderGeometry(0.5, 0.7, 0.8, 16);
    const pylonMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.45,
      metalness: 0.7
    });
    const pylonMesh = new THREE.Mesh(pylonGeo, pylonMat);
    pylonMesh.position.y = 0.78;
    pylonMesh.castShadow = !isSoftwareGl;
    monolithRoot.add(pylonMesh);

    // Part 4: Primary Discovery Core (The 1% Icosahedron Crystal)
    const coreGroup = new THREE.Group();
    coreGroup.position.y = 1.7;
    monolithRoot.add(coreGroup);

    const crystalGeo = new THREE.IcosahedronGeometry(0.7, 1);
    const crystalMat = new THREE.MeshPhysicalMaterial({
      color: 0xf59e0b,
      emissive: 0x78350f,
      emissiveIntensity: 0.4,
      roughness: 0.1,
      metalness: 0.2,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      transmission: isSoftwareGl ? 0 : 0.65,
      thickness: 1.2,
      transparent: true,
      opacity: 0.95
    });
    const crystalMesh = new THREE.Mesh(crystalGeo, crystalMat);
    crystalMesh.castShadow = !isSoftwareGl;
    coreGroup.add(crystalMesh);

    // Part 5: Wireframe Lattice Aura
    const wireGeo = new THREE.IcosahedronGeometry(0.82, 1);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xfde68a,
      wireframe: true,
      transparent: true,
      opacity: 0.45
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    coreGroup.add(wireMesh);

    // Part 6: Outer Gyroscope Orbit Ring (Tactical Ring)
    const gyroRing1Geo = new THREE.TorusGeometry(1.25, 0.04, 16, 64);
    const gyroRing1Mat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.25,
      metalness: 0.9
    });
    const gyroRing1 = new THREE.Mesh(gyroRing1Geo, gyroRing1Mat);
    gyroRing1.castShadow = !isSoftwareGl;
    coreGroup.add(gyroRing1);

    // Part 7: Inner Gyroscope Orbit Ring (Somatic Resonance Ring)
    const gyroRing2Geo = new THREE.TorusGeometry(1.05, 0.03, 16, 64);
    const gyroRing2Mat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.15,
      metalness: 0.95
    });
    const gyroRing2 = new THREE.Mesh(gyroRing2Geo, gyroRing2Mat);
    gyroRing2.rotation.x = Math.PI / 3;
    gyroRing2.castShadow = !isSoftwareGl;
    coreGroup.add(gyroRing2);

    // Part 8: Upper Strategic Emitter / Prismatic Beacon
    const topEmitterGroup = new THREE.Group();
    topEmitterGroup.position.y = 2.75;
    monolithRoot.add(topEmitterGroup);

    const beaconGeo = new THREE.OctahedronGeometry(0.35);
    const beaconMat = new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      emissive: 0xd97706,
      emissiveIntensity: 0.8,
      roughness: 0.15,
      metalness: 0.9
    });
    const beaconMesh = new THREE.Mesh(beaconGeo, beaconMat);
    beaconMesh.castShadow = !isSoftwareGl;
    topEmitterGroup.add(beaconMesh);

    // Part 9 to 15: 7 Floating Hack Magistral Satellite Nodes
    const hackNodesGroup = new THREE.Group();
    hackNodesGroup.position.y = 1.7;
    monolithRoot.add(hackNodesGroup);

    const hackNodes: THREE.Mesh[] = [];
    const hackNames = [
      'Narrativa',
      'Reconocimiento de Patrones',
      'Paradojas',
      'Sistemas e Incentivos',
      'Caos Controlado',
      'Datos',
      'Imaginación Estratégica'
    ];

    const hackRadius = 1.85;
    for (let i = 0; i < 7; i++) {
      const angle = (i * Math.PI * 2) / 7;
      const nodeGeo = new THREE.BoxGeometry(0.14, 0.14, 0.14);
      const nodeMat = new THREE.MeshStandardMaterial({
        color: i % 2 === 0 ? 0xf59e0b : 0x06b6d4,
        roughness: 0.2,
        metalness: 0.8,
        emissive: i % 2 === 0 ? 0x78350f : 0x0e7490,
        emissiveIntensity: 0.5
      });
      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
      nodeMesh.position.set(Math.cos(angle) * hackRadius, 0, Math.sin(angle) * hackRadius);
      nodeMesh.userData = { name: hackNames[i], index: i };
      hackNodesGroup.add(nodeMesh);
      hackNodes.push(nodeMesh);
    }

    // Material finish updater function
    const applyFinish = (finish: FinishStyle) => {
      if (finish === 'obsidian_gold') {
        baseMat.color.setHex(0x0f172a);
        ringPlatterMat.color.setHex(0xd97706);
        pylonMat.color.setHex(0x1e293b);
        crystalMat.color.setHex(0xf59e0b);
        crystalMat.emissive.setHex(0x78350f);
        wireMat.color.setHex(0xfde68a);
        gyroRing1Mat.color.setHex(0xd97706);
        gyroRing2Mat.color.setHex(0x38bdf8);
        beaconMat.color.setHex(0xfbbf24);
        keyLight.color.setHex(0xffecd2);
      } else if (finish === 'titanium_cyan') {
        baseMat.color.setHex(0x1e293b);
        ringPlatterMat.color.setHex(0x06b6d4);
        pylonMat.color.setHex(0x0f172a);
        crystalMat.color.setHex(0x38bdf8);
        crystalMat.emissive.setHex(0x0369a1);
        wireMat.color.setHex(0xa5f3fc);
        gyroRing1Mat.color.setHex(0x0891b2);
        gyroRing2Mat.color.setHex(0xe0e7ff);
        beaconMat.color.setHex(0x38bdf8);
        keyLight.color.setHex(0xdbeafe);
      } else if (finish === 'emerald_biohack') {
        baseMat.color.setHex(0x064e3b);
        ringPlatterMat.color.setHex(0x10b981);
        pylonMat.color.setHex(0x022c22);
        crystalMat.color.setHex(0x34d399);
        crystalMat.emissive.setHex(0x047857);
        wireMat.color.setHex(0xa7f3d0);
        gyroRing1Mat.color.setHex(0x059669);
        gyroRing2Mat.color.setHex(0xfbbf24);
        beaconMat.color.setHex(0x10b981);
        keyLight.color.setHex(0xd1fae5);
      }
    };

    // 8. ANIMATION LOOP WITH LOSSLESS 60FPS & EXPONENTIAL DAMPING
    const clock = new THREE.Clock();
    let frameId = 0;
    const scratchVec = new THREE.Vector3();

    function tick() {
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Exponential damping on exploded factor (1 - Math.exp(-k * dt))
      const dampK = 5.0;
      const factor = 1 - Math.exp(-dampK * delta);
      animStateRef.current.exploded +=
        (animStateRef.current.targetExploded - animStateRef.current.exploded) * factor;

      const currentExploded = animStateRef.current.exploded;

      // Apply vertical exploded layer separation smoothly
      ringPlatter.position.y = 0.34 + currentExploded * 0.4;
      pylonMesh.position.y = 0.78 + currentExploded * 0.7;
      coreGroup.position.y = 1.7 + currentExploded * 1.3;
      topEmitterGroup.position.y = 2.75 + currentExploded * 2.2;
      hackNodesGroup.position.y = 1.7 + currentExploded * 1.3;

      // Expand hack satellite radius dynamically with exploded view
      const expandedRadius = hackRadius + currentExploded * 1.2;
      for (let i = 0; i < hackNodes.length; i++) {
        const angle = (i * Math.PI * 2) / 7 + elapsed * 0.3;
        hackNodes[i].position.x = Math.cos(angle) * expandedRadius;
        hackNodes[i].position.z = Math.sin(angle) * expandedRadius;
        hackNodes[i].rotation.x += delta * 1.2;
        hackNodes[i].rotation.y += delta * 1.4;
      }

      // Smooth rotation of gyro rings and crystal
      crystalMesh.rotation.y = elapsed * 0.4;
      crystalMesh.rotation.x = Math.sin(elapsed * 0.5) * 0.2;
      wireMesh.rotation.y = -elapsed * 0.3;

      gyroRing1.rotation.x = elapsed * 0.7;
      gyroRing1.rotation.y = elapsed * 0.5;
      gyroRing2.rotation.y = -elapsed * 0.6;
      gyroRing2.rotation.z = elapsed * 0.4;

      beaconMesh.rotation.y = elapsed * 1.5;

      // Auto-rotation of root scene when enabled
      if (animStateRef.current.isAutoRotate) {
        monolithRoot.rotation.y += delta * 0.25;
      }

      // Smooth camera position damping towards target
      camera.position.lerp(animStateRef.current.targetCameraPos, factor * 0.8);
      scratchVec.copy(controls.target);
      scratchVec.lerp(animStateRef.current.targetLookAt, factor * 0.8);
      controls.target.copy(scratchVec);
      controls.update();

      // Render frame
      renderer.render(scene, camera);

      frameId = requestAnimationFrame(tick);
    }

    tick();

    // 9. Resize Handling
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Keyboard shortcut 'H' for Zen Mode toggle
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'h' || e.key === 'H') {
        setIsZenMode((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // Store finish reference to call on state change
    const interval = setInterval(() => {
      applyFinish(animStateRef.current.activeFinish);
    }, 200);

    // 10. Cleanup on unmount
    return () => {
      cancelAnimationFrame(frameId);
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);

      controls.dispose();
      renderer.dispose();
      baseGeo.dispose();
      baseMat.dispose();
      ringPlatterGeo.dispose();
      ringPlatterMat.dispose();
      pylonGeo.dispose();
      pylonMat.dispose();
      crystalGeo.dispose();
      crystalMat.dispose();
      wireGeo.dispose();
      wireMat.dispose();
      gyroRing1Geo.dispose();
      gyroRing1Mat.dispose();
      gyroRing2Geo.dispose();
      gyroRing2Mat.dispose();
      beaconGeo.dispose();
      beaconMat.dispose();
      floorGeo.dispose();
      floorMat.dispose();
      dialTexture.dispose();
      shadowTex.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-[85vh] sm:h-[88vh] rounded-3xl overflow-hidden bg-slate-950 border border-amber-500/30 shadow-2xl">
      {/* 3D WebGL Canvas Mount Container */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Left Minimal Spec Badge */}
      <div className="absolute top-5 left-5 z-20 pointer-events-none select-none">
        <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-slate-900/90 border border-amber-500/30 text-xs font-mono text-slate-200 shadow-xl">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          <span className="font-bold text-amber-400">MONOLITO ESTRATÉGICO SRAP</span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-400">Núcleo 3D PBR</span>
        </div>
      </div>

      {/* Top Right Quick Controls */}
      <div className="absolute top-5 right-5 z-20 flex items-center gap-2">
        {setActiveView && (
          <button
            type="button"
            onClick={() => setActiveView('discovery')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-xs text-amber-400 border border-amber-500/30 font-medium transition-all cursor-pointer shadow-lg"
          >
            <span>Volver a la Sesión</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
        <button
          type="button"
          onClick={() => setIsZenMode(!isZenMode)}
          title="Modo Zen (Atajo: H)"
          className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-amber-400 border border-slate-800 hover:border-amber-500/30 transition-all cursor-pointer shadow-lg"
        >
          {isZenMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Unified Bottom Control Dock (Pinned bottom center, <= 15% viewport footprint) */}
      <div
        className={`absolute bottom-5 left-1/2 -translate-x-1/2 z-20 w-[94%] max-w-4xl transition-all duration-300 ${
          isZenMode ? 'translate-y-[120%] opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'
        }`}
      >
        <div className="rounded-2xl bg-slate-900/95 border border-amber-500/30 p-4 shadow-2xl space-y-3">
          {/* Header Bar with Collapse Button */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-bold text-amber-400">Consola de Control Táctico</span>
              <span className="text-slate-500 text-[10px]">| Gira con click + arrastre</span>
            </div>
            <button
              type="button"
              onClick={() => setIsZenMode(true)}
              className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-amber-400 cursor-pointer font-mono"
            >
              <span>Ocultar Dock (Zen)</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Controls Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
            {/* 1. Exploded View Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] font-mono text-slate-300">
                <span>Desglose por Capas (Exploded)</span>
                <span className="text-amber-400 font-bold">{Math.round(explodedFactor * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={explodedFactor}
                onChange={(e) => setExplodedFactor(parseFloat(e.target.value))}
                className="w-full accent-amber-500 bg-slate-950 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[9px] font-mono text-slate-500">
                <span>Núcleo Compacto</span>
                <span>Despiece 7 Hacks</span>
              </div>
            </div>

            {/* 2. Material Finishes Swatches */}
            <div className="space-y-1.5">
              <span className="block text-[11px] font-mono text-slate-300">Acabado de Superficie</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveFinish('obsidian_gold')}
                  className={`flex-1 py-1.5 px-2 rounded-xl text-[10px] font-mono font-bold transition-all cursor-pointer border ${
                    activeFinish === 'obsidian_gold'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  Oro & Obsidiana
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFinish('titanium_cyan')}
                  className={`flex-1 py-1.5 px-2 rounded-xl text-[10px] font-mono font-bold transition-all cursor-pointer border ${
                    activeFinish === 'titanium_cyan'
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  Titanio Cyan
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFinish('emerald_biohack')}
                  className={`flex-1 py-1.5 px-2 rounded-xl text-[10px] font-mono font-bold transition-all cursor-pointer border ${
                    activeFinish === 'emerald_biohack'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  Biohack Esmeralda
                </button>
              </div>
            </div>

            {/* 3. Camera Presets & Auto-Rotate Toggle */}
            <div className="space-y-1.5">
              <span className="block text-[11px] font-mono text-slate-300">Punto de Vista & Dinámica</span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setCameraPreset('orbit')}
                  className={`px-2.5 py-1.5 rounded-xl text-[10px] font-mono font-bold cursor-pointer border transition-all ${
                    cameraPreset === 'orbit'
                      ? 'bg-amber-500 text-slate-950 border-amber-400'
                      : 'bg-slate-950 text-slate-300 border-slate-800'
                  }`}
                >
                  Órbita
                </button>
                <button
                  type="button"
                  onClick={() => setCameraPreset('core')}
                  className={`px-2.5 py-1.5 rounded-xl text-[10px] font-mono font-bold cursor-pointer border transition-all ${
                    cameraPreset === 'core'
                      ? 'bg-amber-500 text-slate-950 border-amber-400'
                      : 'bg-slate-950 text-slate-300 border-slate-800'
                  }`}
                >
                  Núcleo
                </button>
                <button
                  type="button"
                  onClick={() => setCameraPreset('top')}
                  className={`px-2.5 py-1.5 rounded-xl text-[10px] font-mono font-bold cursor-pointer border transition-all ${
                    cameraPreset === 'top'
                      ? 'bg-amber-500 text-slate-950 border-amber-400'
                      : 'bg-slate-950 text-slate-300 border-slate-800'
                  }`}
                >
                  Cenital
                </button>
                <button
                  type="button"
                  onClick={() => setIsAutoRotate(!isAutoRotate)}
                  title="Giro Continuo"
                  className={`p-1.5 rounded-xl border cursor-pointer transition-all ${
                    isAutoRotate
                      ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Restore Button when in Zen Mode */}
      {isZenMode && (
        <button
          type="button"
          onClick={() => setIsZenMode(false)}
          className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/90 hover:bg-slate-800 text-amber-400 border border-amber-500/30 text-xs font-mono shadow-2xl cursor-pointer"
        >
          <ChevronUp className="w-3.5 h-3.5" />
          <span>Restaurar Controles</span>
        </button>
      )}
    </div>
  );
}
