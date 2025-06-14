import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-clima-laboral',
  templateUrl: './clima-laboral.component.html',
  styleUrls: ['./clima-laboral.component.css']
})
export class ClimaLaboralComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}



// Interfaces para tipado
interface ClimateData {
    satisfaction: number;
    participation: number;
    workEnvironment: number;
    leadership: number;
}

interface DepartmentData {
    name: string;
    score: number;
    color?: string;
}

interface MetricData {
    title: string;
    score: number;
    progress: number;
    category: 'excellent' | 'good' | 'average';
}

interface TrendData {
    month: string;
    score: number;
}

// Declaración global de Chart.js para TypeScript
declare const Chart: any;

class ClimateLaboral {
    
  private trendChart: any;
    private departmentChart: any;
    private updateInterval: number | null = null;

    // Datos de ejemplo
    private climateData: ClimateData = {
        satisfaction: 8.4,
        participation: 92,
        workEnvironment: 7.8,
        leadership: 8.1
    };

    private departmentData: DepartmentData[] = [
        { name: 'Ventas', score: 8.5, color: '#ff6b6b' },
        { name: 'Marketing', score: 8.2, color: '#4ecdc4' },
        { name: 'IT', score: 8.8, color: '#45b7d1' },
        { name: 'RRHH', score: 8.0, color: '#96ceb4' },
        { name: 'Finanzas', score: 7.9, color: '#feca57' },
        { name: 'Operaciones', score: 8.1, color: '#ff9ff3' }
    ];

    private trendData: TrendData[] = [
        { month: 'Ene', score: 7.8 },
        { month: 'Feb', score: 8.0 },
        { month: 'Mar', score: 7.9 },
        { month: 'Abr', score: 8.2 },
        { month: 'May', score: 8.1 },
        { month: 'Jun', score: 8.4 }
    ];

    private metricsData: MetricData[] = [
        { title: 'Satisfacción con el Puesto', score: 8.6, progress: 86, category: 'excellent' },
        { title: 'Relaciones Interpersonales', score: 8.2, progress: 82, category: 'excellent' },
        { title: 'Compensación y Beneficios', score: 7.4, progress: 74, category: 'good' },
        { title: 'Desarrollo Profesional', score: 6.8, progress: 68, category: 'average' },
        { title: 'Balance Vida-Trabajo', score: 7.6, progress: 76, category: 'good' },
        { title: 'Claridad de Objetivos', score: 8.0, progress: 80, category: 'excellent' }
    ];

    constructor() {
        this.init();
    }

    private init(): void {
        // Esperar a que se cargue el DOM
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
        } else {
            this.initializeComponents();
        }
    }

    private initializeComponents(): void {
        this.setupChartDefaults();
        this.initializeCharts();
        //this.initializeProgressBars();
        //this.initializeHoverEffects();
        //this.startRealTimeUpdates();
    }

    private setupChartDefaults(): void {
        if (typeof Chart !== 'undefined') {
            Chart.defaults.font.family = 'Segoe UI';
            Chart.defaults.color = '#666';
        }
    }

    private initializeCharts(): void {
        this.createTrendChart();
        //this.createDepartmentChart();
    }

    private createTrendChart(): void {
        const canvas = document.getElementById('trendChart') as HTMLCanvasElement;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        this.trendChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: this.trendData.map(item => item.month),
                datasets: [{
                    label: 'Clima Laboral General',
                    data: this.trendData.map(item => item.score),
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#2c3e50',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 6
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        min: 6,
                        max: 10,
                        grid: {
                            color: 'rgba(0,0,0,0.1)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                },
                animation: {
                    duration: 2000,
                    easing: 'easeInOutQuart'
                }
            }
        });
    }
  }
