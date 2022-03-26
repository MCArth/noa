/**
 *
 * State object of the `movement` component
 *
*/
export function MovementSettings(): void;
export class MovementSettings {
    maxSpeed: number;
    moveForce: number;
    responsiveness: number;
    movingFriction: number;
    standingFriction: number;
    airMoveMult: number;
    jumpForce: number;
    jumpTime: number;
    _jumpCount: number;
    _currjumptime: number;
    _isJumping: boolean;
}
/**
 * Movement component. State stores settings like jump height, etc.,
 * as well as current state (running, jumping, heading angle).
 * Processor checks state and applies movement/friction/jump forces
 * to the entity's physics body.
 * @param {import('..').Engine} noa
*/
export default function _default(noa: import('..').Engine): {
    name: string;
    order: number;
    state: MovementSettings;
    onAdd: any;
    onRemove: any;
    system: (dt: any, states: any) => void;
};
