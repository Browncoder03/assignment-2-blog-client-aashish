import { expect, test } from "vitest";

import { cx } from "./classes.js";

test("classes correctly combines classes", () => {
  // Normal class strings should be joined with spaces.
  expect(cx("a", "b", "c")).toBe("a b c");

  // null and undefined values should be ignored.
  expect(cx("a", null, undefined)).toBe("a");

  // For object values, only keys with true values are included.
  expect(cx("a", { b: true, c: false, d: null })).toBe("a b");
});