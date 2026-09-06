-- =============================================================================
-- Volné krídla — FAQ seed data
-- =============================================================================
-- One-time seed: copies the FAQ content that was hardcoded in
-- src/sections/volne-kridla-faq/faq.ts (and shown live on the site before the
-- admin panel existed) into faq_items, so it becomes editable in the admin.
-- Safe to run once against a fresh faq_items table; re-running would create
-- duplicates since there's no natural unique key to upsert on.
-- =============================================================================

insert into public.faq_items (group_key, question, answer, sort_order) values ('tipy', $q$Kliker pri práci s papagájmi 🦜🚀$q$, $a$Používanie klikera pri výcviku papagájov má mnoho výhod, pretože umožňuje efektívnejšiu a presnejšiu komunikáciu medzi tebou a tvojím opereným zverencom. Tu sú hlavné dôvody, prečo ho používať:

1. Presnosť a rýchlosť odmeny

Kliker umožňuje označiť presne ten moment, keď papagáj vykoná správne správanie. To je dôležité, pretože ak by si použil len odmenu (napr. pamlsky), môže dôjsť k oneskoreniu a papagáj nemusí pochopiť, za čo bol odmenený.

2. Jasná komunikácia

Zvuk klilera je vždy rovnaký a jednoznačný, na rozdiel od slovného pochválenia, ktoré môže mať rôzne tóny alebo emócie. Papagáj si rýchlo spojí kliknutie s odmenou a ľahšie pochopí, čo od neho chceš.

3. Zvyšuje motiváciu a rýchlosť učenia

Keď papagáj pochopí princíp klikera, začne sa učiť nové triky rýchlejšie. Vie, že správne správanie vedie ku kliknutiu a následnej odmene, takže sa viac snaží.

4. Obmedzenie nežiaducich zvykov

Keď používaš kliker, môžeš posilňovať iba žiaduce správanie a ignorovať alebo presmerovať nežiaduce správanie. Papagáj si tak zvykne robiť to, čo je správne, aby získal odmenu.

5. Funguje na všetkých papagájov

Nezáleží na tom, či trénuješ malú andulku alebo veľkú aru – klikerový tréning je univerzálny a funguje na všetky druhy papagájov.

Tip: Začni s jednoduchými úlohami, napríklad s privolaním na ruku alebo dotykom zobáka na cieľový predmet. Akonáhle papagáj pochopí princíp klikera, môžeš postupne prechádzať k zložitejším trikom a voľnému letu.$a$, 0);
insert into public.faq_items (group_key, question, answer, sort_order) values ('tipy', $q$Šťastný papagáj aj bez voľného lietania? Určite ÁNO 🦜🌟$q$, $a$Voľné lietanie je skvelé, ale nie každý papagáj musí lietať vonku, aby bol šťastný. Aj v bezpečí domova môže mať plnohodnotný život, ak mu vytvoríme správne podmienky.

✅ Priestranná klietka a výbeh – Papagáj potrebuje dostatok miesta na pohyb, lezenie a naťahovanie krídel. Ideálne je kombinovať klietku s hracou zónou mimo nej.

✅ Stimulujúce prostredie – Hračky, vetvy, laná, hlavolamy a stále nové podnety pomáhajú udržať papagája mentálne aktívneho a šťastného.

✅ Zdravá strava – Pestrá a vyvážená strava je základ zdravého života. Ovocie, zelenina, semienka, orechy a kvalitné granule zabezpečia všetko potrebné.

✅ Sociálny kontakt – Papagáje sú spoločenské tvory, ktoré potrebujú interakciu. Každodenná pozornosť, rozhovory a tréning posilňujú vzťah medzi vtákom a majiteľom.

✅ Možnosť lietať v interiéri – Ak je to bezpečné, umožnite papagájovi pravidelné prelety po miestnosti. Pomáha to udržať ho v dobrej fyzickej kondícii.

Papagáj, ktorý má dostatok pozornosti, podnetov a starostlivosti, môže byť šťastný a spokojný aj bez voľného lietania. Dôležité je vytvoriť mu prostredie, v ktorom sa cíti dobre a bezpečne ❤️$a$, 1);
insert into public.faq_items (group_key, question, answer, sort_order) values ('tipy', $q$Tréning recallu (privolania) 🦜🍀$q$, $a$je dôležitý nie len pre voľnoletcov ale aj pre nevoľnoletcov

Ako trénovať recall krok za krokom:

1. Vytvorenie pozitívneho vzťahu s menom a povelom

🔹 Začni v pokojnom prostredí, kde sa papagáj cíti bezpečne.

🔹 Používaj rovnaké slovo pri privolaní (napr. “Poď sem!”, “Ku mne!” alebo len meno).

🔹 Keď papagáj príde bližšie, okamžite ho odmeň (oblúbená pochúťka, pohladenie alebo pochvala).

2. Krátke vzdialenosti – tréning na ruke alebo v izbe

🔹 Začni na krátke vzdialenosti – pár centimetrov medzi rukami.

🔹 Volaj ho, ukáž mu odmenu a odmeň ho, keď príde.

🔹 Postupne zväčšuj vzdialenosť – najskôr v rámci miestnosti.

3. Tréning v dlhších vzdialenostiach (vo vnútri aj vonku)

🔹 Keď ovláda recall na krátke vzdialenosti, začni ho trénovať cez celú miestnosť.

🔹 Ak si istý, že rozumie povelu, môžeš skúsiť vonku, ale v bezpečnom priestore (voliéra, alebo za použití trakov na lietanie)

🔹 Použi dlhšiu trasu a viaceré zastávky – zavolaj ho z bodu A do bodu B

4. Recall vonku – bezpečné prostredie

🔹 Najprv v kontrolovaných podmienkach – na dvoroch, v sieťovaných voliérách, s postrojom.

🔹 Trénuj v bezpečnej oblasti bez rušivých vplyvov, kde sa cíti komfortne.

🔹 Zlepšuj jeho reakčný čas – odmeň ho len za rýchlu odozvu.

5. Použitie odmien a variabilného posilňovania

🔹 Nie vždy daj jedlo – neskôr stačí len pochvala alebo hra.

🔹 Používaj variabilné odmeny – niekedy väčšia, niekedy menšia odmena, aby zostal motivovaný.

6. Tréning s rušivými vplyvmi

🔹 Po čase vyskúšaj recall v rušnejšom prostredí (viac ľudí, zvuky).

🔹 Trénuj, aj keď je vystresovaný – aby si bol istý, že príde aj v nečakaných situáciách.

➡️ Dôležité tipy:

✅ Buď trpezlivý – niektorým papagájom to trvá dlhšie.

✅ Nikdy ho netrestaj, ak nepriletí – recall musí byť vždy pozitívny zážitok.$a$, 2);
insert into public.faq_items (group_key, question, answer, sort_order) values ('tipy', $q$Ako správne ponúknuť ovocie🦜 🍇$q$, $a$Každý chovateľ sa snaží ponúknuť čo najširšiu škálu ovocia, často pripravuje ovocné šaláty, v ktorých sú rôzne druhy ovocia nakrájané na malé kúsky a zmiešané dohromady. Táto farebná rozmanitosť je atraktívna pre ľudí, a preto sa predpokladá, že sa páči aj vtákom. To však nie je pravda!

Každý papagáj má svoje obľúbené ovocie a bude sa ho snažiť vybrať zo zmesi, pričom zvyšok nechá v miske alebo ho rozhádže po zemi.

Stačilo by sa pozrieť na prírodu, aby sme pochopili, ako papagáje a iné druhy papagájovitých vtákov kombinujú svoju stravu vo voľnej prírode.

Ako sa papagáje kŕmia v prírode?

Zväčša celé kŕdle pristávajú na jednom ovocnom strome a živia sa ním, kým sa všetci nenajedia, potom odletia. Konzumujú iba jeden druh ovocia, pričom ho jedia niekoľko dní, kým nie je úplne spotrebované. Potom musia hľadať nový zdroj potravy.

Podľa ročného obdobia jedia to ovocie, ktoré je práve dostupné, a pokračujú v jeho konzumácii, kým sa zásoby nevyčerpajú.

Ako využiť tento prirodzený spôsob kŕmenia v zajatí?

Je dokázané, že papagáje uprednostňujú jedno konkrétne ovocie, aj keď im ponúkneme rôzne druhy v jednom ovocnom šaláte. Vyberú si obľúbený druh a ostatné ignorujú alebo rozhádžu.

Preto sa odporúča podávať denne len jeden druh ovocia.

• Každý deň iné ovocie, aby sa počas týždňa dosiahla pestrosť v strave.

• Týmto spôsobom sa papagáj môže naučiť akceptovať a obľúbiť si nové druhy ovocia.

• Rovnaký princíp platí aj pre zeleninu.

Záver

Správne kŕmenie papagájov by malo napodobňovať ich prirodzené správanie v prírode. Podávanie potravy v samostatných miskách a ponúkanie iba jedného druhu ovocia denne pomáha zabezpečiť vyváženú stravu a predchádza plytvaniu potravou.$a$, 3);
insert into public.faq_items (group_key, question, answer, sort_order) values ('tipy', $q$Interaktívne kŕmenie ako motivácia🦜👌$q$, $a$Papagáje potrebujú nielen fyzickú aktivitu, ale aj mentálnu stimuláciu! 🧠✨ Využi jedlo na zábavné učenie a posilňovanie ich prirodzených schopností:

🔹 Hlavolamy na jedlo – nech si maškrtu vydobyjú z hračky

🔹 Hľadanie jedla – schovaj odmenu a sleduj, ako ju objavia

🔹 Tréning trikov – točenie, podanie nôžky alebo iné šikovnosti výmenou za obľúbenú pochúťku$a$, 4);
insert into public.faq_items (group_key, question, answer, sort_order) values ('tipy', $q$Papagáje a konzumácia hliny: Prečo to robia? 🦜🤔$q$, $a$Papagáje sú známe svojím zvykom konzumovať hlinu, čo je správanie pozorované u viacerých druhov, najmä v Južnej Amerike. Tento jav, nazývaný geofágia, zaujal mnoho výskumníkov a viedol k viacerým teóriám o jeho príčinách.

Neutralizácia rastlinných toxínov

Jedno z najuznávanejších vysvetlení je, že hlina pomáha papagájom neutralizovať toxíny nachádzajúce sa v niektorých rastlinných potravinách, ktoré konzumujú. Mnohé rastliny produkujú toxické látky ako obranný mechanizmus proti bylinožravcom. Konzumáciou hliny môžu papagáje tieto toxíny viazať, čím sa znižuje ich vstrebávanie a chráni sa tak ich organizmus.

Doplnenie esenciálnych minerálov

Ďalšia teória naznačuje, že hlina poskytuje dôležité minerály, ako sú sodík a vápnik, ktoré môžu v prirodzenej strave papagájov chýbať. Clay licks (steny z hliny) sú často bohaté na tieto minerály a ich konzumácia môže pomôcť pokryť nutričné potreby vtákov.

Zlepšenie trávenia

Hlina môže tiež uľahčiť trávenie tým, že sa viaže na ťažko stráviteľné látky, čím zlepšuje účinnosť vstrebávania živín. Okrem toho môže pôsobiť ako prírodné antacidum, ktoré zmierňuje prípadné tráviace ťažkosti.

Zníženie črevných parazitov

Niektoré štúdie naznačujú, že konzumácia hliny môže pomôcť znížiť prítomnosť črevných parazitov, čím sa zlepšuje celkové zdravie papagájov.

Pozorovania v zajatí

V zajatí bolo zistené, že poskytovanie hliny papagájom môže mať podobné výhody – pomáha pri vyvážení stravy a poskytuje im mentálne obohatenie. Je však dôležité zabezpečiť, aby bola hlina bezpečná na konzumáciu a neobsahovala škodlivé látky.

Záver

Geofágia u papagájov je multifunkčné správanie, ktoré prispieva k ich zdraviu prostredníctvom neutralizácie toxínov, doplnenia minerálov, zlepšenia trávenia a redukcie parazitov.$a$, 5);
insert into public.faq_items (group_key, question, answer, sort_order) values ('tipy', $q$Prečo papagáje toľko plytvajú jedlom? 👇😉$q$, $a$V zajatí patrí medzi najviac diskutované témy otázka: “Prečo moje papagáje plytvajú jedlom?” Prečo hádžu a rozhadzujú potravu okolo seba? Často vyhadzujú viac, než zjedia – niekedy až viac než 80 %jedla.

Toto správanie však nie je obmedzené len na papagáje v zajatí, ale je v nich geneticky zakódované. Takéto správanie sa pozorovalo u všetkých druhov papagájov.

Výskumné údaje pokrývajúce 103 druhov v 17 krajinách, čo predstavuje asi 30 % všetkých papagájích druhov vo voľnej prírode, ukázali, že plytvanie jedlom je bežné. Či už ide o aru arakangu zo Južnej Ameriky, kakadu žltolícího z Austrálie, alebo žaka sivého z Afriky – všetky tieto druhy vyhadzovali až 80 % potravy, ktorú si vzali.

Podľa niektorých ornitológov a vedcov je toto správanie zámerné.

Dáta ukazujú, že papagáje častejšie púšťali nezrelé ovocie ako to zrelé. Tiež sa ukázalo, že hádzanie potravy sa výrazne znížilo počas obdobia hniezdenia, najmä keď mali mláďatá.

Toto správanie môže podporovať ekosystémy. Bolo pozorované, že až 86 druhov zvierat – od mravcov až po dobytok – konzumujú potravu, ktorú papagáje zhodili. Tieto zvieratá následne šíria semená, čím prispievajú k udržiavaniu rovnováhy v prírode.

Prečo to teda papagáje robia?

Zatiaľ neexistuje jednoznačná odpoveď. Ale je potvrdené, že to robia zámerne. Keďže sa to deje naprieč rôznymi regiónmi a druhmi, predpokladá sa, že ide o inštinktívne správanie. Možno nimi niečo ženie k tomu, aby jedlo rozhadzovali, čím zabezpečia, že ďalšia úroda prinesie väčšie a sladšie plody, a šírenie semien im zaistí viac potravy v budúcnosti.

Ich prirodzené prostredie je podporované ich zvykom rozhadzovať jedlo a pomáhať pri šírení semien. Dá sa povedať, že papagáje významne prispievajú k ochrane svojho životného prostredia a zohrávajú kľúčovú úlohu pri ekologickej rovnováhe.

Prečo papagáje toľko plytvajú jedlom?

Často vyhadzujú viac, než zjedia – niekedy až viac než 80 % jedla.

Toto správanie však nie je obmedzené len na papagáje v zajatí, ale je v nich geneticky zakódované

Papagáje pomáhajú prírode tým, že rozhadzujú jedlo a šíria semienka. Aj vďaka tomu chránia svoje prostredie a pomáhajú udržať rovnováhu v prírode.$a$, 6);
insert into public.faq_items (group_key, question, answer, sort_order) values ('tipy', $q$Ako motivovať papagája jedlom? 🫐$q$, $a$1. Vyber správnu odmenu 🫛🥜

• Každý papagáj má iné preferencie. Vyskúšaj rôzne maškrty a sleduj, na ktoré reaguje najviac

2.Používaj odmeny len počas tréningu

• Aby odmena bola motivujúca, nemala by byť bežnou súčasťou denného jedálnička.

• Ak papagáj dostáva obľúbené jedlo kedykoľvek, nebude mať motiváciu pracovať zaň.

• Môžeš mierne obmedziť kŕmenie pred tréningom (nie však hladovať), aby bol viac motivovaný.

3. Okamžitá odmena za správne správanie

• Daj odmenu ihneď, keď papagáj vykoná požadovanú akciu. Čím rýchlejšie príde odmena, tým lepšie si spojí akciu s pozitívnym výsledkom.

• Môžeš použiť aj kliker tréning – klikneš klikrom a hneď na to dáš odmenu, čím si papagáj lepšie uvedomí, za čo ju dostal.

Variabilita a postupné znižovanie odmien

• Ak papagáj už dobre ovláda daný trik, postupne zníž frekvenciu odmien.

• Môžeš ho odmeňovať niekedy jedlom, inokedy pochvalou alebo pohladením.

• Používaj rôzne druhy odmien, aby ho tréning neomrzel.

Nepoužívaj jedlo ako nátlak

• Odmena by mala byť motiváciou, nie manipuláciou. Ak papagáj nie je ochotný spolupracovať, netlač naňho, radšej vyskúšaj iný čas alebo inú stratégiu.

• Ak je papagáj prejedaný alebo vystresovaný, ani obľúbené jedlo ho nemusí motivovať.$a$, 7);
insert into public.faq_items (group_key, question, answer, sort_order) values ('tipy', $q$Čomu sa vyhnúť v domácnosti s papagájom? 🚫$q$, $a$Papagáje sú veľmi citlivé na rôzne látky a predmety, ktoré sú pre ľudí bežné, no pre nich môžu byť nebezpečné až smrteľné. Tu je prehľad vecí, ktoré by sa nemali používať v domácnosti s papagájom:

Nebezpečné látky a produkty:

1. Teflón a iné nepriľnavé povrchy (PTFE/PFOA)

• Pri prehriatí (už nad 240 °C) uvoľňujú toxické výpary, ktoré môžu spôsobiť u papagája náhlu smrť.

• Pozor na panvice, hriankovače, žehličky, rúry, ohrievače.

2. Aerosóly a spreje

• Parfémy, osviežovače vzduchu, čističe, laky na vlasy – všetky môžu spôsobiť problémy s dýchaním alebo otravu.

3. Fajčenie a nikotín

• Cigarety, elektronické cigarety aj pasívne fajčenie sú pre papagája extrémne toxické.

4. Sviečky a vonné tyčinky

• Parfumované alebo parafínové sviečky môžu uvoľňovať výpary škodlivé pre papagájov.

5. Niektoré rastliny

• Jedovaté pre papagáje: napr. monstera, ľalie, azalka, oleander, ficus, tulipány, svokrin jazyk, dracena.

6. Čistiace prostriedky a bielidlá

• Silné chemikálie, amoniak, bielidlo a dezinfekčné prostriedky sú toxické aj vo forme výparov.

7. Esenciálne oleje

• Mnohé oleje (napr. tea tree, eukalyptus, citrusy) sú pre papagáje toxické aj len vdýchnutím.$a$, 8);
insert into public.faq_items (group_key, question, answer, sort_order) values ('tipy', $q$Medzidruhové vzťahy = ľudská ilúzia, =riziko pre papagája 💬🦜$q$, $a$Nechajte papagája žiť s ostatnými papagájmi rovnakého druhu: reč tela je druhovo špecifická.
Predstava, že medzi rôznymi druhmi papagájov možno vytvoriť harmonické “priateľstvá” alebo pevné partnerské väzby, je vo väčšine prípadov len ľudskou ilúziou.

V prírode sa odlišné druhy papagájov stretávajú len zriedkavo a ich vzájomná interakcia je obmedzená, najmä počas hniezdneho obdobia alebo pri súťažení o potravu. V zajatí sa však často nútene dostávajú do tesného kontaktu, čo pre nich môže predstavovať riziko – od vzniku konfliktov a stresu až po fyzické zranenia. Každý druh má svoje špecifické správanie, spôsob komunikácie a “osobný priestor”, a to, čo my vnímame ako priateľskú interakciu, môže byť v skutočnosti varovný signál alebo začiatok agresie. Preto je dôležité pozerať sa na vzťahy medzi papagájmi z ich pohľadu, nie z nášho, a zabezpečiť im podmienky, v ktorých sa budú cítiť bezpečne a prirodzene.

Pretože rešpektovať túto skutočnosť znamená dať mu to, čo naozaj potrebuje, nie to, čo si myslíme, že ho robí šťastným.$a$, 9);
insert into public.faq_items (group_key, question, answer, sort_order) values ('tipy', $q$Kŕmenie peletami – áno či nie?🤔$q$, $a$Kŕmenie domácich papagájov je témou veľkého záujmu medzi nadšencami aj chovateľmi. V posledných desaťročiach vyvolalo zavedenie peliet ako súčasti stravy diskusie o ich prínosoch a možných obmedzeniach.
Výhody peliet v kŕmení papagájov

• Vyvážená strava: Pelety sú formulované tak, aby poskytovali všetky základné živiny potrebné pre vyváženú diétu, čím sa znižuje riziko bežných nutričných nedostatkov pri strave založenej výhradne na semenách.

Nevýhody a kritika používania peliet

• Neprirodzená potrava: Niektorí tvrdia, že pelety predstavujú “cudzí” druh potravy pre papagáje, vzdialený ich prirodzenej strave. To vyvoláva otázky o ich prijateľnosti a psychickej pohode vtákov kŕmených výhradne peletami.

Vývoj výživových odporúčaní

Spočiatku boli pelety propagované ako úplná náhrada tradičnej stravy papagájov. Postupom času sa však ukázalo, že strava výlučne založená na peletách nemusí úplne pokrývať nutričné no najmä behaviorálne potreby všetkých druhov. V súčasnosti mnohí odborníci odporúčajú, aby pelety tvorili približne 30 % celkovej stravy, doplnené čerstvým ovocím, zeleninou a inými prírodnými potravinami.

A ak pelety, tak určite siahnúť iba po kvalitných peletách bez umelých farbív, aróm a konzervantov.$a$, 10);

