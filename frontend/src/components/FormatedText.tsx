import React from "react";

interface Props {
  formatedTxt: string;
  className?: string;
}
interface FormatToken {
  type: 'strong' | 'span';
  className: string;
  presuffix: string;
}
const FORMAT_TOKENS: FormatToken[] = [
  { type: 'strong', className: '', presuffix: '**' },
  { type: 'span', className: 'text-red-800', presuffix: '##r' },
  { type: 'strong', className: 'text-red-800', presuffix: '*#r' },
  { type: 'span', className: 'text-blue-800', presuffix: '##b' },
  { type: 'strong', className: 'text-blue-800', presuffix: '*#b' },
  { type: 'span', className: 'text-green-800', presuffix: '##g' },
  { type: 'strong', className: 'text-green-800', presuffix: '*#g' }
];
function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
const REGEX_PATTERN = new RegExp(
  FORMAT_TOKENS.map(token => 
    `(${escapeRegExp(token.presuffix)}.*?${escapeRegExp(token.presuffix)})`)
    .join('|'),
  'g'
);
function findMatchingToken(part: string | undefined): FormatToken | null {
  if (!part) return null;
  for (const token of FORMAT_TOKENS)
    if (part.startsWith(token.presuffix) && part.endsWith(token.presuffix))
      return token;
  return null;
}
export default function FormatedTxt({ formatedTxt, className }: Props) {
  const lines = formatedTxt.split("\n");
  return (
     <p className={className}>
      {lines.map((line, i) => {
        const parts = line.split(REGEX_PATTERN);
        return (
          <React.Fragment key={`line-${i}`}>
            {parts.map((part, j) => {
              const token = findMatchingToken(part);
              if (token) {
                const content = part.slice( token.presuffix.length, part.length - token.presuffix.length );
                const Tag = token.type; 
                return (
                  <Tag 
                    key={`line-${i}-${token.type}-${j}`} 
                    className={token.className}
                  >
                    {content}
                  </Tag>
                );
              } else if (part) {
                return <span key={`line-${i}-n-${j}`}>
                  {part}
                </span>;
              } else
                return null;
            })}
            <br key={`brk-${i}`}/>
          </React.Fragment>
        );
      })}
    </p>
  );
}