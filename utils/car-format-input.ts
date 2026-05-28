export const autoTrimUppercaseRemoveSpecialChars = (value: string): string => {
    return value.toUpperCase().trim().replace(/[^A-Z0-9/]/g, '');
}

export const autoTrim = (value: string): string => {
    return value.trim();
}