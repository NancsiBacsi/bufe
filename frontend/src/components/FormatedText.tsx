import React from "react";

interface Props {
  formatedTxt: string;
  className?: string;
}
export default function FormatedTxt({ formatedTxt, className }: Props) {
  const lines = formatedTxt.split("\n");
  return (
     <p className={className}>
      {lines.map((line, i) => {
        const parts = line.split(/(\*\*.*?\*\*)/g);
        return (
          <React.Fragment key={i}>
            {parts.map((part, j) => {
              if (part.startsWith("**") && part.endsWith("**")) {
                return (
                  <strong key={j}>
                    {part.slice(2, -2)}
                  </strong>
                );
              } else
                return <span key={j}>{part}</span>;
            })}
            <br/>
          </React.Fragment>
        );
      })}
    </p>
  );
}