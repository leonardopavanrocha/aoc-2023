
import { numberMap, readLines, memoize } from "../utils.js";

const inputPath = new URL("./input.txt", import.meta.url);

const countPossibleSolutionsRecursive = memoize((input, pattern) => {
    const [char] = input;
    if (!char) { // string is empty, if pattern is empty, return 1 else 0
        return pattern.length ? 0 : 1;
    } else if (char === ".") {
        return countPossibleSolutionsRecursive(input.slice(1), pattern)
    } else if (char === "#") {
        const [nextGroup] = pattern;
        if (!nextGroup || nextGroup > input.length || input[nextGroup] === "#" || input.slice(0, nextGroup).includes(".")) {
            return 0;
        }
        return countPossibleSolutionsRecursive(input.slice(nextGroup + 1), pattern.slice(1));
    } else {
        return countPossibleSolutionsRecursive(["#"].concat(input.slice(1)), pattern) + countPossibleSolutionsRecursive(["."].concat(input.slice(1)), pattern);
    }
});

export async function solution1() {
    const lines = readLines(inputPath);
    let total = 0;
    for await (const line of lines) {
        const [string, pattern] = line.split(" ");
        const res = countPossibleSolutionsRecursive(string.split(""), numberMap(pattern.split(",")));
        total += res;
    }
    return total;
};

export async function solution2() {
    const lines = readLines(inputPath);
    let total = 0;
    for await (const line of lines) {
        const [string, pattern] = line.split(" ");
        const inputList = Array(5).fill(string).join("?").split("");
        const patternList = numberMap(Array(5).fill(pattern.split(",")).flat(1));
        const res = Number(countPossibleSolutionsRecursive(inputList, patternList));
        total += res;
    }
    return total;
};
