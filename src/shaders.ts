export const vertex = `#version 300 es

uniform mat4 uModelViewProjection;

in vec4 aPosition;
in vec4 aColor;
out vec4 vColor;
void main() {
    vColor = aColor;
    gl_Position = uModelViewProjection * aPosition;
}
`;

export const fragment = `#version 300 es
precision mediump float;
in vec4 vColor;
out vec4 oColor;
void main() {
    oColor = vColor;
}
`;
