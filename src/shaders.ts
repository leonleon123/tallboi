export const vertex =
`#version 300 es

uniform mat4 uMVP;

in vec4 aPosition;
in vec4 aColor;
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
