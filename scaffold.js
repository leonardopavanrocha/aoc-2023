import { appendFileSync, mkdirSync } from "fs";
import { argv } from "process";

const solutionScaffold = `
import { readLines } from "../utils.js";

const inputPath = new URL("./example.txt", import.meta.url);

export async function solution1() {
    const lines = readLines(inputPath);
    for await (const line of lines) {
        
    }
    return 0;
};

export async function solution2() {
    const lines = readLines(inputPath);
    for await (const line of lines) {
        
    }
    return 0;
};
`;


if (argv[2]) {
    const folderName = `./day${argv[2]}`;
    mkdirSync(folderName);

    appendFileSync(`${folderName}/example.txt`, "");
    appendFileSync(`${folderName}/solution.js`, solutionScaffold);
    appendFileSync(`${folderName}/input.txt`, "");
}