insert into public.faq_items (group_key, question, answer, sort_order) values ('otazky', $q$Je voľné lietanie bezpečné? Aké sú možné riziká?$q$, $a$Lietanie vonku s papagájmi prináša riziká, ktoré treba mať na pamäti:

Počasie: náhle zmeny a silný vietor môžu byť pre nedostatočne trénovaného papagája nebezpečné.

Úrazy: Pri lietaní sa môže zraniť napríklad pri náraze do skla, elektrických vedení alebo iných prekážok avšak tento druh rizika je najmenej pravdepodobný, aj vďaka správnemu výberu miesta na tréning voľného lietania.

Strety s inými zvieratami: dravce alebo pohyb iných vtákov predstavujú riziko, najmä pre menších papagájov. Ary vo všeobecnosti vzbudzujú rešpekt jednak svojou veľkosťou, sfarbením ale aj svojim hlasným prejavom.

Útek/únikový reflex: Rovnako ako všetci vtáci majú aj papagáje inštinktívny únikový reflex, ktorý ich chráni aby sa vo voľnej prírode nestali korisťou. Pretože sa jedna o reflexný pohyb, nemôže ho papagáj príliš ovplyvňovať. Únikový reflex spôsobuje, že sa papagáj okamžite vznesie do vzduchu akonáhle sa cíti ohrozený iným tvorom alebo pohybom a čo najrýchlejšie letí preč od zdroja nebezpečia až tam, kde sa cíti bezpečne.

Tieto riziká sami nezmiznú no správnym a postupným tréningom ich dokážeme výrazne znížiť. V rámci letového kurzu VOĽNÉ KRÍDLA vysvetľujem postupy aj riziká, učím recall, bezpečný výber miest a časov letu. Preto je tréning správna voľba — dá vám istotu, naučí papagája bezpečnému správaniu a výrazne zníži riziká pri voľnom lete. Chcete začať bezpečne? Kontaktujte ma a prejdeme to krok za krokom.$a$, 0);
insert into public.faq_items (group_key, question, answer, sort_order) values ('otazky', $q$Dá sa trénovať aj papagáj, ktorý nie je zvyknutý na traky?$q$, $a$Z môjho pohľadu je trénovanie s pomocou trakov najbezpečnejšie. Avšak áno, dá sa trénovať aj bez trakov no tento tréning je o niečo náročnejší a začína ešte v čase dokrmovania papagája čiže je založený na silnom pute medzi vami a papagájom.$a$, 1);
insert into public.faq_items (group_key, question, answer, sort_order) values ('otazky', $q$V akom veku je najlepšie začať s tréningom? Dá sa naučiť na voľný let aj starši papagáj?$q$, $a$Ak začínate s papagájom vo veku v akom by prirodzene lietal vo voľnej prírode, je to oveľa jednoduchšie (papagáj prirodzene chce lietať a nepotrebuje k tomu veľké povzbudzovanie).

Pri starších papagájoch najčastejšie strávime väčšinu času odstraňovaním súčasných zlozvykov a tympádom to môže trvať o niečo dlhšie ako u mláďat.

Avšak dobrá správa je, že na veku vášho papagája až tak nezáleží, pretože všetky papagáje sú schopné učiť sa v akomkoľvek veku avšak podmienka je, že si musí nechať nasadiť traky na lietanie, čo u starších papagájoch môže byť problém.$a$, 2);
