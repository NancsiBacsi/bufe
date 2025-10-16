import React from "react";

interface Props {
  children: React.ReactNode;
}

export const ListContainer = ({ children }: Props) => (
  <ul className="list-none box-border w-full max-w-[400px] bg-white p-4 rounded-md shadow-lg">
    {React.Children.map(children, (child, i) => (
      <li key={i} className="w-full mb-2 last:mb-0">
        {child}
      </li>
    ))}
  </ul>
);