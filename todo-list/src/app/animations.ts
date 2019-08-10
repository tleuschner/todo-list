import { trigger, transition, style, query, animate, animateChild, group } from '@angular/animations';

// export const slideInAnimation =
//     trigger('routeAnimations', [
//         transition('ListPage <=> TaskPage', [
//             style({ position: 'relative' }),
//             query(':enter, :leave', [
//                 style({
//                     position: 'absolute',
//                     top: 0,
//                     left: 0,
//                     width: '100%'
//                 }),
//                 query(':enter', [
//                     style({ left: '-100%' }),
//                     animate('350ms ease-in-out')
//                 ]),
//                 query(':enter', [
//                     style({ left: '0%' }),
//                     animate('350ms ease-in-out')
//                 ]),
//             ]),
//         ])
//     ]);

export const slideInAnimation =
    trigger('routeAnimations', [
        transition('ListPage <=> TaskPage', [
            style({ position: 'relative' }),
            query(':enter, :leave', [
                style({
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%'
                })
            ], { optional: true }),
            query(':enter', [
                style({ left: '-100%' })
            ]),
            query(':leave', animateChild(), { optional: true }),
            group([
                query(':leave', [
                    animate('400ms ease-out', style({ left: '100%' }))
                ], { optional: true }),
                query(':enter', [
                    animate('400ms ease-out', style({ left: '0%' }))
                ])
            ]),
            query(':enter', animateChild()),
        ])
    ]);