export interface Time {
    time: {
        secs_since_epoch: number;
        nanos_since_epoch: number;
    }
}

export type StartFrame = {} & Time;

export type EndFrame = {} & Time;

export type StartPass = {} & Time;

export type EndPass = {} & Time;

export type StartRenderList = {} & Time;

export type EndRenderList = {} & Time;

export type StartTransmissiveObjectsPre = {} & Time;

export type EndTransmissiveObjectsPre = {} & Time;

export type StartOpaqueObjects = {} & Time;

export type EndOpaqueObjects = {} & Time;

export type StartTransmissiveObjectsPost = {} & Time;

export type EndTransmissiveObjectsPost = {} & Time;

export type StartTransparentObjects = {} & Time;

export type EndTransparentObjects = {} & Time;

export type StartObject = { name: string; num_triangles: number; material_type: string; } & Time;

export type EndObject = {} & Time;

export type StartMaterialCompilation = {} & Time;

export type EndMaterialCompilation = {} & Time;

export type Message = | { StartFrame: StartFrame; }
    | { EndFrame: EndFrame; }
    | { StartPass: StartPass; }
    | { EndPass: EndPass; }
    | { StartRenderList: StartRenderList; }
    | { EndRenderList: EndRenderList; }
    | { StartTransmissiveObjectsPre: StartTransmissiveObjectsPre; }
    | { EndTransmissiveObjectsPre: EndTransmissiveObjectsPre; }
    | { StartOpaqueObjects: StartOpaqueObjects; }
    | { EndOpaqueObjects: EndOpaqueObjects; }
    | { StartTransmissiveObjectsPost: StartTransmissiveObjectsPost; }
    | { EndTransmissiveObjectsPost: EndTransmissiveObjectsPost; }
    | { StartTransparentObjects: StartTransparentObjects; }
    | { EndTransparentObjects: EndTransparentObjects; }
    | { StartObject: StartObject; }
    | { EndObject: EndObject; }
    | { StartMaterialCompilation: StartMaterialCompilation; }
    | { EndMaterialCompilation: EndMaterialCompilation; };

export abstract class WebGLProfiler {
    startFrame() {
        this.send({ StartFrame: now() });
    }

    endFrame() {
        this.send({ EndFrame: now() });
    }

    startPass() {
        this.send({ StartPass: now() });
    }

    endPass() {
        this.send({ EndPass: now() });
    }

    startRenderList() {
        this.send({ StartRenderList: now() });
    }

    endRenderList() {
        this.send({ EndRenderList: now() });
    }

    startTransmissiveObjectsPre() {
        this.send({ StartTransmissiveObjectsPre: now() });
    }

    endTransmissiveObjectsPre() {
        this.send({ EndTransmissiveObjectsPre: now() });
    }

    startOpaqueObjects() {
        this.send({ StartOpaqueObjects: now() });
    }

    endOpaqueObjects() {
        this.send({ EndOpaqueObjects: now() });
    }

    startTransmissiveObjectsPost() {
        this.send({ StartTransmissiveObjectsPost: now() });
    }

    endTransmissiveObjectsPost() {
        this.send({ EndTransmissiveObjectsPost: now() });
    }

    startTransparentObjects() {
        this.send({ StartTransparentObjects: now() });
    }

    endTransparentObjects() {
        this.send({ EndTransparentObjects: now() });
    }

    startObject(name: string, num_triangles: number, material_type: string) {
        this.send({ StartObject: { time: now().time, name, num_triangles, material_type } });
    }

    endObject() {
        this.send({ EndObject: now() });
    }

    startMaterialCompilation() {
        this.send({ StartMaterialCompilation: now() });
    }

    endMaterialCompilation() {
        this.send({ EndMaterialCompilation: now() });
    }

    protected abstract send(message: Message): void;
}

function now(): Time {
    const now = performance.now();
    const secs_since_epoch = Math.floor(now / 1000);
    const millis_since_last_second = now - secs_since_epoch * 1000;
    return {
        time: {
            secs_since_epoch,
            nanos_since_epoch: Math.round(millis_since_last_second * 1_000_000)
        }
    }
}
