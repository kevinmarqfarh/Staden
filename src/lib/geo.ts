export type GeoPoint = {
  latitude: number;
  longitude: number;
  precision: "exact" | "area";
};

export type ManualLocation = GeoPoint & {
  id: string;
  label: string;
};

export const MANUAL_LOCATIONS: readonly ManualLocation[] = [
  { id: "centrum", label: "Centrum", latitude: 57.7069, longitude: 11.9677, precision: "area" },
  { id: "jarntorget", label: "Järntorget & Linné", latitude: 57.6992, longitude: 11.9527, precision: "area" },
  { id: "korsvagen", label: "Korsvägen", latitude: 57.6975, longitude: 11.9864, precision: "area" },
  { id: "majorna", label: "Majorna", latitude: 57.6931, longitude: 11.9265, precision: "area" },
  { id: "lindholmen", label: "Lindholmen", latitude: 57.7089, longitude: 11.9385, precision: "area" },
  { id: "gamlestaden", label: "Gamlestaden", latitude: 57.7284, longitude: 12.0054, precision: "area" },
  { id: "frolunda", label: "Frölunda", latitude: 57.6529, longitude: 11.9107, precision: "area" },
  { id: "angered", label: "Angered", latitude: 57.7966, longitude: 12.0505, precision: "area" },
] as const;

type LocationIndexEntry = GeoPoint & { aliases: readonly string[] };

