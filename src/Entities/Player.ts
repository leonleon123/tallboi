import { Body, Box, Vec3 } from 'cannon';
import { vec3 } from 'gl-matrix';
import { Mesh } from 'webgl-obj-loader';
import { UserInput } from '../Scene/UserInput';
import { degToRad } from '../Util/Utility';
import { Entity } from './Entity';
import { Pickup } from './Pickup';

export class Player extends Entity {
    private speed = 7.0; // maybe start faster and lose speed when larger?
    public height = 0;
    private originalHeight: number;
    private originalYaw: number;
    public drawLoc = false;
    public exited = false;

    public body: Body;

    constructor(
        id: number, origin: vec3, mesh: Mesh, collisionBody: Body,
        private userInput: UserInput,
    ) {
        super(id, origin);
        this.name = 'player';
        this.origin = origin;
        this.origin[1] += 0.01;
        this.mesh = mesh;
        // this.color = [0.86, 0.078, 0.23, 1];
        this.body = collisionBody;
        this.body.angularDamping = 1;
        this.originalHeight = (this.body.shapes[0] as any).halfExtents.y;
        this.originalYaw = this.trans.angle[1];
        this.body.position.set(this.origin[0], this.origin[1], this.origin[2]);
    }

    public update(dt: number): void {
        this.body.velocity.set(0, 0, 0);

        if (this.userInput.isPressed('KeyW')) {
            this.body.velocity.vadd(new Vec3(this.trans.yawVector[0], 0, this.trans.yawVector[2]), this.body.velocity);
        }
        else if (this.userInput.isPressed('KeyS')) {
            this.body.velocity.vadd(new Vec3(-this.trans.yawVector[0], 0, -this.trans.yawVector[2]), this.body.velocity);
        }

        if (this.userInput.isPressed('KeyA')) {
            const strafeLeft =  new Vec3(Math.cos(degToRad(this.trans.angle[1] + 90)), 0, -Math.sin(degToRad(this.trans.angle[1] + 90)));
            this.body.velocity.vadd(strafeLeft, this.body.velocity);
        }
        else if (this.userInput.isPressed('KeyD')) {
            const strafeRight = new Vec3(Math.cos(degToRad(this.trans.angle[1] - 90)), 0, -Math.sin(degToRad(this.trans.angle[1] - 90)));
            this.body.velocity.vadd(strafeRight, this.body.velocity);
        }

        this.body.velocity.normalize();
        this.body.velocity.scale(this.speed, this.body.velocity);

        if (this.userInput.mouseDelta[0] !== 0) {
            this.setYaw(this.trans.angle[1] - this.userInput.mouseDelta[0] * dt * this.userInput.sensitivity);
            this.userInput.mouseDelta[0] = 0;
        }

        if (this.userInput.onPress('KeyN')){
            this.drawLoc = !this.drawLoc;
        }

        this.setPosition(this.body.position.x, this.body.position.y, this.body.position.z);
    }

    public reset(): void {
        this.resetHeight();
        this.setYaw(this.originalYaw);
        this.body.position.set(this.origin[0], this.origin[1], this.origin[2]);
    }

    private resetHeight(): void {
        const {x, y, z} = (this.body.shapes[0] as any).halfExtents;
        this.body.shapes = [];
        this.body.addShape(new Box(new Vec3(x, this.originalHeight, z)));
        this.trans.scale = [1, 1, 1];
        this.height = 0;
    }

    public onPickup(pickup: Pickup): void {
        /*
        these are scaling factors for current setup, comes in handy when designing maps
        1.3418913273575974
        1.6837826547151948
        2.0256739820727923
        2.3675653094303897
        */
        const {x, y, z} = (this.body.shapes[0] as any).halfExtents;
        this.body.shapes = [];
        this.height++;
        this.body.addShape(new Box(new Vec3(x, y + 0.5, z)));
        this.trans.scale = [1, (y  + 0.5) / this.originalHeight, 1];
        pickup.draw = false;
        pickup.active = false;
    }
}
