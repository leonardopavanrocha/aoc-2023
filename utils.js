import { createReadStream } from 'fs';
import { createInterface } from 'readline';


export function readLines(path) {
    const fileStream = createReadStream(path);
    return createInterface({input: fileStream, crlfDelay: Infinity});
}

export const directions = [[-1,0], [1,0], [1,1], [-1,1], [0,1], [0,-1], [-1,-1], [1,-1]];

export function sum(arr) {
    return arr.reduce((total, item) => total + item, 0);
}

export function product(arr) {
    return arr.reduce((total, item) => total * item, 1);
}

export function numberMap(arr) {
    return arr.map(el => Number(el));
}

/**
 * Computes the frequency of each element in the array
 * @param {Array<any>} array 
 * @returns {Object<key, count:Number> } frequency map
 */
export function computeFrequency(array) {
    const freq = {};
    array.forEach(item => {
        if (!freq.hasOwnProperty(item)) {
            freq[item] = 0;
        }
        freq[item] +=1;
    });
    return freq;
}

export function zip(arr1, arr2) {
    if (arr1.length !== arr2.length) throw Error("Can't zip arrays with different lengths");
    return arr1.map((e,i) => [e, arr2[i]]);
}

export function bhaskara(a,b,c) {
    const delta = b**2 - 4*a*c;
    return [(-b - Math.sqrt(delta))/2*a, (-b + Math.sqrt(delta))/2*a];
}

/**
 * Returns the intersection between ranges
 * @param {Range} range1 
 * @param {Range} range2 
 * @returns {Range | null} intersection
 */
export function intersectRanges([a,b], [c,d]) {
    if (a > d || b < c) return null;
    if (a >= c) {
        return b < d ? [a, b] : [a, d];
    }
    return b < d ? [c, b] : [c, d];
}

/**
 * Merges ranges
 * @param {Array<Range>} ranges
 * @returns {Array<Range>} merged ranges
 */
export function mergeRanges(ranges) {
    ranges.sort(([min1], [min2]) => min1 - min2);
    const merged = [ranges[0]];
    for (const [min, max] of ranges.slice(1)) {
        const last = merged[merged.length - 1];
        if (min <= last[1] + 1) {
            last[1] = Math.max(max, last[1]);
        } else {
            merged.push([min, max]);
        }
    }
    return merged;
}

/**
 * @typedef {[Number, Number]} Range
 */