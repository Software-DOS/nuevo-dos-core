import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-gauge-progreso',
  templateUrl: './gauge-progreso.component.html',
  styleUrls: ['./gauge-progreso.component.scss']
})
export class GaugeProgresoComponent implements OnChanges {
  @Input() porcentaje = 0;

  dashOffset = 0;

  ngOnChanges(): void {
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    this.dashOffset = circumference * (1 - this.porcentaje / 100);
  }
}
