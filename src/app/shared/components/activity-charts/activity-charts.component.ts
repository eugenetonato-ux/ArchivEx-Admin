import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  Input,
  signal,
  HostListener,
  OnInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { Chart, registerables } from 'chart.js';
import * as THREE from 'three';

Chart.register(...registerables);

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

  // 2D Chart.js Canvas References
  @ViewChild('lineCanvas') lineCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('doughnutCanvas') doughnutCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('barCanvas') barCanvas!: ElementRef<HTMLCanvasElement>;

  // 3D Three.js WebGL Canvas References
  @ViewChild('line3DCanvas') line3DCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('doughnut3DCanvas') doughnut3DCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('bar3DCanvas') bar3DCanvas!: ElementRef<HTMLCanvasElement>;

  viewMode = signal<'3d' | '2d'>('3d');
  timeRange: '7d' | '30d' | 'acad' = '30d';

  hover3dTooltip: Tooltip3D | null = null;

  private lineChart2d?: Chart;
  private doughnutChart2d?: Chart;
  private barChart2d?: Chart;

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

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    // Initialize 2D charts
    this.init2DLineChart();
    this.init2DDoughnutChart();
    this.init2DBarChart();

    // Initialize 3D WebGL scenes with Three.js
    setTimeout(() => {
      this.init3DLineChart();
      this.init3DDoughnutChart();
      this.init3DBarChart();
    }, 100);
  }

  ngOnDestroy(): void {
    // Destroy 2D charts
    this.lineChart2d?.destroy();
    this.doughnutChart2d?.destroy();
    this.barChart2d?.destroy();

    // Cancel 3D animation frames & dispose renderers
    this.animationFrameIds.forEach(id => cancelAnimationFrame(id));
    this.line3DRenderer?.dispose();
    this.doughnut3DRenderer?.dispose();
    this.bar3DRenderer?.dispose();
  }

  toggleViewMode(mode: '3d' | '2d') {
    this.viewMode.set(mode);
    if (mode === '3d') {
      setTimeout(() => {
        this.onWindowResize();
      }, 50);
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
    const height = parent.clientHeight || 220;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  // ==========================================
  // 1. THREE.JS 3D LINE / COLUMN CHART
  // ==========================================
  private init3DLineChart() {
    if (!this.line3DCanvas?.nativeElement) return;
    const canvas = this.line3DCanvas.nativeElement;
    const parent = canvas.parentElement;
    const width = parent?.clientWidth || 600;
    const height = parent?.clientHeight || 280;

    const scene = new THREE.Scene();
    scene.background = null;
    this.line3DScene = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 4.5, 9);
    camera.lookAt(0, 1.2, 0);
    this.line3DCamera = camera;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.line3DRenderer = renderer;

    // Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(6, 12, 8);
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0x8b5cf6, 2.5, 25);
    pointLight.position.set(0, 5, 2);
    scene.add(pointLight);

    // Grid Floor
    const grid = new THREE.GridHelper(10, 10, 0x8b5cf6, 0x334155);
    grid.position.y = -0.1;
    scene.add(grid);

    this.rebuild3DLineScene();

    const animate = () => {
      const frameId = requestAnimationFrame(animate);
      this.animationFrameIds.push(frameId);

      scene.rotation.y = Math.sin(Date.now() * 0.0004) * 0.08;
      renderer.render(scene, camera);
    };
    animate();
  }

  private rebuild3DLineScene() {
    if (!this.line3DScene) return;
    const scene = this.line3DScene;

    // Remove old meshes except lights and grid
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
    const startX = -3.2;
    const stepX = (6.4) / (labels.length - 1 || 1);

    const points: THREE.Vector3[] = [];

    labels.forEach((lbl, idx) => {
      const val = consultations[idx];
      const h = (val / maxVal) * 3.5;
      const x = startX + idx * stepX;
      const y = h / 2;
      const z = 0;

      // 3D Pillar
      const geom = new THREE.CylinderGeometry(0.2, 0.25, h, 16);
      const mat = new THREE.MeshStandardMaterial({
        color: 0x8b5cf6,
        roughness: 0.2,
        metalness: 0.5,
        emissive: 0x5b3cc4,
        emissiveIntensity: 0.3
      });
      const mesh = new THREE.Mesh(geom, mat);
      mesh.position.set(x, y, z);
      mesh.userData = { title: `Consultations (${lbl})`, value: `${val.toLocaleString('fr-FR')} vues`, color: '#8b5cf6' };
      scene.add(mesh);

      // Glowing Sphere Node
      const sphereGeom = new THREE.SphereGeometry(0.18, 16, 16);
      const sphereMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        emissive: 0x0284c7,
        emissiveIntensity: 0.8
      });
      const sphere = new THREE.Mesh(sphereGeom, sphereMat);
      sphere.position.set(x, h + 0.1, z);
      scene.add(sphere);

      points.push(new THREE.Vector3(x, h + 0.1, z));
    });

    // 3D Line connecting nodes
    if (points.length > 1) {
      const lineGeom = new THREE.BufferGeometry().setFromPoints(points);
      const lineMat = new THREE.LineBasicMaterial({ color: 0x38bdf8, linewidth: 3 });
      const line = new THREE.Line(lineGeom, lineMat);
      scene.add(line);
    }
  }

  // ==========================================
  // 2. THREE.JS 3D DOUGHNUT / TORUS CHART
  // ==========================================
  private init3DDoughnutChart() {
    if (!this.doughnut3DCanvas?.nativeElement) return;
    const canvas = this.doughnut3DCanvas.nativeElement;
    const parent = canvas.parentElement;
    const width = parent?.clientWidth || 300;
    const height = parent?.clientHeight || 240;

    const scene = new THREE.Scene();
    scene.background = null;
    this.doughnut3DScene = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 2.5, 5.5);
    camera.lookAt(0, 0, 0);
    this.doughnut3DCamera = camera;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.doughnut3DRenderer = renderer;

    const ambient = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.4);
    dirLight.position.set(4, 8, 6);
    scene.add(dirLight);

    // Create 3D Torus Ring Segments
    this.doughnutSlices = [];
    const segmentsData = [
      { label: 'Épreuves (Gratuit)', pct: 0.50, color: 0x0284C7, hex: '#0284C7' },
      { label: 'Corrigés Pass', pct: 0.32, color: 0x059669, hex: '#059669' },
      { label: 'Fiches Résumé', pct: 0.18, color: 0xD97706, hex: '#D97706' }
    ];

    let startAngle = 0;
    segmentsData.forEach(item => {
      const arcLength = item.pct * Math.PI * 2;
      const geom = new THREE.TorusGeometry(1.5, 0.45, 16, 32, arcLength);
      const mat = new THREE.MeshStandardMaterial({
        color: item.color,
        roughness: 0.25,
        metalness: 0.4,
        emissive: item.color,
        emissiveIntensity: 0.2
      });
      const slice = new THREE.Mesh(geom, mat);
      slice.rotation.x = Math.PI / 2.8;
      slice.rotation.z = startAngle;
      slice.userData = { title: item.label, value: `${Math.round(item.pct * 100)}%`, color: item.hex };
      scene.add(slice);
      this.doughnutSlices.push(slice);

      startAngle += arcLength;
    });

    const animate = () => {
      const frameId = requestAnimationFrame(animate);
      this.animationFrameIds.push(frameId);

      scene.rotation.z += 0.005;
      renderer.render(scene, camera);
    };
    animate();
  }

  // ==========================================
  // 3. THREE.JS 3D BAR CHART
  // ==========================================
  private init3DBarChart() {
    if (!this.bar3DCanvas?.nativeElement) return;
    const canvas = this.bar3DCanvas.nativeElement;
    const parent = canvas.parentElement;
    const width = parent?.clientWidth || 300;
    const height = parent?.clientHeight || 240;

    const scene = new THREE.Scene();
    scene.background = null;
    this.bar3DScene = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 4.2, 7.5);
    camera.lookAt(0, 1.2, 0);
    this.bar3DCamera = camera;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.bar3DRenderer = renderer;

    const ambient = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.3);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    const grid = new THREE.GridHelper(7, 7, 0x6366f1, 0x334155);
    grid.position.y = 0;
    scene.add(grid);

    this.rebuild3DBarScene();

    const animate = () => {
      const frameId = requestAnimationFrame(animate);
      this.animationFrameIds.push(frameId);

      scene.rotation.y = Math.sin(Date.now() * 0.0005) * 0.1;
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
      { label: 'MTN MoMo', value: 650000, color: 0xF59E0B, hex: '#F59E0B', x: -2.1 },
      { label: 'Moov Money', value: 420000, color: 0x10B981, hex: '#10B981', x: -0.7 },
      { label: 'Celtiis Cash', value: 210000, color: 0x3B82F6, hex: '#3B82F6', x: 0.7 },
      { label: 'Carte / Wave', value: 950000, color: 0x6366F1, hex: '#6366F1', x: 2.1 }
    ];

    const maxVal = 1000000;
    const maxHeight = 3.2;

    data.forEach(item => {
      const targetHeight = (item.value / maxVal) * maxHeight;
      const geom = new THREE.BoxGeometry(0.85, targetHeight, 0.85);
      const mat = new THREE.MeshStandardMaterial({
        color: item.color,
        roughness: 0.2,
        metalness: 0.4,
        emissive: item.color,
        emissiveIntensity: 0.25
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
  // MOUSE HOVER RAYCASTING FOR 3D TOOLTIPS
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
        x: event.clientX + 14,
        y: event.clientY - 10
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
        x: event.clientX + 14,
        y: event.clientY - 10
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
          x: event.clientX + 14,
          y: event.clientY - 10
        };
        return;
      }
    }
    this.hover3dTooltip = null;
  }

  // ==========================================
  // 2D FALLBACK CHART.JS INITIALIZATIONS
  // ==========================================
  private init2DLineChart() {
    if (!this.lineCanvas?.nativeElement) return;
    this.lineChart2d = new Chart(this.lineCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: ['Oct', 'Nov', 'Déc', 'Jan', 'Fév', 'Mar'],
        datasets: [
          {
            data: [1200, 2100, 3800, 5400, 7200, 9800],
            label: 'Consultations',
            fill: true,
            borderColor: '#5B3CC4',
            backgroundColor: 'rgba(91, 60, 196, 0.15)'
          }
        ]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
  }

  private init2DDoughnutChart() {
    if (!this.doughnutCanvas?.nativeElement) return;
    this.doughnutChart2d = new Chart(this.doughnutCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Épreuves', 'Corrigés', 'Fiches'],
        datasets: [{ data: [50, 32, 18], backgroundColor: ['#0284C7', '#059669', '#D97706'] }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
  }

  private init2DBarChart() {
    if (!this.barCanvas?.nativeElement) return;
    this.barChart2d = new Chart(this.barCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: ['MTN MoMo', 'Moov', 'Celtiis', 'Wave'],
        datasets: [{ data: [650000, 420000, 210000, 950000], backgroundColor: ['#F59E0B', '#10B981', '#3B82F6', '#6366F1'] }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
  }

  setTimeRange(range: '7d' | '30d' | 'acad') {
    this.timeRange = range;
    this.rebuild3DLineScene();
  }
}
