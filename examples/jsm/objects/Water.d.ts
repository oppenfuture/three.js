import { BufferGeometry, ColorRepresentation, Mesh, Object3D, ShaderMaterial, Side, Texture, Vector3 } from '../../../src/Three';

export interface WaterOptions {
    textureWidth?: number;
    textureHeight?: number;
    clipBias?: number;
    alpha?: number;
    time?: number;
    waterNormals?: Texture;
    sunDirection?: Vector3;
    sunColor?: ColorRepresentation;
    waterColor?: ColorRepresentation;
    eye?: Vector3;
    distortionScale?: number;
    side?: Side;
    fog?: boolean;
    objectSpaceNormal?: Vector3;
    subTreeOnlyVisibleInMirror?: Object3D;
    skipMirrorRendering?: boolean;
}

export class Water extends Mesh {
    material: ShaderMaterial;
    constructor(geometry: BufferGeometry, options: WaterOptions);
}
