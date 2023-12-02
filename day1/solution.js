import { readLines } from "../utils.js";

const inputPath = new URL("./input.txt", import.meta.url);

const digits = {
    "one": 1,
    "two": 2,
    "three": 3,
    "four": 4,
    "five": 5,
    "six": 6,
    "seven": 7,
    "eight": 8,
    "nine": 9
};

function getTypedNumber(str, index) {
    let builtStr;
    for (let i=0; i < 5; i++) {
        if (index - i < 0) {
            break;
        }
        builtStr = str.slice(index-i, index+1);
        if (builtStr in digits) {
            return digits[builtStr];
        }
    }
    return false;
};

function getNum(line, takeTypedNumbers=false) {
    const nums = line.split("").reduce((nums, item, index) => {
        const typedNumber = takeTypedNumbers && getTypedNumber(line, index);
        if (typedNumber) {
            nums.push(typedNumber);
        } else if (!isNaN(Number(item))) {
            nums.push(Number(item));
        }
        return nums;
    }, []);
    return (nums[0] * 10 + nums.at(-1));
};

export async function solution1() {
    const lines = readLines(inputPath);
    let total = 0;
    for await (const line of lines) {
        total += getNum(line);
    }
    return total;
};

export async function solution2() {
    const lines = readLines(inputPath);
    let total = 0;
    for await (const line of lines) {
        total += getNum(line, true);
    }
    return total;
};
