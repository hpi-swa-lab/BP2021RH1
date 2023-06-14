import {
  Filter1,
  Filter2,
  Filter3,
  Filter4,
  Filter5,
  Filter6,
  Filter7,
  Filter8,
  Filter9,
  Filter9Plus,
  FilterNone,
} from '@mui/icons-material';

export const SequenceCount = ({ count }: { count: number }) => {
  const icons = [
    FilterNone,
    Filter1,
    Filter2,
    Filter3,
    Filter4,
    Filter5,
    Filter6,
    Filter7,
    Filter8,
    Filter9,
    Filter9Plus,
  ];
  const Icon = icons[Math.min(count, icons.length - 1)];
  return <Icon />;
};
