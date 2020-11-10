import { mat4, vec3 } from "gl-matrix";
import { Player } from "./Entities/Player";
import { Utility } from "./Utility";

export class Camera{
    public perspective: mat4;
    public eye: vec3 = vec3.create();
    public center: vec3 = vec3.create();

    constructor() {
        //const canvas =  document.querySelector('canvas');
        this.perspective = mat4.create();
        mat4.perspective(this.perspective, Utility.degToRad(90), 1, 1, 100);
    }

    update(dt:number, player:Player):void {
        this.eye = [player.trans.pos[0],player.trans.pos[1]+4,player.trans.pos[2]-5];
        this.center = [player.trans.pos[0],player.trans.pos[1],player.trans.pos[2]];
    }
}