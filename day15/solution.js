
import { readLines } from "../utils.js";

const inputPath = new URL("./input.txt", import.meta.url);

function HASH(str) {
    return str.split("").reduce((total, char) => {
        return (total + char.charCodeAt(0)) * 17 % 256;
    }, 0);
}

export async function solution1() {
    const lines = readLines(inputPath);
    for await (const line of lines) {
        return line.split(",").reduce((total, str) => total + HASH(str), 0);
    }
};

function buildHashMap() {
    const boxNumbers = 256;
    const hashMap = new Map();
    for(let i = 0; i < boxNumbers; i++) {
        hashMap.set(i, []);
    }
    return hashMap;
}

export async function solution2() {
    const lines = readLines(inputPath);
    const hashMap = buildHashMap();
    for await (const line of lines) {
        line.split(",").forEach((str) => {
            const [_, label, op, focalLength] = str.split(/(\w+)(=|-)(\d*)/);
            const targetBox = HASH(label);
            if (op === "=") {
                const lenses = hashMap.get(targetBox);
                const lensIndex = lenses.findIndex(lens => lens.label === label);
                if (lensIndex >= 0) {
                    hashMap.set(targetBox, lenses.map((el,i) => i === lensIndex ? {focalLength, label } : el))
                } else {
                    const newLensSet = hashMap.get(targetBox);
                    newLensSet.push({ focalLength, label })
                    hashMap.set(targetBox, newLensSet);
                }
            } else {
                const lenses = hashMap.get(targetBox);
                const newLensSet = lenses.filter(lens => lens.label !== label);
                hashMap.set(targetBox, newLensSet);
            }
        }, 0);
    }
    return [...hashMap.entries()].reduce((total, [box, lenses]) => {
        return total + (box + 1) * lenses.reduce((lensTotal, lens, index) => lensTotal + (index + 1) * lens.focalLength , 0)
    }, 0);
};
