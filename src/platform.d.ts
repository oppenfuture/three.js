export interface AnimationContext {
  requestAnimationFrame: (callback: FrameRequestCallback) => number;
  cancelAnimationFrame: (handle: number) => void;
}

export interface Platform {
  devicePixelRatio: () => number;
  animationContext: AnimationContext;
}

export declare const platform: Platform;
