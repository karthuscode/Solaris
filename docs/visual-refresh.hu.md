# Vizuális finomítás — GitHub-verzió

Ez a változat a GitHub-repóban dokumentált, de a frissített weboldal még nem került fel a privát Sites-előnézetbe. Helyben az `npm run dev` paranccsal, általában a `http://127.0.0.1:5173/` címen tesztelhető.

## Mit érdemes megnézni?

1. A kezdőlapon a nap görgetés nélkül, körülbelül három másodperc alatt kel fel, majd a Cycling fejezet alatt lenyugszik. Ezután a Monarch szöveg marad látható. A nyitány megállítható, folytatható és újraindítható; a lapról elgörgetve vagy másik böngészőlapra váltva megáll.
2. A további kezdőoldali címek soronként tárulnak fel; a leírások rövid késéssel követik őket.
3. A partnerlogók lassan körbejárnak. Egérrel vagy érintéssel meglökhetők; a nyílvezérlők és a billentyűzet bal/jobb nyilai is működnek.
4. Az Események oldalon a hamarosan készülő alkalom és a Solaris Days #1 kártyája saját, visszafogott fénymotívumot kapott. A Rólunk és az esemény részletoldalának nyitánya ugyanezt az arculatot használja.
5. Csökkentett mozgás beállításnál a nyitány statikus, a címsorok azonnal olvashatók, a partnersor pedig álló és vízszintesen görgethető.

## Partnerforrás

A kilenc logó a helyben kapott Solaris Style Guide „Partners” részéből származik: CSTIT, Funbike, Beats in the Park, Kolumbán Optika, ECSET, feelmkr, MiMi, WATCHTHIS WORKS és Pekengo. Az ECSET szimbóluma és felirata egyetlen logó. Athos az első esemény nyilvános leírásában szerepel, de a PDF-ben nincs hozzá logó, ezért tipografált névként jelenik meg.

A kinyerés forrása a helyi `Solaris_StyleGuide.pdf`; ez a PDF nincs a nyilvános repóban. Az optimalizált képek a `public/partners/` mappában vannak. A kinyerő szkript az eredeti PDF birtokában ismét futtatható. A partnerek első alkalommal vázlatként kerülnek a privát adatbázisba; a nyilvános megjelenítéshez továbbra is szervezői jóváhagyás kell. Athos említésének forrása a [Visit Harghita eseményleírása](https://www.visitharghita.ro/hu/events/solaris-days-1-critical-mass-x-matin).

## Ellenőrzés

TypeScript-ellenőrzés, ESLint és Worker-build sikeres. A helyi felületet asztali és keskeny mobilnézetben ellenőriztük, beleértve a logók betöltését, az eseménykártyák tördelését, az időzített nyitány három fejezetét, a szünet/folytatás és újraindítás vezérlőit, az egérrel húzás utáni automatikus mozgást és a billentyűzetes léptetést. Safariban a nyitó oldal és az újraindított első fejezet megjelent. A csökkentett mozgás működése kódszinten és CSS-ben ellenőrzött; kézi operációsrendszer-szintű kapcsolópróba a tulajdonosi teszt része.
