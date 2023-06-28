import { PropsWithChildren } from 'react';

export const CenteredContainer = ({ title, children }: PropsWithChildren<{ title: string }>) => {
  return (
    <div className='w-[800px] mx-auto mt-4'>
      <h1>{title}</h1>
      {children}
    </div>
  );
};
