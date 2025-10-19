import React from "react";
import ErrorLine from "../ErrorLine";
import PageTitle from "../page/PageTitle";

interface Props {
  children: React.ReactNode;
  beforeList?: React.ReactNode;
  title?: string;
  error?: string | null;
}

export const ListContainer = ({ children, title, error, beforeList }: Props) => (
  <div>
    <PageTitle title={title}/>
    <ErrorLine error={error}/>
    {beforeList}
    <ul className="list-none box-border w-full max-w-[400px] bg-white p-4 rounded-md shadow-lg">
      {React.Children.map(children, (child, i) => (
        <li key={i} className="w-full mb-2 last:mb-0">
          {child}
        </li>
      ))}
    </ul>
  </div>
);