import { Body, Box, Vec3 } from 'cannon';
import { vec3 } from 'gl-matrix';
import { MaterialLibrary, Mesh } from 'webgl-obj-loader';
import { BodyType } from './Enums';
import { LevelData, WarpInfo } from './Interfaces';

export function degToRad(degrees: number): number {
    const pi = Math.PI;
    return degrees * (pi / 180);
}

export async function loadAsset(file: string): Promise<Mesh> {
    const req = await fetch(`assets/meshes/${file}.obj`);
    const text = await req.text();
    const mesh = new Mesh(text);
    const mtl = await fetch(`assets/meshes/${file}.mtl`);
    const mtlText = await mtl.text();
    mesh.addMaterialLibrary(new MaterialLibrary(mtlText));
    return new Promise((resolve, reject) => resolve(mesh));
}

export async function loadAssets(files: string[]): Promise<Mesh[]> {
    return Promise.all(files.map(name => loadAsset(name)));
}

export async function loadCollisionBodies(file: string, group: number, filter: number): Promise<Body[]>{
    const req = await fetch(`assets/meshes/${file}.obj`);
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

export async function loadLevelData(levelName: string): Promise<LevelData>{
    const req = await fetch(`assets/data/${levelName}.data`);
    const data = await req.text();
    console.log(data);
    const lines = data.split('\n');
    const spawnPoint = vec3.create();
    const dExitOrigins: Array<vec3> = [];
    const dWarps: Array<WarpInfo> = [];

    let dExitSize = 0;
    let dSpawnYaw = 0;
    for (const line of lines)
    {
        const tokens = line.split(' ');
        if (tokens[0] === 'spawn')
        {
            vec3.set(spawnPoint, parseFloat(tokens[1]), parseFloat(tokens[2]), parseFloat(tokens[3]));
            if (tokens[4] !== undefined && parseFloat(tokens[4])){
                dSpawnYaw = parseFloat(tokens[4]);
                console.log('setting custom yaw');
            }
        }
        else if (tokens[0] === 'exit_size')
        {
            dExitSize = parseInt(tokens[1], 10);
        }
        else if (tokens[0] === 'exit')
        {
            const dExitOrigin = vec3.create();
            vec3.set(dExitOrigin, parseFloat(tokens[1]), parseFloat(tokens[2]), parseFloat(tokens[3]));
            dExitOrigins.push(dExitOrigin);
            // console.log('adding exit');
        }
        else if (tokens[0] === 'warp')
        {
            const dWarpOrigin = vec3.create();
            vec3.set(dWarpOrigin, parseFloat(tokens[1]), parseFloat(tokens[2]), parseFloat(tokens[3]));
            const warpInfo: WarpInfo = {
                origin: dWarpOrigin,
                to: tokens[4]
            };
            dWarps.push(warpInfo);
        }
    }
    const ret: LevelData = {
        spawn: spawnPoint,
        spawnYaw: dSpawnYaw,
        exitSize: dExitSize,
        exitOrigins: dExitOrigins,
        warps: dWarps
    };
    return ret;
}

export function pickRandom<T>(arr: Array<T>): T{
    return arr[Math.floor(Math.random() * arr.length)];
}
