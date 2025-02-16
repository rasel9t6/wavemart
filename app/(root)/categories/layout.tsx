import React from 'react';
import LeftSidebarPage from '../@leftSidebar/page';
import RightSidebarPage from '../@rightSidebar/page';

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <LeftSidebarPage />
      <section className="flex flex-1 flex-col overflow-hidden">
        <div className="relative h-full min-h-screen bg-gray-50">
          {children}
        </div>
      </section>
      <RightSidebarPage />
    </div>
  );
}
