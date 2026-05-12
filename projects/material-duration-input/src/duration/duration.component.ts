import {
  Component,
  computed,
  DoCheck,
  ElementRef,
  forwardRef,
  inject,
  Input,
  input,
  signal,
  viewChild,
} from '@angular/core';
import {MatFormFieldControl} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatOption, MatSelect, MatSelectChange} from '@angular/material/select';
import {TranslatePipe} from '@ngx-translate/core';

import {MAT_DURATION_INPUT} from '../config';
import {BaseSignalInput} from '@kovalenko/base-components';

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
export class DurationComponent extends BaseSignalInput<number> implements DoCheck {
  readonly select = viewChild(MatSelect);

  override readonly val = signal<number>(NaN);

  readonly input = viewChild.required<ElementRef<HTMLInputElement>>('matinput');

  readonly min = input(0);

  readonly max = input<number>();

  readonly duration = signal<number>(NaN);

  readonly intervals = input(inject(MAT_DURATION_INPUT));

  readonly defaultInterval = computed(() => this.intervals().find(i => i.default) ?? this.intervals().at(0)!);

  readonly dimension = signal(this.defaultInterval());

  readonly selectShown = signal(false, {equal: (a, b) => a === b});

  #updatedManually = false;

  @Input()
  override set value(v: number) {
    this.val.set(v);
    this.stateChanges.next();
  }

  override get value(): number {
    return this.val();
  }

  override get focused(): boolean {
    return !!(document.activeElement && document.activeElement === this.input().nativeElement
      || this.select()?.panelOpen);
  }

  override ngDoCheck(): void {
    super.ngDoCheck();
    this.selectShown.set(this.shouldLabelFloat);
  }

  override writeValue(value: number): void {
    const intervals = this.intervals();

    if (!this.#updatedManually) {
      if (!isNaN(value)) {
        for (let i = intervals.length - 1; i >= 0; i--) {
          if (value % intervals[i].m === 0) {
            this.duration.set(value / intervals[i].m);
            this.dimension.set(intervals[i]);
            break;
          }
        }
      } else {
        this.duration.set(NaN);
        this.dimension.set(this.defaultInterval());
      }
    }

    this.#updatedManually = false;

    this.value = value;
  }

  updateDuration(e: Event): void {
    const v = (e.target as HTMLInputElement).value;

    this.duration.set(v ? Number(v) : NaN);
    this.markControl();
  }

  updateDimension(event: MatSelectChange): void {
    this.dimension.set(event.value);
    this.markControl();
  }

  private markControl(): void {
    this.#updatedManually = true;
    this.value = this.duration() * this.dimension().m;
    this.onTouched();
    this.onChange(this.value);
    this.stateChanges.next();
  }
}
