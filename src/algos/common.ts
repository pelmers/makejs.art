import { ModeType } from '../constants';

export function modeDescription(mode: ModeType): string {
    return {
        intensity: 'Intensity (faster)',
        saliency: 'Saliency (slower)',
    }[mode];
}

export function extractRunsByCutoff(
    width: number,
    height: number,
    passesCutoff: (row: number, column: number) => boolean
) {
    // compute 'runs' of pixels > cutoff in the image rows to use as line widths
    const runs: number[][] = [];
    for (let row = 0; row < height; row++) {
        for (let col = 0; col < width; col++) {
            const i = row * width + col;
            if (passesCutoff(row, col)) {
                // Decide whether we're still on the last run, or make a new one
                if (
                    runs.length > 0 &&
                    col > 0 &&
                    runs[runs.length - 1][runs[runs.length - 1].length - 1] === i - 1
                ) {
                    runs[runs.length - 1].push(i);
                } else {
                    runs.push([i]);
                }
            }
        }
    }
    return runs;
}
