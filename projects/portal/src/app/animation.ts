import {
  trigger,
  animate,
  transition,
  query,
  style,
  group,
  animateChild,
} from '@angular/animations';

export const routerAnimation = trigger('routeAnimations', [
  transition('* => *', [
    style({ position: 'relative' }),
    query(
      ':enter, :leave',
      [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
        }),
      ],
      {
        optional: true,
      },
    ),
    query(':enter', [style({ opacity: 0 })], {
      optional: true,
    }),
    query(':leave', animateChild(), {
      optional: true,
    }),
    group([
      query(':leave', [animate('200ms', style({ opacity: 0 }))], {
        optional: true,
      }),
      query(':enter', [animate('200ms 200ms', style({ opacity: 1 }))], {
        optional: true,
      }),
    ]),
    query(':enter', animateChild(), {
      optional: true,
    }),
  ]),
]);
