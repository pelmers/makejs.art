import { Canvas } from 'node-canvas';

// just some random UUID
const ID = '871dacbf-674c';
export const SPACE_MARKER = ` /*${ID}*/ `;
export const OPTIONAL_SPACE_MARKER = ` /*opt-${ID}*/ `;
export const UNBREAKABLE_SPACE_MARKER = ` /*ubn-${ID}*/ `;

// This constant is a guess at a typical font's ratio of height:width
export const DEFAULT_HEIGHT_WIDTH_RATIO = 1.7;

export const DEFAULT_CUTOFF_THRESHOLD = 0.3;
// Intensity values are sum of r, g, b at each pixel
export const INTENSITY_RANGE = 1 + 255 * 3;
// Resize images to accomodate imperfect fill
export const SIZE_BUFFER_RATIO = 0.95;
// 12 is value referenced in Cheng '11
export const SALIENCY_BUCKETS = 12;

export const MODES = ['intensity', 'saliency'] as const;
export type ModeType = typeof MODES[number];
export type CanvasType = Canvas | HTMLCanvasElement;
