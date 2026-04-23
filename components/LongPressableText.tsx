
import React from 'react';
import { useLongPressTTS } from '../hooks/useLongPressTTS';

interface LongPressableTextProps {
  text: string;
  language?: string;
  className?: string;
  children?: React.ReactNode;
  as?: any;
  dir?: string;
  onClick?: () => void;
}

const LongPressableText: React.FC<LongPressableTextProps> = ({ 
  text, 
  language = 'en', 
  className = '', 
  children,
  as: Component = 'div',
  dir,
  onClick
}) => {
  const handlers = useLongPressTTS(text, language);

  return (
    <Component 
      {...handlers} 
      onClick={onClick}
      className={`${className} cursor-pointer active:opacity-70 transition-opacity select-none touch-manipulation`} 
      dir={dir}
    >
      {children || text}
    </Component>
  );
};

export default LongPressableText;
