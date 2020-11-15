import { vec3 } from 'gl-matrix';
import { Mesh } from 'webgl-obj-loader';
import { UserInput } from '../Scene/UserInput';
import { degToRad } from '../Util/Utility';
import { Entity } from './Entity';
import { Pickup } from './Pickup';

export class Player extends Entity {
    // placeholder
    private speed = 5.0;

    // todo: figure out what else
    constructor(id: number, origin: vec3, mesh: Mesh, private userInput: UserInput) {
        super(id, origin);
        this.name = 'player';
        this.origin = origin;
        this.mesh = mesh;
        this.color = [0.86, 0.078, 0.23, 1];
        // this.trans.scale = [0.5, 0.5, 0.5];
    }

    public update(dt: number): void {
        const moveDelta = vec3.create();
        if (this.userInput.keysPressed.has('KeyW')) {
            moveDelta[0] += this.trans.yawVector[0];
            moveDelta[2] += this.trans.yawVector[2];
        } else if (this.userInput.keysPressed.has('KeyS')) {
            moveDelta[0] -= this.trans.yawVector[0];
            moveDelta[2] -= this.trans.yawVector[2];
        }

        if (this.userInput.keysPressed.has('KeyA')) {
            let strafeLeft = vec3.create();
            strafeLeft = [Math.cos(degToRad(this.trans.angle[1] + 90)), 0, Math.sin(degToRad(this.trans.angle[1] + 90))];
            moveDelta[0] += strafeLeft[0];
            moveDelta[2] -= strafeLeft[2];
        } else if (this.userInput.keysPressed.has('KeyD')) {
            let strafeRight = vec3.create();
            strafeRight = [Math.cos(degToRad(this.trans.angle[1] - 90)), 0, Math.sin(degToRad(this.trans.angle[1] - 90))];
            moveDelta[0] += strafeRight[0];
            moveDelta[2] -= strafeRight[2];
        }

        if (this.userInput.mouseDelta[0] !== 0) {
            this.setYaw(this.trans.angle[1] - this.userInput.mouseDelta[0] * dt * this.userInput.sensitivity);
            this.userInput.mouseDelta[0] = 0;
        }

        vec3.normalize(moveDelta, moveDelta);
        vec3.scale(moveDelta, moveDelta, this.speed);
        vec3.scale(moveDelta, moveDelta, dt);
        vec3.add(this.trans.pos, moveDelta, this.trans.pos);

    }

    public onPickup(pickup: Pickup): void {
        // TODO: pickup code
        pickup.draw = false;
        pickup.active = false;
    }
}