const locationIndex: readonly LocationIndexEntry[] = [
  { aliases: ["röda sten", "roda sten"], latitude: 57.6899, longitude: 11.9012, precision: "exact" },
  { aliases: ["världskulturmuseet", "varldskulturmuseet"], latitude: 57.6947, longitude: 11.9887, precision: "exact" },
  { aliases: ["göteborgs konstmuseum", "goteborgs konstmuseum", "hasselblad center"], latitude: 57.6969, longitude: 11.9808, precision: "exact" },
  { aliases: ["göteborgs konserthus", "goteborgs konserthus", "götaplatsen", "gotaplatsen"], latitude: 57.6971, longitude: 11.9798, precision: "exact" },
  { aliases: ["göteborgs stadsteater", "goteborgs stadsteater"], latitude: 57.6974, longitude: 11.9805, precision: "exact" },
  { aliases: ["naturhistoriska museum", "naturhistoriska museet"], latitude: 57.6899, longitude: 11.9492, precision: "exact" },
  { aliases: ["sjöfartsmuseet", "sjofartsmuseet"], latitude: 57.6992, longitude: 11.9324, precision: "exact" },
  { aliases: ["göteborgs stadsmuseum", "goteborgs stadsmuseum"], latitude: 57.7061, longitude: 11.9631, precision: "exact" },
  { aliases: ["göteborgsoperan", "goteborgsoperan"], latitude: 57.7109, longitude: 11.9627, precision: "exact" },
  { aliases: ["röhsska", "rohsska"], latitude: 57.7003, longitude: 11.9737, precision: "exact" },
  { aliases: ["stora teatern"], latitude: 57.7022, longitude: 11.9689, precision: "exact" },
  { aliases: ["trädgårdsföreningen", "tradgardsforeningen", "palmhuset"], latitude: 57.7062, longitude: 11.9750, precision: "exact" },
  { aliases: ["botaniska trädgård", "botaniska tradgard"], latitude: 57.6818, longitude: 11.9520, precision: "exact" },
  { aliases: ["liseberg"], latitude: 57.6954, longitude: 11.9924, precision: "exact" },
  { aliases: ["universeum", "wisdome"], latitude: 57.6959, longitude: 11.9892, precision: "exact" },
  { aliases: ["maritiman"], latitude: 57.7103, longitude: 11.9662, precision: "exact" },
  { aliases: ["backa teater"], latitude: 57.7167, longitude: 11.9446, precision: "exact" },
  { aliases: ["kulturhuset kåken", "kaken"], latitude: 57.7241, longitude: 12.0257, precision: "exact" },
  { aliases: ["kulturhuset bergsjön", "bergsjon"], latitude: 57.7570, longitude: 12.0687, precision: "exact" },
  { aliases: ["blå stället", "bla stallet"], latitude: 57.7964, longitude: 12.0500, precision: "exact" },
  { aliases: ["frölunda kulturhus", "frolunda kulturhus"], latitude: 57.6522, longitude: 11.9110, precision: "exact" },
  { aliases: ["saltholmen"], latitude: 57.6603, longitude: 11.8454, precision: "area" },
  { aliases: ["slottsskogen"], latitude: 57.6890, longitude: 11.9478, precision: "area" },
  { aliases: ["skansen kronan", "haga"], latitude: 57.6981, longitude: 11.9558, precision: "area" },
  { aliases: ["järntorget", "jarntorget"], latitude: 57.6992, longitude: 11.9527, precision: "area" },
  { aliases: ["linnéplatsen", "linneplatsen", "linné", "linne"], latitude: 57.6907, longitude: 11.9522, precision: "area" },
  { aliases: ["korsvägen", "korsvagen", "evenemangsstråket"], latitude: 57.6975, longitude: 11.9864, precision: "area" },
  { aliases: ["avenyn", "lorensberg", "heden"], latitude: 57.7015, longitude: 11.9754, precision: "area" },
  { aliases: ["vasastaden", "vasastan", "vasagatan"], latitude: 57.6989, longitude: 11.9664, precision: "area" },
  { aliases: ["kungsportsplatsen"], latitude: 57.7048, longitude: 11.9696, precision: "area" },
  { aliases: ["brunnsparken", "nordstan", "inom vallgraven", "centrum"], latitude: 57.7069, longitude: 11.9677, precision: "area" },
  { aliases: ["stenpiren", "skeppsbron", "packhusplatsen"], latitude: 57.7057, longitude: 11.9587, precision: "area" },
  { aliases: ["lilla bommen", "gullbergsvass"], latitude: 57.7138, longitude: 11.9674, precision: "area" },
  { aliases: ["gamlestaden"], latitude: 57.7284, longitude: 12.0054, precision: "area" },
  { aliases: ["kålltorp", "kalltorp", "härlanda", "harlanda"], latitude: 57.7187, longitude: 12.0277, precision: "area" },
  { aliases: ["björnlekplatsen", "bjornlekplatsen", "torpa"], latitude: 57.7230, longitude: 12.0350, precision: "area" },
  { aliases: ["delsjön", "delsjon", "skatås", "skatas"], latitude: 57.6995, longitude: 12.0356, precision: "area" },
  { aliases: ["angered", "hammarkullen"], latitude: 57.7966, longitude: 12.0505, precision: "area" },
  { aliases: ["björlandavallen", "bjorlandavallen", "björlanda", "bjorlanda"], latitude: 57.76326, longitude: 11.8395, precision: "exact" },
  { aliases: ["kortedala"], latitude: 57.7517, longitude: 12.0318, precision: "area" },
  { aliases: ["majorna", "stigberget", "masthugget", "chapmans torg"], latitude: 57.6931, longitude: 11.9265, precision: "area" },
  { aliases: ["sinnesrummet molnet", "eldorado resurscenter", "kustgatan"], latitude: 57.6938, longitude: 11.9175, precision: "exact" },
  { aliases: ["klippan"], latitude: 57.6907, longitude: 11.9073, precision: "area" },
  { aliases: ["lindholmen", "karlatornet"], latitude: 57.7089, longitude: 11.9385, precision: "area" },
  { aliases: ["eriksberg", "norra älvstranden", "norra alvstranden"], latitude: 57.7064, longitude: 11.9160, precision: "area" },
  { aliases: ["backaplan", "backa"], latitude: 57.7216, longitude: 11.9522, precision: "area" },
  { aliases: ["backa röds näridrottsplats", "backa rod naridrottsplats", "backa röd", "backa rod"], latitude: 57.74530252007469, longitude: 11.971302460327443, precision: "exact" },
  { aliases: ["tuvevallens motionscentrum", "tuvevallen", "tuve"], latitude: 57.7523, longitude: 11.9144, precision: "exact" },
  { aliases: ["ringön", "ringon", "frihamnen"], latitude: 57.7178, longitude: 11.9584, precision: "area" },
  { aliases: ["västra frölunda", "vastra frolunda", "frölunda", "frolunda"], latitude: 57.6529, longitude: 11.9107, precision: "area" },
  { aliases: ["askim", "hovås", "hovas", "billdal"], latitude: 57.6260, longitude: 11.9275, precision: "area" },
  { aliases: ["mölndal", "molndal"], latitude: 57.6550, longitude: 12.0137, precision: "area" },
  { aliases: ["styrsö", "styrso"], latitude: 57.6168, longitude: 11.7853, precision: "area" },
  { aliases: ["donsö", "donso"], latitude: 57.6009, longitude: 11.8004, precision: "area" },
  { aliases: ["vrångö", "vrango"], latitude: 57.5732, longitude: 11.7818, precision: "area" },
  { aliases: ["kårholmen", "karholmen"], latitude: 57.5913721, longitude: 11.7794596, precision: "exact" },
  { aliases: ["knarrholmen", "stora knarrholmen"], latitude: 57.62275619999999, longitude: 11.8300596, precision: "exact" },
  { aliases: ["brännö", "branno"], latitude: 57.6440, longitude: 11.7762, precision: "area" },
  { aliases: ["hönö", "hono"], latitude: 57.6904, longitude: 11.6496, precision: "area" },
  { aliases: ["öckerö", "ockero"], latitude: 57.7084, longitude: 11.6554, precision: "area" },
  { aliases: ["björkö", "bjorko"], latitude: 57.7327, longitude: 11.6794, precision: "area" },
] as const;

