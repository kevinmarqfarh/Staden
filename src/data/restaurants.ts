export type RestaurantPriceTier = 1 | 2 | 3 | 4;

export type RestaurantCuisine =
  | "Asiatiskt"
  | "Fisk & skaldjur"
  | "Franskt"
  | "Internationellt"
  | "Italienskt"
  | "Japanskt"
  | "Koreanskt"
  | "Mellanöstern"
  | "Mexikanskt"
  | "Nordiskt"
  | "Spanskt"
  | "Veganskt"
  | "Östeuropeiskt";

export type Restaurant = {
  id: string;
  name: string;
  cuisine: RestaurantCuisine;
  flavours: string[];
  priceTier: RestaurantPriceTier;
  area: string;
  address: string;
  format: string;
  description: string;
  bestFor: string[];
  sourceLabel: string;
  sourceUrl: string;
  websiteUrl?: string;
  opened?: string;
  isNew?: boolean;
  isVegan?: boolean;
  isMichelin?: boolean;
  isWorkLunch?: boolean;
};

export const RESTAURANT_SCAN_DATE = "2026-08-23";

// Price tiers are editorial estimates for one meal per person without drinks.
// Menus and prices change, so every card links back to its verification source.
const scannedRestaurants: Restaurant[] = [
  {
    id: "bar-astell",
    name: "Bar Astell",
    cuisine: "Internationellt",
    flavours: ["Vinbar", "Smårätter", "Ost & chark"],
    priceTier: 3,
    area: "Lorensberg",
    address: "Södra Vägen 47",
    format: "Vinbar & bakficka",
    description:
      "Projects nyaste, mer spontana syskon med vin, smårätter, ost och chark vägg i vägg med stjärnkrogen.",
    bestFor: ["Nytt", "Vin", "Efter jobbet"],
    sourceLabel: "Thatsup · nyöppnat",
    sourceUrl:
      "https://thatsup.se/goteborg/guide/nya-restauranger-i-goteborg/",
    websiteUrl: "https://projectgbg.com/",
    opened: "20 aug 2026",
    isNew: true,
  },
  {
    id: "ophelia",
    name: "Ophelia",
    cuisine: "Internationellt",
    flavours: ["Svenskt", "Medelhavet", "Säsong"],
    priceTier: 3,
    area: "Lindholmen",
    address: "Theres Svenssons gata 15",
    format: "Kvarterskrog vid kajen",
    description:
      "Nytt kajläge med säsongsmeny som rör sig mellan svenska smaker, Medelhavet och enstaka asiatiska avstickare.",
    bestFor: ["Nytt", "Utsikt", "Långlunch"],
    sourceLabel: "Thatsup · nyöppnat",
    sourceUrl:
      "https://thatsup.se/goteborg/guide/nya-restauranger-i-goteborg/",
    opened: "aug 2026",
    isNew: true,
  },
  {
    id: "bar-schiacciate",
    name: "Bar Schiacciate",
    cuisine: "Italienskt",
    flavours: ["Toscana", "Schiacciata", "Streetfood"],
    priceTier: 2,
    area: "Lindholmen",
    address: "Lindholmsallén 22C",
    format: "Italiensk sandwichbar",
    description:
      "Nygräddad toskansk schiacciata fylld med bland annat mortadella, stracciatella och pistage.",
    bestFor: ["Nytt", "Lunch", "Takeaway"],
    sourceLabel: "Göteborgs officiella besöksguide",
    sourceUrl: "https://www.goteborg.com/platser/bar-schiacciate",
    websiteUrl: "https://www.barschiacciate.se/",
    opened: "1 juni 2026",
    isNew: true,
    isWorkLunch: true,
  },
  {
    id: "vassen-market",
    name: "Vassen Market",
    cuisine: "Internationellt",
    flavours: ["Global streetfood", "Matmarknad", "Kultur"],
    priceTier: 2,
    area: "Ringön",
    address: "Pumpgatan 10",
    format: "Mat- och kulturmarknad",
    description:
      "Stor hamndestination där flera streetfoodkoncept möter livemusik, konst och skatekultur.",
    bestFor: ["Nytt", "Kompisgäng", "Många val"],
    sourceLabel: "Göteborgs officiella besöksguide",
    sourceUrl:
      "https://www.goteborg.com/guider/nya-restauranger-i-goteborg",
    websiteUrl: "https://www.vassenmarket.se/",
    opened: "29 maj 2026",
    isNew: true,
  },
  {
    id: "birria-seoul",
    name: "Birria Seoul",
    cuisine: "Koreanskt",
    flavours: ["Koreanskt", "Mexikanskt", "Birria"],
    priceTier: 2,
    area: "Stampen",
    address: "Stampgatan 48",
    format: "Koreansk-mexikansk streetfood",
    description:
      "Ett nytt crossover-koncept där långkokt birria möter sydkoreanska smaker och streetfoodtempo.",
    bestFor: ["Nytt", "Snabb middag", "Crossover"],
    sourceLabel: "Thatsup · nyöppnat",
    sourceUrl:
      "https://thatsup.se/goteborg/guide/nya-restauranger-i-goteborg/",
    opened: "21 maj 2026",
    isNew: true,
  },
  {
    id: "mi-gogi",
    name: "Mi Gogi",
    cuisine: "Koreanskt",
    flavours: ["Koreanska bowls", "Matcha", "Streetfood"],
    priceTier: 2,
    area: "Centrum",
    address: "Stora Saluhallen, Kungstorget",
    format: "Asiatisk saluhallslunch",
    description:
      "Koreanska bowls, frozen matcha och modern asiatisk streetfood mitt i Stora Saluhallen.",
    bestFor: ["Nytt", "Lunch", "Snabbt"],
    sourceLabel: "Thatsup · nyöppnat",
    sourceUrl:
      "https://thatsup.se/goteborg/guide/nya-restauranger-i-goteborg/",
    opened: "19 maj 2026",
    isNew: true,
    isWorkLunch: true,
  },
  {
    id: "somni",
    name: "Somni",
    cuisine: "Spanskt",
    flavours: ["Katalonien", "Medelhavet", "Säsong"],
    priceTier: 3,
    area: "Linné",
    address: "Plantagegatan 3A",
    format: "Spansk kvartersrestaurang",
    description:
      "Modern medelhavsmat med katalanska rötter, säsongsråvaror och noga utvalda viner.",
    bestFor: ["Nytt", "Dejt", "Vin"],
    sourceLabel: "Restaurang Somni",
    sourceUrl: "https://restaurantsomni.se/",
    websiteUrl: "https://restaurantsomni.se/",
    opened: "1 apr 2026",
    isNew: true,
  },
  {
    id: "oss-emellan",
    name: "Oss emellan",
    cuisine: "Internationellt",
    flavours: ["Comfort food", "Grillat", "Streetfood"],
    priceTier: 2,
    area: "Majorna",
    address: "Karl Johansgatan 78",
    format: "Kvarterskrog",
    description:
      "Foodtruck-idé som vuxit till kvarterskrog med rejäla, globala smaker och rätter från grillen.",
    bestFor: ["Nytt", "Avslappnat", "Dela rätter"],
    sourceLabel: "Restaurang Oss emellan",
    sourceUrl: "https://restaurangossemellan.se/",
    websiteUrl: "https://restaurangossemellan.se/",
    opened: "24 mars 2026",
    isNew: true,
  },
  {
    id: "bar-bez-mleczny",
    name: "Bar Bez Mleczny",
    cuisine: "Östeuropeiskt",
    flavours: ["Slaviskt", "Pierogi", "Växtbaserat"],
    priceTier: 2,
    area: "Kungshöjd",
    address: "Kungsgatan 10B",
    format: "Vegansk mjölkbar",
    description:
      "Växtbaserad slavisk husmanskost från teamet bakom Papi’s Pierogi — ett ovanligt tillskott i city.",
    bestFor: ["Nytt", "Veganskt", "Husmanskost"],
    sourceLabel: "Thatsup · nyöppnat",
    sourceUrl:
      "https://thatsup.se/goteborg/guide/nya-restauranger-i-goteborg/",
    websiteUrl: "https://www.barbezmleczny.com/",
    opened: "10 mars 2026",
    isNew: true,
    isVegan: true,
  },
  {
    id: "hermel",
    name: "Hermel",
    cuisine: "Mellanöstern",
    flavours: ["Libanesiskt", "Meze", "Grillat"],
    priceTier: 2,
    area: "Linné",
    address: "Plantagegatan 5",
    format: "Libanesisk restaurang",
    description:
      "Meze, grillat och söta bakverk med en meny som tar avstamp i nordöstra Libanon.",
    bestFor: ["Nytt", "Dela rätter", "Middag"],
    sourceLabel: "Thatsup · nyöppnat",
    sourceUrl:
      "https://thatsup.se/goteborg/guide/nya-restauranger-i-goteborg/",
    websiteUrl: "https://www.hermel.se/",
    opened: "14 feb 2026",
    isNew: true,
  },
  {
    id: "izakaya-by-komo",
    name: "Izakaya by Komo",
    cuisine: "Japanskt",
    flavours: ["Izakaya", "Sushi", "Wagyu"],
    priceTier: 3,
    area: "Lilla Bommen",
    address: "Sankt Eriksgatan 5",
    format: "Japansk tavern",
    description:
      "Avslappnad izakaya med sushi, nigiri, wagyu och japanska smårätter för bordet att dela.",
    bestFor: ["Nytt", "Sushi", "Dela rätter"],
    sourceLabel: "Göteborgs officiella besöksguide",
    sourceUrl: "https://www.goteborg.com/platser/izakaya-by-komo",
    websiteUrl: "https://izakaya.nu/",
    opened: "maj 2025",
    isNew: true,
  },
  {
    id: "la-taqueria",
    name: "La Taqueria",
    cuisine: "Mexikanskt",
    flavours: ["Carnitas", "Birria", "Egna tortillas"],
    priceTier: 2,
    area: "Bagaregården",
    address: "Nobelgatan 2",
    format: "Autentisk taqueria",
    description:
      "Systerkrog till Tizne med carnitas, flautas och vegetarisk birria lagade med traditionella tekniker.",
    bestFor: ["Tacos", "Avslappnat", "Takeaway"],
    sourceLabel: "Göteborgs officiella besöksguide",
    sourceUrl: "https://www.goteborg.com/platser/la-taqueria",
    websiteUrl: "https://www.la-taqueria.se/",
    opened: "maj 2025",
    isNew: true,
  },
  {
    id: "bhoga",
    name: "Bhoga",
    cuisine: "Nordiskt",
    flavours: ["Säsong", "Lokala råvaror", "Avsmakning"],
    priceTier: 4,
    area: "Inom Vallgraven",
    address: "Norra Hamngatan 10",
    format: "Nordisk gastronomi",
    description:
      "Dagligt föränderlig meny med lokala råvaror; återöppnade efter renovering och hör åter till stadens gastronomiska spets.",
    bestFor: ["Avsmakning", "Säsong", "Speciellt tillfälle"],
    sourceLabel: "Göteborgs officiella besöksguide",
    sourceUrl: "https://www.goteborg.com/platser/bhoga",
    websiteUrl: "https://www.bhoga.se/",
    opened: "återöppnade aug 2025",
    isNew: true,
  },
  {
    id: "blackbird",
    name: "Blackbird",
    cuisine: "Veganskt",
    flavours: ["Seitan", "Tempeh", "Rustikt"],
    priceTier: 2,
    area: "Stigberget",
    address: "Stigbergsliden 3",
    format: "Vegansk restaurang & bar",
    description:
      "Helvegansk kvartersfavorit som gör ost, tempeh och seitan från grunden och serverar rustika huvudrätter.",
    bestFor: ["Veganskt", "Barhäng", "Middag"],
    sourceLabel: "Göteborgs officiella besöksguide",
    sourceUrl: "https://www.goteborg.com/platser/blackbird",
    websiteUrl: "https://www.blackbirdvegan.se/",
    isVegan: true,
  },
  {
    id: "sayur",
    name: "Sayur",
    cuisine: "Veganskt",
    flavours: ["Indonesiskt", "Nasi campur", "Växtbaserat"],
    priceTier: 1,
    area: "Olivedal",
    address: "Olivedalsgatan 23",
    format: "Indonesisk lunchrestaurang",
    description:
      "Litet helväxtbaserat kök med indonesiska rätter, generösa blandade tallrikar och mycket smak för pengarna.",
    bestFor: ["Budget", "Veganskt", "Lunch"],
    sourceLabel: "Göteborgs officiella besöksguide",
    sourceUrl: "https://www.goteborg.com/platser/sayur",
    isVegan: true,
    isWorkLunch: true,
  },
  {
    id: "yammy-kitchen",
    name: "Yammy Kitchen",
    cuisine: "Koreanskt",
    flavours: ["Koreanskt", "Japanskt", "Bibimbap"],
    priceTier: 2,
    area: "Långgatorna",
    address: "Andra Långgatan 5",
    format: "Koreansk-japansk restaurang",
    description:
      "Långlivad Långgatan-favorit med koreansk husmanskost, japanska inslag och många vegetariska alternativ.",
    bestFor: ["Blandade sällskap", "Vegoalternativ", "Middag"],
    sourceLabel: "Restaurangens webbplats",
    sourceUrl: "https://yammykitchen.se/",
    websiteUrl: "https://yammykitchen.se/",
  },
  {
    id: "himalaya",
    name: "Himalaya Kök & Bar",
    cuisine: "Asiatiskt",
    flavours: ["Nepalesiskt", "Momo", "Thali"],
    priceTier: 2,
    area: "Olivedal",
    address: "Olivedalsgatan 13",
    format: "Nepalesisk restaurang",
    description:
      "Traditionella nepalesiska dumplings, thali och tandoorirätter med både kött och vegetariska spår.",
    bestFor: ["Momo", "Middag", "Nya smaker"],
    sourceLabel: "Restaurangens webbplats",
    sourceUrl: "https://www.himalayakochb.se/",
    websiteUrl: "https://www.himalayakochb.se/",
    isWorkLunch: true,
  },
  {
    id: "andrum",
    name: "Andrum",
    cuisine: "Veganskt",
    flavours: ["Vegetariskt", "Buffé", "Vardagsmat"],
    priceTier: 1,
    area: "Centrum",
    address: "Östra Hamngatan 19",
    format: "Vegetarisk restaurang",
    description:
      "En av Göteborgs tidiga vegetariska restauranger med prisvärd buffé och centralt läge nära Nordstan.",
    bestFor: ["Budget", "Lunch", "Vegetariskt"],
    sourceLabel: "Andrum",
    sourceUrl: "https://andrumvegetarisk.se/",
    isWorkLunch: true,
  },
  {
    id: "kages-horna",
    name: "Kåges Hörna",
    cuisine: "Nordiskt",
    flavours: ["Svenskt", "Husmanskost", "Dagens lunch"],
    priceTier: 1,
    area: "Centrum",
    address: "Stora Saluhallen, Kungstorget",
    format: "Klassisk lunchdisk",
    description:
      "Rakt och rejält svenskt lunchkök mitt i Saluhallen — en viktig vardagsände av stadens matscen.",
    bestFor: ["Budget", "Husmanskost", "Lunch"],
    sourceLabel: "Kåges Hörna",
    sourceUrl: "https://kages.se/menyer/",
    isWorkLunch: true,
  },
  {
    id: "14m2bao",
    name: "14m² Bao",
    cuisine: "Asiatiskt",
    flavours: ["Bao", "Handgjort", "Streetfood"],
    priceTier: 1,
    area: "Centrum",
    address: "Stora Saluhallen, Kungstorget",
    format: "Bao-lucka",
    description:
      "Kompakt bao-specialist med handgjorda bröd och asiatiska fyllningar — snabbt, fokuserat och centralt.",
    bestFor: ["Budget", "Snabb lunch", "Streetfood"],
    sourceLabel: "14m² Bao",
    sourceUrl: "https://www.14m2bao.se/",
    isWorkLunch: true,
  },
  {
    id: "hermanos-tacokiosk",
    name: "Hermanos Tacokiosk",
    cuisine: "Mexikanskt",
    flavours: ["Tacos", "Egna tortillas", "Streetfood"],
    priceTier: 1,
    area: "Majorna",
    address: "Sannaplan 4A",
    format: "Tacokiosk",
    description:
      "Avskalad kvarterskiosk som gör tortillabröden från grunden och håller tydligt fokus på mexikanska smaker.",
    bestFor: ["Budget", "Tacos", "Drop-in"],
    sourceLabel: "Göteborgs officiella besöksguide",
    sourceUrl: "https://www.goteborg.com/platser/hermanos-tacokiosk",
    websiteUrl: "https://hermanostacokiosk.se/",
  },
  {
    id: "sjobaren-haga",
    name: "Sjöbaren Haga",
    cuisine: "Fisk & skaldjur",
    flavours: ["Västkust", "Fisk", "Klassiskt"],
    priceTier: 2,
    area: "Haga",
    address: "Haga Nygata 25",
    format: "Fiskrestaurang",
    description:
      "Tillgänglig Göteborgsklassiker för fisk och skaldjur i Hagas historiska kvarter.",
    bestFor: ["Västkust", "Lunch", "Besökare"],
    sourceLabel: "Göteborgs officiella besöksguide",
    sourceUrl: "https://www.goteborg.com/platser/sjobaren",
    websiteUrl: "https://www.sjobaren.se/",
  },
  {
    id: "gyllene-prag",
    name: "Gyllene Prag",
    cuisine: "Östeuropeiskt",
    flavours: ["Tjeckiskt", "Husmanskost", "Pilsner"],
    priceTier: 2,
    area: "Linné",
    address: "Sveagatan 25",
    format: "Tjeckisk kvarterskrog",
    description:
      "Göteborgsinstitution sedan 1973 med tjeckisk husmanskost, panerad ost och klassisk pilsner.",
    bestFor: ["Klassiker", "Öl", "Kvarterskrog"],
    sourceLabel: "Göteborgs officiella besöksguide",
    sourceUrl: "https://www.goteborg.com/platser/gyllene-prag",
    websiteUrl: "https://gylleneprag.se/",
  },
  {
    id: "bar-la-lune",
    name: "Bar La Lune",
    cuisine: "Franskt",
    flavours: ["Naturvin", "Smårätter", "Säsong"],
    priceTier: 3,
    area: "Vasastaden",
    address: "Vasa kyrkogata 1",
    format: "Vinbar & restaurang",
    description:
      "Liten, livlig vinbar där en stor vinlista möter franskinspirerade små- och mellanrätter.",
    bestFor: ["Vin", "Dejt", "Spontant"],
    sourceLabel: "Göteborgs officiella besöksguide",
    sourceUrl: "https://www.goteborg.com/platser/bar-la-lune",
    websiteUrl: "https://www.barlalune.se/",
  },
  {
    id: "manfreds-brasserie",
    name: "Manfred’s Brasserie",
    cuisine: "Östeuropeiskt",
    flavours: ["Österrikiskt", "Schweiziskt", "Schnitzel"],
    priceTier: 3,
    area: "Linné",
    address: "Nordenskiöldsgatan 28",
    format: "Alpbrasserie",
    description:
      "Anrik, informell kvarterskrog där wienerschnitzeln är ett av Göteborgs mest etablerade signaturnummer.",
    bestFor: ["Klassiker", "Schnitzel", "Middag"],
    sourceLabel: "Göteborgs officiella besöksguide",
    sourceUrl:
      "https://www.goteborg.com/guider/guide-det-gastronomiska-goteborg",
    websiteUrl: "https://manfreds.com/",
  },
  {
    id: "human",
    name: "Human",
    cuisine: "Nordiskt",
    flavours: ["Säsong", "Hållbart", "Avsmakning"],
    priceTier: 4,
    area: "Linné",
    address: "Risåsgatan 8",
    format: "Modern fine dining",
    description:
      "Personlig nordisk gastronomi med säsongsbaserade avsmakningsmenyer och uttalat hållbar profil.",
    bestFor: ["Avsmakning", "Hållbart", "Speciellt tillfälle"],
    sourceLabel: "Göteborgs officiella besöksguide",
    sourceUrl: "https://www.goteborg.com/platser/human",
    websiteUrl: "https://www.humanrestaurang.se/",
    isWorkLunch: true,
  },
  {
    id: "project",
    name: "Project",
    cuisine: "Nordiskt",
    flavours: ["Modern europeisk", "Säsong", "Avsmakning"],
    priceTier: 4,
    area: "Lorensberg",
    address: "Södra Vägen 45",
    format: "Michelinrestaurang",
    description:
      "Intim och avslappnat elegant stjärnkrog där råvaror och meny följer säsongen.",
    bestFor: ["Michelin", "Avsmakning", "Speciellt tillfälle"],
    sourceLabel: "Project",
    sourceUrl: "https://projectgbg.com/",
    websiteUrl: "https://projectgbg.com/",
    isMichelin: true,
  },
  {
    id: "koka",
    name: "Koka",
    cuisine: "Nordiskt",
    flavours: ["Västsvenskt", "Säsong", "Avsmakning"],
    priceTier: 4,
    area: "Vasastaden",
    address: "Viktoriagatan 12",
    format: "Michelinrestaurang",
    description:
      "Modern västsvensk gastronomi där lokala råvaror och rena, precisa smaker står i centrum.",
    bestFor: ["Michelin", "Västkust", "Avsmakning"],
    sourceLabel: "Göteborgs officiella besöksguide",
    sourceUrl:
      "https://www.goteborg.com/ata-och-dricka/michelinkrogar",
    websiteUrl: "https://restaurangkoka.se/",
    isMichelin: true,
  },
  {
    id: "sk-mat-manniskor",
    name: "SK Mat & Människor",
    cuisine: "Nordiskt",
    flavours: ["Svenskt", "Öppet kök", "Avsmakning"],
    priceTier: 4,
    area: "Lorensberg",
    address: "Johannebergsgatan 24",
    format: "Michelinrestaurang",
    description:
      "Svensk smaktradition i modern form, serverad nära köket med råvaran som tydlig huvudperson.",
    bestFor: ["Michelin", "Svenskt", "Speciellt tillfälle"],
    sourceLabel: "Göteborgs officiella besöksguide",
    sourceUrl:
      "https://www.goteborg.com/ata-och-dricka/michelinkrogar",
    websiteUrl: "https://skmat.se/",
    isMichelin: true,
  },
  {
    id: "hoze",
    name: "Hoze",
    cuisine: "Japanskt",
    flavours: ["Omakase", "Sushi", "Lokala råvaror"],
    priceTier: 4,
    area: "Stigberget",
    address: "Stigbergsliden 17",
    format: "Sexplatser-omakase",
    description:
      "Extremt intim omakase där japansk teknik möter lokala råvaror; belönad med Michelin-stjärna 2025.",
    bestFor: ["Michelin", "Omakase", "Boka långt före"],
    sourceLabel: "Göteborgs officiella besöksguide",
    sourceUrl:
      "https://www.goteborg.com/ata-och-dricka/michelinkrogar",
    isMichelin: true,
  },
  {
    id: "restaurang-28-plus",
    name: "Restaurang 28+",
    cuisine: "Nordiskt",
    flavours: ["Klassisk fine dining", "Vin", "Avsmakning"],
    priceTier: 4,
    area: "Lorensberg",
    address: "Götabergsgatan 28",
    format: "Michelinrestaurang",
    description:
      "En av stadens mest långlivade lyxkrogar med djup vinkällare och obruten Michelintradition sedan 1991.",
    bestFor: ["Michelin", "Vin", "Klassisk lyx"],
    sourceLabel: "Göteborgs officiella besöksguide",
    sourceUrl:
      "https://www.goteborg.com/ata-och-dricka/michelinkrogar",
    websiteUrl: "https://28plus.se/",
    isMichelin: true,
  },
  {
    id: "fiskekrogen",
    name: "Fiskekrogen",
    cuisine: "Fisk & skaldjur",
    flavours: ["Västkust", "Skaldjur", "Klassiskt"],
    priceTier: 4,
    area: "Inom Vallgraven",
    address: "Lilla Torget 1",
    format: "Klassisk fiskrestaurang",
    description:
      "Göteborgsinstitution sedan 1972 med klassiskt kök, skaldjur och havet som självklar utgångspunkt.",
    bestFor: ["Skaldjur", "Klassiker", "Fira"],
    sourceLabel: "Göteborgs officiella besöksguide",
    sourceUrl:
      "https://www.goteborg.com/guider/guide-det-gastronomiska-goteborg",
    websiteUrl: "https://fiskekrogen.se/",
  },
];

const trustedRestaurantSourceHosts = new Set([
  "andrumvegetarisk.se",
  "izakaya.nu",
  "kages.se",
  "projectgbg.com",
  "restaurantsomni.se",
  "restaurangossemellan.se",
  "thatsup.se",
  "www.14m2bao.se",
  "www.goteborg.com",
  "www.himalayakochb.se",
  "yammykitchen.se",
]);

function validateRestaurantUrl(value: string, sourceOnly = false) {
  const url = new URL(value);

  if (
    url.protocol !== "https:" ||
    (sourceOnly && !trustedRestaurantSourceHosts.has(url.hostname))
  ) {
    throw new Error(`Otillåten restaurangkälla: ${url.hostname}`);
  }
}

export const restaurants = scannedRestaurants.map((restaurant) => {
  validateRestaurantUrl(restaurant.sourceUrl, true);
  if (restaurant.websiteUrl) validateRestaurantUrl(restaurant.websiteUrl);
  return restaurant;
});

export const restaurantCuisines = [
  "Alla",
  ...Array.from(new Set(restaurants.map((restaurant) => restaurant.cuisine))).sort(
    (a, b) => a.localeCompare(b, "sv"),
  ),
] as const;
