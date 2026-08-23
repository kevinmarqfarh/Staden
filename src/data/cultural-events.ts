export type CulturalEventCategory =
  | "Festival"
  | "Konst"
  | "Museum"
  | "Musik"
  | "Scenkonst"
  | "Skapande";

export type CulturalEvent = {
  id: string;
  title: string;
  category: CulturalEventCategory;
  dateLabel: string;
  startDate: string;
  endDate?: string;
  time?: string;
  venue: string;
  area: string;
  description: string;
  sourceLabel: string;
  sourceUrl: string;
  isFree?: boolean;
  isOngoing?: boolean;
  featured?: boolean;
};

const scannedCulturalEvents = [
  {
    id: "gdtf-2026",
    title: "Göteborgs dans- och teaterfestival",
    category: "Festival",
    dateLabel: "21–30 aug",
    startDate: "2026-08-21",
    endDate: "2026-08-30",
    venue: "Scener i Göteborg",
    area: "Centrum + Västra Götaland",
    description:
      "Tio dagar med internationell dans, cirkus, performance och teater — plus ett stort utomhusprogram.",
    sourceLabel: "Göteborgs dans- och teaterfestival",
    sourceUrl: "https://www.gdtf.se/sv/",
    isOngoing: true,
  },
  {
    id: "goteborgskalaset-2026",
    title: "Göteborgskalaset 2026",
    category: "Festival",
    dateLabel: "27–30 aug",
    startDate: "2026-08-27",
    endDate: "2026-08-30",
    venue: "Götaplatsen med flera platser",
    area: "Centrum",
    description:
      "Fyra kostnadsfria dagar med livemusik, dans, cirkus, lokala artister, mat och folkliv mitt i staden.",
    sourceLabel: "Göteborgs Stad",
    sourceUrl:
      "https://goteborg.se/wps/portal?id=b9faaf1e-7c5a-4cf5-9dbc-6166a2d6b62c&uri=gbglnk%3Ase.goteborg.aktuelltarkiv",
    isFree: true,
  },
  {
    id: "nadim-stadsteatern-2026",
    title: "Nadim — min väg från flykting till hela Sveriges polis",
    category: "Scenkonst",
    dateLabel: "27 aug–19 sep",
    startDate: "2026-08-27",
    endDate: "2026-09-19",
    time: "19:00",
    venue: "Göteborgs Stadsteater, Lilla Scen",
    area: "Götaplatsen",
    description:
      "Lisa Lindéns scenbearbetning följer Nadim Ghazales resa genom flykt, kulturkrockar och mellanförskap.",
    sourceLabel: "Göteborgs Stadsteater",
    sourceUrl:
      "https://stadsteatern.goteborg.se/pa-scen/2026-2027/nadim-min-vag-fran-flykting-till-hela-sveriges-polis/",
  },
  {
    id: "goteborg-jazz-festival-2026",
    title: "Göteborg Jazz Festival",
    category: "Musik",
    dateLabel: "5 sep",
    startDate: "2026-09-05",
    time: "12:00–23:55",
    venue: "Jazzkvarteret, Tredje Långgatan",
    area: "Linné",
    description:
      "En intensiv heldag med konserter, jam och jazz både inne och ute längs Tredje Långgatan.",
    sourceLabel: "Göteborgs officiella besöksguide",
    sourceUrl:
      "https://www.goteborg.com/evenemang/goteborg-jazz-festival-2026",
    featured: true,
  },
  {
    id: "en-mycket-liten-manniska-2026",
    title: "En mycket liten människa",
    category: "Scenkonst",
    dateLabel: "Premiär 11 sep",
    startDate: "2026-09-11",
    time: "19:00",
    venue: "Göteborgs Stadsteater, Studion",
    area: "Götaplatsen",
    description:
      "Lisa Aschans dramatiker- och regidebut om moderskap, anknytning och den allra första tiden i livet.",
    sourceLabel: "Göteborgs Stadsteater",
    sourceUrl:
      "https://www.stadsteatern.goteborg.se/pa-scen/2026-2027/en-mycket-liten-manniska/",
  },
  {
    id: "trad-i-tid-och-rorelse-2026",
    title: "Träd i tid och rörelse",
    category: "Scenkonst",
    dateLabel: "16 sep",
    startDate: "2026-09-16",
    time: "Samling 17:45",
    venue: "Göteborgs botaniska trädgård",
    area: "Änggården",
    description:
      "Dans, ljudlandskap och berättelser vävs samman med forskning om trädens liv i en föreställning ute i skogen.",
    sourceLabel: "Göteborgs officiella besöksguide",
    sourceUrl:
      "https://www.goteborg.com/evenemang/trad-i-tid-och-rorelse",
  },
  {
    id: "trettondagsafton-stadsteatern-2026",
    title: "Trettondagsafton",
    category: "Scenkonst",
    dateLabel: "Premiär 25 sep",
    startDate: "2026-09-25",
    time: "19:00",
    venue: "Göteborgs Stadsteater, Stora Scen",
    area: "Götaplatsen",
    description:
      "Shakespeares virvelvindskomedi om kärlek, identitet och förväxlingar i regi av Ellen McDougall.",
    sourceLabel: "Göteborgs Stadsteater",
    sourceUrl:
      "https://stadsteatern.goteborg.se/pa-scen/2026-2027/trettondagsafton/",
  },
  {
    id: "tikwarihwahk-levons-le-chant-2026",
    title: "Tikwarihwahk / Levons le chant",
    category: "Scenkonst",
    dateLabel: "26 sep",
    startDate: "2026-09-26",
    time: "18:00",
    venue: "Göteborgs Stadsteater, Lilla Scen",
    area: "Götaplatsen",
    description:
      "Ett poetiskt gästspel där poesi, dans och musik lyfter Wendatfolkets traditionella kultur och samtida identitet.",
    sourceLabel: "Göteborgs Stadsteater",
    sourceUrl:
      "https://stadsteatern.goteborg.se/pa-scen/2026-2027/tikwarihwahk-levonslechant/",
  },
  {
    id: "kropp-ideal-blick-frihet-2026",
    title: "Kropp. Ideal, blick, frihet",
    category: "Konst",
    dateLabel: "Nu–17 jan",
    startDate: "2026-03-07",
    endDate: "2027-01-17",
    venue: "Göteborgs konstmuseum",
    area: "Götaplatsen",
    description:
      "Omkring hundra historiska och samtida verk undersöker kroppen, blicken, makten och möjligheten till frigörelse.",
    sourceLabel: "Göteborgs konstmuseum",
    sourceUrl:
      "https://goteborgskonstmuseum.se/utstallningar/kropp-ideal-blick-frihet/",
    isOngoing: true,
  },
  {
    id: "oko-sunce-bla-stallet-2026",
    title: "Oko Sunce – mellan groove och råhet",
    category: "Musik",
    dateLabel: "26 aug",
    startDate: "2026-08-26",
    time: "19:00–20:00",
    venue: "Kulturhuset Blå Stället",
    area: "Angered",
    description:
      "Ett gratis musikcafé där Oko Sunce rör sig mellan atmosfäriska klanger, soul, funkiga rytmer och rå energi.",
    sourceLabel: "Göteborgs Stad",
    sourceUrl:
      "https://goteborg.se/wps/portal/start/uppleva-och-gora/kultur/kulturhus/program-pa-kulturhusen?activityId=aabeaac0-7a93-43bd-a6da-3a62b10c1291",
    isFree: true,
  },
  {
    id: "about-duo-padella-bla-stallet-2026",
    title: "About med Duo Padella",
    category: "Scenkonst",
    dateLabel: "27 aug",
    startDate: "2026-08-27",
    time: "15:30–17:20",
    venue: "Angereds Stadspark",
    area: "Angered",
    description:
      "Punkig och ömsint familjecirkus med cykelakrobatik och humor, följd av en workshop för barn och unga.",
    sourceLabel: "Göteborgs Stad · Blå Stället",
    sourceUrl:
      "https://goteborg.se/wps/portal/start/uppleva-och-gora/kultur/kulturhus/program-pa-kulturhusen?activityId=6e3c1bdf-8cfc-4bc9-9630-24f2cee12f95",
    isFree: true,
  },
  {
    id: "haute-heure-bla-stallet-2026",
    title: "Haute Heure med Compagnie Barolosolo",
    category: "Scenkonst",
    dateLabel: "27 aug",
    startDate: "2026-08-27",
    time: "17:30–18:20",
    venue: "Angereds Stadspark",
    area: "Angered",
    description:
      "Fransk cirkus där akrobatik, humor och livemusik förvandlar barndomens fantasi till en lekfull föreställning.",
    sourceLabel: "Göteborgs Stad · Blå Stället",
    sourceUrl:
      "https://goteborg.se/wps/portal/start/uppleva-och-gora/kultur/kulturhus/program-pa-kulturhusen?activityId=3ba0265e-ed85-44b7-8a7a-57dc6591ff9d",
    isFree: true,
  },
  {
    id: "collective-imagination-bergsjon-2026",
    title: "Collective Imagination",
    category: "Konst",
    dateLabel: "30 aug–20 sep",
    startDate: "2026-08-30",
    endDate: "2026-09-20",
    venue: "Kulturhuset Bergsjön",
    area: "Bergsjön",
    description:
      "En utställning kurerad av Sadia Sharmin där barns visuella berättelser, kartor och böcker blir språk för tillhörighet.",
    sourceLabel: "Göteborgs Stad",
    sourceUrl:
      "https://goteborg.se/wps/portal/start/uppleva-och-gora/kultur/kulturhus/utstallningar-pa-kulturhusen/aktuella-utstallningar?activityId=83dd184c-dcff-4abc-8a64-d72df4b9ce82",
    isFree: true,
  },
  {
    id: "kakens-gardsfest-2026",
    title: "Kåkens gårdsfest",
    category: "Festival",
    dateLabel: "6 sep",
    startDate: "2026-09-06",
    time: "11:00–15:00",
    venue: "Kulturhuset Kåken",
    area: "Kålltorp",
    description:
      "Grön kulturfest med musik, hantverksmarknad, skapande, cirkusskola, sagor, mat och aktiviteter för alla åldrar.",
    sourceLabel: "Göteborgs Stad",
    sourceUrl:
      "https://goteborg.se/wps/portal/start/uppleva-och-gora/bibliotek/alla-arrangemang-pa-biblioteken?activityId=c7e96c10-5e9a-4659-97dc-730c35f5122f",
    isFree: true,
  },
  {
    id: "virka-rutor-bla-stallet-2026",
    title: "Virka rutor",
    category: "Skapande",
    dateLabel: "7 sep–19 okt",
    startDate: "2026-09-07",
    endDate: "2026-10-19",
    time: "måndagar 10:15–13:15",
    venue: "Kulturhuset Blå Stället",
    area: "Angered",
    description:
      "En gratis sjugångerskurs i olika virktekniker, mönster och hur rutorna kan bli plagg, väskor eller filtar. Anmälan krävs.",
    sourceLabel: "Göteborgs Stad · Blå Stället",
    sourceUrl:
      "https://goteborg.se/wps/portal/start/uppleva-och-gora/kultur/kulturhus/program-pa-kulturhusen?activityId=00ff00d1-f3e7-4a2f-8bf9-4703c7367a91",
    isFree: true,
  },
  {
    id: "roster-fran-insidan-2026",
    title: "Röster från insidan",
    category: "Musik",
    dateLabel: "28 sep",
    startDate: "2026-09-28",
    time: "18:00–19:30",
    venue: "Frölunda Kulturhus",
    area: "Frölunda",
    description:
      "Ett helkvällsprogram med musik och poesi byggt på frihetsberövades erfarenheter och djupintervjuer från svenska fängelser.",
    sourceLabel: "Göteborgs Stad",
    sourceUrl:
      "https://goteborg.se/wps/portal/start/uppleva-och-gora/kultur/kulturhus/utstallningar-pa-kulturhusen/aktuella-utstallningar?activityId=2295b957-3b69-4209-80c3-a836115ab1a2",
    isFree: true,
  },
  {
    id: "tellusfestivalen-2026",
    title: "Tellusfestivalen",
    category: "Festival",
    dateLabel: "5 sep",
    startDate: "2026-09-05",
    time: "Program publiceras löpande",
    venue: "Kulturhuset Bergsjön, Bergsjöns Kulturhusväg 4A",
    area: "Bergsjön",
    description:
      "En gratis stadsdelsfestival med musik, dans, workshops, hantverk, mat och skapande för hela familjen.",
    sourceLabel: "Göteborgs Stad · Kulturhuset Bergsjön",
    sourceUrl:
      "https://goteborg.se/wps/portal?uri=gbglnk%3A202631385252764",
    isFree: true,
  },
  {
    id: "multisensoriskt-musikdrama-eldorado-2026",
    title: "Multisensoriskt musikdrama",
    category: "Musik",
    dateLabel: "Tisdagar från 1 sep",
    startDate: "2026-09-01",
    time: "09:30–10:10",
    venue: "Eldorado Resurscenter, Kustgatan 10",
    area: "Majorna",
    description:
      "En återkommande kostnadsfri musikaktivitet med flera sinnesintryck, skapad för personer med svår intellektuell funktionsnedsättning.",
    sourceLabel: "Göteborgs Stad · Eldorado Resurscenter",
    sourceUrl:
      "https://goteborg.se/wps/portal/enheter/eldorado-resurscenter/kalendarium?activityId=4ce4f116-caf1-444f-99bf-55ba198801cc",
    isFree: true,
  },
  {
    id: "we-will-survive-rohsska-2026",
    title: "We Will Survive: Prepperrörelsen och design",
    category: "Museum",
    dateLabel: "Nu–4 okt",
    startDate: "2026-02-07",
    endDate: "2026-10-04",
    time: "Tis–ons 11–18 · tors 11–20 · fre–sön 11–17",
    venue: "Röhsska museet, Vasagatan 37–39",
    area: "Vasastaden",
    description:
      "Över 200 designobjekt undersöker existentiella hot, civil beredskap och hur design används för individuell överlevnad.",
    sourceLabel: "Röhsska museet",
    sourceUrl:
      "https://rohsska.se/utstallningar/we-will-survive-prepperrorelsen-och-design/",
    isOngoing: true,
  },
  {
    id: "landshovdingehus-150-ar-2026",
    title: "Landshövdingehus 150 år",
    category: "Museum",
    dateLabel: "Nu–2030",
    startDate: "2025-11-22",
    time: "Tis/tor 10–18 · ons 10–20 · fre–sön 10–17",
    venue: "Göteborgs stadsmuseum, Norra Hamngatan 12",
    area: "Centrum",
    description:
      "Fotografier, filmer, modeller och föremål berättar om den göteborgska hustypens uppgång, rivningar och återupprättelse.",
    sourceLabel: "Göteborgs stadsmuseum",
    sourceUrl:
      "https://goteborgsstadsmuseum.se/utstallningar/landshovdingehus-150-ar/",
    isOngoing: true,
  },
  {
    id: "kvinnor-bakom-kameran-2026",
    title: "Kvinnor bakom kameran 1848–1968",
    category: "Konst",
    dateLabel: "Nu–27 sep",
    startDate: "2026-05-23",
    endDate: "2026-09-27",
    time: "Tis/tor 11–18 · ons 11–20 · fre–sön 11–17",
    venue: "Hasselblad Center, Götaplatsen 6",
    area: "Götaplatsen",
    description:
      "Närmare 300 bilder skriver tillbaka kvinnliga yrkesfotografer i svensk fotohistoria, från pionjärtid till 1968.",
    sourceLabel: "Hasselbladstiftelsen",
    sourceUrl:
      "https://www.hasselbladfoundation.org/sv/portfolio_page/kvinnor-bakom-kameran/",
    isOngoing: true,
  },
  {
    id: "sharks-camera-action-2026",
    title: "Sharks, Camera, Action!",
    category: "Museum",
    dateLabel: "Nu–29 aug 2027",
    startDate: "2026-04-25",
    endDate: "2027-08-29",
    time: "Tis/tor 10–18 · ons 10–20 · fre–sön 10–17",
    venue: "Sjöfartsmuseet Akvariet, Karl Johansgatan 1–3",
    area: "Majorna",
    description:
      "Filmer och fotografier följer kallvattenshajar från Bohuslän till Grönland och livet bakom undervattenskameran.",
    sourceLabel: "Sjöfartsmuseet Akvariet",
    sourceUrl:
      "https://www.sjofartsmuseetakvariet.se/utstallningar/sharks-camera-action/",
    isOngoing: true,
  },
  {
    id: "tatau-varldskulturmuseet-2026",
    title: "TATAU – Frihet | Identitet | Minnen",
    category: "Museum",
    dateLabel: "Nu–10 jan",
    startDate: "2026-06-27",
    endDate: "2027-01-10",
    time: "Tis/tor–sön 11–17 · ons 11–20",
    venue: "Världskulturmuseet, Södra vägen 54",
    area: "Korsvägen",
    description:
      "Kvinnors tatueringar från olika delar av världen blir levande berättelser om identitet, tillhörighet, minne och motstånd.",
    sourceLabel: "Världskulturmuseet",
    sourceUrl: "https://www.varldskulturmuseet.se/utstallningar/tatau/",
    isOngoing: true,
  },
  {
    id: "native-american-fashion-2026",
    title: "Native American Fashion",
    category: "Museum",
    dateLabel: "Nu–9 maj 2027",
    startDate: "2025-04-11",
    endDate: "2027-05-09",
    time: "Tis/tor–sön 11–17 · ons 11–20",
    venue: "Världskulturmuseet, Södra vägen 54",
    area: "Korsvägen",
    description:
      "Streetwear, exklusivt mode och historiska regalier möts i en utställning om nordamerikanska urfolk, identitet och framtid.",
    sourceLabel: "Världskulturmuseet",
    sourceUrl:
      "https://www.varldskulturmuseet.se/utstallningar/native-american-fashion/",
    isOngoing: true,
  },
  {
    id: "mira-gar-genom-rummen-host-2026",
    title: "Mira går genom rummen",
    category: "Scenkonst",
    dateLabel: "Nypremiär 29 aug · fler datum",
    startDate: "2026-08-29",
    time: "14:00 på nypremiären",
    venue: "Backa Teater",
    area: "Lindholmen",
    description:
      "En finurlig familjeföreställning från sju år om att höra ihop och hitta sin plats när familjens karta ritas om.",
    sourceLabel: "Backa Teater",
    sourceUrl:
      "https://stadsteatern.goteborg.se/backa-teater/produktioner/2026-2027/mira-gar-genom-rummen/",
  },
  {
    id: "la-traviata-goteborgsoperan-2026",
    title: "La traviata",
    category: "Scenkonst",
    dateLabel: "12 sep–18 okt",
    startDate: "2026-09-12",
    endDate: "2026-10-18",
    time: "Flera tider · cirka 2 tim 20 min",
    venue: "GöteborgsOperan, Stora scenen",
    area: "Lilla Bommen",
    description:
      "Verdis opera om frihet, kärlek och ensamhet öppnar säsongen i en ny uppsättning, textad på svenska och engelska.",
    sourceLabel: "GöteborgsOperan",
    sourceUrl:
      "https://www.opera.se/forestallningar/sasong-2026-2027/la-traviata/",
  },
  {
    id: "goteborg-art-sounds-folkteatern-2026",
    title: "Göteborg Art Sounds Festival",
    category: "Musik",
    dateLabel: "24 sep",
    startDate: "2026-09-24",
    time: "19:00",
    venue: "Folkteatern, Lilla scenen",
    area: "Järntorget",
    description:
      "En fri kväll med experimentell musik av In Motion, elbasisten Farida Amadou och kompositören Ji Youn Kang.",
    sourceLabel: "Folkteatern",
    sourceUrl:
      "https://www.folkteatern.se/events/goteborg-art-sounds-festival-24-september-2026",
    isFree: true,
  },
  {
    id: "bokmassan-2026",
    title: "Bokmässan 2026",
    category: "Festival",
    dateLabel: "24–27 sep",
    startDate: "2026-09-24",
    endDate: "2026-09-27",
    time: "Tors 9–18 · fre 9–19 · lör 9–18 · sön 9–17",
    venue: "Svenska Mässan, Mässans gata 10",
    area: "Korsvägen",
    description:
      "Fyra litteraturdagar med seminarier, författarmöten och årets teman folkbildning, spel och hedersgästen Québec.",
    sourceLabel: "Bokmässan",
    sourceUrl: "https://bokmassan.se/",
  },
  {
    id: "gbg-mime-fest-folkteatern-2026",
    title: "GBG Mime Fest 2026",
    category: "Festival",
    dateLabel: "1–3 okt på Folkteatern",
    startDate: "2026-10-01",
    endDate: "2026-10-03",
    time: "Flera tider",
    venue: "Folkteatern, Olof Palmes plats 5",
    area: "Järntorget",
    description:
      "Svenska och internationella artister visar mimens bredd i scenkonst som vill beröra, inspirera och överraska.",
    sourceLabel: "Folkteatern",
    sourceUrl: "https://www.folkteatern.se/events/gbg-mime-fest-2026",
  },
  {
    id: "tillsammans-i-rymden-2026",
    title: "Tillsammans i rymden",
    category: "Musik",
    dateLabel: "3 okt",
    startDate: "2026-10-03",
    time: "15:00–ca 16:00",
    venue: "Göteborgs Konserthus, Stora salen",
    area: "Götaplatsen",
    description:
      "En familjekonsert från sex år med Holsts Planeterna, NASA-ljud, poesi och musiker ur Göteborgs Symfoniker.",
    sourceLabel: "Göteborgs Konserthus",
    sourceUrl:
      "https://www.gso.se/program/konserter/familjekonsert-tillsammans-i-rymden/",
  },
  {
    id: "zanele-muholi-hasselblad-award-2026",
    title: "Zanele Muholi – Hasselbladpriset 2026",
    category: "Konst",
    dateLabel: "10 okt–4 apr 2027",
    startDate: "2026-10-10",
    endDate: "2027-04-04",
    time: "Tis/tor 11–18 · ons 11–20 · fre–sön 11–17",
    venue: "Hasselblad Center, Götaplatsen 6",
    area: "Götaplatsen",
    description:
      "Porträtt och visuell aktivism lyfter synlighet, värdighet och svarta hbtqia+-gemenskapers rättigheter.",
    sourceLabel: "Hasselbladstiftelsen",
    sourceUrl:
      "https://www.hasselbladfoundation.org/en/portfolio_page/zanele-muholi-hasselblad-award-2026/",
  },
  {
    id: "kulturnatta-goteborg-2026",
    title: "Kulturnatta Göteborg 2026",
    category: "Festival",
    dateLabel: "23 okt",
    startDate: "2026-10-23",
    time: "Kväll · programsläpp 18 sep",
    venue: "Museer, scener, bibliotek & ateljéer",
    area: "Hela Göteborg",
    description:
      "Göteborgs officiella kulturnatt samlar konst, dans, musik, teater, film, vandringar och workshops över hela staden.",
    sourceLabel: "Kulturnatta · Göteborgs Stad",
    sourceUrl: "https://kulturnatta.goteborg.se/",
  },
] satisfies CulturalEvent[];

