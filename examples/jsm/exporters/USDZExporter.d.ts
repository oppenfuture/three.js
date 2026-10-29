import { Object3D } from '../../../src/Three';

export class USDZExporter {
    constructor();

    parse(scene: Object3D, options?: { quickLookCompatible?: boolean }): Promise<Uint8Array>;
}
