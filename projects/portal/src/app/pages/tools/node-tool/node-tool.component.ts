import { ConfigService } from '../../../models/config.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-node-tool',
  templateUrl: './node-tool.component.html',
  styleUrls: ['./node-tool.component.css'],
})
export class NodeToolComponent implements OnInit {
  configs?: string[];
  selectedConfig$: Observable<string | undefined>;

  constructor(private readonly configS: ConfigService) {
    const config$ = this.configS.config$;
    this.configs = this.configS.configs.map((config) => config.id);
    this.selectedConfig$ = config$.pipe(map((config) => config?.id));
  }

  ngOnInit(): void {}

  onChangeConfig(value: string) {
    this.configS.setCurrentConfig(value);
  }
}
