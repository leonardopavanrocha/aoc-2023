import { readLines } from "../utils.js";

const inputPath = new URL("./input.txt", import.meta.url);

const available = {
    "red": 12,
    "green": 13,
    "blue": 14,
};

function checkGamePossible(currentSet, available) {
    for(const [key, value] of Object.entries(currentSet)) {
        if (value > available[key]) {
            return false;
        }
    }
    return true;
};

export async function solution1() {
    const lines = readLines(inputPath);
    let total = 0;

    for await (const line of lines) {
        const [game, sets] = line.split(":");
        const gameNumber = Number(game.split(" ").at(-1));
        const maxPerSet = sets.split(";").reduce((maxCubes, set) => {
            set.split(",").forEach(cube => {
                const [_, qty, color] = cube.split(" ");
                if (color in maxCubes) {
                    if (qty > maxCubes[color]) {
                        maxCubes[color] = Number(qty);
                    }
                } else {
                    maxCubes[color] = Number(qty);
                }
            });
            return maxCubes;
        }, {});
        if (checkGamePossible(maxPerSet, available)) {
            total += gameNumber;
        }
    }
    return total;
};

export async function solution2() {
    const lines = readLines(inputPath);
    let total = 0;

    for await (const line of lines) {
        const [_, sets] = line.split(":");
        const maxPerSet = sets.split(";").reduce((maxCubes, set) => {
            set.split(",").forEach(cube => {
                const [_, qty, color] = cube.split(" ");
                if (color in maxCubes) {
                    if (qty > maxCubes[color]) {
                        maxCubes[color] = Number(qty);
                    }
                } else {
                    maxCubes[color] = Number(qty);
                }
            });
            return maxCubes;
        }, {});
        total += Object.values(maxPerSet).reduce((product, qty) => product * qty, 1);
    }
    return total;
};
