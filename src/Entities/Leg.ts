import { Mesh } from 'webgl-obj-loader';
import { PlayerState } from '../Util/Enums';
import { Entity } from './Entity';
import { Player } from './Player';

export class Leg extends Entity {

    private period: number;
    private speed = 175;

    constructor(mesh: Mesh, period: number, private player: Player){
        super(0, [0, 0, 0]);
        this.name = 'leg';
        this.mesh = mesh;
        if (period % 2 === 0){
            this.period = 1;
        }
        else{
            this.period = -1;
        }
    }

    public update(dt: number): void{
        if (this.player.state === PlayerState.WALKING){
            if (this.trans.angle[2] > 45){
                this.period = -1;
            }
            else if (this.trans.angle[2] < -45){
                this.period = 1;
            }
            this.setPitch(this.trans.angle[2] + dt * this.speed * this.period);
        }else{
            this.setPitch(0);
        }
    }
}
