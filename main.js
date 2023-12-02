import { argv } from "process";

if (argv[2]) {
    const { solution1, solution2 } = await import(`./day${argv[2]}/solution.js`);
    console.log(`Solution 1: ${await solution1?.()}`);
    console.log(`Solution 2: ${await solution2?.()}`);
}