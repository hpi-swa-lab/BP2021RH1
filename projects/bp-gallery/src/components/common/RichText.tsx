import { sanitize } from 'isomorphic-dompurify';
import { LegacyRef } from 'react';
import ReactHtmlParser from 'react-html-parser';

type RichTextProps = {
  value: string;
  className?: string;
  textRef?: LegacyRef<HTMLDivElement>;
};

const RichText = ({ value, className, textRef }: RichTextProps) => {
  return (
    <div className={className} ref={textRef}>
      {ReactHtmlParser(sanitize(value))}
    </div>
  );
};

export default RichText;
