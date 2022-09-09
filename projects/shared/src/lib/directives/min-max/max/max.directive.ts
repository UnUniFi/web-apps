import { Directive, Input } from '@angular/core';
import {
  NG_VALIDATORS,
  Validator,
  AbstractControl,
  Validators,
} from '@angular/forms';

@Directive({
  selector: '[max]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: MaxDirective, multi: true },
  ],
})
export class MaxDirective implements Validator {
  @Input() max: number;
  constructor() {
    this.max = 0;
  }

  validate(control: AbstractControl): { [key: string]: any } | null {
    return Validators.max(this.max)(control);
  }
}
