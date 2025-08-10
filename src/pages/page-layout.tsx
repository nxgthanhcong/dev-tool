import React from "react";

interface PageLayoutProps {
  title: string;
  children: React.ReactNode;
}

export default function PageLayout({ title, children }: PageLayoutProps) {
  return (
    <div className="flex flex-col gap-4 ml-5">
      <div className="flex items-end fixed top-5 right-10">
        <span className="mr-2">suy sup tuoi 25</span>
        <img
          src="/dev-tool/tubt.jpg"
          alt="Photo by Drew Beamer"
          className="h-16 w-16 rounded-lg object-cover dark:brightness-[0.2] dark:grayscale"
        />{" "}
      </div>
      {/* Page Header */}
      <header>
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-gray-500">This is the {title.toLowerCase()} page.</p>
      </header>

      {/* Page Body */}
      <section>{children}</section>
    </div>
  );
}
