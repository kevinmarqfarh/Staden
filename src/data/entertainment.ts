export type EntertainmentAudience =
  | "singel"
  | "par"
  | "barnfamilj"
  | "senior"
  | "besokare"
  | "lokal";

export type EntertainmentCategory =
  | "Göteborgsklassiker"
  | "Skärgård & hav"
  | "Barn & lek"
  | "Natur & vandring"
  | "Kultur & historia"
  | "Aktivt & sport"
  | "Spel & utmaning"
  | "Scen & kväll"
  | "Kvarter & stadsliv"
  | "Lugn & välmående";

export type EntertainmentPace = "LUGNT" | "LAGOM" | "AKTIVT";
export type EntertainmentBooking = "SPONTANT" | "KOLLA FÖRST" | "BOKA";

export interface EntertainmentExperience {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: EntertainmentCategory;
  area: string;
  duration: string;
  price: string;
  setting: "INNE" | "UTE" | "INNE & UTE";
  season: string;
  pace: EntertainmentPace;
  booking: EntertainmentBooking;
  audiences: EntertainmentAudience[];
  url: string;
  sourceLabel: string;
  keywords?: string;
  free?: boolean;
  featured?: boolean;
}

export const entertainmentVerifiedAt = "2026-08-23";

export const entertainmentAudienceOptions: Array<{
  id: "alla" | EntertainmentAudience;
  label: string;
  description: string;
}> = [
  { id: "alla", label: "Alla", description: "Hela staden" },
  { id: "singel", label: "På egen hand", description: "Lätt att göra solo" },
  { id: "par", label: "Par", description: "Dejt och kvalitetstid" },
  { id: "barnfamilj", label: "Barnfamilj", description: "Lek, pauser och nyfikenhet" },
  { id: "senior", label: "Senior", description: "Lugnare tempo och kultur" },
  { id: "besokare", label: "På besök", description: "Göteborg för första gången" },
  { id: "lokal", label: "Göteborgare", description: "Se staden på nytt" },
];

export const entertainmentCategoryInfo: Array<{
  id: EntertainmentCategory;
  description: string;
}> = [
  { id: "Göteborgsklassiker", description: "Ikonerna som sätter staden på kartan" },
  { id: "Skärgård & hav", description: "Öhoppning, bad, båtar och saltstänk" },
  { id: "Barn & lek", description: "Utflyktslek, djur och nyfikna små" },
  { id: "Natur & vandring", description: "Sjöar, skog, leder och utsikter" },
  { id: "Kultur & historia", description: "Museer, konst, design och berättelser" },
  { id: "Aktivt & sport", description: "Puls, paddling, klättring och matcher" },
  { id: "Spel & utmaning", description: "Tävla, lös gåtor och prova något nytt" },
  { id: "Scen & kväll", description: "Musik, film, teater och sena rum" },
  { id: "Kvarter & stadsliv", description: "Promenader, marknader och lokala miljöer" },
  { id: "Lugn & välmående", description: "Bastu, spa, bibliotek och långsamma dagar" },
];

export const entertainmentCategories: Array<"Alla" | EntertainmentCategory> = [
  "Alla",
  ...entertainmentCategoryInfo.map((category) => category.id),
];

export const entertainmentJourneys: Array<{
  id: string;
  number: string;
  eyebrow: string;
  title: string;
  description: string;
  stops: string;
  audience: "alla" | EntertainmentAudience;
  category: "Alla" | EntertainmentCategory;
}> = [
  { id: "forsta-gangen", number: "01", eyebrow: "FÖRSTA GÅNGEN", title: "Stadens signaturer", description: "En rak väg till kanalerna, kullerstenen, parken och kvällsljuset.", stops: "Paddan · Haga · Liseberg", audience: "besokare", category: "Göteborgsklassiker" },
  { id: "hela-familjen", number: "02", eyebrow: "HELA FAMILJEN", title: "Spring i benen", description: "Djur, lek och experiment med gott om naturliga pauser.", stops: "Universeum · Plikta · Slottsskogen", audience: "barnfamilj", category: "Barn & lek" },
  { id: "havet-nara", number: "03", eyebrow: "UT I HAVET", title: "En ö på en dag", description: "Välj färja efter väder och bygg dagen kring stigar, bad eller bastu.", stops: "Stenpiren · Styrsö · Donsö", audience: "alla", category: "Skärgård & hav" },
  { id: "som-en-lokal", number: "04", eyebrow: "SOM EN LOKAL", title: "Älven västerut", description: "Följ kajerna från vardagspendel till konst, kranar och klippor.", stops: "Älvsnabben · Eriksberg · Klippan", audience: "lokal", category: "Kvarter & stadsliv" },
];

const allAudiences: EntertainmentAudience[] = ["singel", "par", "barnfamilj", "senior", "besokare", "lokal"];
const adults: EntertainmentAudience[] = ["singel", "par", "senior", "besokare", "lokal"];
const social: EntertainmentAudience[] = ["singel", "par", "besokare", "lokal"];
const families: EntertainmentAudience[] = ["par", "barnfamilj", "senior", "besokare", "lokal"];
const calm: EntertainmentAudience[] = ["singel", "par", "senior", "besokare", "lokal"];

const sources = {
  guide: "https://www.goteborg.com/en",
  attractions: "https://www.goteborg.com/en/attractions",
  archipelago: "https://www.goteborg.com/en/guides/activities-in-the-gothenburg-archipelago",
  archipelagoTravel: "https://www.goteborg.com/en/guides/getting-to-the-archipelago",
  kids: "https://www.goteborg.com/en/guides/visit-gothenburg-with-children",
  rain: "https://www.goteborg.com/en/guides/a-rainy-day-in-gothenburg",
  nature: "https://www.goteborg.com/en/nature-sports",
  sports: "https://www.goteborg.com/en/nature-sports/sports",
  culture: "https://www.goteborg.com/en/arts-culture",
  theatre: "https://www.goteborg.com/en/arts-culture/theatre-performing-arts",
  nightlife: "https://www.goteborg.com/en/guides/discover-gothenburgs-nightlife",
  events: "https://www.goteborg.com/en/events",
  markets: "https://www.goteborg.com/en/shopping/flea-markets",
  cityParks: "https://goteborg.se/wps/portal/start/uppleva-och-gora/parker-och-lekplatser",
  playgrounds: "https://goteborg.se/wps/portal?uri=gbglnk%3A20130326-150535",
  natureAreas: "https://goteborg.se/wps/portal/start/uppleva-och-gora/idrott-motion-och-friluftsliv/friluftsliv/naturomraden/hitta-naturomraden/",
  exercise: "https://goteborg.se/wps/portal/start/uppleva-och-gora/idrott-motion-och-friluftsliv/motion-och-halsa/gym-och-motionscentrum/hitta-gym--och-motionscentrum/",
  libraries: "https://goteborg.se/wps/portal?uri=gbglnk%3A202192010485290",
} as const;

