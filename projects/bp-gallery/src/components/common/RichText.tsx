import ReactHtmlParser from 'react-html-parser';
import { sanitize } from 'isomorphic-dompurify';

type RichTextProps = {
  value: string;
  className?: string;
};

const RichText = ({ value, className }: RichTextProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  return <div className={className}>{ReactHtmlParser(sanitize(value))}</div>;
};

export default RichText;
