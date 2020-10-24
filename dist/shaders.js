"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fragment = exports.vertex = void 0;
exports.vertex = `#version 300 es

uniform mat4 uModelViewProjection;

in vec4 aPosition;
in vec4 aColor;
out vec4 vColor;
void main() {
    vColor = aColor;
    gl_Position = uModelViewProjection * aPosition;
}
`;
exports.fragment = `#version 300 es
precision mediump float;
in vec4 vColor;
out vec4 oColor;
void main() {
    oColor = vColor;
}
`;
//# sourceMappingURL=shaders.js.map