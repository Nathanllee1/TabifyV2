

export function calculateTextMatchingScore(text1: string, text2: string): number {

    // make both text in lowercase
    text1 = text1.toLowerCase();
    text2 = text2.toLowerCase();
    const text1Words = text1.split(" ");
    const text2Words = text2.split(" ");
    const text1WordsSet = new Set(text1Words);
    const text2WordsSet = new Set(text2Words);
    const intersection = new Set([...text1WordsSet].filter(x => text2WordsSet.has(x)));
    const union = new Set([...text1WordsSet, ...text2WordsSet]);
    return intersection.size / union.size;
}