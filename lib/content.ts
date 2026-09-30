export type SolarisEvent = {
  id: string; slug: string; title: string; subtitle: string; startsAt: string | null;
  city: string; venue: string; summary: string; cycling: string; monarch: string;
  status: "draft" | "published"; rsvpOpen: boolean; updatedAt: string;
};

export const firstEvent: SolarisEvent = {
  id: "solaris-days-1", slug: "solaris-days-1", title: "Solaris Days #1", subtitle: "Critical Mass x Matiné",
  startsAt: "2026-07-11T07:00:00.000Z", city: "Csíkszereda", venue: "Petőfi Sándor utca → Szécsenyi Sportpark",
  summary: "Az első Solaris nap közös kerékpározással, sporttal, zenével és találkozásokkal hozta össze a várost.",
  cycling: "Critical Mass Ride: mintegy 15 kilométeres közösségi tekerés Csíkszeredában. A résztvevők 12:30-kor találkoztak a Petőfi Sándor utcában, a Tulipán Áruház előtt; a felvonulás 13:00-kor indult.",
  monarch: "A délután a Szécsenyi Sportparkban folytatódott. Szabadtéri Matiné, sportprogramok, zene és kötetlen együttlét várta az érkezőket.",
  status: "draft", rsvpOpen: false, updatedAt: "2026-09-30T00:00:00.000Z",
};

export const defaultCopy: Record<string, string> = {
  home_intro: "Egy közös tekerés, egy új ismerős, egy délután, amelyből történet lesz. Olyan napokat szervezünk, ahol a mozgás összehozza az embereket — aztán együtt maradunk a zenéért és a beszélgetésekért.",
  home_next: "Már tervezzük a következő Solaris napot. Amint megvan az időpont és a helyszín, itt találod majd a részleteket.",
  about_intro: "Csíkszeredából induló közösség vagyunk. Mozgással, zenével és közös programokkal teremtünk alkalmat arra, hogy az emberek valóban találkozzanak.",
};

export const oldPartnerNames = ["MiMi", "Pekengo", "Beats In The Park", "Athos"];

export function formatEventDate(value: string | null) {
  if (!value) return "Időpont szervezés alatt";
  return new Intl.DateTimeFormat("hu-HU", { timeZone: "Europe/Bucharest", year: "numeric", month: "long", day: "numeric" }).format(new Date(value));
}

export function canRsvp(event: SolarisEvent) {
  return event.status === "published" && event.rsvpOpen && !!event.startsAt && new Date(event.startsAt).getTime() > Date.now();
}
