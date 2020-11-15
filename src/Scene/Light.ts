import { vec3 } from 'gl-matrix';

export class Light{

    constructor(
        public position: vec3,
        public ambient: number,
        public diffuse: number,
        public specular: number,
        public shininess: number,
        public color: vec3,
        public attenuation: vec3
    ){ }
}
