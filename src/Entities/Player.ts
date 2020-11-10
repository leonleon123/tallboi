import { vec3 } from 'gl-matrix';
import { Mesh } from 'webgl-obj-loader';
import { UserInput } from '../UserInput';
import { Entity } from './Entity';

export class Player extends Entity {
    // placeholder
    private speed = 2.0;

    // todo: figure out what else
    constructor(id: number, origin: vec3, mesh: Mesh) {
        
        super(id, origin);
        this.name = 'player';
        this.origin = origin;
        this.mesh = mesh;
    }

    public update(dt: number, input: UserInput): void {
        if(input.keysPressed.has("KeyW"))
        {
            this.trans.pos[0] += this.trans.yawVector[0] * this.speed * dt;
            this.trans.pos[2] += this.trans.yawVector[2] * this.speed * dt;
        }
        if(input.keysPressed.has("KeyS"))
        {
            this.trans.pos[2] -= this.speed * dt;
        }
        if(input.keysPressed.has("KeyA"))
        {
            this.trans.pos[0] += this.speed * dt;
        }
        if(input.keysPressed.has("KeyD"))
        {
            this.trans.pos[0] -= this.speed * dt;
        }

        if(input.keysPressed.has("Digit1"))
        {
            this.setRoll(this.trans.angle[0]+0.5);
        }
        if(input.keysPressed.has("Digit2"))
        {
            this.setYaw(this.trans.angle[1]+0.5);
        }
        if(input.keysPressed.has("Digit3"))
        {
            this.setPitch(this.trans.angle[2]+0.5);
        }

        if(input.keysPressed.has("Digit5"))
        {
            this.setYaw(90);
        }
        if(input.keysPressed.has("Digit6"))
        {
            this.setYaw(180);
        }
        if(input.keysPressed.has("Digit7"))
        {
            this.setYaw(270);
        }
        if(input.keysPressed.has("Digit4"))
        {
            this.setYaw(0);
        }
    }
}
