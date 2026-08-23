import Link from "next/link";
import { Anslag } from "@/components/Anslag";
import { Katalogplatta } from "@/components/Katalogplatta";
import { Sparaknapp } from "@/components/Sparaknapp";
import { prisrad } from "@/lib/tid";
import type { Objekt } from "@/lib/typer";

/**
 * The object chassis. One component renders an event and a permanent place at
 * the same size in the same room — which is what makes "what happens" and
 * "what exists" one collection rather than two products stapled together.
 *
 * Every layout decision inside the card is a container query, never a viewport
 * query, so the same card is correct in the 288px rail, the 360px pane and the
 * 924px gallery.
 *
 * The whole card is the hit target. The save control is a square 44×44 at the
 * bottom-right — square, not circular, because the round top-right save button
 * is the Airbnb/Pinterest tell.
 */
export function Objektkort({
  objekt,
  nu,
  stad,
  format = "kort",
  visaEtikett = false,
}: {
  objekt: Objekt;
  nu: Date;
  stad: string;
  format?: "kort" | "led";
  visaEtikett?: boolean;
}) {
  const pris = prisrad(
    objekt.prisSlag,
    objekt.prisMinOre,
    objekt.prisMaxOre,
    objekt.prisNot,
  );
  const harBild = Boolean(objekt.media?.url);
  const salNamn = objekt.sal === "sevardheter" ? "SEVÄRDHETER" : objekt.sal.toUpperCase();

  return (
    <article
      className={`objekt objekt--${format}`}
      data-sal={objekt.sal}
      data-slag={objekt.slag}
    >
      <Link
        href={`/${stad}/objekt/${objekt.slug}`}
        className="objekt__yta"
        style={{ viewTransitionName: `objekt-${objekt.accession}` }}
      >
        <div className="objekt__media">
          {harBild ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={objekt.media!.url}
              alt={objekt.media!.alt}
              width={objekt.media!.bredd}
              height={objekt.media!.hojd}
              loading={format === "led" ? "eager" : "lazy"}
              decoding="async"
            />
          ) : (
            <Katalogplatta objekt={objekt} format={format} />
          )}
        </div>

        {harBild && objekt.media?.kredit && (
          <p className="objekt__kredit katalog">{objekt.media.kredit}</p>
        )}

        <div className="objekt__kropp">
          <p className="objekt__accession katalog" aria-hidden="true">
            NR {objekt.accession} · SAL {salNamn}
          </p>

          <h3 className="objekt__titel">{objekt.titel}</h3>

          {visaEtikett && <p className="objekt__etikett etikett">{objekt.varfor}</p>}

          {/* KATALOGRALEN — four fixed slots. Wraps rather than truncates at
              200% zoom, because the rail declares its own container. */}
          <div className="katalograd katalog">
            <span>{objekt.kvarter?.toUpperCase() ?? salNamn}</span>
            <span>
              {objekt.slag === "handelse" ? (
                <Anslag objekt={objekt} nu={nu} format="rad" />
              ) : objekt.oppettider.length > 0 ? (
                "ÖPPET IDAG"
              ) : (
                "ALLTID ÖPPET"
              )}
            </span>
            {/* Unknown price is omitted entirely — never greyed, never an
                em-dash. */}
            {pris && <span>{pris}</span>}
            {objekt.gangminuter != null && objekt.gangminuter > 0 && (
              <span>{objekt.gangminuter} MIN</span>
            )}
          </div>
        </div>
      </Link>

      <Sparaknapp objektId={objekt.id} titel={objekt.titel} />
    </article>
  );
}
