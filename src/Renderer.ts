import { mat4, vec3 } from 'gl-matrix';
import { Entity } from './Entities/Entity';
import { Shader } from './Interfaces';
import { Scene } from './Scene';
import { simpleShader } from './Shaders';

export class Renderer{

    private program: WebGLProgram;
    private uMVP: WebGLUniformLocation;

    constructor(
        private gl: WebGL2RenderingContext
    ) { }

    public initScene(scene: Scene): void{
        this.buildProgram(simpleShader);
        this.uMVP = this.gl.getUniformLocation(this.program, 'uMVP')!;
        for (const entity of scene.entManager.entities){
            this.initEntity(entity);
        }
    }

    public renderScene(scene: Scene): void{
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.gl.clearColor(240 / 256, 198 / 256, 120 / 256, 1);

        this.gl.useProgram(this.program);

        for (const entity of scene.entManager.entities){
            if (entity.active){
                this.renderEntity(entity);
            }
        }
    }

    public initEntity(entity: Entity): void{
        const vao = this.gl.createVertexArray();
        this.gl.bindVertexArray(vao);

        const vertexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(entity.mesh?.vertices!), this.gl.STATIC_DRAW);

        const indexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(entity.mesh?.indices!), this.gl.STATIC_DRAW);

        this.gl.enableVertexAttribArray(0);
        this.gl.vertexAttribPointer(0, 3, this.gl.FLOAT, false, 0, 0 );

        entity.vao = vao!;

    }

    public renderEntity(entity: Entity): void{
        this.gl.bindVertexArray(entity.vao);
        this.gl.uniformMatrix4fv(this.uMVP, false, this.getMVP());
        this.gl.drawElements(this.gl.LINE_LOOP, entity.mesh?.indices.length!, this.gl.UNSIGNED_SHORT, 0);
    }

    private buildProgram(shader: Shader): void{
        this.program = this.gl.createProgram()!;
        const vertex = this.createShader(this.gl.VERTEX_SHADER, shader.vertex);
        const fragment = this.createShader(this.gl.FRAGMENT_SHADER, shader.fragment);
        this.gl.attachShader(this.program, vertex);
        this.gl.attachShader(this.program, fragment);
        this.gl.linkProgram(this.program);
    }

    private createShader(type: number, source: string): WebGLShader{
        const shader = this.gl.createShader(type)!;
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);
        return shader;
    }

    private getMVP(): mat4{
        const M: mat4 = mat4.create();
        // mat4.translate(M , M, pos);
        mat4.rotateY(M, M, Math.PI / 3);
        mat4.scale(M, M, vec3.fromValues(0.3, 0.3, 0.3));

        const P: mat4 = mat4.create();
        mat4.perspective(P, Math.PI / 3, 1, 0.1, 100);
        mat4.rotateX(P, P, Math.PI / 12);
        mat4.translate(P, P, vec3.fromValues(0, -3, -7));

        const MVP: mat4 = mat4.create();
        mat4.mul(MVP, M, MVP);
        mat4.mul(MVP, P, MVP);

        return MVP;
    }
}
