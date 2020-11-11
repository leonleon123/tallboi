import { mat4, vec3 } from "gl-matrix";
import { Player } from "./Entities/Player";
import { UserInput } from "./UserInput";
import { Utility } from "./Utility";

export class Camera{
    public perspective: mat4;
    public eye: vec3 = vec3.create();
    public center: vec3 = vec3.create();
    public pitch:number = 45;

    constructor() {
        //const canvas =  document.querySelector('canvas');
        this.perspective = mat4.create();
        mat4.perspective(this.perspective, Utility.degToRad(90), 1, 1, 100); //Aspect ratio must not be hardcoded. Get width/height from canvas.
    }

    update(dt:number, player:Player, input:UserInput):void {
        let playerLookAt: vec3 = vec3.create();
        let eyeOffset: vec3 = vec3.create();
        if(input.mouseDelta[1] != 0)
        {
            this.pitch += (input.mouseDelta[1]*dt*input.sensitivity);

            if(this.pitch < -30)
                this.pitch = -30;
            else if(this.pitch > 60)
                this.pitch = 60;

            input.mouseDelta[1] = 0;
        }
        var dist = 4.0;
        var a = Math.sin(Utility.degToRad(this.pitch));
        var b = Math.cos(Utility.degToRad(this.pitch));
        var c = Math.sin(Utility.degToRad(player.trans.angle[1]+90));
        var d = Math.cos(Utility.degToRad(player.trans.angle[1]+90));
        /*
        playerLookAt = [player.trans.yawVector[0]*3,0,player.trans.yawVector[2]*3];
        eyeOffset = [player.trans.yawVector[0]*3,0,player.trans.yawVector[2]*3];
        this.eye = [player.trans.pos[0]-eyeOffset[0],player.trans.pos[1]+3+3*Math.sin(Utility.degToRad(this.pitch)),player.trans.pos[2]-eyeOffset[2]];
        this.center = [player.trans.pos[0]+playerLookAt[0],player.trans.pos[1]-3*Math.sin(Utility.degToRad(this.pitch)),player.trans.pos[2]+playerLookAt[2]];
        */
        this.eye = [player.trans.pos[0]-dist*c*b,Math.max(player.trans.pos[1]+dist*a+1,0),player.trans.pos[2]-dist*b*d];
        this.center = [player.trans.pos[0]+dist*c*b,player.trans.pos[1]-dist*a,player.trans.pos[2]+dist*b*d];
    }
}