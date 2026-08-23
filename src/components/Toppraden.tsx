import Link from "next/link";
import { Ordmarke } from "@/components/Ordmarke";
import { Temavaljare } from "@/components/Temavaljare";

/**
 * The sticky top bar: 56px of content plus the top safe-area inset, opaque
 * ground, one hairline. Never height-locked, never translucent by default.
 *
 * SÖK lives here rather than in the tab bar for two reasons that are not
 * compromises: Android's IME resizes the layout viewport and fights a
 * bottom-anchored field, and three tabs at 390px give each label the width it
 * needs to never truncate.
 */
export function Toppraden({ stad, stadNamn }: { stad: string; stadNamn: string }) {
  return (
    <header className="toppraden">
      <Link href={`/${stad}`} className="toppraden__lockup">
        <Ordmarke stad={stadNamn} storlek="bar" />
      </Link>

      <Temavaljare />

      <Link href={`/${stad}/sok`} className="toppraden__sok" aria-label="Sök i staden">
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
          <circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M15.5 15.5 21 21" stroke="currentColor" strokeWidth="2" />
        </svg>
      </Link>
    </header>
  );
}
