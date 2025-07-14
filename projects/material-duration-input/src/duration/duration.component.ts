import {AfterViewInit, Component, DoCheck, forwardRef, inject, input, signal, ViewChild} from '@angular/core';
import {ValidationErrors, Validator} from '@angular/forms';
import {MatFormFieldControl} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatOption, MatSelect, MatSelectChange} from '@angular/material/select';
import {BaseInputComponent} from '@kovalenko/base-components';
import {TranslatePipe} from '@ngx-translate/core';
import {MAT_DURATION_INPUT} from '../config';

@Component({
  selector: 'mat-duration',
  templateUrl: './duration.component.html',
  styleUrls: ['./duration.component.scss'],
  providers: [
    {
      provide: MatFormFieldControl,
      useExisting: forwardRef(() => DurationComponent),
    },
  ],
  imports: [
    MatInput,
    MatOption,
    MatSelect,
    TranslatePipe,
  ],
})
export class DurationComponent extends BaseInputComponent<number | null | undefined> implements AfterViewInit, DoCheck, Validator {
  @ViewChild(MatSelect, {static: false}) select: MatSelect;

  readonly min = input(0);

  readonly max = input<number>();

  readonly selectShown = signal(false);

  readonly duration = signal<number | undefined>(undefined);

  readonly intervals = inject(MAT_DURATION_INPUT);

  readonly dimension = signal(this.getDefaultInterval());

  private _oldFocused: boolean;

  private _to: any;

  override get focused(): boolean {
    return (document.activeElement === this.input?.nativeElement) || this.select && (this.select.focused || this.select.panelOpen);
  }

  ngAfterViewInit(): void {
    this.ngControl?.control?.setValidators(this.validate.bind(this));
  }

  override ngDoCheck(): void {
    super.ngDoCheck();
    if (this.shouldLabelFloat !== this._oldFocused) {
      this._oldFocused = this.shouldLabelFloat;
      if (this._to) {
        clearTimeout(this._to);
      }
      this._to = setTimeout(() => {
        this.selectShown.set(this._oldFocused);
      });
    }
  }

  override writeValue(value: number | null | undefined): void {
    if (typeof value === 'number') {
      for (let i = this.intervals.length - 1; i >= 0; i--) {
        if (value % this.intervals[i].m === 0) {
          this.duration.set(value / this.intervals[i].m);
          this.dimension.set(this.intervals[i]);
          break;
        }
      }
    } else {
      this.duration.set(undefined);
      this.dimension.set(this.getDefaultInterval());
    }

    this.value = value;
  }

  updateDuration(e: Event): void {
    const v = (e.target as HTMLInputElement).value;

    this.duration.set(v ? Number(v) : undefined);
    this.markControl();
  }

  updateDimension(event: MatSelectChange): void {
    this.dimension.set(event.value);
    this.markControl();
  }

  validate(): ValidationErrors | null {
    let ret = null;
    if (this.value! < this.min()) {
      ret = {min: true};
    } else if (this.max() != null && this.value! > this.max()!) {
      ret = {max: true};
    }

    return ret;
  }

  private markControl(): void {
    this.value = this.duration()! * this.dimension().m;
    this.onTouched();
    this.ngControl!.control?.markAsDirty();
    this.stateChanges.next();
  }

  private getDefaultInterval(): any {
    return this.intervals.find(i => i.default) ?? this.intervals[0];
  }
}
