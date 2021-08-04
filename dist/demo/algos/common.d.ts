export declare const DEFAULT_CUTOFF_THRESHOLD = 0.3;
export declare const INTENSITY_RANGE: number;
export declare const SIZE_BUFFER_RATIO = 0.95;
export declare const SALIENCY_BUCKETS = 12;
export declare const MODES: readonly ["intensity", "saliency"];
export declare type ModeType = typeof MODES[number];
export declare function modeDescription(mode: ModeType): string;
export declare function extractRunsByCutoff(width: number, height: number, passesCutoff: (row: number, column: number) => boolean): number[][];
