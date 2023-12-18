
import { readLines, sum, manhattanDistance } from "../utils.js";

const inputPath = new URL("./input.txt", import.meta.url);

function expandGalaxies(galaxies, emptyCols, emptyRows, multiplier=1) {
    return galaxies.map(([x, y]) => {
        const xOffset = [...emptyRows.keys()].filter(el => el < x).length * multiplier;
        const yOffset = [...emptyCols.keys()].filter(el => el < y).length * multiplier;
        return [x + xOffset, y + yOffset];
    });
}

export async function solution1() {
    const lines = readLines(inputPath);
    const galaxies = []
    const grid = [];
    for await (const line of lines) {
        grid.push(line.split(""));
    }
    const emptyRows = new Set(Array(grid.length).fill(0).map((el, i) => el+i));
    const emptyCols = new Set(Array(grid[0].length).fill(0).map((el, i) => el+i));
    
    grid.forEach((row, i) => {
        row.forEach((col, j) => {
            if (col === "#") {
                galaxies.push([i,j]);
                emptyCols.delete(j);
                emptyRows.delete(i);
            }
        });
    });

    const expandedGalaxies = expandGalaxies(galaxies, emptyCols, emptyRows, 1);

    let total = 0;
    while(expandedGalaxies.length > 1) {
        const src = expandedGalaxies.pop();
        total += sum(expandedGalaxies.map((target) => {
            return manhattanDistance(src, target);
        }));
    }
    return total;
};

export async function solution2() {
    const lines = readLines(inputPath);
    const galaxies = []
    const grid = [];
    for await (const line of lines) {
        grid.push(line.split(""));
    }
    const emptyRows = new Set(Array(grid.length).fill(0).map((el, i) => el+i));
    const emptyCols = new Set(Array(grid[0].length).fill(0).map((el, i) => el+i));
    
    grid.forEach((row, i) => {
        row.forEach((col, j) => {
            if (col === "#") {
                galaxies.push([i,j]);
                emptyCols.delete(j);
                emptyRows.delete(i);
            }
        });
    });

    const expandedGalaxies = expandGalaxies(galaxies, emptyCols, emptyRows, 999999); // 1_000_000 - 1;

    let total = 0;
    while(expandedGalaxies.length > 1) {
        const src = expandedGalaxies.pop();
        total += sum(expandedGalaxies.map((target) => {
            return manhattanDistance(src, target);
        }));
    }
    return total;
};
