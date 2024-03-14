export const objectify = <T>(payload: T): T => {
  return JSON.parse(JSON.stringify(payload));
};

export const removeObjectEmptyOrNull = (obj: { [x: string]: any }) => {
  Object.keys(obj).forEach((k) => {
    (obj[k] && typeof obj[k] === "object" && removeObjectEmptyOrNull(obj[k])) ||
      (!obj[k] && obj[k] !== undefined && delete obj[k]);
  });
};
