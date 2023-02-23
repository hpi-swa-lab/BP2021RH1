import { sanitize } from 'isomorphic-dompurify';
import ReactHtmlParser from 'react-html-parser';

type RichTextProps = {
  value: string;
  className?: string;
};

const RichText = ({ value, className }: RichTextProps) => {
  return <div className={className}>{ReactHtmlParser(sanitize(value))}</div>;
};

export default RichText;
