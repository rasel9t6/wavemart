import React from "react";
import LeftSidebarPage from "../@leftSidebar/page";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative bg-neutral-100 text-neutral-900">
            <div className="flex">
              <LeftSidebarPage />
              <section className="flex flex-1 flex-col overflow-hidden ">
                <div className="h-full">{children}</div>
              </section>
            </div>
          </main>
  )
}