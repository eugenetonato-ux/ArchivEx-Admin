import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import {
  Chart,
  ChartConfiguration,
  ChartData,
  registerables
} from 'chart.js';

// Register Chart.js modules
Chart.register(...registerables);

@Component({
  selector: 'app-activity-charts',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './activity-charts.component.html',
  styleUrls: ['./activity-charts.component.scss']
})
export class ActivityChartsComponent implements OnInit {
  @Input() totalRessources = 45;
  @Input() totalEtudiants = 142;

  timeRange: '7d' | '30d' | 'acad' = '30d';

  // 1. Line/Area Chart Configuration (Consultations & Publications)
  public lineChartData: ChartData<'line'> = {
    labels: ['Oct', 'Nov', 'Déc', 'Jan', 'Fév', 'Mar'],
    datasets: [
      {
        data: [1200, 2100, 3800, 5400, 7200, 9800],
        label: 'Consultations de Documents',
        fill: true,
        tension: 0.4,
        borderColor: '#5B3CC4',
        backgroundColor: 'rgba(91, 60, 196, 0.15)',
        pointBackgroundColor: '#5B3CC4',
        pointBorderColor: '#ffffff',
        pointHoverBackgroundColor: '#ffffff',
        pointHoverBorderColor: '#5B3CC4',
        pointRadius: 5
      },
      {
        data: [120, 240, 410, 680, 890, 1150],
        label: 'Téléchargements PDF',
        fill: true,
        tension: 0.4,
        borderColor: '#0284C7',
        backgroundColor: 'rgba(2, 132, 199, 0.1)',
        pointBackgroundColor: '#0284C7',
        pointBorderColor: '#ffffff',
        pointRadius: 4
      }
    ]
  };

  public lineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          usePointStyle: true,
          font: { family: 'sans-serif', size: 12, weight: 600 }
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        padding: 12,
        cornerRadius: 8
      }
    },
    scales: {
      x: {
        grid: { display: false }
      },
      y: {
        grid: { color: 'rgba(0,0,0,0.05)' },
        ticks: { precision: 0 }
      }
    }
  };

  // 2. Doughnut Chart Configuration (Répartition des Documents)
  public doughnutChartData: ChartData<'doughnut'> = {
    labels: ['Épreuves (Gratuit)', 'Corrigés Détaillés (Pass)', 'Fiches Résumé (Pass)'],
    datasets: [
      {
        data: [50, 32, 18],
        backgroundColor: ['#0284C7', '#059669', '#D97706'],
        hoverBackgroundColor: ['#0369A1', '#047857', '#B45309'],
        borderWidth: 2,
        borderColor: '#ffffff'
      }
    ]
  };

  public doughnutChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 16,
          font: { size: 11, weight: 600 }
        }
      }
    },
    cutout: '68%'
  };

  // 3. Bar Chart Configuration (Paiements par Moyen de Paiement)
  public barChartData: ChartData<'bar'> = {
    labels: ['MTN MoMo', 'Moov Money', 'Celtiis Cash', 'Carte / Wave'],
    datasets: [
      {
        data: [650000, 420000, 210000, 950000],
        label: 'Volume de Transactions (FCFA)',
        backgroundColor: ['#F59E0B', '#10B981', '#3B82F6', '#6366F1'],
        borderRadius: 8,
        borderSkipped: false
      }
    ]
  };

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => {
            const val = context.raw as number;
            return ` Volume: ${val.toLocaleString('fr-FR')} FCFA`;
          }
        }
      }
    },
    scales: {
      x: { grid: { display: false } },
      y: {
        grid: { color: 'rgba(0,0,0,0.05)' },
        ticks: {
          callback: (value) => `${Number(value) / 1000}k`
        }
      }
    }
  };

  ngOnInit(): void {}

  setTimeRange(range: '7d' | '30d' | 'acad') {
    this.timeRange = range;
    if (range === '7d') {
      this.lineChartData = {
        labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
        datasets: [
          {
            ...this.lineChartData.datasets[0],
            data: [320, 450, 510, 680, 890, 720, 940]
          },
          {
            ...this.lineChartData.datasets[1],
            data: [45, 60, 85, 110, 140, 105, 160]
          }
        ]
      };
    } else if (range === '30d') {
      this.lineChartData = {
        labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
        datasets: [
          {
            ...this.lineChartData.datasets[0],
            data: [2100, 3800, 5400, 7200]
          },
          {
            ...this.lineChartData.datasets[1],
            data: [240, 410, 680, 890]
          }
        ]
      };
    } else {
      this.lineChartData = {
        labels: ['Oct', 'Nov', 'Déc', 'Jan', 'Fév', 'Mar'],
        datasets: [
          {
            ...this.lineChartData.datasets[0],
            data: [1200, 2100, 3800, 5400, 7200, 9800]
          },
          {
            ...this.lineChartData.datasets[1],
            data: [120, 240, 410, 680, 890, 1150]
          }
        ]
      };
    }
  }
}
