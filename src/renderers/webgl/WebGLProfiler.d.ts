export interface Time {
    time: {
        secs_since_epoch: number;
        nanos_since_epoch: number;
    };
}
export declare type StartFrame = {} & Time;
export declare type EndFrame = {} & Time;
export declare type StartPass = {} & Time;
export declare type EndPass = {} & Time;
export declare type StartRenderList = {} & Time;
export declare type EndRenderList = {} & Time;
export declare type StartTransmissiveObjectsPre = {} & Time;
export declare type EndTransmissiveObjectsPre = {} & Time;
export declare type StartOpaqueObjects = {} & Time;
export declare type EndOpaqueObjects = {} & Time;
export declare type StartTransmissiveObjectsPost = {} & Time;
export declare type EndTransmissiveObjectsPost = {} & Time;
export declare type StartTransparentObjects = {} & Time;
export declare type EndTransparentObjects = {} & Time;
export declare type StartObject = {
    name: string;
    num_triangles: number;
    material_type: string;
} & Time;
export declare type EndObject = {} & Time;
export declare type StartMaterialCompilation = {} & Time;
export declare type EndMaterialCompilation = {} & Time;
export declare type Message = {
    StartFrame: StartFrame;
} | {
    EndFrame: EndFrame;
} | {
    StartPass: StartPass;
} | {
    EndPass: EndPass;
} | {
    StartRenderList: StartRenderList;
} | {
    EndRenderList: EndRenderList;
} | {
    StartTransmissiveObjectsPre: StartTransmissiveObjectsPre;
} | {
    EndTransmissiveObjectsPre: EndTransmissiveObjectsPre;
} | {
    StartOpaqueObjects: StartOpaqueObjects;
} | {
    EndOpaqueObjects: EndOpaqueObjects;
} | {
    StartTransmissiveObjectsPost: StartTransmissiveObjectsPost;
} | {
    EndTransmissiveObjectsPost: EndTransmissiveObjectsPost;
} | {
    StartTransparentObjects: StartTransparentObjects;
} | {
    EndTransparentObjects: EndTransparentObjects;
} | {
    StartObject: StartObject;
} | {
    EndObject: EndObject;
} | {
    StartMaterialCompilation: StartMaterialCompilation;
} | {
    EndMaterialCompilation: EndMaterialCompilation;
};
export declare abstract class WebGLProfiler {
    startFrame(): void;
    endFrame(): void;
    startPass(): void;
    endPass(): void;
    startRenderList(): void;
    endRenderList(): void;
    startTransmissiveObjectsPre(): void;
    endTransmissiveObjectsPre(): void;
    startOpaqueObjects(): void;
    endOpaqueObjects(): void;
    startTransmissiveObjectsPost(): void;
    endTransmissiveObjectsPost(): void;
    startTransparentObjects(): void;
    endTransparentObjects(): void;
    startObject(name: string, num_triangles: number, material_type: string): void;
    endObject(): void;
    startMaterialCompilation(): void;
    endMaterialCompilation(): void;
    protected abstract send(message: Message): void;
}
