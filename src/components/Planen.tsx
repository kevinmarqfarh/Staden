import type { Sal } from "@/lib/typer";

/**
 * PLANEN — the floor plan. A square plate divided by two off-centre walls into
 * four unequal rooms, with one room filled solid: this is the building, these
 * are the four wings, you are standing in this one.
 *
 * No pin, no compass, no teardrop, no circle, no diagonal — the shapes that
 * make every travel app's mark interchangeable.
 *
 * Every painted band lands on an even coordinate and every band is 2 units
 * wide, so the figure halves cleanly to a 16px favicon with no anti-aliasing
 * mush. The rooms are deliberately unequal: a symmetric cross in a square is a
 * compass rose, and this is a plan.
 *
 * The filled room is decorative reinforcement of the active wing only. The room
 * name in words is always present beside it — nothing here is distinguished by
 * colour or position alone.
 */

const RUM: Record<Sal, { x: number; y: number; w: number; h: number }> = {
  kultur: { x: 3, y: 3, w: 9, h: 15 },
  nojen: { x: 14, y: 3, w: 15, h: 15 },
  mat: { x: 3, y: 20, w: 9, h: 9 },
  sevardheter: { x: 14, y: 20, w: 15, h: 9 },
};

const NEUTRALT = RUM.nojen;

export function Planen({
  sal,
  storlek = 22,
  className,
}: {
  sal?: Sal;
  storlek?: number;
  className?: string;
}) {
  const rum = sal ? RUM[sal] : NEUTRALT;

  return (
    <svg
      viewBox="0 0 32 32"
      width={storlek}
      height={storlek}
      fill="none"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {/* active room: filled first, so the walls overprint it */}
      <rect
        x={rum.x}
        y={rum.y}
        width={rum.w}
        height={rum.h}
        fill={sal ? "var(--sal, currentColor)" : "currentColor"}
      />
      {/* plate */}
      <rect x="3" y="3" width="26" height="26" stroke="currentColor" strokeWidth="2" />
      {/* north–south wall */}
      <rect x="12" y="3" width="2" height="26" fill="currentColor" />
      {/* east–west wall */}
      <rect x="3" y="18" width="26" height="2" fill="currentColor" />
    </svg>
  );
}
