export function removeDuplicatesFromArray(arr: any[]): any[] {
    return [...new Set(arr)];
  }