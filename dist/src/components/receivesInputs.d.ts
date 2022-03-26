/**
 *
 * Input processing component - gets (key) input state and
 * applies it to receiving entities by updating their movement
 * component state (heading, movespeed, jumping, etc.)
 *
 */
export default function _default(noa: any): {
    name: string;
    order: number;
    state: {
        joystickHeading: any;
        isTouchscreen: boolean;
        canRunCombinator: any;
        _moving: boolean;
        _running: boolean;
    };
    onAdd: (eid: any, state: any) => void;
    onRemove: any;
    renderSystem: (dt: any, states: any) => void;
};
