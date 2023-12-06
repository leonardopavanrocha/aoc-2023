
import { numberMap, readLines, zip, bhaskara } from "../utils.js";

const inputPath = new URL("./example.txt", import.meta.url);


export async function solution1() {
    const lines = readLines(inputPath);
    const data = [];
    for await (const line of lines) {
        data.push(numberMap(line.match(/((?:\d+\s*)+)/g)[0].split(/\s+/)));
    }
    const races = zip(data[0], data[1]);
    return races.reduce((total, [time, distance]) => {
        const a = -1;
        const b = time;
        const [firstZero, secondZero] = bhaskara(a, b, -distance);
        return total * (Math.ceil(firstZero) - Math.floor(secondZero) - 1);
    }, 1);
};

export async function solution2() {
    const lines = readLines(inputPath);
    const data = [];
    for await (const line of lines) {
        data.push(Number(line.match(/((?:\d+\s*)+)/g)[0].split(/\s+/).join("")));
    }
    const [time, distance] = data;
    const a = -1;
    const b = time;
    const [firstZero, secondZero] = bhaskara(a, b, -distance);
    return (Math.ceil(firstZero) - Math.floor(secondZero) - 1);
};
