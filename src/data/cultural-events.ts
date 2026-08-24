import { OBJEKT } from "@/data/goteborg";

export type CulturalEventCategory =
  | "Festival"
  | "Konst"
  | "Museum"
  | "Musik"
  | "Film"
  | "Litteratur"
  | "Samtal"
  | "Scenkonst"
  | "Skapande"
  | "Kulturhus";

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
  {
    id: "hanna-vihriala-same-moment-of-pleasure-2026",
    title: "Hanna Vihriälä – Same Moment of Pleasure",
    category: "Museum",
    dateLabel: "Nu–1 nov",
    startDate: "2026-05-09",
    endDate: "2026-11-01",
    time: "Tis/tor 11–18 · ons 11–20 · fre–sön 11–17",
    venue: "Göteborgs konstmuseum, Götaplatsen",
    area: "Götaplatsen",
    description:
      "Sommarutställning med tidigare och nyproducerade verk av Hanna Vihriälä, där vardagliga material blir skulpturer och rumsliga installationer.",
    sourceLabel: "Göteborgs konstmuseum",
    sourceUrl: "https://goteborgskonstmuseum.se/utstallningar/hanna-vihriala/",
    isOngoing: true,
  },
  {
    id: "goteborgskalaset-konstmuseum-2026",
    title: "Göteborgskalaset på Göteborgs konstmuseum",
    category: "Museum",
    dateLabel: "29 aug",
    startDate: "2026-08-29",
    time: "11:00–17:00",
    venue: "Göteborgs konstmuseum, Götaplatsen",
    area: "Götaplatsen",
    description:
      "Fri entré till samlingen, Kropp. Ideal, blick, frihet och Hanna Vihriälä, Same Moment of Pleasure, med visningar, skapande verkstad och dansperformance.",
    sourceLabel: "Göteborgs konstmuseum",
    sourceUrl:
      "https://goteborgskonstmuseum.se/2026/07/goteborgskalaset-pa-goteborgs-konstmuseum/",
    isFree: true,
  },
  {
    id: "asplund-och-radhuset-2026",
    title: "Asplund och rådhuset",
    category: "Museum",
    dateLabel: "Nu–30 aug",
    startDate: "2025-09-27",
    endDate: "2026-08-30",
    time: "Tis–ons 11–18 · tors 11–20 · fre–sön 11–17",
    venue: "Röhsska museet, Vasagatan 37–39",
    area: "Vasastaden",
    description:
      "Ett urval av möbler, textilier, ritningar och reproduktioner som lyfter Gunnar Asplunds arbete med Göteborgs rådhus.",
    sourceLabel: "Röhsska museet",
    sourceUrl:
      "https://rohsska.se/utstallningar/asplund-och-radhuset-en-dold-modern-klassiker-i-goteborg/",
    isOngoing: true,
  },
  {
    id: "bland-helgon-pavar-och-vanligt-folk-2026",
    title: "Bland helgon, påvar och vanligt folk",
    category: "Museum",
    dateLabel: "23 sep",
    startDate: "2026-09-23",
    time: "18:00–19:00",
    venue: "Göteborgs stadsmuseum, Companisalen",
    area: "Centrum",
    description:
      "Föreläsning om helgonkulten, från de tidiga kristna i Romarriket till medeltidens Europa och vidare till andra religioner.",
    sourceLabel: "Göteborgs stadsmuseum",
    sourceUrl:
      "https://goteborgsstadsmuseum.se/aktivitet/historieonsdag-bland-helgon-pavar-och-vanligt-folk/?date=202609231800",
  },
  {
    id: "cross-backa-teater-2026",
    title: "Cross",
    category: "Scenkonst",
    dateLabel: "Urpremiär 2 okt",
    startDate: "2026-10-02",
    time: "19:00 på premiären",
    venue: "Backa Teater",
    area: "Lindholmen",
    description:
      "En skamlöst rolig föreställning om att vara sig själv i en värld full av åsikter om vem man borde vara.",
    sourceLabel: "Backa Teater",
    sourceUrl:
      "https://stadsteatern.goteborg.se/backa-teater/produktioner/2026-2027/cross/",
  },
  {
    id: "konstrundan-ostra-goteborg-2026",
    title: "Konstrundan i Östra Göteborg 2026",
    category: "Konst",
    dateLabel: "6–8 nov",
    startDate: "2026-11-06",
    endDate: "2026-11-08",
    time: "Fre 17–20 · lör–sön 11–16",
    venue: "Kulturhuset Bergsjön + ateljéer i Östra Göteborg",
    area: "Bergsjön + Östra Göteborg",
    description:
      "Årlig konsthelg där vernissagen hålls på Kulturhuset Bergsjön och lokala konstnärer öppnar ateljéer, hem och utställningslokaler.",
    sourceLabel: "Konstrundan i Östra Göteborg",
    sourceUrl:
      "https://goteborg.se/wps/portal?uri=gbglnk%3A202631384850168",
  },
  {
    id: "diktgymnasiet-konversationer-frolunda-2026",
    title: "Diktgymnasiet – Konversationer",
    category: "Konst",
    dateLabel: "Nu–13 sep",
    startDate: "2026-08-15",
    endDate: "2026-09-13",
    time: "Mån–fre 10–20 · lör–sön 10–17",
    venue: "Frölunda Kulturhus, Valthornsgatan 13",
    area: "Frölunda",
    description:
      "En utställning om de samtal och konstnärliga samarbeten som blir avgörande när kronisk sjukdom eller funktionsvariation begränsar fysiska möten.",
    sourceLabel: "Göteborgs Stad · Frölunda Kulturhus",
    sourceUrl:
      "https://goteborg.se/wps/portal/start/uppleva-och-gora/kultur/kulturhus/program-pa-kulturhusen?activityId=6454201a-b05b-486c-ac6c-fa9418087b68",
    isFree: true,
    isOngoing: true,
  },
  {
    id: "sarah-klang-goteborgssymfoniker-kalaset-2026",
    title: "Sarah Klang & Göteborgs Symfoniker",
    category: "Musik",
    dateLabel: "27 aug",
    startDate: "2026-08-27",
    time: "17:00–ca 18:30",
    venue: "Götaplatsen",
    area: "Götaplatsen",
    description:
      "Sarah Klang möter Göteborgs Symfoniker under bar himmel med sällan framfört material och nya orkesterarrangemang av hennes mest älskade låtar.",
    sourceLabel: "Göteborgs Konserthus",
    sourceUrl:
      "https://www.gso.se/program/konserter/goteborgskalaset-sarah-klang-goteborgs-symfoniker/",
    isFree: true,
  },
  {
    id: "kulturkvall-vem-betalar-kulturen-2026",
    title: "Kulturkväll: Vem ska betala för kulturen?",
    category: "Samtal",
    dateLabel: "2 sep",
    startDate: "2026-09-02",
    time: "19:00–ca 20:15",
    venue: "Göteborgs Konserthus, Stenhammarsalen",
    area: "Götaplatsen",
    description:
      "Ett publikt samtal om kulturfinansiering och prioriteringar med röster från konst, musik, journalistik, scenkonst och politik.",
    sourceLabel: "Göteborgs Konserthus",
    sourceUrl:
      "https://www.gso.se/program/konserter/kulturkvall-vem-ska-betala-for-kulturen/",
  },
  {
    id: "hagabion-oppningshelg-valet-2026",
    title: "Hagabions öppningshelg: Tema Valet",
    category: "Film",
    dateLabel: "4–6 sep",
    startDate: "2026-09-04",
    endDate: "2026-09-06",
    time: "Program från fre 18:00 · lör 12:15 · sön 13:15",
    venue: "Hagabion, Skeppsbron 4",
    area: "Skeppsbron",
    description:
      "Tre dagar med filmer om demokrati, integration, omvårdnad och miljö, plus premiärer, förhandsvisningar och publiksamtal med gäster.",
    sourceLabel: "Hagabion",
    sourceUrl: "https://hagabion.se/event/oppningshelg-tema-valet/",
  },
  {
    id: "bokcirkel-fantastik-gamlestaden-host-2026",
    title: "Bokcirkel i fantastik",
    category: "Litteratur",
    dateLabel: "7 sep–30 nov",
    startDate: "2026-09-07",
    endDate: "2026-11-30",
    time: "Var tredje måndag 17:00–18:00",
    venue: "Gamlestadens Bibliotek, Gamlestads Torg 11",
    area: "Gamlestaden",
    description:
      "En höstserie för läsare av science fiction, fantasy, dystopier och rysare. Föranmälan krävs via biblioteket.",
    sourceLabel: "Göteborgs Stad · Gamlestadens Bibliotek",
    sourceUrl:
      "https://goteborg.se/wps/portal/start/uppleva-och-gora/bibliotek/alla-arrangemang-pa-biblioteken?activityId=da1df1ac-f2f9-4b3c-8621-967c38fb7afb",
    isFree: true,
  },
  {
    id: "johannes-anyuru-upplyst-sten-2026",
    title: "Johannes Anyuru: Upplyst sten",
    category: "Litteratur",
    dateLabel: "9 sep",
    startDate: "2026-09-09",
    time: "18:00–19:30",
    venue: "Världskulturmuseet, Trappscenen",
    area: "Korsvägen",
    description:
      "Johannes Anyuru samtalar om essäsamlingen Upplyst sten, språkets gränser och författarens roll i en tid av upprepade brott mot mänskligheten.",
    sourceLabel: "Världskulturmuseet",
    sourceUrl:
      "https://www.varldskulturmuseet.se/kalendarium/program/johannes-anyuru-upplyst-sten/",
  },
  {
    id: "pyssla-kawaii-varldskulturmuseet-2026",
    title: "Pyssla kawaii",
    category: "Skapande",
    dateLabel: "19 sep",
    startDate: "2026-09-19",
    time: "13:00–15:00",
    venue: "Världskulturmuseet, Världslabbet",
    area: "Korsvägen",
    description:
      "Drop-in för barn från sex år och tonåringar som vill skapa nyckelringar och magneter med egna eller färdiga kawaii-motiv.",
    sourceLabel: "Världskulturmuseet",
    sourceUrl:
      "https://www.varldskulturmuseet.se/kalendarium/barn-och-familj/pyssla-kawaii2/",
  },
  {
    id: "vemod-vals-och-vanvett-operan-2026",
    title: "Vemod, vals och vanvett",
    category: "Musik",
    dateLabel: "20 sep",
    startDate: "2026-09-20",
    time: "18:00 · ca 2 tim 5 min",
    venue: "GöteborgsOperan, Stora scenen",
    area: "Lilla Bommen",
    description:
      "GöteborgsOperans Orkester inleder hösten med Bruchs violinkonsert, franska orkesterfärger och Ravels stegrande Boléro.",
    sourceLabel: "GöteborgsOperan",
    sourceUrl:
      "https://www.opera.se/forestallningar/sasong-2026-2027/vemod-vals-och-vanvett/",
  },
  {
    id: "utblick-fran-anstalten-frolunda-2026",
    title: "Utblick från anstalten",
    category: "Konst",
    dateLabel: "22 sep–11 okt",
    startDate: "2026-09-22",
    endDate: "2026-10-11",
    time: "Mån–fre 10–20 · lör–sön 10–17",
    venue: "Frölunda Kulturhus, Valthornsgatan 13",
    area: "Frölunda",
    description:
      "En mobil utställning med skulptur och film som synliggör interners erfarenheter av kriminalvård, tillvaro och framtid.",
    sourceLabel: "Göteborgs Stad · Frölunda Kulturhus",
    sourceUrl:
      "https://goteborg.se/wps/portal/start/uppleva-och-gora/kultur/kulturhus/utstallningar-pa-kulturhusen/aktuella-utstallningar?activityId=c2185055-5ebf-4b45-b59c-5b25aded7757",
    isFree: true,
  },
  {
    id: "fornuft-och-kanslor-varldskulturmuseet-2026",
    title: "Förnuft och känslor",
    category: "Samtal",
    dateLabel: "23 sep",
    startDate: "2026-09-23",
    time: "18:00–19:00",
    venue: "Världskulturmuseet, Trappscenen",
    area: "Korsvägen",
    description:
      "Sociologen Åsa Wettergren och psykologen Pär Bjälkebring undersöker hur känslor och förnuft formar våra val, relationer och samhällen.",
    sourceLabel: "Världskulturmuseet",
    sourceUrl:
      "https://www.varldskulturmuseet.se/kalendarium/program/existens-fornuft-och-kanslor/",
    isFree: true,
  },
  {
    id: "azva-manens-tarar-stora-teatern-2026",
    title: "Azvá – Månens tårar",
    category: "Scenkonst",
    dateLabel: "9 sep",
    startDate: "2026-09-09",
    time: "19:00–ca 20:30",
    venue: "Stora Teatern, Stora scenen, Kungsparken 1",
    area: "Kungsparken",
    description:
      "Arthem – Romska Teatern väver musik, vittnesmål och folklig mystik till en scenisk berättelse om romskt slaveri, motstånd och minne.",
    sourceLabel: "Stora Teatern",
    sourceUrl:
      "https://storateatern.se/sv/program/azva-%E2%80%90-manens-tarar-2/",
  },
  {
    id: "slojdkvall-naturhistoriska-host-2026",
    title: "Slöjdkväll på museet",
    category: "Skapande",
    dateLabel: "10 sep–3 dec · fyra träffar",
    startDate: "2026-09-10",
    endDate: "2026-12-03",
    time: "10 sep, 8 okt, 12 nov & 3 dec · 17:30–19:30",
    venue: "Göteborgs naturhistoriska museum, Utsiktsrummet",
    area: "Slottsskogen",
    description:
      "En månatlig höstserie där Göteborgsslöjd låter både unga och vuxna prova olika slöjdtekniker, med ett nytt tema vid varje träff.",
    sourceLabel: "Göteborgs naturhistoriska museum",
    sourceUrl:
      "https://www.gnm.se/aktiviteter/kalendarium/slojdkvall-pa-museet/",
  },
  {
    id: "doruntina-kastrati-roda-sten-2026",
    title: "Doruntina Kastrati – ...why do you hold back?",
    category: "Konst",
    dateLabel: "12 sep–22 nov",
    startDate: "2026-09-12",
    endDate: "2026-11-22",
    time: "Se aktuella öppettider hos källan",
    venue: "Röda Sten Konsthall, Röda Sten 1",
    area: "Klippan",
    description:
      "Den kosovanska konstnären Doruntina Kastratis första separatutställning i Norden visas över konsthallen under hösten.",
    sourceLabel: "Röda Sten Konsthall",
    sourceUrl: "https://rodasten.com/utstallningar/",
  },
  {
    id: "valdag-malmska-valen-2026",
    title: "VALdag: Kliv in i Malmska valen",
    category: "Museum",
    dateLabel: "13 sep",
    startDate: "2026-09-13",
    time: "11:00–16:00",
    venue: "Göteborgs naturhistoriska museum, Museivägen 10",
    area: "Slottsskogen",
    description:
      "På valdagen öppnas den mytomspunna Malmska valens buk för besökare, med en inledande Moby Dick-läsning av översättaren Niklas Hval.",
    sourceLabel: "Göteborgs naturhistoriska museum",
    sourceUrl: "https://www.gnm.se/aktiviteter/kalendarium/valdagen/",
  },
  {
    id: "rovdjurens-tysta-krig-naturhistoriska-2026",
    title: "Rovdjurens tysta krig – och jägarna som aldrig syns",
    category: "Samtal",
    dateLabel: "17 sep",
    startDate: "2026-09-17",
    time: "18:00–19:00",
    venue: "Göteborgs naturhistoriska museum, Föreläsningssalen",
    area: "Slottsskogen",
    description:
      "Den tidigare miljöbrottspolisen Erold Coleman berättar om organiserad tjuvjakt och dess konsekvenser för Sveriges stora rovdjur.",
    sourceLabel: "Göteborgs naturhistoriska museum",
    sourceUrl:
      "https://www.gnm.se/aktiviteter/kalendarium/foredrag-rovdjurens-tysta-krig--och-jagarna-som-aldrig-syns/",
  },
  {
    id: "krister-linder-carbon-based-solar-fields-2026",
    title: "Krister Linder, Carbon Based Lifeforms & Solar Fields",
    category: "Musik",
    dateLabel: "19 sep",
    startDate: "2026-09-19",
    time: "19:00 · ca 3 tim 45 min",
    venue: "Stora Teatern, Stora scenen, Kungsparken 1",
    area: "Kungsparken",
    description:
      "Tre svenska namn inom ambient, konstmusik och downtempo möts i en specialbyggd audiovisuell konsertkväll.",
    sourceLabel: "Stora Teatern",
    sourceUrl:
      "https://storateatern.se/sv/program/krister-linder-carbon-based-lifeforms-solar-fields/",
  },
  {
    id: "forskarfredag-quiz-naturhistoriska-2026",
    title: "ForskarFredag: Quiz på museet",
    category: "Samtal",
    dateLabel: "24 sep",
    startDate: "2026-09-24",
    time: "17:30–19:30",
    venue: "Göteborgs naturhistoriska museum, Biblioteket",
    area: "Slottsskogen",
    description:
      "En svensk-engelsk kväll där lag möter forskare, samlar fakta och tävlar i ett quiz om forskning genom tiderna och in i framtiden.",
    sourceLabel: "Göteborgs naturhistoriska museum",
    sourceUrl:
      "https://www.gnm.se/aktiviteter/kalendarium/forskarfredag/",
    isFree: true,
  },
  {
    id: "makrameworkshop-sjofartsmuseet-host-2026",
    title: "Makraméworkshop",
    category: "Skapande",
    dateLabel: "24 sep–10 nov · sex tillfällen",
    startDate: "2026-09-24",
    endDate: "2026-11-10",
    time: "15:30–17:30",
    venue: "Sjöfartsmuseet Akvariet, Studion/Gripsholm",
    area: "Majorna",
    description:
      "En återkommande workshop från 13 år där Samira Khoshbakht Bahremany lär ut sjömanshantverkets grundknutar; material finns på plats.",
    sourceLabel: "Sjöfartsmuseet Akvariet",
    sourceUrl:
      "https://www.sjofartsmuseetakvariet.se/aktivitet/makrameworkshop-2/",
  },
  {
    id: "forskarfredag-magasinsvisningar-2026",
    title: "ForskarFredag: Magasinsvisningar",
    category: "Museum",
    dateLabel: "26 sep",
    startDate: "2026-09-26",
    time: "12:00, 13:00 & 14:00 · ca 40 min",
    venue: "Göteborgs naturhistoriska museum, Museivägen 10",
    area: "Slottsskogen",
    description:
      "Museets intendenter visar samlingar bakom kulisserna och berättar hur hundraårigt material fortfarande används av forskare världen över.",
    sourceLabel: "Göteborgs naturhistoriska museum",
    sourceUrl:
      "https://www.gnm.se/aktiviteter/kalendarium/magasinsvisningar/",
    isFree: true,
  },
  {
    id: "havets-vasen-sjofartsmuseet-2026",
    title: "Berättarträff: Havets väsen",
    category: "Litteratur",
    dateLabel: "1 okt",
    startDate: "2026-10-01",
    time: "10:30–12:00",
    venue: "Sjöfartsmuseet Akvariet, Gripsholmssalen",
    area: "Majorna",
    description:
      "Muntliga berättelser om havet, livet på sjön och kustens väsen följs av gemensam reflektion och möjlighet att dela egna historier.",
    sourceLabel: "Sjöfartsmuseet Akvariet",
    sourceUrl:
      "https://www.sjofartsmuseetakvariet.se/aktivitet/berattartraff-havets-vasen/?date=202610011030",
  },
  {
    id: "skulptur-i-pilane-2026",
    title: "Skulptur i Pilane",
    category: "Konst",
    dateLabel: "14 maj–27 sep",
    startDate: "2026-05-14",
    endDate: "2026-09-27",
    time: "Maj–aug 09:00–19:00 · sep 10:00–17:00",
    venue: "Pilane skulpturpark",
    area: "Tjörn",
    description:
      "Tony Craggs skulpturer möter betande får, fornlämningar och bohuslänskt kulturlandskap i Pilanes tjugoårsjubileum.",
    sourceLabel: "Göteborgs officiella besöksguide",
    sourceUrl: "https://www.goteborg.com/evenemang/skulptur-i-pilane",
  },
  {
    id: "noughties-molndal-2026",
    title: "Noughties – 00-talets mode och trender",
    category: "Museum",
    dateLabel: "15 aug–27 sep",
    startDate: "2026-08-15",
    endDate: "2026-09-27",
    time: "Museets öppettider",
    venue: "Mölndals stadsmuseum",
    area: "Mölndal",
    description:
      "Den lilla men maxade sommarutställningen tar en nostalgisk titt på denim, velour, loggor, bloggare och Y2K-mode.",
    sourceLabel: "Göteborgs officiella besöksguide",
    sourceUrl:
      "https://www.goteborg.com/evenemang/noughties-00-talets-mode-och-trender",
    isFree: true,
  },
  {
    id: "djuren-i-staden-naturhistoriska-2026",
    title: "Djuren i staden",
    category: "Museum",
    dateLabel: "Pågår–9 jan 2028",
    startDate: "2026-04-21",
    endDate: "2028-01-09",
    time: "Insläpp varje kvart över timmen",
    venue: "Göteborgs Naturhistoriska Museum",
    area: "Slottsskogen",
    description:
      "En humoristisk familjeutställning efter Sarah Sheppards bok där sparvar, råttor och rävar visar stadens hemliga liv.",
    sourceLabel: "Göteborgs officiella besöksguide",
    sourceUrl: "https://www.goteborg.com/evenemang/djuren-i-staden",
  },
  {
    id: "skuggornas-varld-maritiman-2026",
    title: "Skuggornas värld",
    category: "Museum",
    dateLabel: "2 apr–1 nov",
    startDate: "2026-04-02",
    endDate: "2026-11-01",
    time: "Museets öppettider",
    venue: "Maritiman",
    area: "Packhusplatsen",
    description:
      "En spionutställning där verkligt underrättelsearbete möter film, spel och populärkultur – med uppdrag för hela familjen.",
    sourceLabel: "Göteborgs officiella besöksguide",
    sourceUrl: "https://www.goteborg.com/evenemang/skuggornas-varld",
  },
  {
    id: "asger-jorn-per-kirkeby-2026",
    title: "Asger Jorn och Per Kirkeby",
    category: "Konst",
    dateLabel: "10 maj–6 sep",
    startDate: "2026-05-10",
    endDate: "2026-09-06",
    time: "11:00–17:00",
    venue: "Nordiska Akvarellmuseet",
    area: "Skärhamn",
    description:
      "Akvareller och teckningar av två av Danmarks mest betydelsefulla efterkrigskonstnärer, kompletterade av verk ur museets samling.",
    sourceLabel: "Göteborgs officiella besöksguide",
    sourceUrl:
      "https://www.goteborg.com/evenemang/asger-jorn-och-per-kirkeby-pa-nordiska-akvarellmuseet",
  },
  {
    id: "what-ever-pays-off-konstepidemin-2026",
    title: "What ever pays off",
    category: "Konst",
    dateLabel: "28 aug–20 sep",
    startDate: "2026-08-28",
    endDate: "2026-09-20",
    time: "Ons 16–20, tor–fre 12–17, lör–sön 12–16",
    venue: "Galleri Konstepidemin, Galleriet",
    area: "Konstepidemins väg 6",
    description:
      "Jacqueline Forzelius samlar performancevideo, miniatyrdioraman, målningar och mosaik i en utställning om arbete, mening och vad samhället räknar på.",
    sourceLabel: "Konstepidemin",
    sourceUrl: "https://konstepidemin.se/kalender/what-ever-pays-off/",
  },
  {
    id: "crysis-revision-konstepidemin-2026",
    title: "CRYSIS: Revision",
    category: "Konst",
    dateLabel: "28 aug–20 sep",
    startDate: "2026-08-28",
    endDate: "2026-09-20",
    time: "Ons 16–20, tor–fre 12–17, lör–sön 12–16",
    venue: "Galleri Konstepidemin, Glasrummet",
    area: "Konstepidemins väg 6",
    description:
      "Medina Balešić, Bea Lamadrid Bayón och Maira Darja förenar rörelse, ljud och rörlig bild i ett verk om kropp, identitet, minne och kollektiv erfarenhet.",
    sourceLabel: "Konstepidemin",
    sourceUrl: "https://konstepidemin.se/kalender/crysis-revision/",
  },
  {
    id: "unmaking-stones-konstepidemin-2026",
    title: "Unmaking Stones",
    category: "Konst",
    dateLabel: "28 aug–20 sep",
    startDate: "2026-08-28",
    endDate: "2026-09-20",
    time: "Ons 16–20, tor–fre 12–17, lör–sön 12–16",
    venue: "Galleri Konstepidemin, Bergrummet",
    area: "Konstepidemins väg 6",
    description:
      "Marilen Rauch låter besökare delta när fältspat mals i en egenbyggd keramisk kulkvarn och synliggör mineralets dolda materialhistoria.",
    sourceLabel: "Konstepidemin",
    sourceUrl: "https://konstepidemin.se/kalender/unmaking-stones/",
  },
  {
    id: "liminalitet-konstepidemin-2026",
    title: "Liminalitet",
    category: "Konst",
    dateLabel: "28 aug–20 sep",
    startDate: "2026-08-28",
    endDate: "2026-09-20",
    time: "Ons 16–20, tor–fre 12–17, lör–sön 12–16",
    venue: "Galleri Konstepidemin, Pannrummet",
    area: "Konstepidemins väg 6",
    description:
      "Camilla Engmans installation bygger en portal kring tillhörighet, förändring och en ny relation mellan människan och allt levande.",
    sourceLabel: "Konstepidemin",
    sourceUrl: "https://konstepidemin.se/kalender/liminalitet/",
  },
  {
    id: "blues-i-hangmattan-hosten-2026",
    title: "Blues i Hängmattan – hösten 2026",
    category: "Musik",
    dateLabel: "26 aug–16 dec, varannan onsdag",
    startDate: "2026-08-26",
    endDate: "2026-12-16",
    time: "19:00",
    venue: "Hängmattan, Karl Johansgatan 16",
    area: "Majorna",
    description:
      "Nio fria klubbkvällar med Göteborgsblues och boogie, från Blue Confessions och Miss Daisy till Steamship Blues och Juke Jointers.",
    sourceLabel: "Musikens Hus & Hängmattan",
    sourceUrl:
      "https://www.musikenshus.se/blues-i-hangmattan-molle-molin-band/",
    isFree: true,
  },
  {
    id: "goteborg-open-stage-hosten-2026",
    title: "Göteborg Open Stage – hösten 2026",
    category: "Scenkonst",
    dateLabel: "17 sep, 15 okt, 19 nov, 17 dec",
    startDate: "2026-09-17",
    endDate: "2026-12-17",
    time: "19:00",
    venue: "Hängmattan, Karl Johansgatan 16",
    area: "Majorna",
    description:
      "En öppen scen för musik, spoken word, poesi, dans och magi där både anmälda och spontana framträdanden ryms under fyra höstkvällar.",
    sourceLabel: "Musikens Hus & Hängmattan",
    sourceUrl:
      "https://www.musikenshus.se/goteborg-open-stage-host-2026-2/",
    isFree: true,
  },
  {
    id: "live-action-21-efter-auschwitz-2026",
    title: "Live Action 21 – Efter Auschwitz",
    category: "Festival",
    dateLabel: "3–5 sep",
    startDate: "2026-09-03",
    endDate: "2026-09-05",
    time: "19:00–22:30",
    venue: "3:e Våningen, Sockerbruket 9",
    area: "Majorna",
    description:
      "Tolv konstnärer från tio länder möts under tre kvällar i en performancekonstfestival om minne, ansvar, våld, motstånd och mänsklig närvaro.",
    sourceLabel: "3:e Våningen",
    sourceUrl: "https://3vaningen.se/live-action-21-2026/",
    isFree: true,
  },
  {
    id: "ljuset-som-bygger-varlden-2026",
    title: "Ljuset som bygger världen",
    category: "Konst",
    dateLabel: "12 sep–11 okt",
    startDate: "2026-09-12",
    endDate: "2026-10-11",
    time: "Ons–sön 12:00–16:00",
    venue: "3:e Våningen, Sockerbruket 9",
    area: "Majorna",
    description:
      "Terese Molins nya vävar möter Fanny Hellgrens skulpturer och verk på papper i en duoutställning om ljusets dubbla natur.",
    sourceLabel: "3:e Våningen",
    sourceUrl:
      "https://3vaningen.se/terese-molin-och-fanny-hellgren-2026/",
    isFree: true,
  },
  {
    id: "aktenskapets-hemligheter-operan-2026",
    title: "Äktenskapets hemligheter",
    category: "Scenkonst",
    dateLabel: "11 sep–8 nov",
    startDate: "2026-09-11",
    endDate: "2026-11-08",
    time: "Flera tider · Göteborg 6 & 8 nov",
    venue: "GöteborgsOperan, Lilla scenen",
    area: "Lilla Bommen",
    description:
      "Två komiska operor om kärlek, svartsjuka och alla små hemligheter vi gömmer för den vi lever med.",
    sourceLabel: "GöteborgsOperan",
    sourceUrl:
      "https://www.opera.se/forestallningar/sasong-2026-2027/aktenskapets-hemligheter/",
  },
  {
    id: "wicked-goteborgsoperan-2026",
    title: "Wicked",
    category: "Scenkonst",
    dateLabel: "3 okt 2026–20 mars 2027",
    startDate: "2026-10-03",
    endDate: "2027-03-20",
    time: "Flera tider · cirka 3 tim 15 min",
    venue: "GöteborgsOperan, Stora scenen",
    area: "Lilla Bommen",
    description:
      "Den storslagna musikalen om Elphaba och Galinda återvänder i GöteborgsOperans hyllade uppsättning.",
    sourceLabel: "GöteborgsOperan",
    sourceUrl:
      "https://www.opera.se/forestallningar/sasong-2026-2027/wicked/",
  },
  {
    id: "flesh-chariot-goteborg-2026",
    title: "flesh chariot, chariot of flesh",
    category: "Scenkonst",
    dateLabel: "21–22 okt",
    startDate: "2026-10-21",
    endDate: "2026-10-22",
    time: "19:00 · 90 min",
    venue: "Göteborgs Stadsteater, Stora Scen",
    area: "Götaplatsen",
    description:
      "Cullberg och koreografen Faye Driscoll låter femton kroppar bilda en levande, föränderlig organism på scen.",
    sourceLabel: "Göteborgs Stadsteater",
    sourceUrl:
      "https://stadsteatern.goteborg.se/pa-scen/2026-2027/flesh-chariot-chariot-of-flesh/",
  },
  {
    id: "stolthet-och-fordom-stadsteatern-2026",
    title: "Stolthet och fördom",
    category: "Scenkonst",
    dateLabel: "Nypremiär 9 okt",
    startDate: "2026-10-09",
    time: "Cirka 3 timmar inkl. paus",
    venue: "Göteborgs Stadsteater, Stora Scen",
    area: "Götaplatsen",
    description:
      "Jane Austens ikoniska rom-com om Elizabeth Bennet, Mr Darcy, kärlek och sociala fördomar får nytt liv i Göteborg.",
    sourceLabel: "Göteborgs Stadsteater",
    sourceUrl:
      "https://www.stadsteatern.goteborg.se/pa-scen/2026-2027/stolthet-och-fordom2/",
  },
  {
    id: "still-looking-for-rick-folkteatern-2026",
    title: "Still Looking for Rick",
    category: "Scenkonst",
    dateLabel: "27–29 aug",
    startDate: "2026-08-27",
    endDate: "2026-08-29",
    time: "27–28 aug 18:30 · 29 aug 16:00",
    venue: "Folkteatern, Lilla scenen",
    area: "Järntorget",
    description:
      "En feministisk true crime-föreställning som undersöker vad som hänt med det feministiska samtalet sedan 2006.",
    sourceLabel: "Folkteatern",
    sourceUrl: "https://www.folkteatern.se/events/still-looking-for-rick",
  },
  {
    id: "mecenatens-aterkomst-folkteatern-2026",
    title: "Mecenatens återkomst",
    category: "Scenkonst",
    dateLabel: "1 sep",
    startDate: "2026-09-01",
    time: "19:00 · 90 min",
    venue: "Folkteatern, Foajén",
    area: "Järntorget",
    description:
      "En snabbproducerad svart komedi om privatfinansiering, kulturpolitik och hemmagjorda bomber.",
    sourceLabel: "Folkteatern",
    sourceUrl: "https://www.folkteatern.se/events/mecenatens-aterkomst",
  },
  {
    id: "gothenburg-fringe-festival-2026",
    title: "Gothenburg Fringe Festival 2026",
    category: "Festival",
    dateLabel: "2–5 sep",
    startDate: "2026-09-02",
    endDate: "2026-09-05",
    time: "Flera tider",
    venue: "Folkteatern + scener över staden",
    area: "Göteborg",
    description:
      "En gränsöverskridande scenkonstfestival med teater, musik, dans, drag, burlesk och komedi på oväntade platser.",
    sourceLabel: "Folkteatern",
    sourceUrl:
      "https://www.folkteatern.se/events/gothenburg-fringe-festival-2026",
  },
  {
    id: "the-escape-room-folkteatern-2026",
    title: "The Escape Room",
    category: "Scenkonst",
    dateLabel: "15–17 okt",
    startDate: "2026-10-15",
    endDate: "2026-10-17",
    time: "18:30 · 1 tim 25 min",
    venue: "Folkteatern, Lilla scenen",
    area: "Järntorget",
    description:
      "Ett surrealistiskt scenkonstäventyr där ett klassiskt escape room förvandlas till en resa genom det kollektiva omedvetna.",
    sourceLabel: "Folkteatern",
    sourceUrl: "https://www.folkteatern.se/events/the-escape-room",
  },
  {
    id: "first-aid-kit-gso-2026",
    title: "First Aid Kit & Göteborgs Symfoniker",
    category: "Musik",
    dateLabel: "23–24 sep",
    startDate: "2026-09-23",
    endDate: "2026-09-24",
    time: "19:00 · cirka 2 timmar",
    venue: "Göteborgs Konserthus, Stora salen",
    area: "Götaplatsen",
    description:
      "First Aid Kits drömska americana möter Göteborgs Symfonikers symfoniska arrangemang i två konserter.",
    sourceLabel: "Göteborgs Konserthus",
    sourceUrl: "https://www.gso.se/program/konserter/first-aid-kit-goteborgs-symfoniker/",
  },
  {
    id: "tillbaka-till-en-upplyst-varld-gso-2026",
    title: "Tillbaka till en upplyst värld",
    category: "Samtal",
    dateLabel: "25 sep",
    startDate: "2026-09-25",
    time: "19:00 · cirka 2 timmar",
    venue: "Göteborgs Konserthus, Stora salen",
    area: "Götaplatsen",
    description:
      "En kväll för demokrati och anständighet med samtal, musik av Sara Parkman och Göteborgs Symfoniker.",
    sourceLabel: "Göteborgs Konserthus",
    sourceUrl: "https://www.gso.se/program/konserter/tillbaka-till-en-upplyst-varld/",
  },
  {
    id: "arstiderna-i-nya-farger-gso-2026",
    title: "Årstiderna i nya färger",
    category: "Musik",
    dateLabel: "9 okt",
    startDate: "2026-10-09",
    time: "18:00 · cirka 2 timmar",
    venue: "Göteborgs Konserthus, Stora salen",
    area: "Götaplatsen",
    description:
      "Vivaldis årstider får ny färg när Kent Nagano leder Göteborgs Symfoniker i musik av Vivaldi, Schumann och Aziza Sadikova.",
    sourceLabel: "Göteborgs Konserthus",
    sourceUrl: "https://www.gso.se/program/konserter/arstiderna-i-nya-farger/",
  },
  {
    id: "jubelklanger-som-ger-hopp-gso-2026",
    title: "Jubelklanger som ger hopp",
    category: "Musik",
    dateLabel: "16–17 okt",
    startDate: "2026-10-16",
    endDate: "2026-10-17",
    time: "Fre 18:00 · lör 15:00",
    venue: "Göteborgs Konserthus, Stora salen",
    area: "Götaplatsen",
    description:
      "Göteborgs Symfoniker, orgel, kör och solister möts i musik av Elfrida Andrée och Mendelssohns Lobgesang.",
    sourceLabel: "Göteborgs Konserthus",
    sourceUrl: "https://www.gso.se/program/konserter/jubelklanger-som-ger-hopp/",
  },
  {
    id: "juljubel-gso-2026",
    title: "Juljubel",
    category: "Musik",
    dateLabel: "27–28 nov",
    startDate: "2026-11-27",
    endDate: "2026-11-28",
    time: "18:00 · cirka 2 timmar",
    venue: "Göteborgs Konserthus, Stora salen",
    area: "Götaplatsen",
    description:
      "Viktoria Tolstoy, Tomas von Brömssen, körer och Göteborgs Symfonikers brassensemble startar julen med nya och gamla sånger.",
    sourceLabel: "Göteborgs Konserthus",
    sourceUrl: "https://www.gso.se/program/konserter/juljubel-goteborgs-symfoniker-2026/",
  },
  {
    id: "det-har-ar-vi-frolunda-2026",
    title: "Det här är vi!",
    category: "Konst",
    dateLabel: "Pågår–6 sep",
    startDate: "2026-08-22",
    endDate: "2026-09-06",
    time: "Mån–fre 10:00–20:00 · lör–sön 10:00–17:00",
    venue: "Frölunda Kulturhus, gågatan",
    area: "Frölunda",
    description:
      "Textila självporträtt och bilder i applikationsteknik skapade av femteklassare på Slottsbergsskolan.",
    sourceLabel: "Göteborgs Stad · Frölunda Kulturhus",
    sourceUrl:
      "https://goteborg.se/wps/portal/start/uppleva-och-gora/kultur/kulturhus/program-pa-kulturhusen?activityId=b8a10715-b3eb-47f3-ba3c-c7eec6d542f3",
    isFree: true,
    isOngoing: true,
  },
  {
    id: "politikshowen-stora-teatern-2026",
    title: "Politikshowen – Vem vinner slaget om Göteborg?",
    category: "Samtal",
    dateLabel: "2 sep",
    startDate: "2026-09-02",
    time: "18:00 · cirka 2 timmar",
    venue: "Stora Teatern, Stora scenen",
    area: "Kungsportsplatsen",
    description:
      "Göteborgs toppolitiker möter GP, P4 Göteborg och SVT Nyheter Väst i en direktsänd kväll med debatt och livemusik.",
    sourceLabel: "Stora Teatern",
    sourceUrl: "https://storateatern.se/sv/program/politikshowen/",
  },
  {
    id: "o-festen-ringon-2026",
    title: "Ö-festen 2026",
    category: "Festival",
    dateLabel: "5 sep",
    startDate: "2026-09-05",
    time: "11:00–17:00 · kvällsöppet fortsätter",
    venue: "Området kring Järnmalmsgatan 1",
    area: "Ringön",
    description:
      "Ringön fylls med musik, konst, loppisar, fordon, mat och öppna verksamheter under en heldag för hela staden.",
    sourceLabel: "Göteborgs officiella besöksguide",
    sourceUrl: "https://www.goteborg.com/evenemang/o-festen",
    isFree: true,
  },
  {
    id: "lordagsstudion-smyckesverkstad-hosten-2026",
    title: "Lördagsstudion: Smyckesverkstad",
    category: "Skapande",
    dateLabel: "12 sep, 10 okt & 7 nov",
    startDate: "2026-09-12",
    endDate: "2026-11-07",
    time: "13:00–15:30",
    venue: "Röhsska museet, Studio 1",
    area: "Vasastaden",
    description:
      "Barn från sex år och deras vuxna utforskar museets smycken och skapar egna verk av bland annat sten, lera, pärlor och spillmaterial.",
    sourceLabel: "Röhsska museet",
    sourceUrl:
      "https://rohsska.se/aktivitet/lordagsstudion-smyckesverkstad/",
  },
  {
    id: "designhistorier-visningar-hosten-2026",
    title: "Designhistorier – guidade visningar",
    category: "Museum",
    dateLabel: "13 sep–6 dec",
    startDate: "2026-09-13",
    endDate: "2026-12-06",
    time: "Utvalda söndagar 12:00 eller 14:00 · 45 min",
    venue: "Röhsska museet",
    area: "Vasastaden",
    description:
      "En serie guidade turer genom sex teman som visar hur design formar vardagen, samhället och våra sätt att uttrycka oss.",
    sourceLabel: "Röhsska museet",
    sourceUrl: "https://rohsska.se/aktivitet/oppen-visning-designhistorier/",
  },
  {
    id: "landskapsbroderi-marbosom-2026",
    title: "Landskapsbroderi: Marbosöm",
    category: "Skapande",
    dateLabel: "17 sep",
    startDate: "2026-09-17",
    time: "13:00–15:00",
    venue: "Göteborgs stadsmuseum",
    area: "Norra Hamngatan",
    description:
      "Hanne Samuelsson leder en workshop i den röd- och blåvita broderitraditionen från Marks härad. Material finns på plats.",
    sourceLabel: "Göteborgs stadsmuseum",
    sourceUrl:
      "https://goteborgsstadsmuseum.se/aktivitet/workshop-landskapsbroderi-och-marbosom/",
  },
  {
    id: "goteborg-baroque-vivaldi-2026",
    title: "Göteborg Baroque – Vivaldi, virtuosen från Venedig",
    category: "Musik",
    dateLabel: "26 sep",
    startDate: "2026-09-26",
    time: "19:00 · cirka 2 tim 40 min inkl. paus",
    venue: "Stora Teatern, Stora scenen",
    area: "Kungsportsplatsen",
    description:
      "Göteborg Baroque öppnar säsongen med Vivaldis vokal- och instrumentalverk, lett av Magnus Kjellson från ett claviorganum.",
    sourceLabel: "Stora Teatern",
    sourceUrl:
      "https://storateatern.se/sv/program/goteborg-baroque-vivaldi-virtuosen-fran-venedig/",
  },
  {
    id: "alla-ater-alla-hammarkullen-2026",
    title: "Alla äter Alla",
    category: "Litteratur",
    dateLabel: "26 sep",
    startDate: "2026-09-26",
    time: "14:00–14:30",
    venue: "Hammarkullens bibliotek, Hammarkulletorget 62B",
    area: "Hammarkullen",
    description:
      "Aron Landahl läser ur en jättelik version av bilderboken om näringskedjan, ackompanjerad av tuba och cello.",
    sourceLabel: "Göteborgs Stad · Hammarkullens bibliotek",
    sourceUrl:
      "https://goteborg.se/wps/portal/start/uppleva-och-gora/bibliotek/alla-arrangemang-pa-biblioteken?activityId=08a7c6aa-edbc-4fb3-b452-72d8cca5108a",
    isFree: true,
  },
] satisfies CulturalEvent[];

