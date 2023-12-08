
import { readLines, computeFrequency } from "../utils.js";

const inputPath = new URL("./input.txt", import.meta.url);

const cards = ["A", "K", "Q", "J", "T", 9, 8, 7, 6, 5, 4, 3, 2].reduce((cardMap, el, index, arr) => {
    cardMap[el] = arr.length - index;
    return cardMap;
}, {});

const cardsWithJoker = ["A", "K", "Q", "T", 9, 8, 7, 6, 5, 4, 3, 2, "J"].reduce((cardMap, el, index, arr) => {
    cardMap[el] = arr.length - index;
    return cardMap;
}, {});

function twoPair(hand, countJoker=false) {
    const freq = computeFrequency(hand);
    const pairs = [];
    for (const [card, count] of Object.entries(freq)) {
        const numberOfJokers = countJoker ? freq["J"] || 0 : 0;
        if (count >= 2) {
            pairs.push(card);
        } else if (count + numberOfJokers >= 2) {
            pairs.push(card);
            freq["J"] -= 2 - count;
            if (freq["J"] < 0) {
                freq["J"] = 0;
            }
        }
    }
    return pairs.length === 2;
}

function xOfKind(x) {
    return (hand, countJoker=false) => {
        const freq = computeFrequency(hand);
        for (const [card, count] of Object.entries(freq)) {
            const numberOfJokers = countJoker ? freq["J"] || 0 : 0;
            if (count === x) {
                return true;
            } else if(countJoker && card !== "J" && count + numberOfJokers >= x) {
                return x - count;
            }
        }
        return false;
    }
};

function fullHouse(hand, countJoker=false) {
    const freq = computeFrequency(hand);
    const [top1, top2, _] = Object.entries(freq).sort((a,b) => b[1]-a[1]);
    const numberOfJokers = freq["J"] ?? 0;
    return countJoker && top1[0] !== "J" && top2[0] !== "J" ? top1[1] + top2[1] + numberOfJokers === 5 : top1[1] === 3 && top2[1] == 2;
}

const types = [xOfKind(5), xOfKind(4), fullHouse, xOfKind(3), twoPair, xOfKind(2)];

export async function solution1() {
    const lines = readLines(inputPath);
    const hands = []
    for await (const line of lines) {
        const [hand, bid] = line.split(" ");
        hands.push([
            hand.split("").map(el => isNaN(Number(el)) ? el : Number(el)),
            Number(bid)
        ]);
    }
    hands.sort((handA, handB) => {
        const handAScore = types.findIndex((type) => type(handA[0]));
        const handBScore = types.findIndex((type) => type(handB[0]));
        if (handAScore !== handBScore) {
            if (handAScore === -1) {
                return 1; // hand A is smaller, so it should go to the end
            } else if (handBScore === -1) {
                return -1; // hand A is greater, so it should go to the beginning
            }
            return handAScore - handBScore;
        }
        const cardAPointer = handA[0];
        const cardBPointer = handB[0];
        let index = 0;
        while (cardAPointer[index] == cardBPointer[index]) {
            index++;
        }
        return cards[cardBPointer[index]] - cards[cardAPointer[index]];
    });
    return hands.reduce((total, [_, bid], index, arr) => total + (arr.length - index) * bid, 0);
};

export async function solution2() {
    const lines = readLines(inputPath);
    const hands = []
    for await (const line of lines) {
        const [hand, bid] = line.split(" ");
        hands.push([
            hand.split("").map(el => isNaN(Number(el)) ? el : Number(el)),
            Number(bid)
        ]);
    }
    hands.sort((handA, handB) => {
        const handAScore = types.findIndex((type) => type(handA[0], true));
        const handBScore = types.findIndex((type) => type(handB[0], true));
        if (handAScore !== handBScore) {
            if (handAScore === -1) {
                return 1; // hand A is smaller, so it should go to the end
            } else if (handBScore === -1) {
                return -1; // hand A is greater, so it should go to the beginning
            }
            return handAScore - handBScore;
        }
        const cardAPointer = handA[0];
        const cardBPointer = handB[0];
        let index = 0;
        while (cardAPointer[index] == cardBPointer[index]) {
            index++;
        }
        return cardsWithJoker[cardBPointer[index]] - cardsWithJoker[cardAPointer[index]];
    });

    return hands.reduce((total, [_, bid], index, arr) => total + (arr.length - index) * bid, 0);
};
