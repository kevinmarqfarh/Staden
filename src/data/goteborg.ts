import type { Objekt, Stad, Utgava } from "@/lib/typer";
import { fnv1a32 } from "@/lib/platta";

/**
 * Seed edition for Göteborg.
 *
 * This file is the shape the daily automation writes into Supabase — machine
 * proposes, human editor disposes. Every object here is `publicerad`, which
 * means a person wrote its `varfor` and confirmed its facts. Nothing in this
 * file came from Google Maps Platform: the only Google value the product may
 * persist is `googlePlaceId`, an identity join key.
 */

export const GOTEBORG: Stad = {
  slug: "goteborg",
  namn: "Göteborg",
  namnEn: "Gothenburg",
  ordmarkeStad: "GÖTEBORG",
  tidszon: "Europe/Stockholm",
  kvarter: [
    { slug: "centrum", namn: "CENTRUM", ordning: 1 },
    { slug: "nordstan", namn: "NORDSTAN", ordning: 2 },
    { slug: "haga", namn: "HAGA", ordning: 3 },
    { slug: "linne", namn: "LINNÉ", ordning: 4 },
    { slug: "majorna", namn: "MAJORNA", ordning: 5 },
    { slug: "hisingen", namn: "HISINGEN", ordning: 6 },
    { slug: "gamlestaden", namn: "GAMLESTADEN", ordning: 7 },
    { slug: "orgryte", namn: "ÖRGRYTE", ordning: 8 },
  ],
};

type Frobar = Omit<Objekt, "plattaFro" | "stad" | "kurering">;

function objekt(o: Frobar): Objekt {
  return {
    ...o,
    stad: "goteborg",
    kurering: "publicerad",
    plattaFro: fnv1a32(o.id),
  };
}

const IDAG = "2026-08-23";

type MuseumSeed = {
  id: string;
  slug: string;
  titel: string;
  underrubrik: string;
  varfor: string;
  platsNamn: string;
  adress: string;
  url: string;
  kvarter?: string;
  inomhus?: boolean;
};

function museum(o: MuseumSeed): Objekt {
  return objekt({
    id: o.id,
    slag: "plats",
    sal: "kultur",
    slug: o.slug,
    accession: `K-${o.id.slice(-4).toUpperCase()}`,
    titel: o.titel,
    underrubrik: o.underrubrik,
    varfor: o.varfor,
    kvarter: o.kvarter,
    platsNamn: o.platsNamn,
    adress: o.adress,
    prisSlag: "okand",
    arAnslag: false,
    passar: ["alla", "pa_besok", "ensam"],
    inomhus: o.inomhus ?? true,
    tillfallen: [],
    oppettider: [],
    lankar: [
      {
        slag: "hemsida",
        url: o.url,
        vard: new URL(o.url).hostname.replace(/^www\\./, ""),
        mobilanpassad: true,
      },
    ],
    harkomst: [
      {
        falt: "titel",
        kalla: "goteborg_co",
        hamtad: `${IDAG}T06:40:00+02:00`,
        licens: "proprietar_med_tillstand",
        attribution: "Göteborg & Co",
      },
    ],
  });
}