const museumDirectoryEvents: CulturalEvent[] = OBJEKT.filter(
  (object) =>
    object.slag === "plats" &&
    object.sal === "kultur" &&
    !object.id.startsWith("obj-kulturhus-"),
).map((object) => {
  const sourceUrl = object.lankar.find((link) => link.slag === "hemsida")?.url;

  if (!sourceUrl) {
    throw new Error(`Museum saknar hemsida: ${object.titel}`);
  }

  return {
    id: `museum-directory-${object.id}`,
    title: object.titel,
    category: "Museum",
    dateLabel: "Permanent",
    startDate: "2026-08-23",
    venue: `${object.platsNamn ?? object.titel}, ${object.adress ?? "Göteborg"}`,
    area: object.kvarter ?? "Göteborg med närregion",
    description: object.varfor,
    sourceLabel: object.platsNamn ?? object.titel,
    sourceUrl,
    isOngoing: true,
  };
});

const kulturhusDirectoryEvents: CulturalEvent[] = OBJEKT.filter(
  (object) =>
    object.slag === "plats" &&
    object.sal === "kultur" &&
    object.id.startsWith("obj-kulturhus-"),
).map((object) => {
  const sourceUrl = object.lankar.find((link) => link.slag === "hemsida")?.url;

  if (!sourceUrl) {
    throw new Error(`Kulturhus saknar hemsida: ${object.titel}`);
  }

  return {
    id: `kulturhus-directory-${object.id}`,
    title: object.titel,
    category: "Kulturhus",
    dateLabel: "Permanent",
    startDate: "2026-08-23",
    venue: `${object.platsNamn ?? object.titel}, ${object.adress ?? "Göteborg"}`,
    area: object.kvarter ?? "Göteborg",
    description: object.varfor,
    sourceLabel: object.platsNamn ?? object.titel,
    sourceUrl,
    isOngoing: true,
  };
});

