import { readLines, directions } from "../utils.js";

const inputPath = new URL("./input.txt", import.meta.url);

export async function solution1() {
    const lines = readLines(inputPath);
    const partSet = new Set();
    const nums = [];
    let lineCount = 0;
    for await (const line of lines) {
        let num = "";
        const chars = line.split("");
        chars.forEach((el, i) => {
            if (!isNaN(Number(el))) {
                num += el;
            } else {
                if (num) {
                    nums.push({num: Number(num), position: i-num.length, line: lineCount, length: num.length});
                    num = "";
                }
                if (el !== ".") {
                    partSet.add(`${lineCount}-${i}`);
                }
            }
        });
        if (num) {
            nums.push({num: Number(num), position: chars.length-num.length, line: lineCount, length: num.length});
        }
        lineCount++;
    }
    return nums.reduce((total, {num, position, line, length}) => {
        const positionRange = Array(length).fill(position).map((x,y) => x+y);
        if (positionRange.some(y => directions.some(([lineOffset, positionOffset]) => {
            if (line+lineOffset < 0 || y+positionOffset <0) {
                return false;
            }
            return partSet.has(`${line+lineOffset}-${y+positionOffset}`)
        }))) {
            total += num;
        }
        return total;
    }, 0);
};

export async function solution2() {
    const lines = readLines(inputPath);
    const numsMap = {};
    const gears = [];
    let lineCount = 0;
    const directions = [[-1,0], [1,0], [1,1], [-1,1], [0,1], [0,-1], [-1,-1], [1,-1]];
    for await (const line of lines) {
        let num = "";
        const chars = line.split("");
        chars.forEach((el, i) => {
            if (!isNaN(Number(el))) {
                num += el;
            } else {
                if (num) {
                    for (let a = i-1; a >= i-num.length; a--) {
                        numsMap[`${lineCount}-${a}`] = Number(num);
                    }
                    num = "";
                }
                if (el === "*") {
                    gears.push({line: lineCount, position: i});
                }
            }
        });
        if (num) {
            for (let a = chars.length - 1; a >= chars.length-num.length; a--) {
                numsMap[`${lineCount}-${a}`] = Number(num);
            }
        }
        lineCount++;
    }
    return gears.reduce((total, {line, position}) => {
        const matchedNums = directions.reduce((matchedGears, [lineOffset, positionOffset]) => {
            const coordsKey = `${line+lineOffset}-${position+positionOffset}`;
            if (coordsKey in numsMap) {
                matchedGears.add(numsMap[coordsKey]);
            }
            return matchedGears;
        }, new Set());
        if (matchedNums.size == 2) {
            total += Array.from(matchedNums).reduce((mult, num) => num * mult, 1);
        }
        return total;
    }, 0);
};