// Göteborg & Co:s musei- och gallerikatalog (kontrollerad 2026-08-23),
// kompletterad med Göteborg Energis Elyséum. De befintliga posterna ovan
// (Göteborgs konstmuseum och Universeum) lämnas intakta.
const KOMPLETTERANDE_MUSEER: Objekt[] = [
  museum({ id: "obj-rohsska-museet", slug: "rohsska-museet", titel: "Röhsska museet", underrubrik: "Design och konsthantverk", varfor: "Nordisk design, mode och konsthantverk från historiska samlingar till samtida formgivning.", platsNamn: "Röhsska museet", adress: "Vasagatan 37–39, 411 37 Göteborg", url: "https://rohsska.se", kvarter: "centrum" }),
  museum({ id: "obj-goteborgs-stadsmuseum", slug: "goteborgs-stadsmuseum", titel: "Göteborgs stadsmuseum", underrubrik: "12 000 år av Göteborgshistoria", varfor: "I Ostindiska huset möter du stadens historia, från vikingaskeppet till dagens Göteborg.", platsNamn: "Göteborgs stadsmuseum", adress: "Norra Hamngatan 12, 411 14 Göteborg", url: "https://goteborgsstadsmuseum.se", kvarter: "centrum" }),
  museum({ id: "obj-sjofartsmuseet-akvariet", slug: "sjofartsmuseet-akvariet", titel: "Sjöfartsmuseet Akvariet", underrubrik: "Havet, människan och Göteborg", varfor: "Maritim historia, levande akvarier och berättelser om relationen mellan människan och havet.", platsNamn: "Sjöfartsmuseet Akvariet", adress: "Karl Johansgatan 1–3, 414 59 Göteborg", url: "https://www.sjofartsmuseetakvariet.se", kvarter: "majorna" }),
  museum({ id: "obj-varldskulturmuseet", slug: "varldskulturmuseet", titel: "Världskulturmuseet", underrubrik: "Människor, föremål och globala perspektiv", varfor: "Ett museum där föremål, röster och samtida frågor från hela världen möts i utställningar och program.", platsNamn: "Världskulturmuseet", adress: "Södra vägen 54, 412 54 Göteborg", url: "https://www.varldskulturmuseet.se", kvarter: "centrum" }),
  museum({ id: "obj-hasselblad-center", slug: "hasselblad-center", titel: "Hasselblad Center", underrubrik: "Fotografi i världsklass", varfor: "Fotografiska utställningar och Hasselbladpriset i Göteborgs konstmuseums lokaler vid Götaplatsen.", platsNamn: "Hasselblad Center", adress: "Götaplatsen 6, 412 56 Göteborg", url: "https://www.hasselbladfoundation.org", kvarter: "centrum" }),
  museum({ id: "obj-naturhistoriska-museet", slug: "goteborgs-naturhistoriska-museum", titel: "Göteborgs naturhistoriska museum", underrubrik: "Djur, natur och evolution", varfor: "Upptäck miljoner djur, skelett och geologiska föremål – inklusive den välkända afrikanska elefanten.", platsNamn: "Göteborgs naturhistoriska museum", adress: "Museivägen 10, 413 11 Göteborg", url: "https://www.gnm.se", kvarter: "centrum" }),
  museum({ id: "obj-world-of-volvo", slug: "world-of-volvo", titel: "World of Volvo", underrubrik: "Upplevelsecenter för mobilitet och innovation", varfor: "Interaktiva berättelser om Volvo, svensk ingenjörskonst och hur framtidens resande kan se ut.", platsNamn: "World of Volvo", adress: "Lyckholms fabriker, 412 82 Göteborg", url: "https://www.worldofvolvo.com", kvarter: "orgryte" }),
  museum({ id: "obj-maritiman", slug: "maritiman", titel: "Maritiman", underrubrik: "Maritimt museum ombord", varfor: "Gå ombord på historiska fartyg och en ubåt mitt i Göteborgs hamn och upplev livet till sjöss på nära håll.", platsNamn: "Maritiman", adress: "Packhusplatsen 12, 411 13 Göteborg", url: "https://www.maritiman.se", kvarter: "centrum" }),
  museum({ id: "obj-oscar-ii-fort", slug: "oscar-ii-fort", titel: "Oscar II Fort", underrubrik: "Kustförsvar i Nya Varvet", varfor: "Ett historiskt fort i Göteborgs försvarslinje med underjordiska gångar och utsikt över älvinloppet.", platsNamn: "Oscar II Fort", adress: "Nya Varvet, 426 76 Västra Frölunda", url: "https://www.oscariiifort.se", kvarter: "majorna", inomhus: false }),
  museum({ id: "obj-fiskemuseet-hono", slug: "fiskemuseet", titel: "Fiskemuseet", underrubrik: "Fiskets historia i skärgården", varfor: "Modeller, foton och redskap berättar om fisket och livet på öarna i Göteborgs norra skärgård.", platsNamn: "Fiskemuseet", adress: "Västra vägen 17, 475 42 Hönö", url: "https://www.fiskemuseet.se", inomhus: true }),
  museum({ id: "obj-aeroseum", slug: "aeroseum", titel: "Aeroseum", underrubrik: "Flygmuseum i en berghangar", varfor: "Historiska flygplan, helikoptrar och experiment i en unik underjordisk hangar på Säve.", platsNamn: "Aeroseum", adress: "Holmvägen 100, 417 46 Göteborg", url: "https://aeroseum.se", inomhus: true }),
  museum({ id: "obj-goteborgs-konsthall", slug: "goteborgs-konsthall", titel: "Göteborgs Konsthall", underrubrik: "Samtidskonst", varfor: "Göteborgs kommunala konsthall visar svensk och internationell samtidskonst; verksamheten flyttar till Slakthuset 2027.", platsNamn: "Göteborgs Konsthall", adress: "Götaplatsen 7, 412 56 Göteborg", url: "https://goteborgskonsthall.se", kvarter: "centrum" }),
  museum({ id: "obj-molndals-stadsmuseum", slug: "molndals-stadsmuseum", titel: "Mölndals stadsmuseum", underrubrik: "Kulturhistoria i Kvarnbyn", varfor: "Mölndals historia, industriarv och vardagsliv i de gamla kvarnarna vid forsen.", platsNamn: "Mölndals stadsmuseum", adress: "Kvarnbygatan 12, 431 34 Mölndal", url: "https://www.molndal.se/stadsmuseum" }),
  museum({ id: "obj-galleri-thomassen", slug: "galleri-thomassen", titel: "Galleri Thomassen", underrubrik: "Samtida konst", varfor: "Ett etablerat Göteborgsgalleri med utställningar av svenska och internationella samtidskonstnärer.", platsNamn: "Galleri Thomassen", adress: "Götabergsgatan 32, 411 34 Göteborg", url: "https://www.gallerithomassen.se", kvarter: "centrum" }),
  museum({ id: "obj-paradox-museum", slug: "paradox-museum-gothenburg", titel: "Paradox Museum Gothenburg", underrubrik: "Illusioner och interaktiva upplevelser", varfor: "En lekfull utställning där paradoxala rum och optiska illusioner gör vetenskap och perception till en upplevelse.", platsNamn: "Paradox Museum Gothenburg", adress: "Södra Hamngatan 35, 411 14 Göteborg", url: "https://www.paradoxmuseumgothenburg.com", kvarter: "centrum" }),
  museum({ id: "obj-goteborgs-remfabrik", slug: "goteborgs-remfabrik", titel: "Göteborgs Remfabrik", underrubrik: "Arbetslivsmuseum i Gårda", varfor: "En av Skandinaviens bäst bevarade arbetsplatser från början av 1900-talet, med maskinerna kvar på plats.", platsNamn: "Göteborgs Remfabrik", adress: "Åvägen 15, 412 51 Göteborg", url: "https://www.remfabriken.se", kvarter: "orgryte" }),
  museum({ id: "obj-medicinhistoriska-museet", slug: "medicinhistoriska-museet", titel: "Medicinhistoriska museet", underrubrik: "400 år av medicinhistoria", varfor: "Föremål och berättelser visar hur sjukvård, behandlingar och människosyn har förändrats genom fyra sekler.", platsNamn: "Medicinhistoriska museet", adress: "Östra Hamngatan 11, 411 10 Göteborg", url: "https://medicinhistoriska.sahlgrenska.se", kvarter: "centrum" }),
  museum({ id: "obj-ostindiefararen-gotheborg", slug: "ostindiefararen-gotheborg", titel: "Ostindiefararen Götheborg", underrubrik: "Historiskt segelfartyg", varfor: "Den rekonstruerade ostindiefararen berättar om handel, sjöfart och Göteborgs globala historia.", platsNamn: "Ostindiefararen Götheborg", adress: "Eriksberg, 417 64 Göteborg", url: "https://www.gotheborg.se", kvarter: "hisingen", inomhus: false }),
  museum({ id: "obj-radiomuseet", slug: "radiomuseet", titel: "Radiomuseet", underrubrik: "Radio, teknik och kommunikation", varfor: "Historiska radioapparater, sändare och berättelser om hur ljud och information färdats genom luften.", platsNamn: "Radiomuseet", adress: "Anders Carlssons gata 2, 417 27 Göteborg", url: "https://www.radiomuseet.se", kvarter: "hisingen" }),
  museum({ id: "obj-sparvagsmuseet", slug: "goteborgs-sparvagsmuseum", titel: "Göteborgs Spårvägsmuseum", underrubrik: "Göteborgs spårvägshistoria", varfor: "Äldre spårvagnar, biljetter och teknikhistoria visar hur kollektivtrafiken format Göteborg.", platsNamn: "Göteborgs Spårvägsmuseum", adress: "J Sigfrid Edströms gata 2, 416 48 Göteborg", url: "https://www.ringlinien.org", kvarter: "orgryte" }),
  museum({ id: "obj-wisdome", slug: "wisdome", titel: "Wisdome", underrubrik: "Visualiseringar i världens största visualiseringsdom", varfor: "Storskaliga projektioner och forskningsbaserade berättelser gör rymd, natur och vetenskap omslutande.", platsNamn: "Wisdome", adress: "Södra vägen 54, 412 54 Göteborg", url: "https://www.wisdome.se", kvarter: "centrum" }),
  museum({ id: "obj-roda-sten-konsthall", slug: "roda-sten-konsthall", titel: "Röda Sten Konsthall", underrubrik: "Samtidskonst under Älvsborgsbron", varfor: "En experimentell konsthall i ett gammalt pannhus med svenska och internationella utställningar nära älven.", platsNamn: "Röda Sten Konsthall", adress: "Röda Sten 1, 414 51 Göteborg", url: "https://rodasten.com", kvarter: "majorna" }),
  museum({ id: "obj-goteborg-energi-elyseum", slug: "elyseum", titel: "Göteborg Energi – Elyséum", underrubrik: "Energihistoriska samlingar", varfor: "Se hur el, gas och fjärrvärme utvecklats i Göteborg i den historiska Elyséum-byggnaden.", platsNamn: "Elyséum", adress: "Drakegatan 7, 412 50 Göteborg", url: "https://www.goteborgenergi.se", kvarter: "orgryte" }),
  museum({ id: "obj-nordiska-akvarellmuseet", slug: "nordiska-akvarellmuseet", titel: "Nordiska Akvarellmuseet", underrubrik: "Akvarellkonst vid havet", varfor: "Ett internationellt konstcentrum i Skärhamn med akvarellutställningar, verkstad och havet precis utanför.", platsNamn: "Nordiska Akvarellmuseet", adress: "Södra Hamnen 6, 471 32 Skärhamn", url: "https://www.akvarellmuseet.org" }),
];