const trustedSourceHosts = new Set([
  "3vaningen.se",
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
  "hagabion.se",
  "konstepidemin.se",
  "kulturnatta.goteborg.se",
  "opera.se",
  "rohsska.se",
  "sjofartsmuseetakvariet.se",
  "stadsteatern.goteborg.se",
  "storateatern.se",
  "varldskulturmuseet.se",
  "www.botaniska.se",
  "www.bokmassan.se",
  "www.folkteatern.se",
  "www.goteborg.com",
  "www.goteborgsstadsmuseum.se",
  "www.gdtf.se",
  "www.gso.se",
  "www.hasselbladfoundation.org",
  "www.hagabion.se",
  "www.opera.se",
  "www.rohsska.se",
  "www.sjofartsmuseetakvariet.se",
  "www.stadsteatern.goteborg.se",
  "www.storateatern.se",
  "www.varldskulturmuseet.se",
  "aeroseum.se",
  "akvarellmuseet.org",
  "fiskemuseet.se",
  "gallerithomassen.se",
  "goteborgenergi.se",
  "gnm.se",
  "goteborgskonsthall.se",
  "gotheborg.se",
  "maritiman.se",
  "musikenshus.se",
  "molndal.se",
  "paradoxmuseumgothenburg.com",
  "radiomuseet.se",
  "remfabriken.se",
  "ringlinien.org",
  "rodasten.com",
  "sahlgrenska.se",
  "universeum.se",
  "wisdome.se",
  "www.wisdome.se",
  "worldofvolvo.com",
  "www.worldofvolvo.com",
  "www.aeroseum.se",
  "www.3vaningen.se",
  "www.akvarellmuseet.org",
  "www.fiskemuseet.se",
  "www.gallerithomassen.se",
  "www.goteborgenergi.se",
  "www.gnm.se",
  "www.goteborgskonsthall.se",
  "www.gotheborg.se",
  "www.maritiman.se",
  "www.musikenshus.se",
  "www.molndal.se",
  "www.paradoxmuseumgothenburg.com",
  "www.radiomuseet.se",
  "www.remfabriken.se",
  "www.ringlinien.org",
  "www.rodasten.com",
  "medicinhistoriska.sahlgrenska.se",
  "www.medicinhistoriska.sahlgrenska.se",
  "www.oscariiifort.se",
  "www.konstepidemin.se",
  "oscariiifort.se",
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
  [
    ...scannedCulturalEvents,
    ...museumDirectoryEvents,
    ...kulturhusDirectoryEvents,
  ],
);

export const culturalCatalogVerifiedAt = "2026-08-24";
