
import { readLines, rotate } from "../utils.js";

const inputPath = new URL("./input.txt", import.meta.url);

function fullCycle(grid) {
    for (let i=0; i < 4; i++) {
        grid = rotate(grid);
        const rockPositions = new Set();
        grid.forEach((row, i) => {
            let lastObstacle = 0;
            row.forEach((el, j) => {
                if (el === "#") {
                    lastObstacle = j + 1;
                } else if (el === "O") {
                    rockPositions.add(`${i}-${lastObstacle}`);
                    grid[i][j] = ".";
                    lastObstacle +=1;
                }
            });
        });
        grid.forEach((row, i) => {
            row.forEach((el, j) => {
                if (rockPositions.has(`${i}-${j}`)) {
                    grid[i][j] = "O";
                }
            });
        });
    }
    return grid;
}

export async function solution1() {
    const lines = readLines(inputPath);
    const grid = [];
    for await (const line of lines) {
        grid.push(line.split(""));
    }
    const transposedGrid = rotate(grid, false);
    return transposedGrid.reduce((total, row, j) => {
        return total + row.reduce((sum, el, index) => {
            if (el === "#") {
                sum.lastObstacle = index + 1;
            } else if (el === "O") {
                sum.total += row.length - sum.lastObstacle;
                sum.lastObstacle += 1;
            }
            return sum;
        }, {total: 0, lastObstacle: 0}).total;
    }, 0);
};

export async function solution2() {
    const lines = readLines(inputPath);
    let grid = [];
    for await (const line of lines) {
        grid.push(line.split(""));
    }
    const resultsByCycle = [];
    const results = new Map();
    const ONE_BILLION = 1_000_000_000;
    grid = rotate(rotate(grid, false), false);
    for(let i=0; i < ONE_BILLION; i++) {
        grid = fullCycle(grid);
        const load = rotate(grid).reduce((total, row) => {
            return total + row.reduce((total, el, j) => {
                return total + (el === "O" ? row.length - j : 0);
            }, 0);
        }, 0);
        const key = JSON.stringify(rotate(grid));
        resultsByCycle.push(load);
        if (results.has(key)) {
            const cycleLength = i - results.get(key);
            return resultsByCycle[(ONE_BILLION - results.get(key)) % cycleLength + results.get(key) - 1];
        }
        results.set(key, i);
    }
};