const trustedSourceHosts = new Set([
  "botaniska.se",
  "bokmassan.se",
  "folkteatern.se",
  "goteborgsstadsmuseum.se",
  "goteborg.se",
  "goteborg.com",
  "goteborgskonstmuseum.se",
  "gdtf.se",
  "gso.se",
  "hasselbladfoundation.org",
  "kulturnatta.goteborg.se",
  "opera.se",
  "rohsska.se",
  "sjofartsmuseetakvariet.se",
  "stadsteatern.goteborg.se",
  "varldskulturmuseet.se",
  "www.botaniska.se",
  "www.bokmassan.se",
  "www.folkteatern.se",
  "www.goteborg.com",
  "www.goteborgsstadsmuseum.se",
  "www.gdtf.se",
  "www.gso.se",
  "www.hasselbladfoundation.org",
  "www.opera.se",
  "www.rohsska.se",
  "www.sjofartsmuseetakvariet.se",
  "www.stadsteatern.goteborg.se",
  "www.varldskulturmuseet.se",
]);

function canonicalSource(url: string) {
  const source = new URL(url);

  if (source.protocol !== "https:" || !trustedSourceHosts.has(source.hostname)) {
    throw new Error(`Otillåten kulturkälla: ${source.hostname}`);
  }

  source.hash = "";
  source.pathname = source.pathname.replace(/\/$/, "");
  return source.toString().toLocaleLowerCase("sv-SE");
}

