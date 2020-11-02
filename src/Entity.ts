import { Mesh } from 'webgl-obj-loader';

export interface Entity {
    id: number;
    mesh: Mesh;
    update(): void;
}
