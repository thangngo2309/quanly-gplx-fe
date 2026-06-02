export const autoTrimUppercaseRemoveSpecialChars = (value: string): string => {
    return value.toUpperCase().trim().replace(/[^A-Z0-9/]/g, '');
}

export const autoTrim = (value: string): string => {
    return value.trim();
}

export const emptyToNull = <T>(value: T): T | null => {
  return (value as any) === "" ? null : value;
};