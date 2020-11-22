import { vec3 } from 'gl-matrix';
import { Player } from '../Entities/Player';

export class Light{

    constructor(
        public position: vec3,
        public ambient: number,
        public diffuse: number,
        public specular: number,
        public shininess: number,
        public color: vec3,
        public attenuation: vec3
    ){ }

    public update(player: Player): void {
            this.position[0] = player.trans.pos[0];
            this.position[1] = player.trans.pos[1] + 10;
            this.position[2] = player.trans.pos[2];
    }
}
