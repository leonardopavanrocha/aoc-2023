
import { readLines, numberMap, intersectRanges, mergeRanges } from "../utils.js";

const inputPath = new URL("./input.txt", import.meta.url);


export async function solution1() {
    const lines = readLines(inputPath);
    let seeds;
    let lastMap = [];
    for await (const line of lines) {
        const seedLine = line.match(/seeds:\s((?:\s*\d+)*)/);
        if (seedLine) {
            seeds = numberMap(seedLine[1].split(" "));
            continue;
        }
        const mapLine = line.match(/(?<destination>\w+)-to-(?<source>\w+)\smap:/);
        if (mapLine) {
            seeds = seeds.map(el => {
                const { offset } = lastMap.find(rangeItem => el >= rangeItem.range[0] && el <= rangeItem.range[1]) || {offset: 0};
                return el + offset;
            });
            lastMap = [];
        } else if (line) {
            const [destination, source, range] = numberMap(line.split(" "));
            lastMap.push({
                range: [source, source + range - 1],
                offset: destination - source,
            });
        }
    }
    seeds = seeds.map(el => {
        const { offset } = lastMap.find(rangeItem => el >= rangeItem.range[0] && el <= rangeItem.range[1]) || {offset: 0};
        return el + offset;
    });
    return Math.min(...seeds);
};

export async function solution2() {
    const lines = readLines(inputPath);
    let seedRanges;
    let lastMap = [];
    for await (const line of lines) {
        const seedLine = line.match(/seeds:\s((?:\s*\d+)*)/);
        if (seedLine) {
            seedRanges = numberMap(seedLine[1].split(" "));
            seedRanges = seedRanges.reduce((obj, seed) => {
                if (obj.lastNumber) {
                    obj.seeds.push([obj.lastNumber, obj.lastNumber + seed - 1]);
                    obj.lastNumber = null;
                } else {
                    obj.lastNumber = seed;
                }
                return obj;
            }, {seeds: [], lastNumber: null}).seeds;
            continue;
        }
        const mapLine = line.match(/(?<destination>\w+)-to-(?<source>\w+)\smap:/);
        if (mapLine) {
            const newSeedRanges = [];
            lastMap.forEach(mapRange => {
                seedRanges = seedRanges.flatMap(seedRange => {
                    const intersection = intersectRanges(mapRange.range, seedRange);
                    if (intersection) {
                        newSeedRanges.push(intersection.map(el => el + mapRange.offset));
                        return [
                            [seedRange[0], intersection[0] - 1],
                            [intersection[1] + 1, seedRange[1]],
                        ].filter(([low, high]) => low <= high);
                    }
                    return [seedRange];
                });
            });
            seedRanges = mergeRanges(newSeedRanges.concat(seedRanges));
            lastMap = [];
        } else if (line) {
            const [destination, source, range] = numberMap(line.split(" "));
            lastMap.push({
                range: [source, source + range - 1],
                offset: destination - source,
            });
        }
    }
    lastMap.forEach(mapRange => {
        const newSeedRanges = [];
        seedRanges = seedRanges.flatMap(seedRange => {
            const intersection = intersectRanges(mapRange.range, seedRange);
            if (intersection) {
                newSeedRanges.push(intersection.map(el => el + mapRange.offset));
                return [
                    [seedRange[0], intersection[0] - 1],
                    [intersection[1] + 1, seedRange[1]],
                ].filter(([lo, hi]) => lo <= hi);
            }
            return [seedRange];
        });
        seedRanges = mergeRanges(newSeedRanges.concat(seedRanges));
    });
    return Math.min(...seedRanges.map(el => el[0]));
};
