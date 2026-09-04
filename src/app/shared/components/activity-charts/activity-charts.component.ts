import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  Input,
  HostListener,
  OnInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
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
  imports: [CommonModule, IonIcon],
  templateUrl: './activity-charts.component.html',
  styleUrls: ['./activity-charts.component.scss']
})
export class ActivityChartsComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() totalRessources = 45;
  @Input() totalEtudiants = 142;

  // 3D Three.js WebGL Canvas References
  @ViewChild('line3DCanvas') line3DCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('doughnut3DCanvas') doughnut3DCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('bar3DCanvas') bar3DCanvas!: ElementRef<HTMLCanvasElement>;

  timeRange: '7d' | '30d' | 'acad' = '30d';
  hover3dTooltip: Tooltip3D | null = null;

  // Three.js Scenes, Cameras, Renderers & Meshes
  private line3DScene?: THREE.Scene;
  private line3DCamera?: THREE.PerspectiveCamera;
  private line3DRenderer?: THREE.WebGLRenderer;

  private doughnut3DScene?: THREE.Scene;
  private doughnut3DCamera?: THREE.PerspectiveCamera;
  private doughnut3DRenderer?: THREE.WebGLRenderer;
  private doughnutSlices: THREE.Mesh[] = [];

  private bar3DScene?: THREE.Scene;
  private bar3DCamera?: THREE.PerspectiveCamera;
  private bar3DRenderer?: THREE.WebGLRenderer;
  private barMeshes: THREE.Mesh[] = [];

  private animationFrameIds: number[] = [];
  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();
  private resizeObserver?: ResizeObserver;

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    // Initialize 3D scenes after a brief timeout to ensure DOM layout bounds are ready
    setTimeout(() => {
      this.init3DLineChart();
      this.init3DDoughnutChart();
      this.init3DBarChart();
      this.setupResizeObserver();
    }, 120);
  }

  ngOnDestroy(): void {
    this.animationFrameIds.forEach(id => cancelAnimationFrame(id));
    this.line3DRenderer?.dispose();
    this.doughnut3DRenderer?.dispose();
    this.bar3DRenderer?.dispose();
    this.resizeObserver?.disconnect();
  }

  private setupResizeObserver() {
    this.resizeObserver = new ResizeObserver(() => {
      this.onWindowResize();
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

  @HostListener('window:resize')
  onWindowResize() {
    this.resize3DCanvas(this.line3DCanvas, this.line3DCamera, this.line3DRenderer);
    this.resize3DCanvas(this.doughnut3DCanvas, this.doughnut3DCamera, this.doughnut3DRenderer);
    this.resize3DCanvas(this.bar3DCanvas, this.bar3DCamera, this.bar3DRenderer);
  }

  private resize3DCanvas(
    canvasRef?: ElementRef<HTMLCanvasElement>,
    camera?: THREE.PerspectiveCamera,
    renderer?: THREE.WebGLRenderer
  ) {
    if (!canvasRef?.nativeElement || !camera || !renderer) return;
    const parent = canvasRef.nativeElement.parentElement;
    if (!parent) return;

    const width = parent.clientWidth || 300;
    const height = parent.clientHeight || 260;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  }

  // ==========================================
  // 1. THREE.JS 3D ISOMETRIC LINE & COLUMN CHART
  // ==========================================
  private init3DLineChart() {
    if (!this.line3DCanvas?.nativeElement) return;
    const canvas = this.line3DCanvas.nativeElement;
    const parent = canvas.parentElement;
    const width = parent?.clientWidth || 600;
    const height = parent?.clientHeight || 300;

    const scene = new THREE.Scene();
    this.line3DScene = scene;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 5, 9.5);
    camera.lookAt(0, 1.2, 0);
    this.line3DCamera = camera;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(width, height, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.line3DRenderer = renderer;

    // Lighting Setup
    const ambient = new THREE.AmbientLight(0xffffff, 1.1);
    scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(8, 14, 10);
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0x7c3aed, 3.0, 30);
    pointLight.position.set(0, 6, 3);
    scene.add(pointLight);

    // Glowing Floor Grid
    const grid = new THREE.GridHelper(12, 12, 0x7c3aed, 0x3b82f6);
    grid.position.y = -0.1;
    scene.add(grid);

    this.rebuild3DLineScene();

    const animate = () => {
      const frameId = requestAnimationFrame(animate);
      this.animationFrameIds.push(frameId);

      scene.rotation.y = Math.sin(Date.now() * 0.0003) * 0.06;
      renderer.render(scene, camera);
    };
    animate();
  }

  private rebuild3DLineScene() {
    if (!this.line3DScene) return;
    const scene = this.line3DScene;

    const toRemove = scene.children.filter(c => c.type === 'Mesh' || c.type === 'Group' || c.type === 'Line');
    toRemove.forEach(c => scene.remove(c));

    const labels = this.timeRange === '7d'
      ? ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
      : this.timeRange === '30d'
      ? ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4']
      : ['Oct', 'Nov', 'Déc', 'Jan', 'Fév', 'Mar'];

    const consultations = this.timeRange === '7d'
      ? [320, 450, 510, 680, 890, 720, 940]
      : this.timeRange === '30d'
      ? [2100, 3800, 5400, 7200]
      : [1200, 2100, 3800, 5400, 7200, 9800];

    const maxVal = Math.max(...consultations, 10000);
    const startX = -3.8;
    const stepX = (7.6) / (labels.length - 1 || 1);

    const points: THREE.Vector3[] = [];

    labels.forEach((lbl, idx) => {
      const val = consultations[idx];
      const h = (val / maxVal) * 3.8;
      const x = startX + idx * stepX;
      const y = h / 2;
      const z = 0;

      // Metallic 3D Cylinder
      const geom = new THREE.CylinderGeometry(0.24, 0.3, h, 20);
      const mat = new THREE.MeshStandardMaterial({
        color: 0x7c3aed,
        roughness: 0.15,
        metalness: 0.6,
        emissive: 0x5b3cc4,
        emissiveIntensity: 0.4
      });
      const mesh = new THREE.Mesh(geom, mat);
      mesh.position.set(x, y, z);
      mesh.userData = { title: `Consultations (${lbl})`, value: `${val.toLocaleString('fr-FR')} vues`, color: '#7c3aed' };
      scene.add(mesh);

      // Glowing Node Sphere
      const sphereGeom = new THREE.SphereGeometry(0.22, 20, 20);
      const sphereMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        emissive: 0x0284c7,
        emissiveIntensity: 0.9,
        roughness: 0.1
      });
      const sphere = new THREE.Mesh(sphereGeom, sphereMat);
      sphere.position.set(x, h + 0.12, z);
      scene.add(sphere);

      points.push(new THREE.Vector3(x, h + 0.12, z));
    });

    // 3D Connecting Line
    if (points.length > 1) {
      const lineGeom = new THREE.BufferGeometry().setFromPoints(points);
      const lineMat = new THREE.LineBasicMaterial({ color: 0x38bdf8, linewidth: 4 });
      const line = new THREE.Line(lineGeom, lineMat);
      scene.add(line);
    }
  }

  // ==========================================
  // 2. THREE.JS 3D DOUGHNUT / TORUS SLICES
  // ==========================================
  private init3DDoughnutChart() {
    if (!this.doughnut3DCanvas?.nativeElement) return;
    const canvas = this.doughnut3DCanvas.nativeElement;
    const parent = canvas.parentElement;
    const width = parent?.clientWidth || 300;
    const height = parent?.clientHeight || 260;

    const scene = new THREE.Scene();
    this.doughnut3DScene = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 2.8, 5.8);
    camera.lookAt(0, 0, 0);
    this.doughnut3DCamera = camera;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(width, height, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.doughnut3DRenderer = renderer;

    const ambient = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.6);
    dirLight.position.set(5, 9, 7);
    scene.add(dirLight);

    this.doughnutSlices = [];
    const segmentsData = [
      { label: 'Épreuves (Gratuit)', pct: 0.50, color: 0x0284C7, hex: '#0284C7' },
      { label: 'Corrigés Pass', pct: 0.32, color: 0x10B981, hex: '#10B981' },
      { label: 'Fiches Résumé', pct: 0.18, color: 0xF59E0B, hex: '#F59E0B' }
    ];

    let startAngle = 0;
    segmentsData.forEach(item => {
      const arcLength = item.pct * Math.PI * 2 - 0.08; // gap between slices
      const geom = new THREE.TorusGeometry(1.6, 0.5, 20, 40, arcLength);
      const mat = new THREE.MeshStandardMaterial({
        color: item.color,
        roughness: 0.2,
        metalness: 0.5,
        emissive: item.color,
        emissiveIntensity: 0.3
      });
      const slice = new THREE.Mesh(geom, mat);
      slice.rotation.x = Math.PI / 2.6;
      slice.rotation.z = startAngle;
      slice.userData = { title: item.label, value: `${Math.round(item.pct * 100)}% des docs`, color: item.hex };
      scene.add(slice);
      this.doughnutSlices.push(slice);

      startAngle += arcLength + 0.08;
    });

    const animate = () => {
      const frameId = requestAnimationFrame(animate);
      this.animationFrameIds.push(frameId);

      scene.rotation.z += 0.006;
      renderer.render(scene, camera);
    };
    animate();
  }

  // ==========================================
  // 3. THREE.JS 3D PRISMATIC BAR CHART
  // ==========================================
  private init3DBarChart() {
    if (!this.bar3DCanvas?.nativeElement) return;
    const canvas = this.bar3DCanvas.nativeElement;
    const parent = canvas.parentElement;
    const width = parent?.clientWidth || 300;
    const height = parent?.clientHeight || 260;

    const scene = new THREE.Scene();
    this.bar3DScene = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 4.5, 7.8);
    camera.lookAt(0, 1.2, 0);
    this.bar3DCamera = camera;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(width, height, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.bar3DRenderer = renderer;

    const ambient = new THREE.AmbientLight(0xffffff, 1.1);
    scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(6, 11, 8);
    scene.add(dirLight);

    const grid = new THREE.GridHelper(8, 8, 0x6366f1, 0x1e293b);
    grid.position.y = 0;
    scene.add(grid);

    this.rebuild3DBarScene();

    const animate = () => {
      const frameId = requestAnimationFrame(animate);
      this.animationFrameIds.push(frameId);

      scene.rotation.y = Math.sin(Date.now() * 0.0004) * 0.08;
      renderer.render(scene, camera);
    };
    animate();
  }

  private rebuild3DBarScene() {
    if (!this.bar3DScene) return;
    const scene = this.bar3DScene;

    this.barMeshes.forEach(m => scene.remove(m));
    this.barMeshes = [];

    const data = [
      { label: 'MTN MoMo', value: 650000, color: 0xF59E0B, hex: '#F59E0B', x: -2.2 },
      { label: 'Moov Money', value: 420000, color: 0x10B981, hex: '#10B981', x: -0.7 },
      { label: 'Celtiis Cash', value: 210000, color: 0x3B82F6, hex: '#3B82F6', x: 0.7 },
      { label: 'Carte / Wave', value: 950000, color: 0x6366F1, hex: '#6366F1', x: 2.2 }
    ];

    const maxVal = 1000000;
    const maxHeight = 3.4;

    data.forEach(item => {
      const targetHeight = (item.value / maxVal) * maxHeight;
      const geom = new THREE.BoxGeometry(0.9, targetHeight, 0.9);
      const mat = new THREE.MeshStandardMaterial({
        color: item.color,
        roughness: 0.18,
        metalness: 0.5,
        emissive: item.color,
        emissiveIntensity: 0.3
      });
      const mesh = new THREE.Mesh(geom, mat);
      mesh.position.set(item.x, targetHeight / 2, 0);
      mesh.userData = {
        title: item.label,
        value: `${item.value.toLocaleString('fr-FR')} FCFA`,
        color: item.hex
      };
      scene.add(mesh);
      this.barMeshes.push(mesh);
    });
  }

  // ==========================================
  // RAYCASTING FOR 3D TOOLTIPS
  // ==========================================
  on3DBarMouseMove(event: MouseEvent) {
    if (!this.bar3DCanvas?.nativeElement || !this.bar3DCamera) return;
    const canvas = this.bar3DCanvas.nativeElement;
    const rect = canvas.getBoundingClientRect();

    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.bar3DCamera);
    const intersects = this.raycaster.intersectObjects(this.barMeshes);

    if (intersects.length > 0) {
      const hit = intersects[0].object;
      this.hover3dTooltip = {
        title: hit.userData['title'],
        value: hit.userData['value'],
        color: hit.userData['color'],
        x: event.clientX + 16,
        y: event.clientY - 12
      };
    } else {
      this.hover3dTooltip = null;
    }
  }

  on3DDoughnutMouseMove(event: MouseEvent) {
    if (!this.doughnut3DCanvas?.nativeElement || !this.doughnut3DCamera) return;
    const canvas = this.doughnut3DCanvas.nativeElement;
    const rect = canvas.getBoundingClientRect();

    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.doughnut3DCamera);
    const intersects = this.raycaster.intersectObjects(this.doughnutSlices);

    if (intersects.length > 0) {
      const hit = intersects[0].object;
      this.hover3dTooltip = {
        title: hit.userData['title'],
        value: hit.userData['value'],
        color: hit.userData['color'],
        x: event.clientX + 16,
        y: event.clientY - 12
      };
    } else {
      this.hover3dTooltip = null;
    }
  }

  on3DLineMouseMove(event: MouseEvent) {
    if (!this.line3DCanvas?.nativeElement || !this.line3DCamera || !this.line3DScene) return;
    const canvas = this.line3DCanvas.nativeElement;
    const rect = canvas.getBoundingClientRect();

    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.line3DCamera);
    const meshes = this.line3DScene.children.filter(c => c.type === 'Mesh');
    const intersects = this.raycaster.intersectObjects(meshes);

    if (intersects.length > 0) {
      const hit = intersects[0].object;
      if (hit.userData && hit.userData['title']) {
        this.hover3dTooltip = {
          title: hit.userData['title'],
          value: hit.userData['value'],
          color: hit.userData['color'],
          x: event.clientX + 16,
          y: event.clientY - 12
        };
        return;
      }
    }
    this.hover3dTooltip = null;
  }

  setTimeRange(range: '7d' | '30d' | 'acad') {
    this.timeRange = range;
    this.rebuild3DLineScene();
  }
}
