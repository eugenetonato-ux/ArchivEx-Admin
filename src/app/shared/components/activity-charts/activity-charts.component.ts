import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  Input,
  NgZone,
  OnInit,
  ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import * as THREE from 'three';

export interface Tooltip3D {
  title: string;
  value: string;
  color: string;
  x: number;
  y: number;
}

@Component({
  selector: 'app-activity-charts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './activity-charts.component.html',
  styleUrls: ['./activity-charts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivityChartsComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() totalRessources = 0;
  @Input() totalEtudiants = 0;

  @ViewChild('line3DCanvas') line3DCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('doughnut3DCanvas') doughnut3DCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('bar3DCanvas') bar3DCanvas!: ElementRef<HTMLCanvasElement>;

  timeRange: '7d' | '30d' | 'acad' = '30d';
  hover3dTooltip: Tooltip3D | null = null;

  // Three.js Renderers & Scenes
  private line3DScene?: THREE.Scene;
  private line3DCamera?: THREE.PerspectiveCamera;
  private line3DRenderer?: THREE.WebGLRenderer;

  private doughnut3DScene?: THREE.Scene;
  private doughnut3DCamera?: THREE.PerspectiveCamera;
  private doughnut3DRenderer?: THREE.WebGLRenderer;

  private bar3DScene?: THREE.Scene;
  private bar3DCamera?: THREE.PerspectiveCamera;
  private bar3DRenderer?: THREE.WebGLRenderer;

  private resizeObserver?: ResizeObserver;
  private isDestroyed = false;
  private lastWidths = new Map<HTMLElement, { w: number; h: number }>();

  constructor(private ngZone: NgZone) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    // Run Three.js setup strictly OUTSIDE Angular Zone to eliminate any change detection freeze
    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        if (this.isDestroyed) return;
        this.init3DLineChart();
        this.init3DDoughnutChart();
        this.init3DBarChart();
        this.setupResizeObserver();
      }, 100);
    });
  }

  ngOnDestroy(): void {
    this.isDestroyed = true;
    this.resizeObserver?.disconnect();

    this.disposeScene(this.line3DScene, this.line3DRenderer);
    this.disposeScene(this.doughnut3DScene, this.doughnut3DRenderer);
    this.disposeScene(this.bar3DScene, this.bar3DRenderer);
  }

  private disposeScene(scene?: THREE.Scene, renderer?: THREE.WebGLRenderer) {
    if (scene) {
      scene.traverse(obj => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry?.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach(m => m.dispose());
          } else if (obj.material) {
            obj.material.dispose();
          }
        }
      });
      scene.clear();
    }
    renderer?.dispose();
  }

  private setupResizeObserver() {
    if (typeof ResizeObserver === 'undefined') return;

    this.resizeObserver = new ResizeObserver(entries => {
      this.ngZone.runOutsideAngular(() => {
        let changed = false;
        for (const entry of entries) {
          const el = entry.target as HTMLElement;
          const prev = this.lastWidths.get(el);
          const cr = entry.contentRect;
          if (!prev || Math.abs(prev.w - cr.width) > 4 || Math.abs(prev.h - cr.height) > 4) {
            this.lastWidths.set(el, { w: cr.width, h: cr.height });
            changed = true;
          }
        }
        if (changed && !this.isDestroyed) {
          this.resizeAll();
        }
      });
    });

    if (this.line3DCanvas?.nativeElement?.parentElement) {
      this.resizeObserver.observe(this.line3DCanvas.nativeElement.parentElement);
    }
    if (this.doughnut3DCanvas?.nativeElement?.parentElement) {
      this.resizeObserver.observe(this.doughnut3DCanvas.nativeElement.parentElement);
    }
    if (this.bar3DCanvas?.nativeElement?.parentElement) {
      this.resizeObserver.observe(this.bar3DCanvas.nativeElement.parentElement);
    }
  }

  private resizeAll() {
    this.resize3D(this.line3DCanvas, this.line3DCamera, this.line3DRenderer, this.line3DScene);
    this.resize3D(this.doughnut3DCanvas, this.doughnut3DCamera, this.doughnut3DRenderer, this.doughnut3DScene);
    this.resize3D(this.bar3DCanvas, this.bar3DCamera, this.bar3DRenderer, this.bar3DScene);
  }

  private resize3D(
    canvasRef?: ElementRef<HTMLCanvasElement>,
    camera?: THREE.PerspectiveCamera,
    renderer?: THREE.WebGLRenderer,
    scene?: THREE.Scene
  ) {
    if (!canvasRef?.nativeElement || !camera || !renderer || !scene) return;
    const parent = canvasRef.nativeElement.parentElement;
    if (!parent) return;

    const width = Math.max(parent.clientWidth, 280);
    const height = Math.max(parent.clientHeight, 220);

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    renderer.render(scene, camera);
  }

  // ==========================================
  // 1. THREE.JS 3D ISOMETRIC ACTIVITY CHART
  // ==========================================
  private init3DLineChart() {
    if (!this.line3DCanvas?.nativeElement) return;
    const canvas = this.line3DCanvas.nativeElement;
    const parent = canvas.parentElement;
    const width = parent?.clientWidth || 600;
    const height = parent?.clientHeight || 280;

    const scene = new THREE.Scene();
    this.line3DScene = scene;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 4.8, 9.5);
    camera.lookAt(0, 1.0, 0);
    this.line3DCamera = camera;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
    renderer.setSize(width, height, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    this.line3DRenderer = renderer;

    const ambient = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.6);
    dirLight.position.set(7, 12, 9);
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0x7c3aed, 2.5, 25);
    pointLight.position.set(0, 5, 3);
    scene.add(pointLight);

    // Glowing Floor Grid
    const grid = new THREE.GridHelper(12, 12, 0x7c3aed, 0x334155);
    grid.position.y = -0.05;
    scene.add(grid);

    this.rebuild3DLineScene();
    renderer.render(scene, camera);
  }

  private rebuild3DLineScene() {
    if (!this.line3DScene || !this.line3DCamera || !this.line3DRenderer) return;
    const scene = this.line3DScene;

    const toRemove = scene.children.filter(c => c.type === 'Mesh' || c.type === 'Group' || c.type === 'Line');
    toRemove.forEach(c => scene.remove(c));

    const labels = this.timeRange === '7d'
      ? ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
      : this.timeRange === '30d'
      ? ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4']
      : ['Oct', 'Nov', 'Déc', 'Jan', 'Fév', 'Mar'];

    // ZERO DATA for fresh project
    const consultations = labels.map(() => 0);
    const startX = -3.6;
    const stepX = 7.2 / (labels.length - 1 || 1);
    const points: THREE.Vector3[] = [];

    labels.forEach((lbl, idx) => {
      const x = startX + idx * stepX;
      const y = 0.1;
      const z = 0;

      // Base 3D pedestal
      const geom = new THREE.CylinderGeometry(0.22, 0.26, 0.2, 16);
      const mat = new THREE.MeshStandardMaterial({
        color: 0x475569,
        roughness: 0.3,
        metalness: 0.4
      });
      const mesh = new THREE.Mesh(geom, mat);
      mesh.position.set(x, 0.1, z);
      scene.add(mesh);

      // Node Sphere at 0 baseline
      const sphereGeom = new THREE.SphereGeometry(0.16, 16, 16);
      const sphereMat = new THREE.MeshStandardMaterial({
        color: 0x6366f1,
        emissive: 0x4f46e5,
        emissiveIntensity: 0.8
      });
      const sphere = new THREE.Mesh(sphereGeom, sphereMat);
      sphere.position.set(x, 0.28, z);
      scene.add(sphere);

      points.push(new THREE.Vector3(x, 0.28, z));
    });

    if (points.length > 1) {
      const lineGeom = new THREE.BufferGeometry().setFromPoints(points);
      const lineMat = new THREE.LineBasicMaterial({ color: 0x6366f1, linewidth: 3 });
      const line = new THREE.Line(lineGeom, lineMat);
      scene.add(line);
    }

    this.line3DRenderer.render(scene, this.line3DCamera);
  }

  // ==========================================
  // 2. THREE.JS 3D DOUGHNUT / TORUS SLICES
  // ==========================================
  private init3DDoughnutChart() {
    if (!this.doughnut3DCanvas?.nativeElement) return;
    const canvas = this.doughnut3DCanvas.nativeElement;
    const parent = canvas.parentElement;
    const width = parent?.clientWidth || 300;
    const height = parent?.clientHeight || 240;

    const scene = new THREE.Scene();
    this.doughnut3DScene = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 3.2, 5.2);
    camera.lookAt(0, 0, 0);
    this.doughnut3DCamera = camera;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
    renderer.setSize(width, height, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    this.doughnut3DRenderer = renderer;

    const ambient = new THREE.AmbientLight(0xffffff, 1.3);
    scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.6);
    dirLight.position.set(5, 8, 7);
    scene.add(dirLight);

    // Initial clean 3D Torus representing empty/ready state
    const geom = new THREE.TorusGeometry(1.5, 0.45, 18, 48);
    const mat = new THREE.MeshStandardMaterial({
      color: 0x6366f1,
      roughness: 0.25,
      metalness: 0.4,
      emissive: 0x4338ca,
      emissiveIntensity: 0.25
    });
    const torus = new THREE.Mesh(geom, mat);
    torus.rotation.x = Math.PI / 2.7;
    scene.add(torus);

    renderer.render(scene, camera);
  }

  // ==========================================
  // 3. THREE.JS 3D PRISMATIC BAR CHART
  // ==========================================
  private init3DBarChart() {
    if (!this.bar3DCanvas?.nativeElement) return;
    const canvas = this.bar3DCanvas.nativeElement;
    const parent = canvas.parentElement;
    const width = parent?.clientWidth || 300;
    const height = parent?.clientHeight || 240;

    const scene = new THREE.Scene();
    this.bar3DScene = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 4.0, 7.2);
    camera.lookAt(0, 0.8, 0);
    this.bar3DCamera = camera;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
    renderer.setSize(width, height, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    this.bar3DRenderer = renderer;

    const ambient = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(6, 10, 8);
    scene.add(dirLight);

    const grid = new THREE.GridHelper(8, 8, 0x6366f1, 0x334155);
    grid.position.y = 0;
    scene.add(grid);

    // Initial 4 baseline 3D pedestals at level 0
    const gateways = [
      { label: 'MTN MoMo', x: -2.1, color: 0xf59e0b },
      { label: 'Moov Money', x: -0.7, color: 0x10b981 },
      { label: 'Celtiis Cash', x: 0.7, color: 0x3b82f6 },
      { label: 'Carte / Wave', x: 2.1, color: 0x6366f1 }
    ];

    gateways.forEach(gw => {
      const geom = new THREE.BoxGeometry(0.85, 0.2, 0.85);
      const mat = new THREE.MeshStandardMaterial({
        color: gw.color,
        roughness: 0.2,
        metalness: 0.4,
        emissive: gw.color,
        emissiveIntensity: 0.3
      });
      const mesh = new THREE.Mesh(geom, mat);
      mesh.position.set(gw.x, 0.1, 0);
      scene.add(mesh);
    });

    renderer.render(scene, camera);
  }

  setTimeRange(range: '7d' | '30d' | 'acad') {
    this.timeRange = range;
    this.ngZone.runOutsideAngular(() => {
      this.rebuild3DLineScene();
    });
  }
}
