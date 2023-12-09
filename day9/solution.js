
import { numberMap, readLines } from "../utils.js";

const inputPath = new URL("./input.txt", import.meta.url);

async function getReadings(line) {
    const nums = numberMap(line.split(" "));
    const readings = [nums];
    while(readings.at(-1).some(el => el !== 0)) {
        const diffs = readings.at(-1).reduce((diffs, num, i, arr) => {
            if (i > 0) {
                diffs.push(num - arr[i-1]);
            }
            return diffs;
        }, []);
        readings.push(diffs);
    };
    return readings;
}

export async function solution1() {
    const lines = readLines(inputPath);
    let total = 0;
    for await (const line of lines) {
        const readings = getReadings(line);
        let lastOffset;
        while(readings.length > 1) {
            lastOffset = readings.pop().at(-1);
            const nextReading = readings.at(-1).at(-1) + lastOffset;
            readings.at(-1).push(nextReading);
        }
        total += readings.pop().pop();
    }
    return total;
};

export async function solution2() {
    const lines = readLines(inputPath);
    let total = 0;
    for await (const line of lines) {
        const readings = getReadings(line);
        let lastOffset;
        while(readings.length > 1) {
            lastOffset = readings.pop().at(0);
            const pastReading = readings.at(-1).at(0) - lastOffset;
            readings.at(-1).unshift(pastReading);
        }
        total += readings.pop().shift();
    }
    return total;
};
