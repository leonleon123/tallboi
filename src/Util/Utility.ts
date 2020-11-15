import { Body, Box, Vec3 } from 'cannon';
import { vec3 } from 'gl-matrix';
import { Mesh } from 'webgl-obj-loader';
import { BodyType } from './Enums';

export function degToRad(degrees: number): number {
    const pi = Math.PI;
    return degrees * (pi / 180);
}

export async function loadAsset(file: string): Promise<Mesh> {
    const req = await fetch(`assets/${file}`);
    const text = await req.text();
    const mesh = new Mesh(text);
    return new Promise((resolve, reject) => resolve(mesh));
}

export async function loadCollisionBodies(file: string, group: number, filter: number): Promise<Body[]>{
    const req = await fetch(`assets/${file}`);
    const text = await req.text();
    const bodies = text.split(/^o.*$/gm)
    .filter(block => !block.startsWith('#'))
    .map((block, i) => {
        const vertices = block.split('\n')
        .filter(line => line.startsWith('v '))
        .map(vertexString => {
            const [x, y, z] = vertexString.split(' ').slice(1).map(val => parseFloat(val));
            return vec3.fromValues(x, y, z);
        });
        return getBodyFromVertices(vertices, group, filter);
    });
    return new Promise((resolve, reject) => resolve(bodies));
}

function getTwoMostDistantVertices(vertices: vec3[]): [vec3, vec3]{
    let maxDist = 0;
    const mostDistant: [vec3, vec3] = [vec3.create(), vec3.create()];
    for (const a of vertices){
        for (const b of vertices){
            const dist = vec3.dist(a, b);
            if (dist > maxDist){
                maxDist = dist;
                vec3.copy(mostDistant[0], a);
                vec3.copy(mostDistant[1], b);
            }
        }
    }
    return mostDistant;
}

export function getBodyFromVertices(vertices: vec3[], group: BodyType, filter: BodyType): Body{
    const center = vec3.create();
    for (const vertex of vertices){
        vec3.add(center, center, vertex);
    }
    vec3.divide(center, center, vec3.fromValues(vertices.length, vertices.length, vertices.length));
    const [max, min] = getTwoMostDistantVertices(vertices);
    const halfExtents = vec3.create();
    vec3.subtract(halfExtents, max, min);
    vec3.divide(halfExtents, halfExtents, vec3.fromValues(2, 2, 2));

    const shape = new Box(new Vec3(Math.abs(halfExtents[0]), Math.abs(halfExtents[1]), Math.abs(halfExtents[2])));
    const body = new Body({
        mass: group === BodyType.WALL ? 0 : 1,
        collisionFilterGroup: group,
        collisionFilterMask: filter
    });
    body.addShape(shape);
    body.position.set(center[0], center[1], center[2]);

    return body;
}
