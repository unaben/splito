export function titleCase(str: string): string {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  }