const KULTURHUS: Objekt[] = [
  museum({ id: "obj-kulturhus-atom-studios", slug: "atom-studios", titel: "Atom Studios", underrubrik: "Kulturhus för unga kreatörer", varfor: "Angereds kreativa hus för 15–21-åringar med mediastudio, dans- och musikstudios, poddrum och evenemangslokaler.", platsNamn: "Atom Studios", adress: "Angered centrum, 424 65 Angered", url: "https://goteborg.se/wps/portal/start/uppleva-och-gora/kultur/kulturhus/hitta-kulturhusen?plats=atom-studios", kvarter: "nordstan" }),
  museum({ id: "obj-kulturhus-axelhuset", slug: "axelhuset", titel: "Axelhuset", underrubrik: "Bibliotek, café och kulturarrangemang", varfor: "Familjecentrerad mötesplats i södra Göteborg med bibliotek, café, utställningar, föredrag och kulturprogram.", platsNamn: "Axelhuset", adress: "Hulda Lindgrens gata 8, 421 31 Västra Frölunda", url: "https://goteborg.se/wps/portal/start/uppleva-och-gora/kultur/kulturhus/hitta-kulturhusen?plats=axelhuset", kvarter: "majorna" }),
  museum({ id: "obj-kulturhus-frolunda", slug: "frolunda-kulturhus", titel: "Frölunda Kulturhus", underrubrik: "Musik, dans, teater och konst", varfor: "Kulturhuset vid Frölunda Torg erbjuder sagostunder, musik, dans, teater, quiz och konstutställningar.", platsNamn: "Frölunda Kulturhus", adress: "Valthornsgatan 3, 421 41 Västra Frölunda", url: "https://goteborg.se/wps/portal/start/uppleva-och-gora/kultur/kulturhus/hitta-kulturhusen?plats=frolunda-kulturhus", kvarter: "majorna" }),
  museum({ id: "obj-kulturhus-fangelset", slug: "fangelset", titel: "Fängelset", underrubrik: "Kreativ mötesplats för unga", varfor: "En plats för 16–25-åringar där egna initiativ, idéer och kreativitet får växa med stöd av coacher.", platsNamn: "Fängelset", adress: "Salsmästaregatan 9, 422 46 Göteborg", url: "https://goteborg.se/wps/portal/start/uppleva-och-gora/kultur/kulturhus/hitta-kulturhusen?plats=fangelset", kvarter: "hisingen" }),
  museum({ id: "obj-kulturhus-bergsjon", slug: "kulturhuset-bergsjon", titel: "Kulturhuset Bergsjön", underrubrik: "Skapande, bibliotek och scener", varfor: "Ett öppet kulturhus vid Rymdtorget med keramik, textil, musikstudio, bibliotek och scener för musik, dans och teater.", platsNamn: "Kulturhuset Bergsjön", adress: "Bergsjöns Kulturhusväg 4A, 415 23 Göteborg", url: "https://goteborg.se/wps/portal/start/uppleva-och-gora/kultur/kulturhus/hitta-kulturhusen?plats=bergsjon", kvarter: "gamlestaden" }),
  museum({ id: "obj-kulturhus-bla-stallet", slug: "bla-stallet", titel: "Kulturhuset Blå Stället", underrubrik: "Konst, scenkonst och verkstäder", varfor: "Angereds kulturhus med musik, samhällssamtal, teater, bio, konst och verkstäder för eget skapande.", platsNamn: "Kulturhuset Blå Stället", adress: "Angereds torg 13, 424 65 Angered", url: "https://goteborg.se/wps/portal/start/uppleva-och-gora/kultur/kulturhus/hitta-kulturhusen?plats=bla-stallet", kvarter: "nordstan" }),
  museum({ id: "obj-kulturhus-kaken", slug: "kulturhuset-kaken", titel: "Kulturhuset Kåken", underrubrik: "Musik, teater och bibliotek i Härlanda", varfor: "Ett hbtqi-certifierat kulturhus vid Stockholmsgatan med musik, teater, bokcirklar, filmklubbar och bibliotek.", platsNamn: "Kulturhuset Kåken", adress: "Kålltorpsgatan 2, 416 52 Göteborg", url: "https://goteborg.se/wps/portal/start/uppleva-och-gora/kultur/kulturhus/hitta-kulturhusen?plats=kaken", kvarter: "orgryte" }),
  museum({ id: "obj-kulturhus-kulturlagret", slug: "kulturlagret", titel: "Kulturlagret", underrubrik: "Kulturplats för egna initiativ", varfor: "En plats för dig över 16 år som vill arrangera konserter, teater, workshops och andra kulturprojekt.", platsNamn: "Kulturlagret", adress: "Göteborg", url: "https://goteborg.se/wps/portal/start/uppleva-och-gora/kultur/kulturhus/hitta-kulturhusen?plats=kulturlagret" }),
  museum({ id: "obj-kulturhus-kulturrummet-gardsten", slug: "kulturrummet-gardsten", titel: "Kulturrummet Gårdsten", underrubrik: "Öppen mötesplats för kultur och delaktighet", varfor: "En öppen plats för och av Gårstensbor med kultur, delaktighet och biblioteksservice i vardagen.", platsNamn: "Kulturrummet Gårdsten", adress: "Kaneltorget 1, 424 39 Angered", url: "https://goteborg.se/wps/portal/start/uppleva-och-gora/kultur/kulturhus/hitta-kulturhusen?plats=kulturrummet-gardsten", kvarter: "nordstan" }),
  museum({ id: "obj-kulturhus-selma-lagerlofs-center", slug: "selma-lagerlofs-center", titel: "Selma Lagerlöfs Center", underrubrik: "Mötesplats för kultur och gemenskap", varfor: "En inkluderande mötesplats där människor kan utvecklas, skapa och känna sig hemma i Backa.", platsNamn: "Selma Lagerlöfs Center", adress: "Selma Lagerlöfs torg, 422 51 Hisings Backa", url: "https://goteborg.se/wps/portal/start/uppleva-och-gora/kultur/kulturhus/hitta-kulturhusen?plats=selma-lagerlofs-center", kvarter: "hisingen" }),
];

