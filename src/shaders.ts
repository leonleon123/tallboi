import { Shader } from './Interfaces';

export const vertex =
`#version 300 es

uniform mat4 uMVP;

layout (location = 0) in vec4 aPosition;

out vec4 vColor;

void main() {
    vColor = aPosition;
    gl_Position = uMVP * aPosition;
}
`;

export const fragment =
`#version 300 es

precision mediump float;

in vec4 vColor;
out vec4 oColor;

void main() {
    oColor = vec4(0,0,0,1);
}
`;

export const simpleShader: Shader = { vertex, fragment};