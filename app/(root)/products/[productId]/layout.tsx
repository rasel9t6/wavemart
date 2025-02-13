import React from 'react';
import RightSidebarPage from '../../@rightSidebar/page';

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex w-full justify-between">
      <div className="flex-1 px-5">{children}</div>
      <RightSidebarPage />
    </div>
  );
}
