import { mat4 } from 'gl-matrix';
import { Entity } from '../Entities/Entity';
import { Camera } from '../Scene/Camera';
import { Level } from '../Scene/Level';
import { Scene } from '../Scene/Scene';
import { MaterialRenderInfo, Shader } from '../Util/Interfaces';
import { degToRad } from '../Util/Utility';
import { simpleShader } from './Shaders';

export class Renderer{

    private program: WebGLProgram;
    private uModelView: WebGLUniformLocation;
    private uProjection: WebGLUniformLocation;
    private uDiffuse: WebGLUniformLocation;
    private uAmbient: WebGLUniformLocation;
    private uSpecular: WebGLUniformLocation;
    private uShininess: WebGLUniformLocation;
    private uLightPosition: WebGLUniformLocation;
    private uLightColor: WebGLUniformLocation;
    private uLightAttenuation: WebGLUniformLocation;
    private uTexture: WebGLUniformLocation;
    private uTexScale: WebGLUniformLocation;
    private uTexOffset: WebGLUniformLocation;

    constructor(
        private gl: WebGL2RenderingContext
    ) { }

    public initScene(scene: Scene): void{
        this.buildProgram(simpleShader);
        this.initLevel(scene.entManager.level);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);

        this.uModelView = this.gl.getUniformLocation(this.program, 'uModelView')!;
        this.uProjection = this.gl.getUniformLocation(this.program, 'uProjection')!;

        this.uDiffuse = this.gl.getUniformLocation(this.program, 'uDiffuse')!;
        this.uAmbient = this.gl.getUniformLocation(this.program, 'uAmbient')!;
        this.uSpecular = this.gl.getUniformLocation(this.program, 'uSpecular')!;

