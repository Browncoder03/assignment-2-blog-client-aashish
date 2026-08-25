import type { PropsWithChildren } from "react";

export function LinkList(
  props: PropsWithChildren<{ title: string }>,
) {
  return (
    <div>
      {/* Show the title of the list */}
      <h2>{props.title}</h2>

      {/* Show whatever components are passed inside LinkList */}
      <div>{props.children}</div>
    </div>
  );
}