import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent {
  @Input() tabs: string[] = [];
  @Input() activeTab: string = '';
  @Output() tabSelected = new EventEmitter<string>();

  seleccionar(tab: string) {
    this.tabSelected.emit(tab);
  }
}
