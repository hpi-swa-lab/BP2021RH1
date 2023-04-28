import { useMobile } from '../../hooks/context-hooks';
import NavigationBar from './NavigationBar';

const BottomBar = () => {
  const { isMobile } = useMobile();

  return isMobile ? <NavigationBar isMobile /> : null;
};

export default BottomBar;