function normalize(value: string) {
  return value
    .toLocaleLowerCase("sv-SE")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

export function parseCoordinates(value: string): GeoPoint | null {
  const match = value.match(/(?:koordinat(?:er)?\s*)?(-?\d{1,2}\.\d+)\s*[,;/]\s*(-?\d{1,3}\.\d+)/i);
  if (!match) return null;

  const latitude = Number(match[1]);
  const longitude = Number(match[2]);
  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude) ||
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180
  ) {
    return null;
  }

  return { latitude, longitude, precision: "exact" };
}

export function resolveGothenburgPoint(...parts: Array<string | null | undefined>): GeoPoint | null {
  for (const part of parts) {
    if (!part) continue;
    const coordinates = parseCoordinates(part);
    if (coordinates) return coordinates;
  }

  for (const part of parts) {
    if (!part) continue;
    const haystack = normalize(part);
    const matches = locationIndex
      .flatMap((entry) =>
        entry.aliases
          .map(normalize)
          .filter((alias) => haystack.includes(alias))
          .map((alias) => ({
            entry,
            score:
              alias.length +
              (entry.precision === "exact" ? 100 : 0) -
              (alias === "centrum" ? 1_000 : 0),
          })),
      )
      .sort((left, right) => right.score - left.score);

    if (matches[0]) {
      return {
        latitude: matches[0].entry.latitude,
        longitude: matches[0].entry.longitude,
        precision: matches[0].entry.precision,
      };
    }
  }

  return null;
}

export function distanceInMeters(from: GeoPoint, to: GeoPoint) {
  const radians = (degrees: number) => (degrees * Math.PI) / 180;
  const earthRadius = 6_371_000;
  const latitudeDelta = radians(to.latitude - from.latitude);
  const longitudeDelta = radians(to.longitude - from.longitude);
  const firstLatitude = radians(from.latitude);
  const secondLatitude = radians(to.latitude);
  const haversine =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(firstLatitude) *
      Math.cos(secondLatitude) *
      Math.sin(longitudeDelta / 2) ** 2;

  return 2 * earthRadius * Math.asin(Math.sqrt(haversine));
}

export function formatDistance(distance: number) {
  if (distance < 1_000) return `${Math.max(10, Math.round(distance / 10) * 10)} m`;
  return `${new Intl.NumberFormat("sv-SE", { maximumFractionDigits: distance < 10_000 ? 1 : 0 }).format(distance / 1_000)} km`;
}
