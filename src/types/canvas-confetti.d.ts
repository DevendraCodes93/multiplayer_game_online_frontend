declare module "canvas-confetti" {
  interface ConfettiOptions {
    particleCount?: number;
    spread?: number;
    origin?: { x?: number; y?: number };
    colors?: string[];
    angle?: number;
    gravity?: number;
    decay?: number;
    scalar?: number;
    shapes?: string[];
    shapeOptions?: {
      text?: {
        value?: string;
      };
    };
  }

  function confetti(options?: ConfettiOptions): Promise<void>;
  export = confetti;
}