function eventFingerprint(event: CulturalEvent) {
  const normalize = (value: string) =>
    value
      .normalize("NFKC")
      .toLocaleLowerCase("sv-SE")
      .replace(/[^a-z0-9åäö]+/g, " ")
      .trim();

  return [normalize(event.title), event.startDate, normalize(event.venue)].join(
    "|",
  );
}

/**
 * Append-only merge: an event already known by id, canonical source URL or a
 * normalized title/date/venue fingerprint is retained and never overwritten.
 */
export function appendOnlyNewCulturalEvents(
  existing: readonly CulturalEvent[],
  incoming: readonly CulturalEvent[],
) {
  const seenIds = new Set(existing.map((event) => event.id));
  const seenSources = new Set(
    existing.map((event) => canonicalSource(event.sourceUrl)),
  );
  const seenFingerprints = new Set(existing.map(eventFingerprint));
  const additions: CulturalEvent[] = [];

  for (const event of incoming) {
    const source = canonicalSource(event.sourceUrl);
    const fingerprint = eventFingerprint(event);

    if (
      seenIds.has(event.id) ||
      seenSources.has(source) ||
      seenFingerprints.has(fingerprint)
    ) {
      continue;
    }

    additions.push(event);
    seenIds.add(event.id);
    seenSources.add(source);
    seenFingerprints.add(fingerprint);
  }

  return [...existing, ...additions];
}

export const culturalEvents = appendOnlyNewCulturalEvents(
  [],
  scannedCulturalEvents,
);

export const culturalCatalogVerifiedAt = "2026-08-23";
