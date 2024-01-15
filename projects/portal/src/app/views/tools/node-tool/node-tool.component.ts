import { Config } from '../../../models/config.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'view-node-tool',
  templateUrl: './node-tool.component.html',
  styleUrls: ['./node-tool.component.css'],
})
export class NodeToolComponent implements OnInit {
  @Input()
  configs?: Config[];
  @Input()
  selectedConfig?: Config | null;
  @Output()
  appChangeConfig: EventEmitter<string>;

  constructor() {
    this.appChangeConfig = new EventEmitter();
  }

  ngOnInit(): void {}

  onChangeConfig(selectedConfig: string): void {
    this.appChangeConfig.emit(selectedConfig);
  }
}
