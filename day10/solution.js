
import { simpleDirections, readLines, outsideBoundaries, findItemInGrid} from "../utils.js";

const inputPath = new URL("./input.txt", import.meta.url);

const pipes = {
    "|": [[1, 0], [-1, 0]],
    "-": [[0, 1], [0, -1]],
    "L": [[-1, 0], [0, 1]],
    "J": [[-1, 0], [0, -1]],
    "F": [[1, 0], [0, 1]],
    "7": [[0, -1], [1, 0]],
};

function countPipesToRight(grid, i, j, seen) {
    const seenPipes = [];
    let pointer=j;
    while (pointer < grid[i].length) {
        if (seen.has(`${i}-${pointer}`)) {
            seenPipes.push(grid[i][pointer]);
        }
        pointer++;
    }
    let rightPipes = seenPipes.join("");
    rightPipes = rightPipes.replaceAll("-", "");
    rightPipes = rightPipes.replaceAll("FJ", "|");
    rightPipes = rightPipes.replaceAll("F7", "");
    rightPipes = rightPipes.replaceAll("L7", "|");
    rightPipes = rightPipes.replaceAll("LJ", "");
    return rightPipes.length;
}

export async function solution1() {
    const lines = readLines(inputPath);
    const grid = [];
    for await (const line of lines) {
        grid.push(line.split(""));
    }
    const [Sx,Sy] = findItemInGrid(grid, "S");
    let nodes = simpleDirections.filter(([x,y]) => {
        const destCoords = [x + Sx, y + Sy];
        const destNode = !outsideBoundaries(grid, destCoords) && grid[destCoords[0]][destCoords[1]];
        if (destNode && destNode in pipes) {
            return pipes[destNode].find(([i,j]) => {
                if (Sx === destCoords[0] + i && Sy === destCoords[1] + j) {
                    return true;
                }
            });
        }
        return false;
    }).map(([x,y]) => [Sx + x,Sy + y]);

    const seen = new Set();
    while (nodes.length) {
        nodes = nodes.map(node => {
            const nodeEl = grid[node[0]][node[1]];
            seen.add(node.join("-"));
            return pipes[nodeEl].map(([x,y]) => {
                const coords = [node[0] + x, node[1] + y];
                const newNode = !outsideBoundaries(grid, coords) && grid[coords[0]][coords[1]];
                if (newNode && newNode in pipes) {
                    return coords;
                }
                return false;
            })
            .find(node => node &&!seen.has(node.join("-")));
        }).filter(Boolean);
    }
    return Math.ceil(seen.size / 2);
};

export async function solution2() {
    const lines = readLines(inputPath);
    const grid = [];
    for await (const line of lines) {
        grid.push(line.split(""));
    }
    const [Sx,Sy] = findItemInGrid(grid, "S");
    const SDirections = simpleDirections.filter(([x,y]) => {
        const destCoords = [x + Sx, y + Sy];
        const destNode = !outsideBoundaries(grid, destCoords) && grid[destCoords[0]][destCoords[1]];
        if (destNode && destNode in pipes) {
            return pipes[destNode].find(([i,j]) => {
                if (Sx === destCoords[0] + i && Sy === destCoords[1] + j) {
                    return true;
                }
            });
        }
        return false;
    });
    let nodes = SDirections.map(([x,y]) => [Sx + x,Sy + y]);

    for (const [key, directions] of Object.entries(pipes)) {
        if (SDirections.every(([x,y]) => directions.find(([i,j]) => i === x && y===j))) {
            grid[Sx][Sy] = key;
        }
    }

    const seen = new Set();
    seen.add(`${Sx}-${Sy}`);
    while (nodes.length) {
        nodes = nodes.map(node => {
            const nodeEl = grid[node[0]][node[1]];
            seen.add(node.join("-"));
            return pipes[nodeEl].map(([x,y]) => {
                const coords = [node[0] + x, node[1] + y];
                const newNode = !outsideBoundaries(grid, coords) && grid[coords[0]][coords[1]];
                if (newNode && newNode in pipes) {
                    return coords;
                }
                return false;
            })
            .find(node => !seen.has(node.join("-")));
        }).filter(Boolean);
    }
    let count = 0;
    grid.forEach((row, i) => {
        row.forEach((col, j) => {
            if (!(col in pipes) || !seen.has(`${i}-${j}`)) {
                if (countPipesToRight(grid, i, j, seen) % 2 != 0) {
                    count++;
                }
            }
        })
    });
    return count;
};
