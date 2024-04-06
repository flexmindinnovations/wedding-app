import {
    style,
    animate,
    animation,
    keyframes
} from "@angular/animations";

// =========================
// Slide Left / Right
// =========================

export const slideLeft = animation([
    style({ opacity: 0, transform: 'translateX(100%)' }),
    animate('{{time}} ease-out', style({ opacity: 1, transform: 'translateX(0%)' }))
])

export const slideRight = animation([
    style({ opacity: 1, transform: 'translateX(0%)' }),
    animate('{{time}} ease-out', style({ opacity: 0, transform: 'translateX(100%)' }))
])

// =========================
// Scale
// =========================
export const scaleIn = animation([
    style({ opacity: 0, transform: "scale(0.5)" }), // start state
    animate(
        "{{time}} cubic-bezier(0.785, 0.135, 0.15, 0.86)",
        style({ opacity: 1, transform: "scale(1)" })
    )
]);

export const scaleOut = animation([
    animate(
        "{{time}} cubic-bezier(0.785, 0.135, 0.15, 0.86)",
        style({ opacity: 0, transform: "scale(0.5)" })
    )
]);

// =========================
// Fade
// =========================
export const fadeIn = animation([
    style({ opacity: 0 }), // start state
    animate('{{time}}', style({ opacity: 1 }))
]);

export const fadeOut = animation([
    animate('{{time}}', style({ opacity: 0 }))
]);