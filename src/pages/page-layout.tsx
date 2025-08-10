import React from "react";

interface PageLayoutProps {
  title: string;
  children: React.ReactNode;
}

export default function PageLayout({ title, children }: PageLayoutProps) {
  return (
    <div className="flex flex-col gap-4 ml-5">
      {/* Page Header */}
      <header>
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-gray-500">This is the {title.toLowerCase()} page.</p>
      </header>

      {/* Page Body */}
      <section>{children}</section>
    </div>
  );
}
