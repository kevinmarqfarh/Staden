export type FoodGuideTag = "Takbar" | "Barnfamilj" | "Första dejten";

export type FoodGuide = {
  id: string;
  tag: FoodGuideTag;
  highlightFrom?: string;
  highlightUntil?: string;
  eyebrow: string;
  title: string;
  description: string;
  imagePath: string;
  imageAlt: string;
  readingTime: string;
  sourceLabel?: string;
  sourceUrl?: string;
};

export const foodGuides: FoodGuide[] = [
  {
    id: "takbarerna-i-goteborg",
    tag: "Takbar",
    eyebrow: "UTSIKT · DRINKAR · SOLNEDGÅNG",
    title: "Takbarerna i Göteborg",
    description:
      "Från hamninloppet till Lisebergs siluett — fem höga lägen för en kväll som börjar innan solen går ner.",
    imagePath: "/media/guide-takbarer-goteborg.png",
    imageAlt:
      "Gäster på en takbar med utsikt över Göteborg under den blå timmen.",
    readingTime: "4 min läsning",
    sourceLabel: "Göteborgs officiella besöksguide",
    sourceUrl: "https://www.goteborg.com/guider/takbarer-i-goteborg/",
  },
  {
    id: "mat-med-barnfamiljen",
    tag: "Barnfamilj",
    eyebrow: "RYMLIGT · ENKELT · FÖR ALLA",
    title: "Matplatser för barnfamiljen",
    description:
      "Barnportioner, gott om plats och något att titta på medan maten kommer. Adresser där hela bordet får en bra kväll.",
    imagePath: "/media/guide-barnfamilj-goteborg.png",
    imageAlt:
      "En familj delar flera rätter vid ett ljust bord på en restaurang i Göteborg.",
    readingTime: "5 min läsning",
    sourceLabel: "Göteborgs officiella besöksguide",
    sourceUrl:
      "https://www.goteborg.com/guider/barnvanliga-restauranger-i-goteborg",
  },
  {
    id: "forsta-dejtenvibbar",
    tag: "Första dejten",
    eyebrow: "LAGOM SORL · BRA LJUS · INGEN STRESS",
    title: "Första dejtenvibbar",
    description:
      "Vinbarer, kvarterskrogar och mindre matsalar där samtalet får plats — med rätt balans mellan avslappnat och speciellt.",
    imagePath: "/media/guide-forsta-dejten-goteborg.png",
    imageAlt:
      "Två personer möts över ett litet bord i en stämningsfull restaurangmiljö.",
    readingTime: "3 min läsning",
    sourceLabel: "Göteborgs officiella besöksguide",
    sourceUrl: "https://www.goteborg.com/guider/charmiga-vinbarer-i-goteborg",
  },
];
