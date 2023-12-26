
import { readLines, buildHashMapGrid } from "../utils.js";

const inputPath = new URL("./input.txt", import.meta.url);

const UP = [-1, 0];
const DOWN = [1, 0];
const LEFT = [0, -1];
const RIGHT = [0, 1];

const mirrors = {
    "/": (direction) => {
        switch (direction) {
            case RIGHT:
                return [UP]
            case DOWN: return [LEFT]
            case LEFT: return [DOWN]
            case UP: return [RIGHT]
        }
    },
    "\\": (direction) => {
        switch (direction) {
            case RIGHT: return [DOWN]
            case DOWN: return [RIGHT]
            case LEFT: return [UP]
            case UP: return [LEFT]
        }
    },
    "-": (direction) => {
        switch (direction) {
            case DOWN: return [LEFT, RIGHT]
            case UP: return [LEFT, RIGHT]
            default: return [direction]
        }
    },
    "|": (direction) => {
        switch(direction) {
            case RIGHT: return [UP, DOWN]
            case LEFT: return [DOWN, UP]
            default: return [direction]
        }
    }
}

function moveInGrid(point, direction) {
    return {
        point: [point[0] + direction[0], point[1] + direction[1]],
        direction,
    };
}

function outsideHashMapGrid(grid, [x, y]) {
    return x >= grid.size || x < 0 || y < 0 || y >= grid.get(0).size;
}

function makeKey({point, direction}) {
    return `${point[0]}-${point[1]}-${direction[0]}-${direction[1]}`;
}

async function sol1(grid, startingPoint, startingDirection) {
    function filterGrid(node) {
        return grid.get(node.point[0])?.get(node.point[1]) in mirrors || (!visited.has(makeKey(node)) && !outsideHashMapGrid(grid, node.point))
    }
    const nodesToVisit = [moveInGrid(startingPoint, startingDirection)];
    const visited = new Set();
    visited.add(makeKey({point: startingPoint, direction: startingDirection}));
    while(nodesToVisit.length) {
        const {point, direction} = nodesToVisit.pop();
        const el = grid.get(point[0])?.get(point[1]);
        visited.add(makeKey({point, direction}));
        if (el in mirrors) {
            const nextDirections = mirrors[el](direction);
            nodesToVisit.push(
                ...nextDirections.map(direction => moveInGrid(point, direction))
                .filter(filterGrid)
            );
        } else {
            const nextVisit = moveInGrid(point, direction);
            if (filterGrid(nextVisit)) {
                nodesToVisit.push(nextVisit);
            }
        }
    }
    const energized = new Set();
    [...visited.keys()].forEach(el => {
        const [x,y, _] = el.split("-");
        energized.add(`${x}-${y}`);
    });
    return energized.size;
}

export async function solution1() {
    const lines = readLines(inputPath);
    const grid = await buildHashMapGrid(lines);
    const startingPoint = [0,0];
    const startingDirection = RIGHT;
    return sol1(grid, startingPoint, startingDirection);
};


export async function solution2() {
    const lines = readLines(inputPath);
    const grid = await buildHashMapGrid(lines);
    const results = [];
    for (const [i, row] of [...grid.entries()]) {
        for (const [j, el] of [...row.entries()]) {
            if (i === 0 || i === grid.size - 1) {
                results.push(await sol1(grid, [i,j], i === 0 ? DOWN : UP));
            }
            if (j === 0 || j === row.size - 1) {
                results.push(await sol1(grid, [i, j], j === 0 ? RIGHT : LEFT));
            }
        };
    };
    return Math.max(...results);
};
