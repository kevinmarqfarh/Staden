/**
 * The wordmark: STADEN in Familjen Grotesk 700, all caps.
 *
 * The spec calls for SVG outlines with four optical cuts drawn in (flattened A
 * apex, chamfered D bowl, equalised E arms). Those cuts require the licensed
 * outline data; until the font binary is vendored into the repo this renders as
 * live text with the specified tracking and the two local kerning pairs applied
 * per-letter. Metrics drift is bounded by next/font's adjustFontFallback, which
 * matches the fallback's cap height and advance to Familjen Grotesk's.
 *
 * The lockup is: wordmark, then a 2px rule bleeding full width, then the city
 * in DM Mono sitting on that rule.
 */
export function Ordmarke({
  stad,
  storlek = "bar",
}: {
  stad: string;
  storlek?: "bar" | "masthead" | "rail";
}) {
  return (
    <span className={`ordmarke ordmarke--${storlek}`}>
      <span className="ordmarke__ord" aria-hidden="true">
        <span className="k-st">ST</span>
        <span>A</span>
        <span className="k-de">DE</span>
        <span className="k-n">N</span>
      </span>
      <span className="visually-hidden">STADEN, {stad}</span>
      <span className="ordmarke__regel" aria-hidden="true" />
      <span className="ordmarke__stad katalog" aria-hidden="true">
        {stad}
      </span>
    </span>
  );
}
