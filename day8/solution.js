
import { readLines, lcm } from "../utils.js";

const inputPath = new URL("./input.txt", import.meta.url);

async function processInput() {
    const lines = readLines(inputPath);
    let pattern;
    const map = {};
    for await (const line of lines) {
        if (line) {
            if (!pattern) {
                pattern = line.split("");
            } else {
                const [key, directions] = line.split("=").map(el => el.trim());
                const [_, left, right] = directions.match(/\((\w+),\s+(\w+)\)/);
                map[key] = [left, right];
            }
        }
    }
    return [pattern, map];
}

function findSingleSolution(pattern, map, startPosition, stopCondition) {
    let currentPosition = startPosition;
    let index = 0;
    let count = 0;
    while (!stopCondition(currentPosition)) {
        if (index === pattern.length) {
            index=0;
        }
        currentPosition = map[currentPosition][pattern[index] === "L" ? 0 : 1];
        index++;
        count++;
    }
    return count;
}

export async function solution1() {
    const [pattern, map] = await processInput();
    function stopCondition(position) {
        return position === "ZZZ";
    };
    const startPosition = "AAA";
    return findSingleSolution(pattern, map, startPosition, stopCondition);
};

export async function solution2() {
    const [pattern, map] = await processInput();

    const startingPositions = Object.keys(map).reduce((arr, key) => {
        if (key.at(-1) === "A") {
            arr.push(key);
        }
        return arr;
    }, []);

    return startingPositions.map(position => {
        return findSingleSolution(pattern, map, position, (pos) => {return pos.at(-1) === "Z"});
    }).reduce(lcm);
};