        this.uShininess = this.gl.getUniformLocation(this.program, 'uShininess')!;
        this.uLightPosition = this.gl.getUniformLocation(this.program, 'uLightPosition')!;
        this.uLightColor = this.gl.getUniformLocation(this.program, 'uLightColor')!;
        this.uLightAttenuation = this.gl.getUniformLocation(this.program, 'uLightAttenuation')!;
        this.uTexture = this.gl.getUniformLocation(this.program, 'uTexture')!;
        this.uTexScale = this.gl.getUniformLocation(this.program, 'uTexScale')!;
        this.uTexOffset = this.gl.getUniformLocation(this.program, 'uTexOffset')!;
    }

    public renderScene(scene: Scene): void{
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.gl.clearColor(240 / 256, 198 / 256, 120 / 256, 1);
        // I added this because i saw it somewhere. Do we need it? Also we need to get rid of hardcoding 600 600.
        // this.gl.viewport(0, 0, 600, 600);

        this.gl.useProgram(this.program);

        this.gl.uniform1f(this.uDiffuse, scene.light.diffuse);
        this.gl.uniform1f(this.uAmbient, scene.light.ambient);
        this.gl.uniform1f(this.uSpecular, scene.light.specular);
        this.gl.uniform1f(this.uShininess, scene.light.shininess);

        this.gl.uniform3fv(this.uLightPosition, scene.light.position);
        this.gl.uniform3fv(this.uLightColor, scene.light.color);
        this.gl.uniform3fv(this.uLightAttenuation, scene.light.attenuation);

        this.renderLevel(scene.entManager.level, scene.camera);

        for (const entity of scene.entManager.entities){
            if (!entity.initialized) {
                this.initEntity(entity);
            }
            if (entity.draw) {
                this.renderEntity(entity, scene.camera);
            }
        }
    }

    public initEntity(entity: Entity): void{
        for (let i = 0; i < entity.mesh?.materialNames.length!; i++){

            const vao = this.gl.createVertexArray();

            this.gl.bindVertexArray(vao);

            const vertexBuffer = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(entity.mesh?.vertices!), this.gl.STATIC_DRAW);

            const indexBuffer = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

            const materialIndices = entity.mesh?.indicesPerMaterial[i]!;
            this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(materialIndices), this.gl.STATIC_DRAW);

            this.gl.enableVertexAttribArray(0);
            this.gl.vertexAttribPointer(0, 3, this.gl.FLOAT, false, 0, 0 );

            const n = entity.mesh?.vertices.length! / 3;
            const colors = Array(n).fill(0).map(e => entity.color as Array<number>).reduce((a, b) => [...a, ...b]);
            const colorBuffer = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, colorBuffer);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(colors), this.gl.STATIC_DRAW);

            this.gl.enableVertexAttribArray(1);
            this.gl.vertexAttribPointer(1, 4, this.gl.FLOAT, false, 0, 0 );

            const normalBuffer = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, normalBuffer);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(entity.mesh?.vertexNormals!), this.gl.STATIC_DRAW);

            this.gl.enableVertexAttribArray(2);
            this.gl.vertexAttribPointer(2, 3, this.gl.FLOAT, false, 0, 0);

            const textureCoordBuffer = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, textureCoordBuffer);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(entity.mesh?.textures!), this.gl.STATIC_DRAW);

            this.gl.enableVertexAttribArray(3);
            this.gl.vertexAttribPointer(3, 2, this.gl.FLOAT, false, 0, 0);

            const texture = this.gl.createTexture()!;
            this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
            this.gl.texImage2D(
                this.gl.TEXTURE_2D, 0, this.gl.RGBA, 1, 1, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, new Uint8Array([255, 0, 0, 255])
            );
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);

            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);

            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.REPEAT);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.REPEAT);
            const image = new Image();
            image.addEventListener('load', () => {
                this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
                this.gl.texImage2D(
                    this.gl.TEXTURE_2D,
                    0,
                    this.gl.RGBA,
                    this.gl.RGBA,
                    this.gl.UNSIGNED_BYTE,
                    image
                );
            });
            image.src = `assets/textures/${entity.mesh?.materialsByIndex[i].mapDiffuse.filename}`;

            const materialRenderInfo: MaterialRenderInfo = {
                vao: vao!,
                texture,
                materialIndices,
                material: entity.mesh?.materialsByIndex[i]!
            };
            entity.materialRenderInfos.push(materialRenderInfo);
        }

        entity.initialized = true;
    }

    public renderEntity(entity: Entity, camera: Camera): void{
        for (const materialInfo of entity.materialRenderInfos){
            this.gl.bindVertexArray(materialInfo.vao);

            this.gl.uniformMatrix4fv(this.uModelView, false, this.getModelView(entity));
            this.gl.uniformMatrix4fv(this.uProjection, false, this.getProjection(camera));
            const texScale = [materialInfo.material.mapDiffuse.scale.u, materialInfo.material.mapDiffuse.scale.v];
            const texOffset = [materialInfo.material.mapDiffuse.offset.u, materialInfo.material.mapDiffuse.offset.v];
            this.gl.uniform2fv(this.uTexScale, texScale);
            this.gl.uniform2fv(this.uTexOffset, texOffset);

            this.gl.activeTexture(this.gl.TEXTURE0);
            this.gl.bindTexture(this.gl.TEXTURE_2D, materialInfo.texture);
            this.gl.uniform1i(this.uTexture, 0);

            this.gl.drawElements(this.gl.TRIANGLES, materialInfo.materialIndices.length, this.gl.UNSIGNED_SHORT, 0);
        }
    }

    private initLevel(level: Level): void{
        this.initEntity(level);
    }

    private renderLevel(level: Level, camera: Camera): void{
        this.renderEntity(level, camera);
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

    private getProjection(camera: Camera): mat4{
        // camera
        const P: mat4 = mat4.create();
        mat4.multiply(P, P, camera.perspective);
        const C: mat4 = mat4.create();
        mat4.lookAt(C, camera.eye, camera.center, [0, 1, 0]);
        mat4.multiply(P, P, C);
        return P;
    }

    private getModelView(entity: Entity): mat4{
        // entity
        const M: mat4 = mat4.create();
        mat4.translate(M , M, entity.trans.pos);
        mat4.rotateX(M, M, degToRad(entity.trans.angle[0]));
        mat4.rotateY(M, M, degToRad(entity.trans.angle[1]));
        mat4.rotateZ(M, M, degToRad(entity.trans.angle[2]));
        mat4.scale(M, M, entity.trans.scale);

        return M;
    }
}
