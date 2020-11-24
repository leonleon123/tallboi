import { mat4, vec3 } from 'gl-matrix';
import { Player } from '../Entities/Player';
import { Size } from '../Util/Interfaces';
import { degToRad } from '../Util/Utility';
import { UserInput } from './UserInput';

export class Camera{
    public perspective: mat4;
    public eye: vec3 = vec3.create();
    public center: vec3 = vec3.create();
    public defaultPitch = 45;
    public pitch = this.defaultPitch;

    constructor(
        private size: Size
    ) {
        this.perspective = mat4.create();
        mat4.perspective(this.perspective, degToRad(90), this.size.width / this.size.height , 1, 100);
    }

    public update(dt: number, player: Player, input: UserInput): void {
        if (input.mouseDelta[1] !== 0) {
            this.pitch += (input.mouseDelta[1] * dt * input.sensitivity);

            if (this.pitch < -30) {
                this.pitch = -30;
            }
            else if (this.pitch > 60) {
                this.pitch = 60;
            }
            input.mouseDelta[1] = 0;
        }
        const dist = 3.0;
        const a = Math.sin(degToRad(this.pitch));
        const b = Math.cos(degToRad(this.pitch));
        const c = Math.sin(degToRad(player.trans.angle[1] + 90));
        const d = Math.cos(degToRad(player.trans.angle[1] + 90));

        this.eye = [
            player.trans.pos[0] - dist * c * b,
            Math.max(player.trans.pos[1] + dist * a + 2 * player.trans.scale[1], player.trans.pos[1]) ,
            player.trans.pos[2] - dist * b * d
        ];
        this.center = [
            player.trans.pos[0] + dist * c * b,
            player.trans.pos[1] - dist * a,
            player.trans.pos[2] + dist * b * d
        ];
    }
}
