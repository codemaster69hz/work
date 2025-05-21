"use client";

import TopHeader from "./TopHeader";
import MiddleHeader from "./MiddleHeader";
import BottomHeader from "./BottomHeader";

interface HeaderProps {
  user?: { username: string };
}

export default function Header({ user }: HeaderProps) {
  return (
    // <header className="w-full fixed top-0 left-0 right-0 z-50">
      <header className="w-full top-0 left-0 right-0 bg-white shadow-md">

      <TopHeader user={user} />
      <MiddleHeader />
      <BottomHeader />
    </header>
  );
}
