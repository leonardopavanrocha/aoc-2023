import { readLines, sum } from "../utils.js";

const inputPath = new URL("./input.txt", import.meta.url);

export async function solution1() {
    const lines = readLines(inputPath);
    let total = 0;
    for await (const line of lines) {
        const [match, cardNumber, scratch, winners] = line.match(/Card\s+(\d+):((?:\s+\d+)*)\s\|((?:\s+\d+)*)/);
        const winnersSet = winners.split(" ").reduce((wSet, winner) => {
            if (!isNaN(parseInt(winner, 10))) {
                wSet.add(parseInt(winner, 10));
            }
            return wSet;
        }, new Set());
        const winnersCount = scratch.split(" ").filter(item => winnersSet.has(parseInt(item, 10))).length;
        if (winnersCount > 0) {
            total += 2**(winnersCount - 1);
        }
    }
    return total;
};

export async function solution2() {
    const lines = readLines(inputPath);
    let total = 0;
    const cardCountMap = {};
    for await (const line of lines) {
        const [match, card, scratch, winners] = line.match(/Card\s+(\d+):((?:\s+\d+)*)\s\|((?:\s+\d+)*)/);
        const cardNumber = parseInt(card, 10);
        if (!(cardNumber in cardCountMap)) {
            cardCountMap[cardNumber] = 1;
        } else {
            cardCountMap[cardNumber] += 1;
        }
        const winnersSet = winners.split(" ").reduce((wSet, winner) => {
            if (!isNaN(parseInt(winner, 10))) {
                wSet.add(parseInt(winner, 10));
            }
            return wSet;
        }, new Set());
        const winnersCount = scratch.split(" ").filter(item => winnersSet.has(parseInt(item, 10))).length;
        for (let i = 1; i <= winnersCount; i++) {
            if (!((cardNumber+i) in cardCountMap)) {
                cardCountMap[cardNumber+i] = 0;
            }
            cardCountMap[cardNumber+i] += cardCountMap[cardNumber];
        }
    }
    return sum(Object.values(cardCountMap));
};
