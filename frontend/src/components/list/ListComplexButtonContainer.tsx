import React from "react";

interface Props {
  children: React.ReactNode;
}
export const ListComplexButtonContainer = ( { children }: Props )  => (
  <div className="flex items-center gap-1 w-full box-border">
    {React.Children.map(children, (child, i) => (
      child
    ))}
  </div>
);