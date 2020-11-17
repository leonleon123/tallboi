import { Shader } from '../Util/Interfaces';

export const vertex =
`#version 300 es

uniform mat4 uModelView;
uniform mat4 uProjection;

uniform float uAmbient;
uniform float uDiffuse;
uniform float uSpecular;

uniform float uShininess;
uniform vec3 uLightPosition;
uniform vec3 uLightColor;
uniform vec3 uLightAttenuation;

layout (location = 0) in vec3 aPosition;
layout (location = 1) in vec4 aColor;
layout (location = 2) in vec3 aNormal;

out vec4 vColor;
out vec3 vLight;

void main() {
    vec3 vertexPosition = (uModelView * vec4(aPosition, 1)).xyz;
    vec3 lightPosition = uLightPosition;
    float d = distance(vertexPosition, lightPosition);
    float attenuation = 1.0 / dot(uLightAttenuation * vec3(1, d, d * d), vec3(1, 1, 1));

    vec3 N = (uModelView * vec4(aNormal, 0)).xyz;
    vec3 L = normalize(lightPosition - vertexPosition);
    vec3 E = normalize(-vertexPosition);
    vec3 R = normalize(reflect(-L, N));

    float lambert = max(0.0, dot(L, N));
    float phong = pow(max(0.0, dot(E, R)), uShininess);

    float ambient = uAmbient;
    float diffuse = uDiffuse * lambert;
    float specular = uSpecular * phong;

    vLight = ((ambient + diffuse + specular) * attenuation) * uLightColor;
    vColor = aColor;
    gl_Position = uProjection * vec4(vertexPosition, 1);
}
`;

export const fragment =
`#version 300 es

precision mediump float;

in vec4 vColor;
in vec3 vLight;

out vec4 oColor;

void main() {
    oColor = vColor * vec4(vLight, 1) + vColor * vec4(0.5, 0.5, 0.5, 1);
}
`;

export const simpleShader: Shader = { vertex, fragment};
