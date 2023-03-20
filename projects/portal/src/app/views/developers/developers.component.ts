import { Config } from '../../models/config.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'view-developers',
  templateUrl: './developers.component.html',
  styleUrls: ['./developers.component.css'],
})
export class DevelopersComponent implements OnInit {
  @Input()
  config?: Config | null;
  @Input()
  version?: string | null;

  @Output()
  rebuild = new EventEmitter<Config>();
  @Output()
  restart = new EventEmitter<Config>();

  constructor() {}

  ngOnInit(): void {}

  onRebuild() {
    if (!this.config) {
      alert('Invalid Config');
      return;
    }
    this.rebuild.emit(this.config);
  }

  onRestart() {
    if (!this.config) {
      alert('Invalid Config');
      return;
    }
    this.restart.emit(this.config);
  }
}
