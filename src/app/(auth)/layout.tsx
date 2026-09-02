"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/providers/auth-context";
import Topbar from "@/components/Topbar";
import Sidebar from "@/components/Sidebar";
import NavLinks from "@/components/NavLinks";
import { useUnconfirmedDealerCount } from "@/lib/use-unconfirmed-dealer-count";
import { Warehouse } from "lucide-react";

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const unconfirmedCount = useUnconfirmedDealerCount();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [user, isLoading, router]);

  const closeMenu = () => setMenuOpen(false);

  if (isLoading) return null;
  if (!user) return null;

  return (
    <div className="min-h-screen">
      <Topbar onMenuToggle={() => setMenuOpen((v) => !v)} menuOpen={menuOpen} />

      {/* Mobile slide-over drawer */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 lg:hidden ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="absolute inset-0 bg-black/40" onClick={closeMenu} />
        <aside
          className={`absolute left-0 top-0 h-full w-[280px] bg-[var(--surface)] shadow-xl transition-transform duration-300 ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-12 items-center gap-2 border-b border-[var(--line)] px-3">
            <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md bg-teal-700 text-white font-bold">
              <Warehouse size={16} />
            </div>
            <div className="text-xs font-bold text-[var(--text-primary)]">Picking Control</div>
          </div>
          <div className="overflow-y-auto p-3" style={{ height: "calc(100% - 48px)" }}>
            <NavLinks onNavigate={closeMenu} unconfirmedCount={unconfirmedCount} />
          </div>
        </aside>
      </div>

      <div className="grid grid-cols-[260px_1fr] gap-5 px-4 pb-8 pt-5 sm:px-6 max-lg:grid-cols-1">
        <div className="max-lg:hidden">
          <Sidebar />
        </div>
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
