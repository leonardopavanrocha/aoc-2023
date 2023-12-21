import { readLines, transpose } from "../utils.js";

const inputPath = new URL("./input.txt", import.meta.url);

async function readGrids(lines) {
    const grids = [];
    let grid = [];
    for await (const line of lines) {
        if (line) {
            grid.push(line.split(""));
        } else if(grid.length) {
            grids.push(grid);
            grid = [];
        }
    }
    grids.push(grid);
    return grids;
}

function findSymmetry(grid) {
    const possiblePoints = [];
    grid.forEach((row, i) => {
        const key = row.join("");
        if (i > 0 && key === grid[i-1].join("")) {
            possiblePoints.push(i);
        }
    });
    return possiblePoints.find(point => {
        if (point < 2) {
            return true;
        }
        let left = point -2;
        let right = point + 1;
        while(left >= 0 && right < grid.length) {
            if (grid[left].join("") !== grid[right].join("")) {
                return false;
            }
            left -=1;
            right +=1;
        }
        return true;
    });
}

function calculateSummary(grid) {
    const invertedGrid = transpose(grid);
    const horizontalSymmetry = findSymmetry(grid) ?? 0;
    const verticalSymmetry = findSymmetry(invertedGrid) ?? 0;
    return [horizontalSymmetry, verticalSymmetry]
}

const symmetryResults = new Map();

export async function solution1() {
    const lines = readLines(inputPath);
    const grids = await readGrids(lines);
    return grids.reduce((total, grid, i) => {
        const [horizontalSymmetry, verticalSymmetry] = calculateSummary(grid);
        symmetryResults.set(i, [horizontalSymmetry, verticalSymmetry]);
        return total + (horizontalSymmetry * 100) + verticalSymmetry;
    }, 0);
};

function findPossiblePointsWithSmudge(grid) {
    const possiblePoints = [];
    grid.forEach((row, i) => {
        const key = row.join("");
        if (i > 0 && key === grid[i-1].join("")) {
            possiblePoints.push({point: i, smudge: false});
        } else if (i > 0) {
            const diff = row.reduce((diff, el, index) => {
                if (el !== grid[i-1][index]) {
                    diff.push(index);
                }
                return diff;
            }, []);
            if (diff.length === 1) {
                possiblePoints.push({point: i, smudge: true});
            }
        }
    });
    return possiblePoints;
} 

function findSymmetryWithSmudge(grid) {
    const possiblePoints = findPossiblePointsWithSmudge(grid);
    const lines = possiblePoints.filter(({point, smudge}) => {
        let left = point -2;
        let right = point + 1;
        let smudgeCount = 0;
        while(left >= 0 && right < grid.length) {
            if (grid[left].join("") !== grid[right].join("")) {
                if (smudge) {
                    return false;
                }
                const diff = grid[left].reduce((diff, el, index, arr) => {
                    if (el !== grid[right][index]) {
                        diff.push(index);
                    }
                    return diff;
                }, []);
                if (diff.length > 1) {
                    return false;
                } else {
                    smudgeCount +=1;
                }
            }
            if (smudgeCount > 1) {
                return false;
            }
            left--;
            right++;
        }
        return true;
    }, []);
    return lines;
}

function calculateSummaryWithSmudge(grid, index) {
    const horizontalSymmetry = findSymmetryWithSmudge(grid).filter(el => el.point !== symmetryResults.get(index)[0]);
    const invertedGrid = transpose(grid);
    const verticalSymmetry = findSymmetryWithSmudge(invertedGrid).filter(el => el.point !== symmetryResults.get(index)[1]);
    return [horizontalSymmetry?.[0]?.point ?? 0, verticalSymmetry?.[0]?.point ?? 0];
}

export async function solution2() {
    const lines = readLines(inputPath);
    const grids = await readGrids(lines);
    return grids.reduce((total, grid, i) => {
        const [horizontalSymmetry, verticalSymmetry] = calculateSummaryWithSmudge(grid, i);
        return total + (100*horizontalSymmetry) + verticalSymmetry;
    }, 0);
};
