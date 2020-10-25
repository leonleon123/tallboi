export const vertex = `#version 300 es

uniform mat4 uMVC;

in vec4 aPosition;
in vec4 aColor;
out vec4 vColor;
void main() {
    vColor = aColor;
    gl_Position = uMVC * aPosition;
}
`;

export const fragment = `#version 300 es
precision mediump float;
in vec4 vColor;
out vec4 oColor;
void main() {
    oColor = vec4(0.6, 0.2, 0.6, 1);
}
`;
