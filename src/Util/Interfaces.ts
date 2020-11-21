import { vec3 } from 'gl-matrix';
import { Material } from 'webgl-obj-loader';

export interface Shader{
    vertex: string;
    fragment: string;
}

export interface Size{
    width: number;
    height: number;
}

export interface MaterialRenderInfo{
    vao: WebGLVertexArrayObject;
    texture: WebGLTexture;
    materialIndices: number[];
    material: Material;
    textureLoaded: boolean;
}

export interface LevelData{
    spawn: vec3;
    spawnYaw: number;
    exitSize: number;
    exitOrigins: Array<vec3>;
    warps: Array<WarpInfo>;
}

export interface WarpInfo{
    origin: vec3;
    to: string;
}
