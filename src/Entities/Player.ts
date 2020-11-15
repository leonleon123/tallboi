import { Body, Box, Vec3 } from 'cannon';
import { vec3 } from 'gl-matrix';
import { Mesh } from 'webgl-obj-loader';
import { UserInput } from '../Scene/UserInput';
import { degToRad } from '../Util/Utility';
import { Entity } from './Entity';
import { Pickup } from './Pickup';

export class Player extends Entity {
    // placeholder
    private speed = 5.0;
    private height = 1;
    private originalHeight: number;
    // todo: figure out what else

    public body: Body;

    constructor(
        id: number, origin: vec3, mesh: Mesh, collisionBody: Body,
        private userInput: UserInput,
    ) {
        super(id, origin);
        this.name = 'player';
        this.origin = origin;
        this.mesh = mesh;
        this.color = [0.86, 0.078, 0.23, 1];
        this.body = collisionBody;
        this.body.angularDamping = 1;
        const {x, y, z} = (this.body.shapes[0] as any).halfExtents;
        this.originalHeight = y;
        this.body.position.set(0, 1, 0);
    }

    public update(dt: number): void {
        this.body.velocity.set(0, 0, 0);

        if (this.userInput.keysPressed.has('KeyW')) {
            this.body.velocity.vadd(new Vec3(this.trans.yawVector[0], 0, this.trans.yawVector[2]), this.body.velocity);
        }

        if (this.userInput.keysPressed.has('KeyS')) {
            this.body.velocity.vadd(new Vec3(-this.trans.yawVector[0], 0, -this.trans.yawVector[2]), this.body.velocity);
        }

        if (this.userInput.keysPressed.has('KeyA')) {
            const strafeLeft =  new Vec3(Math.cos(degToRad(this.trans.angle[1] + 90)), 0, -Math.sin(degToRad(this.trans.angle[1] + 90)));
            this.body.velocity.vadd(strafeLeft, this.body.velocity);
        }

        if (this.userInput.keysPressed.has('KeyD')) {
            const strafeRight = new Vec3(Math.cos(degToRad(this.trans.angle[1] - 90)), 0, -Math.sin(degToRad(this.trans.angle[1] - 90)));
            this.body.velocity.vadd(strafeRight, this.body.velocity);
        }

        this.body.velocity.normalize();
        this.body.velocity.scale(this.speed, this.body.velocity);

        if (this.userInput.mouseDelta[0] !== 0) {
            this.setYaw(this.trans.angle[1] - this.userInput.mouseDelta[0] * dt * this.userInput.sensitivity);
            this.userInput.mouseDelta[0] = 0;
        }
        this.trans.pos = [this.body.position.x, this.body.position.y, this.body.position.z];
    }

    public onPickup(pickup: Pickup): void {
        // TODO: pickup code
        const {x, y, z} = (this.body.shapes[0] as any).halfExtents;
        const scaleRatio = (y  + 0.5) / this.originalHeight;
        this.body.shapes = [];
        this.height++;
        this.body.addShape(new Box(new Vec3(x, y + 0.5, z)));
        this.trans.scale = [1, scaleRatio, 1];
        pickup.draw = false;
        pickup.active = false;
    }
}
