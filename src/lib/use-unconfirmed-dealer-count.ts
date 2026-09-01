"use client";

import { useState, useEffect } from "react";
import { useAuth } from "./providers/auth-context";
import { fetchDealerItems } from "./api";

export function useUnconfirmedDealerCount(): number {
  const { user } = useAuth();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!user || user.role !== "dealer") {
      setCount(0);
      return;
    }

    let cancelled = false;

    fetchDealerItems()
      .then((items) => {
        if (cancelled) return;
        const unconfirmed = items.filter(
          (i) => !i.confirmation_status || i.confirmation_status === "pending",
        );
        setCount(unconfirmed.length);
      })
      .catch(() => {
        if (!cancelled) setCount(0);
      });

    return () => {
      cancelled = true;
    };
  }, [user]);

  return count;
}
