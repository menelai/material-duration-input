# @kovalenko/material-duration-input

Angular Material component for inputting duration values. Combines a numeric input with a unit selector (ms, s, m, h), stores the value in milliseconds, and integrates seamlessly with Angular's reactive forms and `mat-form-field`.

## Requirements

| Peer dependency | Version |
|---|---|
| `@angular/core` | ≥ 21 |
| `@angular/material` | ≥ 21 |
| `@angular/cdk` | ≥ 21 |
| `@ngx-translate/core` | ≥ 17 |
| `@kovalenko/base-components` | ^ 4 |

## Installation

```bash
npm install @kovalenko/material-duration-input
```

## Basic Usage

Import `DurationComponent` into your standalone component or module:

```ts
import { DurationComponent } from '@kovalenko/material-duration-input';

@Component({
  imports: [DurationComponent],
  template: `
    <mat-form-field>
      <mat-label>Timeout</mat-label>
      <mat-duration [formField]="form" />
    </mat-form-field>
  `,
})
export class MyComponent {
  timeout = signal(60_000); // value in milliseconds
  
  form = form(this.timeout);
}
```

The component emits and accepts values **in milliseconds**. The displayed number and unit are derived automatically — for example, `60000` ms is shown as `1 m`.

## Selector

```
<mat-duration>
```

## Inputs

| Input | Type | Default | Description |
|---|---|---|---|
| `value` | `number` | — | Duration value in milliseconds (also usable via `formControl` / `ngModel`). |
| `min` | `number` | `0` | Minimum allowed numeric value for the number input. |
| `max` | `number` | — | Maximum allowed numeric value for the number input. |
| `intervals` | `Interval[]` | see config | List of available time units. Overrides the global token if provided. |

### `Interval` shape

```ts
{
  title: string;   // Label shown in the unit selector (e.g. 'ms', 's', 'm', 'h')
  m: number;       // Multiplier: 1 unit × m = milliseconds
  default?: boolean; // Mark this unit as the default selection
}
```

## Global Configuration

The default set of units is provided via the `MAT_DURATION_INPUT` injection token. Override it in your application providers to change the available units globally:

```ts
import { MAT_DURATION_INPUT } from '@kovalenko/material-duration-input';

bootstrapApplication(AppComponent, {
  providers: [
    {
      provide: MAT_DURATION_INPUT,
      useValue: [
        { title: 's', m: 1000 },
        { title: 'm', m: 1000 * 60, default: true },
        { title: 'h', m: 1000 * 60 * 60 },
      ],
    },
  ],
});
```

**Built-in defaults:**

| Title | Multiplier | Default |
|---|---|---|
| `ms` | 1 | |
| `s` | 1 000 | |
| `m` | 60 000 | ✓ |
| `h` | 3 600 000 | |

## Unit Localisation

Unit labels (e.g. `ms`, `s`, `m`, `h`) are passed through `ngx-translate`'s `TranslatePipe`, so you can translate them via your translation files:

```json
{
  "ms": "ms",
  "s": "sec",
  "m": "min",
  "h": "hr"
}
```

## How the Value Is Selected

When a value is written programmatically (e.g. `patchValue`), the component picks the **largest unit** that divides the millisecond value evenly. For example:

- `3 600 000` → displayed as `1 h`
- `90 000` → displayed as `1.5 m`… actually `90 s` (first exact match from the largest)
- `NaN` / empty → clears the input and resets to the default unit

## `mat-form-field` Integration

`DurationComponent` implements `MatFormFieldControl<number>`, so it works inside `<mat-form-field>` with labels, hints, error messages, and prefix/suffix slots just like a native Material input.

## Public API

```ts
export { MAT_DURATION_INPUT } from './config';
export { DurationComponent } from './duration/duration.component';
```

## License

MIT
