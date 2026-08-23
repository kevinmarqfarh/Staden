"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Planen } from "@/components/Planen";

/**
 * STADSRADEN — three destinations and one control. Nothing else is ever added.
 *
 * A five-tab bar is a confession that the IA was never resolved. STADEN has
 * exactly three nouns: the day, the city, mine. The label is never truncated
 * and never icon-only — that is the older-user and tourist requirement, and it
 * is what decides the item count.
 *
 * iPhone gets a floating inset capsule. Android gets an edge-to-edge bar, and
 * the capsule is forbidden there: a 12px bottom gap sits inside the 24dp
 * gesture-navigation strip and flickers during Chrome's toolbar collapse. The
 * platform is resolved server-side, so there is no flash and no layout shift.
 */

const MAL = [
  { href: "", etikett: "IDAG", namn: "Idag" },
  { href: "/salar", etikett: "SALARNA", namn: "Salarna" },
  { href: "/samlingar", etikett: "SAMLINGAR", namn: "Samlingar" },
] as const;

export function Stadsraden({ stad }: { stad: string }) {
  const pathname = usePathname();
  const [gomd, setGomd] = useState(false);

  /* The Android IME resizes the layout viewport and a bottom-anchored bar
     fights it. Retract on keyboard, restore on close. */
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const pa = () => setGomd(vv.height < window.innerHeight - 150);
    vv.addEventListener("resize", pa);
    return () => vv.removeEventListener("resize", pa);
  }, []);

  return (
    <nav
      className={`stadsraden${gomd ? " stadsraden--gomd" : ""}`}
      aria-label="Huvudnavigering"
    >
      {MAL.map((mal) => {
        const href = mal.href === "/samlingar" ? "/samlingar" : `/${stad}${mal.href}`;
        const aktiv =
          mal.href === ""
            ? pathname === `/${stad}`
            : pathname.startsWith(href);

        return (
          <Link
            key={mal.etikett}
            href={href}
            className="stadsraden__mal"
            aria-current={aktiv ? "page" : undefined}
          >
            <span className="stadsraden__ikon">
              <Planen storlek={22} />
            </span>
            <span className="stadsraden__etikett">{mal.etikett}</span>
            <span className="visually-hidden">{aktiv ? ", aktuell sida" : ""}</span>
          </Link>
        );
      })}
    </nav>
  );
}
