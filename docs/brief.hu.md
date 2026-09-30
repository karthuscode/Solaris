# Solaris Community — weboldalbrief

Elfogadott megvalósítási irány, 2026. szeptember 30. A készültséget és az indulás feltételeit a [státuszlap](status.md) követi.

## Küldetés

A Solaris mozgásra, közös élményekre és valódi kapcsolatokra hívja az embereket. Csíkszeredából indult, később más közeli településeken is szervezhet eseményeket. A hangvétel magyar, fiatalos, közvetlen és minden korosztály számára befogadó.

A Solaris Community az ernyőmárka. Egy eseménynapon belül a Cycling a közös mozgás, a Monarch a későbbi zenei és társas együttlét fejezete. Az első esemény Solaris Days #1, alcíme Critical Mass x Matiné. A 2026. július 11-i dátum és a program a nyilvános [Visit Harghita eseményleírás](https://www.visitharghita.ro/hu/events/solaris-days-1-critical-mass-x-matin) alapján előkészített adat; publikálás előtt szervezői jóváhagyás szükséges.

## Arculat és élmény

A meglévő Solaris arculat logóit, napszimbólumait, narancs és arany színeit, erős tipográfiáját és szemcsés fényhatásait használjuk. A Neue Haas webes licencének rendezéséig Inter szerepel az oldalon.

A kezdőoldal időzített nyitánya Community → Cycling → Monarch sorrendben követi a napot. SVG/CSS-rétegek, fény és tipográfia adják a mozgást, csökkentett mozgásnál egyszerűbb átmenetekkel. A belső oldalak nyugodtabbak.

A [Horizon](https://21st.dev/@lovesickfromthe6ix/components/horizon-hero-section) a nyitány ritmusához adott referenciát. A [Dixor](https://21st.dev/@validtheme/templates/dixor-creative-digital-agency-react) a vélemények és a partnerlogók elrendezésének elvéhez adott inspirációt. A felület saját Solaris-megvalósítás. Idézet csak valódi, jóváhagyott visszajelzésből jelenhet meg; eseményfotók felhasználása is jóváhagyáshoz kötött.

## Felületek

| Oldal | Feladat |
| --- | --- |
| Kezdőoldal | Küldetés, vezetett nyitány, következő esemény vagy „szervezés alatt”, korábbi történetek és partnerek. |
| Események | Közelgő és korábbi események dátummal és helyszínnel. |
| Eseményoldal | Cycling és Monarch program, gyakorlati részletek, képek, videólinkek, partnerek és nyitott eseménynél részvételi szándék. |
| Rólunk | Küldetés, a két fejezet kapcsolata és együttműködési felhívás. |
| Kapcsolat és adatkezelés | Partneri megkeresés, Instagram-linkek, végleges szervezői és adatkezelési adatok. |

## Jelentkezés és kapcsolat

A részvételi űrlap eseményenként csak e-mail-címet kér. Az egész napra vonatkozó részvételi szándékot rögzíti. Nincs helyfoglalás, fizetés, létszámkorlát vagy önálló lemondási felület. Ugyanaz az e-mail ugyanarra az eseményre egy rekordot eredményez. A visszaigazoló levél világosan ismerteti a jelentkezés természetét.

Dátum nélküli, múltbeli vagy lezárt eseménynél az űrlap nem jelenik meg. A jelentkezési címeket az esemény után 30 nappal törölni kell. Hírlevél nincs, a jelentkezés nem ad marketinghozzájárulást.

A partneri űrlap nevet, e-mailt, együttműködési típust és üzenetet kér. A közösségi kapcsolatok: [Solaris Cycling](https://www.instagram.com/solaris.cycling/) és [Solaris Monarch](https://www.instagram.com/solaris.monarch/).

## Szerkesztés és üzemeltetés

React és TypeScript, mobilos felület, webre optimalizált arculati elemek. Sites tárhely, szerveroldali végpontok, D1 adatbázis, R2 képtárolás és külön tranzakciós e-mail-szolgáltatás.

A meghívott 1–2 szervező egy adminfelületen kezel eseményt, szöveget, partnert, képet, videólinket, jóváhagyott idézetet, jelentkezést és megkeresést. Belépés e-mailes egyszeri kóddal, szerveroldali jogosultságellenőrzéssel. A tartalmi modell előkészíti a második nyelvet, az induló felület magyar.

A nyilvános indulást saját domain, kapcsolati e-mail, végleges adatkezelő és tájékoztató, jóváhagyott tartalom és média, működő levélküldés, valamint napi adattörlési időzítő előzi meg. Ezek rendezéséig az oldal privát előnézet.
