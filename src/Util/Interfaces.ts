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
}
