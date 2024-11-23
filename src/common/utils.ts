export const findFirstDigit = (input: string): string | null => {
    const match = input.match(/\d/);
    return match?.[0] || null;
};
