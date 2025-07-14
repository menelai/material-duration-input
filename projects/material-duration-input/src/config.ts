import {InjectionToken} from '@angular/core';

export const MAT_DURATION_INPUT = new InjectionToken<{title: string, m: number, default?: boolean}[]>(
  'MatDurationConfig',
  {
    providedIn: 'root',
    factory: () => [
      {title: 'ms', m: 1},
      {title: 's', m: 1000},
      {title: 'm', m: 1000 * 60, default: true},
      {title: 'h', m: 1000 * 60 * 60},
    ],
  }
);
