export class WebGLProfiler {
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
    startObject(name, num_triangles, material_type) {
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
}
function now() {
    const now = performance.now();
    const secs_since_epoch = Math.floor(now / 1000);
    const millis_since_last_second = now - secs_since_epoch * 1000;
    return {
        time: {
            secs_since_epoch,
            nanos_since_epoch: Math.round(millis_since_last_second * 1000000)
        }
    };
}
