// A class value can be:
// - a string
// - null or undefined
// - an object where true values include the class name
type ClassValue =
  | string
  | null
  | undefined
  | Record<string, boolean | null | undefined>;

export function cx(...values: ClassValue[]): string {
  // Store valid class names here.
  const classNames: string[] = [];

  values.forEach((value) => {
    // Ignore null and undefined.
    if (value == null) {
      return;
    }

    // Add normal string classes directly.
    if (typeof value === "string") {
      classNames.push(value);
      return;
    }

    // For objects, add only keys whose value is true.
    Object.entries(value).forEach(([className, enabled]) => {
      if (enabled === true) {
        classNames.push(className);
      }
    });
  });

  // Join all class names using one space.
  return classNames.join(" ");
}