import { Mesh } from 'webgl-obj-loader';
import { PlayerState } from '../Util/Enums';
import { Entity } from './Entity';
import { Player } from './Player';

export class Arm extends Entity {

    private x = 0;

    constructor(mesh: Mesh, private period: number, private player: Player){
        super(0, [0, 0, 0]);
        this.mesh = mesh;
    }

    update(dt: number): void{
        if (this.player.state === PlayerState.WALKING){
            this.setPitch(this.trans.angle[2] + Math.sin(this.x + this.period - Math.PI / 2) * 2);
            this.x = this.x + 0.05;
        }else{
            this.setPitch(0);
            this.x = 0;
        }
    }
}
