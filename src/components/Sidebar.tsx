"use client";

import NavLinks from "./NavLinks";
import { useUnconfirmedDealerCount } from "@/lib/use-unconfirmed-dealer-count";

export default function Sidebar() {
  const unconfirmedCount = useUnconfirmedDealerCount();

  return (
    <aside className="sticky top-[68px] h-[calc(100vh-92px)] overflow-auto rounded-lg border border-[var(--line)] bg-[var(--surface)] p-3">
      <NavLinks unconfirmedCount={unconfirmedCount} />
    </aside>
  );
}
