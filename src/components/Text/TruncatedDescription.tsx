import { FC, useState } from "react";

interface IProps {
  text: string;
  truncatedLength?: number;
  autowrap?: number;
  onExpand?: (text: string) => boolean;
}

function testWhite(x: string) {
  var white = new RegExp(/^\s$/);
  return white.test(x.charAt(0));
}

function wordWrap(str: string, maxWidth: number): string {
  var newLineStr = "\n";
  var res = "";
  while (str.length > maxWidth) {
    let found = false;
    // Inserts new line at first whitespace of the line
    for (let i = maxWidth - 1; i >= 0; i--) {
      if (testWhite(str.charAt(i))) {
        res = res + [str.slice(0, i), newLineStr].join("");
        str = str.slice(i + 1);
        found = true;
        break;
      }
    }
    // Inserts new line at maxWidth position, the word is too long to wrap
    if (!found) {
      res += [str.slice(0, maxWidth), newLineStr].join("");
      str = str.slice(maxWidth);
    }
  }

  return res + str;
}

const TruncatedDescription: FC<IProps> = ({
  text,
  truncatedLength = 20,
  autowrap,
  onExpand,
}) => {
  const [expanded, setExpanded] = useState(false);

  if (!text) return null;
  const exceedsLength = text.length > truncatedLength;

  let displayedText = expanded ? text : text.slice(0, truncatedLength);

  return (
    <div>
      <span>
        {autowrap ? wordWrap(displayedText, autowrap) : displayedText}
      </span>
      {exceedsLength && (
        <button
          className={"text-blue"}
          onClick={() => (onExpand ? onExpand(text) : setExpanded(!expanded))}
          style={{
            marginLeft: 5,
            color: "purple",
            cursor: "pointer",

            // button style reset
            border: "none",
            background: "none",
          }}
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
};

export default TruncatedDescription;