export const OBJEKT: Objekt[] = [
  /* ---------------------------------------------------------------- KULTUR */
  objekt({
    id: "obj-roda-sten-hosthangning",
    slag: "handelse",
    sal: "kultur",
    slug: "roda-sten-hosthangning",
    accession: "K-0142",
    titel: "Hösthängningen på Röda Sten",
    underrubrik: "Fyra rum, sexton verk, en ny hängning",
    varfor:
      "Konsthallen tömmer sig helt två gånger om året och börjar från väggen. Just nu står den nästan tom i mitten, vilket gör att du hör älven genom teglet. Gå upp till översta planet först och arbeta dig nedåt.",
    kvarter: "majorna",
    platsNamn: "Röda Sten Konsthall",
    adress: "Röda Sten 1, 414 51 Göteborg",
    gangminuter: 14,
    terrang: "kaj",
    prisSlag: "fast",
    prisMinOre: 8000,
    arAnslag: false,
    passar: ["alla", "tva", "ensam", "vanner"],
    inomhus: true,
    media: {
      url: "",
      alt: "",
      kredit: "BILD FRÅN ARRANGÖREN",
      bredd: 0,
      hojd: 0,
    },
    tillfallen: [
      {
        borjar: "2026-08-23T11:00:00+02:00",
        slutar: "2026-11-15T18:00:00+01:00",
        datumBekraftat: true,
        tillstand: "planerad",
      },
    ],
    oppettider: [
      { dag: 3, oppnar: "12:00", stanger: "18:00" },
      { dag: 4, oppnar: "12:00", stanger: "20:00" },
      { dag: 5, oppnar: "12:00", stanger: "18:00" },
      { dag: 6, oppnar: "11:00", stanger: "18:00" },
      { dag: 7, oppnar: "11:00", stanger: "18:00" },
    ],
    lankar: [
      {
        slag: "hemsida",
        url: "https://rodasten.com",
        vard: "rodasten.com",
        mobilanpassad: true,
      },
    ],
    harkomst: [
      {
        falt: "titel",
        kalla: "venue",
        hamtad: `${IDAG}T06:40:00+02:00`,
        licens: "proprietar_med_tillstand",
        attribution: "Röda Sten Konsthall",
      },
      {
        falt: "varfor",
        kalla: "redaktion",
        hamtad: `${IDAG}T06:40:00+02:00`,
        licens: "redaktionell",
        attribution: "STADEN",
      },
    ],
  }),

  objekt({
    id: "obj-hagabion-sondagsmatine",
    slag: "handelse",
    sal: "kultur",
    slug: "hagabion-sondagsmatine",
    accession: "K-0143",
    titel: "Söndagsmatiné på Hagabion",
    varfor:
      "Biografen visar en restaurerad kopia varje söndag klockan ett, och salongen är sällan halvfull. Kaféet innanför entrén öppnar en timme före och är ett av få ställen i Haga där ingen spelar musik.",
    kvarter: "haga",
    platsNamn: "Hagabion",
    adress: "Linnégatan 21, 413 04 Göteborg",
    gangminuter: 9,
    terrang: "platt",
    prisSlag: "fast",
    prisMinOre: 12000,
    arAnslag: false,
    passar: ["alla", "ensam", "tva"],
    inomhus: true,
    tillfallen: [
      {
        borjar: "2026-08-30T13:00:00+02:00",
        datumBekraftat: true,
        tillstand: "planerad",
      },
    ],
    oppettider: [],
    lankar: [
      {
        slag: "biljett",
        url: "https://hagabion.se",
        vard: "hagabion.se",
        mobilanpassad: false,
      },
    ],
    harkomst: [
      {
        falt: "varfor",
        kalla: "redaktion",
        hamtad: `${IDAG}T06:40:00+02:00`,
        licens: "redaktionell",
        attribution: "STADEN",
      },
    ],
  }),

  objekt({
    id: "obj-konstmuseet-trapphallen",
    slag: "plats",
    sal: "kultur",
    slug: "goteborgs-konstmuseum",
    accession: "K-0031",
    titel: "Göteborgs konstmuseum",
    underrubrik: "Fürstenbergska galleriet, plan 6",
    varfor:
      "Gå förbi allt annat och upp till plan sex. Fürstenbergska galleriet är norra Europas bästa samling av nordiskt sekelskifte, och rummet är byggt för just de tavlorna. Sextio minuter räcker om du bara vill ha det.",
    kvarter: "centrum",
    platsNamn: "Göteborgs konstmuseum",
    adress: "Götaplatsen, 412 56 Göteborg",
    gangminuter: 11,
    terrang: "uppfor",
    prisSlag: "fast",
    prisMinOre: 6000,
    prisNot: "Fri entré under 25 år",
    arAnslag: false,
    passar: ["alla", "med_barn", "pa_besok", "ensam"],
    inomhus: true,
    tillfallen: [],
    oppettider: [
      { dag: 2, oppnar: "11:00", stanger: "18:00" },
      { dag: 3, oppnar: "11:00", stanger: "20:00" },
      { dag: 4, oppnar: "11:00", stanger: "18:00" },
      { dag: 5, oppnar: "11:00", stanger: "18:00" },
      { dag: 6, oppnar: "11:00", stanger: "18:00" },
      { dag: 7, oppnar: "11:00", stanger: "18:00" },
    ],
    lankar: [
      {
        slag: "hemsida",
        url: "https://goteborgskonstmuseum.se",
        vard: "goteborgskonstmuseum.se",
        mobilanpassad: true,
      },
    ],
    harkomst: [
      {
        falt: "titel",
        kalla: "wikidata",
        referens: "Q1501113",
        hamtad: `${IDAG}T06:40:00+02:00`,
        licens: "cc0-1.0",
        attribution: "Wikidata",
      },
      {
        falt: "varfor",
        kalla: "redaktion",
        hamtad: `${IDAG}T06:40:00+02:00`,
        licens: "redaktionell",
        attribution: "STADEN",
      },
    ],
    googlePlaceId: "ChIJVVVVVVVVVVVVVVVVVVVVVVV",
  }),

  /* ----------------------------------------------------------------- NÖJEN */
  objekt({
    id: "obj-way-out-west-2027",
    slag: "handelse",
    sal: "nojen",
    slug: "way-out-west",
    accession: "N-0001",
    titel: "Way Out West",
    underrubrik: "Slottsskogen, tre dagar",
    varfor:
      "Tre dagar i en park mitt i staden, vilket betyder att du kan gå hem och byta skor. Torsdagen är alltid lugnast och billigast. Ta spårvagnen till Linnéplatsen och gå in från norr, aldrig från Plikta.",
    kvarter: "linne",
    platsNamn: "Slottsskogen",
    adress: "Slottsskogen, 414 76 Göteborg",
    gangminuter: 18,
    terrang: "grus",
    prisSlag: "fran",
    prisMinOre: 149000,
    arAnslag: true,
    passar: ["vanner", "tva", "ensam"],
    inomhus: false,
    tillfallen: [
      {
        borjar: "2026-09-10T14:00:00+02:00",
        slutar: "2026-09-12T23:59:00+02:00",
        datumBekraftat: true,
        tillstand: "planerad",
      },
    ],
    oppettider: [],
    lankar: [
      {
        slag: "biljett",
        url: "https://wayoutwest.se",
        vard: "wayoutwest.se",
        mobilanpassad: true,
      },
    ],
    harkomst: [
      {
        falt: "varfor",
        kalla: "redaktion",
        hamtad: `${IDAG}T06:40:00+02:00`,
        licens: "redaktionell",
        attribution: "STADEN",
      },
    ],
  }),

  objekt({
    id: "obj-nefertiti-sent",
    slag: "plats",
    sal: "nojen",
    slug: "nefertiti",
    accession: "N-0012",
    titel: "Nefertiti",
    varfor:
      "Jazzklubben har hållit samma hörn sedan 1978 och ljudet i den lilla salen är fortfarande stadens bästa. Kom före nio om du vill ha en av de sex borden längst fram, annars står du — vilket också går bra.",
    kvarter: "centrum",
    platsNamn: "Nefertiti",
    adress: "Hvitfeldtsplatsen 6, 411 20 Göteborg",
    gangminuter: 6,
    terrang: "platt",
    prisSlag: "intervall",
    prisMinOre: 15000,
    prisMaxOre: 32000,
    arAnslag: false,
    passar: ["tva", "vanner", "ensam"],
    inomhus: true,
    tillfallen: [],
    oppettider: [
      { dag: 4, oppnar: "19:00", stanger: "02:00" },
      { dag: 5, oppnar: "19:00", stanger: "03:00" },
      { dag: 6, oppnar: "19:00", stanger: "03:00" },
    ],
    lankar: [
      {
        slag: "program",
        url: "https://nefertiti.se",
        vard: "nefertiti.se",
        mobilanpassad: true,
      },
    ],
    harkomst: [
      {
        falt: "varfor",
        kalla: "redaktion",
        hamtad: `${IDAG}T06:40:00+02:00`,
        licens: "redaktionell",
        attribution: "STADEN",
      },
    ],
  }),

  objekt({
    id: "obj-pustervik-fredag",
    slag: "handelse",
    sal: "nojen",
    slug: "pustervik-fredagsklubb",
    accession: "N-0044",
    titel: "Fredagsklubben på Pustervik",
    varfor:
      "Två våningar, två sorters kväll: konsert nere, klubb uppe, och du kan byta mitt i utan att betala om. Baren på övervåningen har fönster mot kanalen, vilket är den enda platsen att stå om det blir varmt.",
    kvarter: "haga",
    platsNamn: "Pustervik",
    adress: "Järntorgsgatan 12, 413 01 Göteborg",
    gangminuter: 8,
    terrang: "platt",
    prisSlag: "fast",
    prisMinOre: 18000,
    arAnslag: false,
    passar: ["vanner", "tva"],
    inomhus: true,
    tillfallen: [
      {
        borjar: "2026-08-28T21:00:00+02:00",
        slutar: "2026-08-29T03:00:00+02:00",
        datumBekraftat: true,
        tillstand: "planerad",
      },
    ],
    oppettider: [],
    lankar: [
      {
        slag: "biljett",
        url: "https://pustervik.nu",
        vard: "pustervik.nu",
        mobilanpassad: false,
      },
    ],
    harkomst: [
      {
        falt: "varfor",
        kalla: "redaktion",
        hamtad: `${IDAG}T06:40:00+02:00`,
        licens: "redaktionell",
        attribution: "STADEN",
      },
    ],
  }),

  /* ------------------------------------------------------------------- MAT */
  objekt({
    id: "obj-da-matteo-magasinsgatan",
    slag: "plats",
    sal: "mat",
    slug: "da-matteo-magasinsgatan",
    accession: "M-0003",
    titel: "da Matteo",
    underrubrik: "Magasinsgatan",
    varfor:
      "Gården mellan husen är det närmaste Göteborg kommer ett vardagsrum utomhus. Brödet bakas tio meter bort och tar slut vid tvåtiden. Sitt ute även i oktober — de har filtar, och ingen tittar konstigt på dig.",
    kvarter: "centrum",
    platsNamn: "da Matteo",
    adress: "Vallgatan 19, 411 16 Göteborg",
    gangminuter: 4,
    terrang: "platt",
    prisSlag: "intervall",
    prisMinOre: 4500,
    prisMaxOre: 14000,
    arAnslag: false,
    passar: ["alla", "med_barn", "tva", "ensam", "pa_besok"],
    inomhus: true,
    tillfallen: [],
    oppettider: [
      { dag: 1, oppnar: "07:00", stanger: "18:00" },
      { dag: 2, oppnar: "07:00", stanger: "18:00" },
      { dag: 3, oppnar: "07:00", stanger: "18:00" },
      { dag: 4, oppnar: "07:00", stanger: "18:00" },
      { dag: 5, oppnar: "07:00", stanger: "18:00" },
      { dag: 6, oppnar: "09:00", stanger: "17:00" },
      { dag: 7, oppnar: "09:00", stanger: "17:00" },
    ],
    lankar: [
      {
        slag: "hemsida",
        url: "https://damatteo.se",
        vard: "damatteo.se",
        mobilanpassad: true,
      },
    ],
    harkomst: [
      {
        falt: "adress",
        kalla: "osm",
        referens: "node/1904332211",
        hamtad: `${IDAG}T06:40:00+02:00`,
        licens: "odbl-1.0",
        attribution: "© OpenStreetMap-bidragsgivare",
      },
      {
        falt: "varfor",
        kalla: "redaktion",
        hamtad: `${IDAG}T06:40:00+02:00`,
        licens: "redaktionell",
        attribution: "STADEN",
      },
    ],
  }),

  objekt({
    id: "obj-sjobaren-haga",
    slag: "plats",
    sal: "mat",
    slug: "sjobaren",
    accession: "M-0021",
    titel: "Sjöbaren",
    varfor:
      "Fisk och skaldjur i ett trähus från artonhundratalet, med lågt i tak och hårda bänkar. Lunchen är halva middagens pris och samma kök. Boka inte för fyra på en lördag, det är sällan värt väntan.",
    kvarter: "haga",
    platsNamn: "Sjöbaren",
    adress: "Haga Nygata 25, 413 01 Göteborg",
    gangminuter: 10,
    terrang: "platt",
    prisSlag: "intervall",
    prisMinOre: 19500,
    prisMaxOre: 42000,
    arAnslag: false,
    passar: ["tva", "alla", "pa_besok"],
    inomhus: true,
    tillfallen: [],
    oppettider: [
      { dag: 2, oppnar: "11:30", stanger: "22:00" },
      { dag: 3, oppnar: "11:30", stanger: "22:00" },
      { dag: 4, oppnar: "11:30", stanger: "23:00" },
      { dag: 5, oppnar: "11:30", stanger: "23:00" },
      { dag: 6, oppnar: "12:00", stanger: "23:00" },
    ],
    lankar: [
      {
        slag: "bord",
        url: "https://sjobaren.se",
        vard: "sjobaren.se",
        mobilanpassad: false,
      },
    ],
    harkomst: [
      {
        falt: "varfor",
        kalla: "redaktion",
        hamtad: `${IDAG}T06:40:00+02:00`,
        licens: "redaktionell",
        attribution: "STADEN",
      },
    ],
  }),

  objekt({
    id: "obj-saluhallen-briggen",
    slag: "plats",
    sal: "mat",
    slug: "saluhallen-briggen",
    accession: "M-0009",
    titel: "Saluhallen Briggen",
    varfor:
      "Mindre och mycket lugnare än Stora Saluhallen, och de flesta borden står mot fönstren. Gå hit när du vill äta bra utan att bestämma i förväg. Fiskdisken längst in stänger tidigare än resten av huset.",
    kvarter: "linne",
    platsNamn: "Saluhallen Briggen",
    adress: "Nordhemsgatan 28, 413 06 Göteborg",
    gangminuter: 12,
    terrang: "platt",
    prisSlag: "intervall",
    prisMinOre: 9000,
    prisMaxOre: 22000,
    arAnslag: false,
    passar: ["alla", "med_barn", "vanner", "ensam"],
    inomhus: true,
    tillfallen: [],
    oppettider: [
      { dag: 1, oppnar: "10:00", stanger: "18:00" },
      { dag: 2, oppnar: "10:00", stanger: "18:00" },
      { dag: 3, oppnar: "10:00", stanger: "18:00" },
      { dag: 4, oppnar: "10:00", stanger: "19:00" },
      { dag: 5, oppnar: "10:00", stanger: "19:00" },
      { dag: 6, oppnar: "10:00", stanger: "16:00" },
    ],
    lankar: [],
    harkomst: [
      {
        falt: "varfor",
        kalla: "redaktion",
        hamtad: `${IDAG}T06:40:00+02:00`,
        licens: "redaktionell",
        attribution: "STADEN",
      },
    ],
  }),

  /* ---------------------------------------------------------- SEVÄRDHETER */
  objekt({
    id: "obj-slottsskogen-plikta",
    slag: "plats",
    sal: "sevardheter",
    slug: "slottsskogen",
    accession: "S-0002",
    titel: "Slottsskogen",
    underrubrik: "Plikta, Barnens zoo, Stora dammen",
    varfor:
      "Stadens vardagsrum, och det enda stället där älgar, en lekplats i världsklass och en scen ryms inom tio minuters promenad. Plikta är bäst före klockan elva. Ta med kaffe, det finns inget serverat i norra delen.",
    kvarter: "linne",
    platsNamn: "Slottsskogen",
    adress: "Slottsskogspromenaden, 414 76 Göteborg",
    gangminuter: 16,
    terrang: "uppfor",
    prisSlag: "gratis",
    arAnslag: false,
    passar: ["med_barn", "alla", "vanner", "ensam", "pa_besok"],
    inomhus: false,
    tillfallen: [],
    oppettider: [],
    lankar: [
      {
        slag: "karta",
        url: "https://goteborg.se/slottsskogen",
        vard: "goteborg.se",
        mobilanpassad: true,
      },
    ],
    harkomst: [
      {
        falt: "adress",
        kalla: "osm",
        referens: "way/25844121",
        hamtad: `${IDAG}T06:40:00+02:00`,
        licens: "odbl-1.0",
        attribution: "© OpenStreetMap-bidragsgivare",
      },
      {
        falt: "varfor",
        kalla: "redaktion",
        hamtad: `${IDAG}T06:40:00+02:00`,
        licens: "redaktionell",
        attribution: "STADEN",
      },
    ],
  }),

  objekt({
    id: "obj-botaniska-rhododendrondalen",
    slag: "plats",
    sal: "sevardheter",
    slug: "botaniska-tradgarden",
    accession: "S-0004",
    titel: "Botaniska trädgården",
    underrubrik: "Rhododendrondalen och Klippträdgården",
    varfor:
      "Fyrtio hektar som nästan ingen går längst in i. Gå förbi växthusen och rakt upp i Rhododendrondalen — där tar ljudet från Dag Hammarskjöldsleden slut och du hör bara vatten. Entrén kostar ingenting.",
    kvarter: "linne",
    platsNamn: "Göteborgs botaniska trädgård",
    adress: "Carl Skottsbergs gata 22A, 413 19 Göteborg",
    gangminuter: 22,
    terrang: "skog",
    prisSlag: "gratis",
    prisNot: "Växthusen 60 kr",
    arAnslag: false,
    passar: ["alla", "med_barn", "tva", "ensam", "pa_besok"],
    inomhus: false,
    tillfallen: [],
    oppettider: [],
    lankar: [
      {
        slag: "hemsida",
        url: "https://botaniska.se",
        vard: "botaniska.se",
        mobilanpassad: true,
      },
    ],
    harkomst: [
      {
        falt: "titel",
        kalla: "wikidata",
        referens: "Q1362180",
        hamtad: `${IDAG}T06:40:00+02:00`,
        licens: "cc0-1.0",
        attribution: "Wikidata",
      },
      {
        falt: "varfor",
        kalla: "redaktion",
        hamtad: `${IDAG}T06:40:00+02:00`,
        licens: "redaktionell",
        attribution: "STADEN",
      },
    ],
  }),

  objekt({
    id: "obj-vinga-fyr",
    slag: "plats",
    sal: "sevardheter",
    slug: "vinga",
    accession: "S-0018",
    titel: "Vinga",
    varfor:
      "Ytterst i skärgården, en och en halv timme med båt, och det sista du ser innan havet tar över. Klipporna på västsidan är varma till långt in i september. Sista båten tillbaka går tidigare än du tror.",
    kvarter: "majorna",
    platsNamn: "Vinga fyr",
    adress: "Vinga, Göteborgs yttre skärgård",
    gangminuter: 0,
    terrang: "kaj",
    prisSlag: "fran",
    prisMinOre: 12500,
    prisNot: "Båt från Saltholmen",
    arAnslag: false,
    passar: ["tva", "vanner", "ensam", "pa_besok"],
    inomhus: false,
    tillfallen: [],
    oppettider: [],
    lankar: [
      {
        slag: "hemsida",
        url: "https://vasttrafik.se",
        vard: "vasttrafik.se",
        mobilanpassad: true,
      },
    ],
    harkomst: [
      {
        falt: "varfor",
        kalla: "redaktion",
        hamtad: `${IDAG}T06:40:00+02:00`,
        licens: "redaktionell",
        attribution: "STADEN",
      },
    ],
  }),

  objekt({
    id: "obj-universeum-regnskogen",
    slag: "plats",
    sal: "sevardheter",
    slug: "universeum",
    accession: "S-0007",
    titel: "Universeum",
    underrubrik: "Regnskogen, plan 5",
    varfor:
      "Sju våningar, men bara en av dem spelar roll för de flesta barn: regnskogen, där det är tjugofem grader och fritt flygande fåglar. Gå upp först och ner sedan, annars orkar ingen hela vägen.",
    kvarter: "orgryte",
    platsNamn: "Universeum",
    adress: "Södra Vägen 50, 412 54 Göteborg",
    gangminuter: 13,
    terrang: "platt",
    prisSlag: "fran",
    prisMinOre: 29500,
    arAnslag: false,
    passar: ["med_barn", "alla", "pa_besok"],
    inomhus: true,
    tillfallen: [],
    oppettider: [
      { dag: 1, oppnar: "10:00", stanger: "17:00" },
      { dag: 2, oppnar: "10:00", stanger: "17:00" },
      { dag: 3, oppnar: "10:00", stanger: "17:00" },
      { dag: 4, oppnar: "10:00", stanger: "17:00" },
      { dag: 5, oppnar: "10:00", stanger: "17:00" },
      { dag: 6, oppnar: "10:00", stanger: "18:00" },
      { dag: 7, oppnar: "10:00", stanger: "18:00" },
    ],
    lankar: [
      {
        slag: "biljett",
        url: "https://universeum.se",
        vard: "universeum.se",
        mobilanpassad: true,
      },
    ],
    harkomst: [
      {
        falt: "varfor",
        kalla: "redaktion",
        hamtad: `${IDAG}T06:40:00+02:00`,
        licens: "redaktionell",
        attribution: "STADEN",
      },
    ],
  }),

  ...KOMPLETTERANDE_MUSEER,
  ...KULTURHUS,
];

export const UTGAVA: Utgava = {
  stad: "goteborg",
  dag: IDAG,
  omhangdKl: "06:40",
  objektIUtgavan: OBJEKT.length,
  nyforvarv: 4,
  /* Two lines at 390px. 66 characters is the publish lint; a three-line note
     is a publish-time failure, not a runtime overflow. */
  notis: "Regn till fyra. Vi har hängt dagen inomhus, utom en sak.",
  vader: "REGN TILL 16 · 11°",
  soluppgang: "06:02",
  solnedgang: "20:41",
  ledObjekt: "obj-roda-sten-hosthangning",
  rummet: [
    "obj-da-matteo-magasinsgatan",
    "obj-konstmuseet-trapphallen",
    "obj-nefertiti-sent",
    "obj-hagabion-sondagsmatine",
  ],
  anslag: "obj-way-out-west-2027",
  permanenta: [
    "obj-slottsskogen-plikta",
    "obj-botaniska-rhododendrondalen",
    "obj-universeum-regnskogen",
  ],
  salsUrval: {
    sal: "mat",
    objekt: ["obj-sjobaren-haga", "obj-saluhallen-briggen"],
  },
};
