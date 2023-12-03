import { createReadStream } from 'fs';
import { createInterface } from 'readline';


export function readLines(path) {
    const fileStream = createReadStream(path);
    return createInterface({input: fileStream, crlfDelay: Infinity});
}

export const directions = [[-1,0], [1,0], [1,1], [-1,1], [0,1], [0,-1], [-1,-1], [1,-1]];
