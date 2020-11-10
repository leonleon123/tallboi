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
        mat4.perspective(this.perspective, Utility.degToRad(90), 1, 1, 100); //Aspect ratio must not be hardcoded. Get width/height from canvas.
    }

    update(dt:number, player:Player):void {
        let playerLookAt: vec3 = vec3.create();
        let eyeOffset: vec3 = vec3.create();
        //console.log(vec3.length(player.trans.yawVector));
        playerLookAt = [player.trans.yawVector[0]*2,player.trans.yawVector[1]*2,player.trans.yawVector[2]*2];
        eyeOffset = [player.trans.yawVector[0]*4,player.trans.yawVector[1]*4,player.trans.yawVector[2]*4];
        //console.log(vec3.length(playerLookAt));
        this.eye = [player.trans.pos[0]-eyeOffset[0],player.trans.pos[1]+4-eyeOffset[1],player.trans.pos[2]-eyeOffset[2]];
        this.center = [player.trans.pos[0]+playerLookAt[0],player.trans.pos[1]+playerLookAt[1],player.trans.pos[2]+playerLookAt[2]];
    }
}