type ExperienceInput = Omit<EntertainmentExperience, "season" | "pace" | "booking" | "audiences" | "sourceLabel"> &
  Partial<Pick<EntertainmentExperience, "season" | "pace" | "booking" | "audiences" | "sourceLabel">>;

function experience(input: ExperienceInput): EntertainmentExperience {
  return { season: "ÅRET RUNT", pace: "LAGOM", booking: "KOLLA FÖRST", audiences: allAudiences, sourceLabel: "GÖTEBORG & CO", ...input };
}

export const entertainmentExperiences: EntertainmentExperience[] = [
  // Göteborgsklassiker
  experience({ id: "liseberg", title: "Liseberg", subtitle: "Karuseller, trädgårdar och stora scener", description: "Göteborgs stora nöjesklassiker rymmer fart, Kaninlandet, konserter och lugna promenader i samma park.", category: "Göteborgsklassiker", area: "KORSVÄGEN", duration: "4–8 TIM", price: "ENTRÉ / ÅKPASS", setting: "INNE & UTE", season: "SÄSONGSÖPPET", url: sources.attractions, featured: true }),
  experience({ id: "universeum", title: "Universeum", subtitle: "Regnskog, hav och Wisdome", description: "Sju våningar vetenskap och upplevelser för en lång dag bland akvarier, rymd, teknik och tropisk värme.", category: "Göteborgsklassiker", area: "KORSVÄGEN", duration: "3–5 TIM", price: "ENTRÉ", setting: "INNE", url: sources.kids, featured: true }),
  experience({ id: "paddan", title: "Paddan", subtitle: "Staden från kanalerna", description: "En guidad tur under låga broar och ut i hamnen – en enkel första orientering i Göteborg.", category: "Göteborgsklassiker", area: "KUNGSPORTSPLATSEN", duration: "50 MIN", price: "BILJETT", setting: "UTE", season: "VÅR–HÖST", booking: "BOKA", url: sources.attractions, featured: true }),
  experience({ id: "slottsskogen", title: "Slottsskogen", subtitle: "Parkliv, djur och picknick", description: "Stadens vardagsrum för promenad, nordiska djur, naturlek, löpning och spontana dagar.", category: "Göteborgsklassiker", area: "LINNÉ", duration: "1–4 TIM", price: "GRATIS", setting: "UTE", booking: "SPONTANT", url: sources.cityParks, free: true, featured: true }),
  experience({ id: "haga-skansen-kronan", title: "Haga & Skansen Kronan", subtitle: "Kullersten och utsikt", description: "Strosa bland landshövdingehus och fortsätt upp för trapporna till en av stadens mest klassiska vyer.", category: "Göteborgsklassiker", area: "HAGA", duration: "1–3 TIM", price: "GRATIS ATT STROSA", setting: "UTE", booking: "SPONTANT", url: sources.attractions, free: true }),
  experience({ id: "tradgardsforeningen", title: "Trädgårdsföreningen & Palmhuset", subtitle: "Rosor mitt i centrum", description: "En välbevarad 1800-talspark med rosarium, lekplats och Palmhusets varma växthus.", category: "Göteborgsklassiker", area: "CENTRUM", duration: "1–2 TIM", price: "GRATIS", setting: "INNE & UTE", pace: "LUGNT", booking: "SPONTANT", url: sources.cityParks, free: true }),
  experience({ id: "ocean-bus", title: "Ocean Bus", subtitle: "Sightseeing på land och älv", description: "Det amfibiska fordonet visar centrum på hjul och fortsätter sedan ner i Göta älv.", category: "Göteborgsklassiker", area: "CENTRUM", duration: "1 TIM", price: "BILJETT", setting: "INNE", booking: "BOKA", url: sources.kids }),
  experience({ id: "karlatornet-view", title: "Gothenburg View", subtitle: "Staden från Karlatornet", description: "Se älven, hamnen och stadsdelarna från utsiktsplatsen högt över Lindholmen.", category: "Göteborgsklassiker", area: "LINDHOLMEN", duration: "1–2 TIM", price: "BILJETT", setting: "INNE", pace: "LUGNT", booking: "BOKA", audiences: adults, url: sources.attractions }),

  // Skärgård & hav
  experience({ id: "sodra-skargarden", title: "Södra skärgården", subtitle: "Bilfria öar på samma biljett", description: "Hoppa på färjan från Saltholmen eller Stenpiren och bygg en egen dag bland öar, bad och små hamnar.", category: "Skärgård & hav", area: "SALTHOLMEN / STENPIREN", duration: "HALV–HELDAG", price: "VÄSTTRAFIK ZON A", setting: "UTE", booking: "SPONTANT", url: sources.archipelagoTravel, featured: true }),
  experience({ id: "vrango", title: "Vrångö", subtitle: "Naturreservat längst söderut", description: "Välj sandstrand, klippor eller markerade stigar; Tärnstigen fungerar även för barnvagn och rullstol.", category: "Skärgård & hav", area: "VRÅNGÖ", duration: "4–7 TIM", price: "VÄSTTRAFIK ZON A", setting: "UTE", pace: "LAGOM", booking: "SPONTANT", url: sources.archipelago }),
  experience({ id: "styrso-donso", title: "Styrsö & Donsö", subtitle: "Utsikt, bro och hamnliv", description: "Gå upp till Stora Rös på Styrsö och fortsätt över bron till Donsös hamn och bad.", category: "Skärgård & hav", area: "STYRSÖ / DONSÖ", duration: "HELDAG", price: "VÄSTTRAFIK ZON A", setting: "UTE", pace: "AKTIVT", booking: "SPONTANT", url: sources.archipelago }),
  experience({ id: "branno-galtero", title: "Brännö & Galterö", subtitle: "Byvägar och öppet landskap", description: "Börja bland Brännös hus och fortsätt över landbron till Galterös fågelliv och vind.", category: "Skärgård & hav", area: "BRÄNNÖ", duration: "4–7 TIM", price: "VÄSTTRAFIK ZON A", setting: "UTE", pace: "AKTIVT", booking: "SPONTANT", url: sources.archipelago }),
  experience({ id: "aspero", title: "Asperö", subtitle: "Den nära, stilla ön", description: "En kort färjeresa till byvägar, bad och klippor när du vill känna skärgård utan heldagsprojekt.", category: "Skärgård & hav", area: "ASPERÖ", duration: "2–4 TIM", price: "VÄSTTRAFIK ZON A", setting: "UTE", pace: "LUGNT", booking: "SPONTANT", url: sources.archipelagoTravel }),
  experience({ id: "hono-klava", title: "Hönö Klåva", subtitle: "Norra skärgårdens hamnliv", description: "Kombinera hamnpromenad, Fiskemuseet, klippbad och en tur vidare mot Fotö eller Öckerö.", category: "Skärgård & hav", area: "HÖNÖ", duration: "HALV–HELDAG", price: "RESA / EV. ENTRÉ", setting: "INNE & UTE", booking: "SPONTANT", url: sources.archipelagoTravel }),
  experience({ id: "roro", title: "Rörö", subtitle: "Vandringsö med öppet hav", description: "Följ naturstigar över hed och klippor och avsluta vid de långa badvikarna i norr.", category: "Skärgård & hav", area: "RÖRÖ", duration: "HELDAG", price: "RESA", setting: "UTE", pace: "AKTIVT", booking: "SPONTANT", url: sources.archipelago }),
  experience({ id: "skargardsleden", title: "Göteborgs skärgårdsled", subtitle: "Vandra mellan öarna", description: "Sätt ihop en eller flera etapper genom södra och norra skärgården, med färjor och broar som länkar ihop leden.", category: "Skärgård & hav", area: "SKÄRGÅRDEN", duration: "HALV–FLERA DAGAR", price: "GRATIS + RESA", setting: "UTE", pace: "AKTIVT", booking: "SPONTANT", url: sources.archipelago, free: true }),
  experience({ id: "kajak-skargard", title: "Kajak eller SUP i skärgården", subtitle: "Nära vattnet på riktigt", description: "Hyr utrustning eller följ med en guide; välj lugn vik eller en längre tur efter vind och erfarenhet.", category: "Skärgård & hav", area: "KLIPPAN / ÖARNA", duration: "2–5 TIM", price: "HYRA / GUIDNING", setting: "UTE", pace: "AKTIVT", booking: "BOKA", audiences: social, url: sources.archipelago }),
  experience({ id: "salsafari", title: "Sälsafari", subtitle: "Båttur till kobbarna", description: "Följ med ut från hamnen för att spana efter sälar, fågelliv och öarnas utsida.", category: "Skärgård & hav", area: "NORRA SKÄRGÅRDEN", duration: "1–3 TIM", price: "BILJETT", setting: "UTE", season: "SÄSONGSVIS", booking: "BOKA", url: sources.archipelago }),
  experience({ id: "vinga", title: "Vinga fyr", subtitle: "Längst ut i havsbandet", description: "Ta en säsongstur till fyrön, promenera bland klipporna och se inloppet från väster.", category: "Skärgård & hav", area: "VINGA", duration: "HALV–HELDAG", price: "BÅTBILJETT", setting: "UTE", season: "SOMMAR", booking: "BOKA", url: sources.attractions }),
  experience({ id: "vinterbad-skargard", title: "Vinterbad & öbastu", subtitle: "Kallt hav, varm ved", description: "Boka bastu på exempelvis Vrångö, Styrsö eller Öckerö och kombinera med ett kort salt dopp.", category: "Skärgård & hav", area: "SKÄRGÅRDEN", duration: "1–3 TIM", price: "BASTUBOKNING", setting: "INNE & UTE", season: "HÖST–VÅR", pace: "LUGNT", booking: "BOKA", audiences: adults, url: sources.archipelago }),

  // Barn & lek
  experience({ id: "plikta", title: "Plikta", subtitle: "Valen, långrutschkanan och fri lek", description: "En bemannad utflyktslekplats med klättring, vattenlek, grill, redskapslån och gott om plats.", category: "Barn & lek", area: "SLOTTSSKOGEN", duration: "1–4 TIM", price: "GRATIS", setting: "UTE", pace: "AKTIVT", booking: "SPONTANT", audiences: families, url: sources.playgrounds, free: true, featured: true }),
  experience({ id: "jubileumsparken-lek", title: "Jubileumsparkens utflyktslek", subtitle: "Leka mellan bryggor och skulpturer", description: "Fantasifulla lekskulpturer, vattenmiljö, skateramp och hamnbad gör det lätt att stanna länge.", category: "Barn & lek", area: "FRIHAMNEN", duration: "2–4 TIM", price: "GRATIS", setting: "UTE", pace: "AKTIVT", booking: "SPONTANT", audiences: families, url: sources.cityParks, free: true }),
  experience({ id: "positivparken", title: "Positivparken", subtitle: "Parkour, musiklek och bondgårdslek", description: "Två lekdelar för olika åldrar med gratis aktiviteter, grill, bollplaner och redskapslån.", category: "Barn & lek", area: "FRÖLUNDA", duration: "2–4 TIM", price: "GRATIS", setting: "UTE", pace: "AKTIVT", booking: "SPONTANT", audiences: families, url: sources.playgrounds, free: true }),
  experience({ id: "angeredsparken", title: "Angeredsparken", subtitle: "Cirkuslek och stora gräsytor", description: "Utflyktslekplats med cirkustema, boule, utegym, grillplatser och ytor för hela familjen.", category: "Barn & lek", area: "ANGERED", duration: "2–4 TIM", price: "GRATIS", setting: "UTE", pace: "AKTIVT", booking: "SPONTANT", audiences: families, url: sources.playgrounds, free: true }),
  experience({ id: "hisingsparken-familj", title: "Hisingsparken & Kättilsröd", subtitle: "Lek, natur och 4H-djur", description: "Kombinera utflyktslekplatsen med skogsstigar, grillplats och djuren på Kättilsröds 4H-gård.", category: "Barn & lek", area: "HISINGEN", duration: "3–5 TIM", price: "GRATIS", setting: "UTE", pace: "LAGOM", booking: "SPONTANT", audiences: families, url: sources.playgrounds, free: true }),
  experience({ id: "varldens-lek", title: "Världens lek", subtitle: "Tillgänglig lek vid Korsvägen", description: "En färgstark lekplats utanför Världskulturmuseet där barn utforskar tillsammans med hela kroppen.", category: "Barn & lek", area: "KORSVÄGEN", duration: "45–90 MIN", price: "GRATIS", setting: "UTE", pace: "AKTIVT", booking: "SPONTANT", audiences: families, url: sources.kids, free: true }),
  experience({ id: "regnlekplatsen", title: "Regnlekplatsen", subtitle: "Bäst när pölarna kommer", description: "Vid Näckrosdammen blir regnvatten en del av leken med pölar, gungor, klättring och rutschkana.", category: "Barn & lek", area: "RENSTRÖMSPARKEN", duration: "45–90 MIN", price: "GRATIS", setting: "UTE", pace: "AKTIVT", booking: "SPONTANT", audiences: families, url: sources.rain, free: true }),
  experience({ id: "alfons-aberg", title: "Alfons Åbergs Kulturhus", subtitle: "Lek, teater och berättelser", description: "Ett centralt kulturhus för yngre barn med vardagsnära lekvärldar, föreställningar och program.", category: "Barn & lek", area: "TRÄDGÅRDSFÖRENINGEN", duration: "2–4 TIM", price: "ENTRÉ", setting: "INNE", pace: "LAGOM", audiences: families, url: sources.kids }),
  experience({ id: "barnens-museum", title: "Barnens museum", subtitle: "Göteborg i klätterformat", description: "På Stadsmuseet kan de minsta bygga, krypa, åka spårvagn och upptäcka staden i miniatyr.", category: "Barn & lek", area: "NORRA HAMNGATAN", duration: "1–2 TIM", price: "KOLLA ENTRÉ", setting: "INNE", pace: "LAGOM", booking: "SPONTANT", audiences: families, url: sources.kids }),
  experience({ id: "bygglekplatsen", title: "Bygglekplatsen", subtitle: "Skapa, bygg och testa", description: "En bemannad aktivitetsyta i Biskopsgården där barn får skapa och leka med material och verktyg.", category: "Barn & lek", area: "BISKOPSGÅRDEN", duration: "1–3 TIM", price: "GRATIS", setting: "INNE & UTE", pace: "AKTIVT", audiences: families, url: sources.cityParks, free: true }),
  experience({ id: "bibliotek-barn", title: "Sagostund & barnverkstad", subtitle: "Gratis program på biblioteken", description: "Välj bland sagostunder, sång, bokklubbar, workshops och barnteater på bibliotek över hela staden.", category: "Barn & lek", area: "HELA GÖTEBORG", duration: "30–90 MIN", price: "GRATIS", setting: "INNE", pace: "LUGNT", audiences: families, url: sources.libraries, free: true }),
  experience({ id: "lekplatsjakten", title: "Lekplatsjakten", subtitle: "Nästan 300 lekplatser att välja på", description: "Använd stadens karta och gör nästa bostadsområde till en utflykt – från vattenlek till temalek och små kvartersparker.", category: "Barn & lek", area: "HELA GÖTEBORG", duration: "1–3 TIM", price: "GRATIS", setting: "UTE", pace: "AKTIVT", booking: "SPONTANT", audiences: families, url: sources.cityParks, free: true, keywords: "lekplatser park vattenlek utflykt" }),

  // Natur & vandring
  experience({ id: "botaniska-anggardsbergen", title: "Botaniska & Änggårdsbergen", subtitle: "Trädgård möter vildare natur", description: "Börja bland samlingar och växthus och fortsätt rakt in i reservatets dalar, hedar och höjder.", category: "Natur & vandring", area: "ÄNGGÅRDEN", duration: "2–5 TIM", price: "GRATIS / FRIVILLIG ENTRÉ", setting: "UTE", booking: "SPONTANT", url: sources.nature, free: true, featured: true }),
  experience({ id: "delsjon-skatas", title: "Delsjön & Skatås", subtitle: "Stig, sjö och motionsspår", description: "Välj bad, promenad, terränglöpning eller en längre slinga bland sjöar och skog nära spårvagnen.", category: "Natur & vandring", area: "ÖSTRA GÖTEBORG", duration: "1–5 TIM", price: "GRATIS", setting: "UTE", pace: "AKTIVT", booking: "SPONTANT", url: sources.natureAreas, free: true }),
  experience({ id: "stora-amundon", title: "Stora Amundön", subtitle: "Havsbad och rundtur", description: "Gå runt udden mellan hagar, hällar, sandstrand och västkustens öppna horisont.", category: "Natur & vandring", area: "BILLDAL", duration: "2–4 TIM", price: "GRATIS", setting: "UTE", booking: "SPONTANT", url: sources.natureAreas, free: true }),
  experience({ id: "ramberget-keillers", title: "Ramberget & Keillers park", subtitle: "Panorama över älven", description: "Ta promenadvägarna upp genom parken och se broar, kranar och tak från en av stadens bästa höjder.", category: "Natur & vandring", area: "LUNDBY", duration: "1–2 TIM", price: "GRATIS", setting: "UTE", booking: "SPONTANT", url: sources.cityParks, free: true }),
  experience({ id: "rya-skog", title: "Rya skog", subtitle: "Urskogskänsla vid hamnen", description: "En kort lövskogspromenad med våtmark, fågelliv och tillgängliga spänger mitt i industrilandskapet.", category: "Natur & vandring", area: "RYA", duration: "1–2 TIM", price: "GRATIS", setting: "UTE", pace: "LUGNT", booking: "SPONTANT", url: sources.natureAreas, free: true }),
  experience({ id: "vattlefjall", title: "Vättlefjäll", subtitle: "Sjöar, skog och vildmark", description: "Vandra mellan sjöar, paddla, fiska eller gör en längre tur med vindskydd och naturreservat runt dig.", category: "Natur & vandring", area: "ANGERED", duration: "HALV–HELDAG", price: "GRATIS", setting: "UTE", pace: "AKTIVT", booking: "SPONTANT", url: sources.natureAreas, free: true }),
  experience({ id: "larjeans-dalgang", title: "Lärjeåns dalgång", subtitle: "Raviner och lövskog", description: "Följ ån genom ett grönt landskap av raviner, betesmarker och slingrande stig från Angered.", category: "Natur & vandring", area: "ANGERED / LÄRJE", duration: "2–5 TIM", price: "GRATIS", setting: "UTE", booking: "SPONTANT", url: sources.natureAreas, free: true }),
  experience({ id: "hokalla", title: "Hökälla våtmarkspark", subtitle: "Fåglar, betesmarker och utsikt", description: "En lättillgänglig tur genom våtmark och odlingslandskap med rikt fågelliv på norra Hisingen.", category: "Natur & vandring", area: "NORRA HISINGEN", duration: "1–3 TIM", price: "GRATIS", setting: "UTE", pace: "LUGNT", booking: "SPONTANT", url: sources.natureAreas, free: true }),
  experience({ id: "valen", title: "Välen", subtitle: "Kustnära natur i sydväst", description: "Promenera mellan strandängar, fågelmarker, historia och öppna vyer nära Frölunda.", category: "Natur & vandring", area: "VÄSTRA FRÖLUNDA", duration: "1–3 TIM", price: "GRATIS", setting: "UTE", pace: "LUGNT", booking: "SPONTANT", url: sources.natureAreas, free: true }),
  experience({ id: "lillebyrundan", title: "Lillebyrundan", subtitle: "En mil över hällmarker", description: "En längre rundtur mellan Torslanda och Lilleby genom skog, öppna berg och kustnära natur.", category: "Natur & vandring", area: "TORSLANDA", duration: "3–5 TIM", price: "GRATIS", setting: "UTE", pace: "AKTIVT", booking: "SPONTANT", audiences: adults, url: sources.natureAreas, free: true }),
  experience({ id: "harlanda-tjarn", title: "Härlanda tjärn", subtitle: "Bad och enkel skogsrunda", description: "Ta en kort promenad runt vattnet, hitta grillplatsen eller kombinera badet med Delsjöområdets stigar.", category: "Natur & vandring", area: "HÄRLANDA", duration: "1–3 TIM", price: "GRATIS", setting: "UTE", booking: "SPONTANT", url: sources.natureAreas, free: true }),
  experience({ id: "gotaleden-etapp", title: "Gotaleden från centrum", subtitle: "Långled i lagom etapper", description: "Starta mitt i Göteborg och ta en dagssträcka österut; stationerna gör det enkelt att korta turen.", category: "Natur & vandring", area: "CENTRUM–ÖSTERUT", duration: "HALV–HELDAG", price: "GRATIS + RESA", setting: "UTE", pace: "AKTIVT", booking: "SPONTANT", audiences: adults, url: sources.nature, free: true }),

  // Kultur & historia
  experience({ id: "stadsmuseet", title: "Göteborgs stadsmuseum", subtitle: "Staden från vikingatid till nu", description: "Följ Göteborgs berättelse genom handel, vardagsliv, arkitektur och Sveriges enda permanent utställda vikingaskepp.", category: "Kultur & historia", area: "NORRA HAMNGATAN", duration: "2–4 TIM", price: "ENTRÉ / MUSEIKORT", setting: "INNE", pace: "LUGNT", booking: "SPONTANT", url: sources.attractions }),
  experience({ id: "konstmuseet-hasselblad", title: "Konstmuseet & Hasselblad Center", subtitle: "Nordiskt måleri och fotografi", description: "Kombinera klassiker, samtidskonst och fotografi i Götaplatsens monumentala fond.", category: "Kultur & historia", area: "GÖTAPLATSEN", duration: "2–4 TIM", price: "ENTRÉ / MUSEIKORT", setting: "INNE", pace: "LUGNT", booking: "SPONTANT", url: sources.attractions, featured: true }),
  experience({ id: "rohsska", title: "Röhsska museet", subtitle: "Design, mode och konsthantverk", description: "Upptäck hur vardagsföremål, idéer och stil formar livet – från historiska samlingar till samtida design.", category: "Kultur & historia", area: "VASAGATAN", duration: "2–3 TIM", price: "ENTRÉ / MUSEIKORT", setting: "INNE", pace: "LUGNT", booking: "SPONTANT", url: sources.attractions }),
  experience({ id: "varldskulturmuseet", title: "Världskulturmuseet", subtitle: "Samtid, världar och samtal", description: "Utställningar och program om hur människor lever tillsammans; mycket fungerar väl även med barn.", category: "Kultur & historia", area: "KORSVÄGEN", duration: "2–4 TIM", price: "KOLLA ENTRÉ", setting: "INNE", pace: "LUGNT", booking: "SPONTANT", url: sources.rain }),
  experience({ id: "sjofartsmuseet-akvariet", title: "Sjöfartsmuseet Akvariet", subtitle: "Havet under och över ytan", description: "Akvarier, havsmiljö och sjöfartshistoria i ett museum som passar både nyfikna vuxna och barn.", category: "Kultur & historia", area: "MAJORNA", duration: "2–4 TIM", price: "ENTRÉ / MUSEIKORT", setting: "INNE", pace: "LUGNT", booking: "SPONTANT", url: sources.attractions }),
  experience({ id: "naturhistoriska", title: "Naturhistoriska museet", subtitle: "Valen, djuren och samlingarna", description: "Ett klassiskt museum i Slottsskogen för långsam upptäckt bland djur, naturhistoria och den blå valen.", category: "Kultur & historia", area: "SLOTTSSKOGEN", duration: "1–3 TIM", price: "ENTRÉ / MUSEIKORT", setting: "INNE", pace: "LUGNT", booking: "SPONTANT", url: sources.attractions }),
  experience({ id: "world-of-volvo", title: "World of Volvo", subtitle: "Fordon, design och framtid", description: "Interaktiva miljöer om ett av Göteborgs starkaste varumärken, med teknik, historia och skandinavisk design.", category: "Kultur & historia", area: "KORSVÄGEN", duration: "2–4 TIM", price: "ENTRÉ", setting: "INNE", booking: "KOLLA FÖRST", url: sources.kids }),
  experience({ id: "aeroseum", title: "Aeroseum", subtitle: "Flyg i ett bergrum", description: "Ett tidigare hemligt berghangarområde fyllt av flygplan, helikoptrar och upplevelser kring teknik.", category: "Kultur & historia", area: "SÄVE", duration: "2–4 TIM", price: "ENTRÉ", setting: "INNE", booking: "KOLLA FÖRST", url: sources.kids }),
  experience({ id: "maritiman", title: "Maritiman", subtitle: "Klättra ombord på flottan", description: "Gå genom fartyg, maskinrum och ubåt vid Packhuskajen och upplev stadens maritima historia fysiskt.", category: "Kultur & historia", area: "PACKHUSKAJEN", duration: "2–4 TIM", price: "ENTRÉ", setting: "INNE & UTE", pace: "AKTIVT", url: sources.kids }),
  experience({ id: "roda-sten", title: "Röda Sten Konsthall", subtitle: "Samtidskonst under bron", description: "Se aktuella utställningar i pannhuset och fortsätt ut bland Klippans kulturmiljöer och Älvsborgsbron.", category: "Kultur & historia", area: "KLIPPAN", duration: "2–3 TIM", price: "KOLLA ENTRÉ", setting: "INNE & UTE", pace: "LUGNT", booking: "SPONTANT", url: sources.culture }),
  experience({ id: "kronhuset", title: "Kronhuset & Kronhusbodarna", subtitle: "1600-tal och hantverksgård", description: "Besök ett av stadens äldsta hus och den lugna kullerstensgården med små hantverksverksamheter.", category: "Kultur & historia", area: "CENTRUM", duration: "45–90 MIN", price: "GRATIS ATT STROSA", setting: "INNE & UTE", pace: "LUGNT", booking: "SPONTANT", url: sources.attractions, free: true }),
  experience({ id: "nya-alvsborg", title: "Nya Älvsborgs fästning", subtitle: "Historia mitt i älvinloppet", description: "Ta säsongsbåten till fästningsön för guidning, murar och en ovanlig vy tillbaka mot hamnen.", category: "Kultur & historia", area: "ÄLVINLOPPET", duration: "3–5 TIM", price: "BÅT + ENTRÉ", setting: "INNE & UTE", season: "SOMMAR", booking: "BOKA", url: sources.attractions }),

  // Aktivt & sport
  experience({ id: "styr-och-stall", title: "Styr & Ställ-safari", subtitle: "Upptäck staden från cykelsadeln", description: "Länka samman parker, älvstråk och stadsdelar via stadens många lånecykelstationer.", category: "Aktivt & sport", area: "CENTRUM / HISINGEN", duration: "1–4 TIM", price: "CYKELHYRA", setting: "UTE", pace: "AKTIVT", booking: "SPONTANT", audiences: adults, url: sources.sports }),
  experience({ id: "cykla-saltholmen", title: "Cykla till Saltholmen", subtitle: "Västerut längs vattnet", description: "Följ cykelstråk genom Majorna och vidare mot havet, bad och färjeläge.", category: "Aktivt & sport", area: "CENTRUM–SALTHOLMEN", duration: "2–5 TIM", price: "GRATIS / CYKELHYRA", setting: "UTE", pace: "AKTIVT", booking: "SPONTANT", audiences: adults, url: sources.nature, free: true }),
  experience({ id: "kajak-kanaler", title: "Kajak i kanalerna", subtitle: "Staden från vattenlinjen", description: "Paddla genom vallgraven och längs kajerna med guide eller hyrd kajak beroende på erfarenhet.", category: "Aktivt & sport", area: "CENTRUM / KLIPPAN", duration: "2–3 TIM", price: "HYRA / GUIDNING", setting: "UTE", pace: "AKTIVT", booking: "BOKA", audiences: social, url: sources.nature }),
  experience({ id: "klatterdomen-labbet", title: "Klätterdomen eller Klätterlabbet", subtitle: "Rep, vägg och bouldering", description: "Prova inomhusklättring på nybörjarnivå eller bygg ett längre pass med säkring och teknik.", category: "Aktivt & sport", area: "KVIBERG / GÅRDA", duration: "2–3 TIM", price: "ENTRÉ + HYRA", setting: "INNE", pace: "AKTIVT", audiences: social, url: sources.sports }),
  experience({ id: "backa-boulder", title: "Backa Boulder", subtitle: "Klättring utan rep", description: "Ett lättillgängligt bouldergym vid Hjalmar Brantingsplatsen för både första försök och träningspass.", category: "Aktivt & sport", area: "BACKAPLAN", duration: "1–3 TIM", price: "ENTRÉ + HYRA", setting: "INNE", pace: "AKTIVT", booking: "SPONTANT", audiences: social, url: sources.sports }),
  experience({ id: "upzone", title: "Upzone äventyrspark", subtitle: "Höghöjdsbanor bland träden", description: "Klättra, balansera och åk zipline på banor med olika höjd och svårighetsgrad.", category: "Aktivt & sport", area: "SKATÅS", duration: "2–4 TIM", price: "BILJETT", setting: "UTE", season: "SÄSONGSÖPPET", pace: "AKTIVT", booking: "BOKA", audiences: families, url: sources.sports }),
  experience({ id: "actionpark", title: "Actionpark", subtitle: "Skate, BMX och inlines", description: "Göteborgs stora betongpark bakom Bergakungen fungerar för allt från första rull till avancerade linjer.", category: "Aktivt & sport", area: "KORSVÄGEN", duration: "1–3 TIM", price: "GRATIS", setting: "UTE", pace: "AKTIVT", booking: "SPONTANT", audiences: ["singel", "par", "barnfamilj", "besokare", "lokal"], url: sources.sports, free: true }),
  experience({ id: "banana-ramp", title: "Banana Ramp", subtitle: "Skateramp vid älven", description: "Ta brädan eller BMX-cykeln till Bananpiren och rulla med hamnlandskapet runt dig.", category: "Aktivt & sport", area: "FRIHAMNEN", duration: "1–3 TIM", price: "GRATIS", setting: "UTE", pace: "AKTIVT", booking: "SPONTANT", audiences: ["singel", "par", "barnfamilj", "lokal"], url: sources.sports, free: true }),
  experience({ id: "beach-center", title: "Beach Center", subtitle: "Beachvolley året runt", description: "Spela på varm sand under tak i Kviberg – en tydlig kontrast till regn och vinter utanför.", category: "Aktivt & sport", area: "KVIBERG", duration: "1–3 TIM", price: "BANHYRA", setting: "INNE", pace: "AKTIVT", booking: "BOKA", audiences: social, url: sources.sports }),
  experience({ id: "simhall-safari", title: "Simhall & bastu", subtitle: "Bad, längder eller varm bassäng", description: "Välj bland stadens motionscentrum och simhallar efter behov: familjebad, träning, relax eller varmvatten.", category: "Aktivt & sport", area: "HELA GÖTEBORG", duration: "1–3 TIM", price: "BADENTRÉ", setting: "INNE", url: sources.exercise }),
  experience({ id: "minigolf", title: "Minigolf runt staden", subtitle: "Parkbana eller inomhusduell", description: "Välj Heden, Slottsskogen, Jubileumsparken eller en regnsäker bana under tak.", category: "Aktivt & sport", area: "FLERA OMRÅDEN", duration: "1–2 TIM", price: "SPELVAVGIFT", setting: "INNE & UTE", url: sources.sports }),
  experience({ id: "match-live", title: "Se en match live", subtitle: "Fotboll, hockey eller handboll", description: "Kolla kalendern för Gamla Ullevi, Ullevi, Scandinavium, Frölundaborg eller en mindre lokal arena.", category: "Aktivt & sport", area: "EVENEMANGSSTRÅKET / STADEN", duration: "2–4 TIM", price: "BILJETT", setting: "INNE & UTE", booking: "BOKA", url: sources.events }),

  // Spel & utmaning
  experience({ id: "escape-room", title: "Escape room", subtitle: "60 minuter för att lösa allt", description: "Välj mysterium, kupp eller skräcktema och samla ett lag som kan tänka under tidspress.", category: "Spel & utmaning", area: "CENTRUM / MAJORNA", duration: "1–2 TIM", price: "BOKNING", setting: "INNE", booking: "BOKA", audiences: social, url: "https://www.goteborg.com/en/guides/escape-rooms-in-gothenburg", featured: true }),
  experience({ id: "activate", title: "Activate Nordstan", subtitle: "Fysiska och digitala spelrum", description: "Växla mellan klättring, reaktion, problemlösning och laserutmaningar i korta lagbaserade rum.", category: "Spel & utmaning", area: "NORDSTAN", duration: "1–2 TIM", price: "ENTRÉ", setting: "INNE", pace: "AKTIVT", booking: "BOKA", audiences: ["singel", "par", "barnfamilj", "besokare", "lokal"], url: sources.sports }),
  experience({ id: "paradox-museum", title: "Paradox Museum", subtitle: "Illusioner och omöjliga rum", description: "Gå genom interaktiva installationer som lurar perspektiv, balans och kamera.", category: "Spel & utmaning", area: "NORDSTAN", duration: "1–2 TIM", price: "ENTRÉ", setting: "INNE", booking: "KOLLA FÖRST", url: sources.kids }),
  experience({ id: "vr-world", title: "VR World", subtitle: "Spel i nya verkligheter", description: "Välj samarbetsäventyr eller tävling och kliv in i en regnsäker virtuell värld.", category: "Spel & utmaning", area: "CENTRUM", duration: "1–2 TIM", price: "SPELTID", setting: "INNE", pace: "AKTIVT", booking: "BOKA", audiences: social, url: sources.rain }),
  experience({ id: "gokart", title: "Gokart", subtitle: "Varvtider och snabba kurvor", description: "Samla vännerna för kval och final på inomhus- eller utomhusbana beroende på anläggning.", category: "Spel & utmaning", area: "HISINGEN / GÖTEBORG", duration: "1–2 TIM", price: "KÖRPAKET", setting: "INNE & UTE", pace: "AKTIVT", booking: "BOKA", audiences: social, url: sources.sports }),
  experience({ id: "underground-golf", title: "Underground Golf", subtitle: "Minigolf under tak", description: "Två niohålsbanor, social stämning och familjetider på utvalda dagar.", category: "Spel & utmaning", area: "CENTRUM", duration: "1–2 TIM", price: "SPELVAVGIFT", setting: "INNE", booking: "BOKA", audiences: ["singel", "par", "barnfamilj", "besokare", "lokal"], url: "https://www.goteborg.com/en/guides/play-mini-golf-in-gothenburg" }),
  experience({ id: "slice-pingis", title: "Pingisduell på Slice", subtitle: "Bordtennis mitt i centrum", description: "Boka bord för en snabb duell eller en hel kväll med flera matcher.", category: "Spel & utmaning", area: "KUNGSPORTSPLATSEN", duration: "1–3 TIM", price: "BORDSBOKNING", setting: "INNE", pace: "AKTIVT", booking: "BOKA", audiences: social, url: sources.sports }),
  experience({ id: "piffl", title: "Låna spel ur en Piffl-box", subtitle: "Kubb, boll och jättespel i parken", description: "Hyr utrustning i mobilen och gör gräsytan till en spontan arena för kubb, basket eller brännboll.", category: "Spel & utmaning", area: "PARKER RUNT STADEN", duration: "1–3 TIM", price: "LITEN HYRA", setting: "UTE", pace: "AKTIVT", booking: "SPONTANT", url: sources.sports }),
  experience({ id: "boule-schack", title: "Boule eller parkschack", subtitle: "Låg tröskel, lång match", description: "Ta en lugn duell på exempelvis Plikta, Angeredsparken eller någon av stadens många bouleplaner.", category: "Spel & utmaning", area: "HELA GÖTEBORG", duration: "1–3 TIM", price: "OFTA GRATIS", setting: "UTE", pace: "LUGNT", booking: "SPONTANT", url: sources.cityParks, free: true }),

  // Scen & kväll
  experience({ id: "goteborgsoperan", title: "GöteborgsOperan", subtitle: "Opera, musikal och dans vid älven", description: "Boka en stor scenkväll eller besök huset och kajstråket för arkitekturen och utsikten.", category: "Scen & kväll", area: "LILLA BOMMEN", duration: "2–4 TIM", price: "BILJETT", setting: "INNE", pace: "LUGNT", booking: "BOKA", audiences: adults, url: sources.theatre, featured: true }),
  experience({ id: "konserthuset", title: "Göteborgs Konserthus", subtitle: "Symfoniskt på Götaplatsen", description: "Lyssna på Göteborgs Symfoniker, gästande artister eller en introduktion för den som är nyfiken på klassiskt.", category: "Scen & kväll", area: "GÖTAPLATSEN", duration: "2–3 TIM", price: "BILJETT", setting: "INNE", pace: "LUGNT", booking: "BOKA", audiences: adults, url: sources.culture }),
  experience({ id: "stadsteatern", title: "Göteborgs Stadsteater", subtitle: "Dramatik vid Götaplatsen", description: "Välj ny svensk dramatik, klassiker eller samtal och bygg kvällen kring kulturstråket.", category: "Scen & kväll", area: "GÖTAPLATSEN", duration: "2–4 TIM", price: "BILJETT", setting: "INNE", pace: "LUGNT", booking: "BOKA", audiences: adults, url: sources.theatre }),
  experience({ id: "folkteatern", title: "Folkteatern", subtitle: "Samtida scen vid Järntorget", description: "Teater, dans, musik, litteratur och debatt i ett hus där scenkonsten möter Långgatornas kvällsliv.", category: "Scen & kväll", area: "JÄRNTORGET", duration: "2–4 TIM", price: "BILJETT", setting: "INNE", pace: "LUGNT", booking: "BOKA", audiences: adults, url: sources.theatre }),
  experience({ id: "stora-teatern", title: "Stora Teatern", subtitle: "Gästspel, dans och samtal", description: "En central scen för svenska och internationella gästspel, ofta med samtal och mindre program runtomkring.", category: "Scen & kväll", area: "KUNGSPARKEN", duration: "2–4 TIM", price: "BILJETT", setting: "INNE", pace: "LUGNT", booking: "BOKA", audiences: adults, url: sources.theatre }),
  experience({ id: "bio-kvarter", title: "Bio Roy, Hagabion eller Draken", subtitle: "Film med egen karaktär", description: "Välj klassiker, festivalfilm, dokumentär eller ny premiär i en salong med tydlig lokal identitet.", category: "Scen & kväll", area: "AVENYN / LINNÉ / JÄRNTORGET", duration: "2–3 TIM", price: "BIOBILJETT", setting: "INNE", pace: "LUGNT", audiences: adults, url: sources.culture }),
  experience({ id: "pustervik", title: "Pustervik", subtitle: "Konserter och klubb vid Järntorget", description: "En långlivad scen för indie, rock, klubbkvällar och gästande artister.", category: "Scen & kväll", area: "JÄRNTORGET", duration: "2–5 TIM", price: "BILJETT / ENTRÉ", setting: "INNE", audiences: social, url: sources.nightlife }),
  experience({ id: "nefertiti", title: "Nefertiti", subtitle: "Jazz, soul och klubb", description: "Göteborgsk jazzinstitution med levande musik, DJ-kvällar och en scen nära Centralstationen.", category: "Scen & kväll", area: "CENTRUM", duration: "2–5 TIM", price: "BILJETT / ENTRÉ", setting: "INNE", audiences: social, url: sources.nightlife }),
  experience({ id: "majorna-live", title: "Livemusik i Majorna", subtitle: "Oceanen, Skeppet och Musikens Hus", description: "Följ kvällens program mellan mindre scener där lokal musik, turnerande band och klubbkultur möts.", category: "Scen & kväll", area: "STIGBERGET / MAJORNA", duration: "3–6 TIM", price: "VARIERAR", setting: "INNE", audiences: social, url: sources.nightlife }),
  experience({ id: "backa-teater", title: "Backa Teater", subtitle: "Scenkonst för unga och vuxna", description: "En modig teaterscen på Hisingen med perspektiv som talar till både ungdomar, familjer och vuxen publik.", category: "Scen & kväll", area: "LINDHOLMEN", duration: "2–3 TIM", price: "BILJETT", setting: "INNE", pace: "LUGNT", booking: "BOKA", audiences: ["singel", "par", "barnfamilj", "besokare", "lokal"], url: sources.theatre }),

  // Kvarter & stadsliv
  experience({ id: "alvsnabben", title: "Älvsnabben som sightseeing", subtitle: "Pendelbåt med utsikt", description: "Åk längs älven på vanlig kollektivtrafikbiljett och kliv av vid Lindholmen, Eriksberg eller Klippan.", category: "Kvarter & stadsliv", area: "GÖTA ÄLV", duration: "1–3 TIM", price: "VÄSTTRAFIK ZON A", setting: "INNE & UTE", pace: "LUGNT", booking: "SPONTANT", url: sources.guide, featured: true }),
  experience({ id: "majorna-promenad", title: "Majorna till Klippan", subtitle: "Landshövdingehus mot havet", description: "Följ Mariaplan, Chapmans torg och gamla varvsmiljöer västerut till Klippan och Röda Sten.", category: "Kvarter & stadsliv", area: "MAJORNA", duration: "2–4 TIM", price: "GRATIS", setting: "UTE", booking: "SPONTANT", url: sources.guide, free: true }),
  experience({ id: "lindholmen-eriksberg", title: "Lindholmen & Eriksberg", subtitle: "Kranar, kajer och ny stad", description: "Promenera längs norra älvstranden mellan modern arkitektur, varvshistoria och den röda bockkranen.", category: "Kvarter & stadsliv", area: "NORRA ÄLVSTRANDEN", duration: "2–4 TIM", price: "GRATIS", setting: "UTE", booking: "SPONTANT", url: sources.attractions, free: true }),
  experience({ id: "ringon", title: "Ringön", subtitle: "Verkstäder och kreativ industrikant", description: "Upptäck ateljéer, små scener, bryggor och tillfälliga marknader i ett område som fortfarande känns producerande.", category: "Kvarter & stadsliv", area: "RINGÖN", duration: "2–4 TIM", price: "OFTA GRATIS", setting: "INNE & UTE", audiences: adults, url: sources.events, free: true }),
  experience({ id: "vasastan-gotaplatsen", title: "Vasastan till Götaplatsen", subtitle: "Arkitektur, boklådor och kultur", description: "Gå längs Vasagatan mellan stenstad, designmuseum, universitet och Götaplatsens stora institutioner.", category: "Kvarter & stadsliv", area: "VASASTAN", duration: "1–3 TIM", price: "GRATIS ATT STROSA", setting: "UTE", pace: "LUGNT", booking: "SPONTANT", url: sources.guide, free: true }),
  experience({ id: "gamlestaden", title: "Gamlestaden & Slakthuset", subtitle: "Historia, ny stadsdel och marknader", description: "Se hur fabriks- och järnvägsmiljöer blandas med nya kvarter, kulturverksamheter och helgmarknader.", category: "Kvarter & stadsliv", area: "GAMLESTADEN", duration: "2–4 TIM", price: "OFTA GRATIS", setting: "INNE & UTE", url: sources.events, free: true }),
  experience({ id: "loppisrunda", title: "Loppis- & vintagerunda", subtitle: "Fynda i flera stadsdelar", description: "Planera en runda mellan helgloppisar, antikbutiker och second hand i Majorna, Linné, centrum eller Hisingen.", category: "Kvarter & stadsliv", area: "HELA GÖTEBORG", duration: "2–5 TIM", price: "GRATIS ATT TITTA", setting: "INNE & UTE", pace: "LUGNT", url: sources.markets, free: true }),
  experience({ id: "offentlig-konst", title: "Offentlig konst på promenad", subtitle: "Ett galleri utan väggar", description: "Bygg en egen konstrunda mellan skulpturer, muralmålningar och tillfälliga verk i centrum, Majorna eller längs älven.", category: "Kvarter & stadsliv", area: "HELA GÖTEBORG", duration: "1–4 TIM", price: "GRATIS", setting: "UTE", pace: "LUGNT", booking: "SPONTANT", url: sources.culture, free: true }),
  experience({ id: "filminspelningsplatser", title: "Göteborg på film", subtitle: "Hitta inspelningsplatserna", description: "Se staden genom välkända film- och tv-miljöer och jämför fiktionen med kvarteren i dag.", category: "Kvarter & stadsliv", area: "CENTRUM / HAMNEN", duration: "2–4 TIM", price: "GRATIS", setting: "UTE", pace: "LUGNT", booking: "SPONTANT", url: sources.culture, free: true }),

  // Lugn & välmående
  experience({ id: "jubileumsparken-bastu", title: "Bastu & hamnbad i Frihamnen", subtitle: "Arkitektur och vinterdopp", description: "Boka bastun och kombinera med salt- eller sötvattenbassäng i Jubileumsparken.", category: "Lugn & välmående", area: "FRIHAMNEN", duration: "1–3 TIM", price: "KOLLA BOKNING", setting: "INNE & UTE", pace: "LUGNT", booking: "BOKA", audiences: adults, url: sources.cityParks, featured: true }),
  experience({ id: "hagabadet", title: "Hagabadet", subtitle: "Bad, yoga och historisk miljö", description: "Ta en långsam halvdag med varma bad, bastu, behandling eller rörelse i ett badhus från 1876.", category: "Lugn & välmående", area: "HAGA", duration: "2–5 TIM", price: "ENTRÉ / BEHANDLING", setting: "INNE", pace: "LUGNT", booking: "BOKA", audiences: adults, url: sources.rain }),
  experience({ id: "park-picknick", title: "Parkpicknick utan program", subtitle: "Låt platsen vara aktiviteten", description: "Välj Slottsskogen, Trädgårdsföreningen, Keillers park eller en mindre kvarterspark och stanna längre.", category: "Lugn & välmående", area: "HELA GÖTEBORG", duration: "1–4 TIM", price: "GRATIS", setting: "UTE", season: "VÅR–HÖST", pace: "LUGNT", booking: "SPONTANT", url: sources.cityParks, free: true }),
  experience({ id: "biblioteksro", title: "Bibliotekshäng", subtitle: "Läs, lyssna eller gå på program", description: "Hitta en lugn stund, en tidning eller ett kostnadsfritt samtal på Stadsbiblioteket eller ett lokalt bibliotek.", category: "Lugn & välmående", area: "HELA GÖTEBORG", duration: "1–3 TIM", price: "GRATIS", setting: "INNE", pace: "LUGNT", booking: "SPONTANT", audiences: calm, url: sources.libraries, free: true }),
  experience({ id: "kanalpromenad", title: "Promenad längs vallgraven", subtitle: "Staden i långsamt tempo", description: "Följ vattnet mellan parker, broar och äldre kvarter och ta den lilla avstickare som ser mest lovande ut.", category: "Lugn & välmående", area: "INOM VALLGRAVEN", duration: "1–2 TIM", price: "GRATIS", setting: "UTE", pace: "LUGNT", booking: "SPONTANT", audiences: calm, url: sources.guide, free: true }),
  experience({ id: "rosarium", title: "Rosariet i långsam takt", subtitle: "Doft, bänkar och säsonger", description: "Gå utan mål genom Trädgårdsföreningens rosarium och Palmhuset, med gott om platser att pausa.", category: "Lugn & välmående", area: "CENTRUM", duration: "45–90 MIN", price: "GRATIS", setting: "INNE & UTE", pace: "LUGNT", booking: "SPONTANT", audiences: calm, url: sources.cityParks, free: true }),
  experience({ id: "vardagsbad", title: "Vardagsbad vid sjö eller hav", subtitle: "En timme som känns längre", description: "Välj Delsjöbadet, Härlanda tjärn, Sillvik eller en västlig klippa efter vind, tillgänglighet och restid.", category: "Lugn & välmående", area: "HELA GÖTEBORG", duration: "1–3 TIM", price: "GRATIS", setting: "UTE", season: "SOMMAR / VINTERBAD", pace: "LUGNT", booking: "SPONTANT", url: sources.nature, free: true }),
];
