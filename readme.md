Fantastic 4 - Vina, Humberto, Arian & Karin 

# Tillgänglighetsrapport (HTML & CSS)

## 1. Identifierade tillgänglighetsproblem

* **Brist på semantiska landmärken**: Ursprungskoden använde osemantiska `<div>`-element (`<div class="header">` och `<div class="order-form">`) istället för HTML5-landmärken, vilket försvårade navigeringen för skärmläsare.


* **Avsaknad av struktur och gruppering**: Formuläret saknade ett `<form>`-element samt uppdelning med `<fieldset>` och `<legend>` för logiskt sammanhörande fält.
* **Extremt låg färgkontrast**: Ursprungs-CSS:en använde mycket ljusgrå text (`#b3b3b2`) mot ljus bakgrund (`#f4efe6`/`#fffdf8`) samt rosa text (`#f78484`) mot mörkröd bakgrund (`#7c3030`), vilket understeg WCAG-kraven för läsbarhet.
* **Svårläst typografi**: Valet av seriftypsnittet Georgia i kombination med trång text gjorde sidan svårläst för användare med exempelvis synnedsättning eller dyslexi.
* **Felaktiga datatyper för nummerinmatning**: Fälten för antal deltagare och portioner var angivna som `<input type="text">`, vilket hindrade mobiler från att visa numeriskt tangentbord och saknade inbyggd validering (`min="0"`, `step="1"`).
* **Brister i felåterkoppling och ARIA**: Det saknades tydliga visuella markeringar för ogiltiga fält (`.is-invalid`), ikoner för felmeddelanden samt kopplande ARIA-attribut (`aria-describedby` och `aria-live`).
* **Inline JavaScript (Bruten "Separation of Concerns")**: Knappen för att avbryta innehöll inline `onclick`-logik direkt i HTML-koden istället för att hanteras i skriptfilen.



---

## 2. Hur problemen har åtgärdats

* **Semantisk HTML-struktur**: `<div class="header">` ersattes med `<header>` och formulärområdet kapslades in i ett `<main>`-element och ett korrekt `<form id="orderForm">`.


* **Logisk gruppering med `<fieldset>` och `<legend>**`: Formuläret delades upp i två sektioner (*1. DELTAGARE & MÅLTIDER* samt *2. DATUM & LEVERANS*) med tillhörande förklarande instruktioner (`.fieldset-desc`).
* **Korrekt färgkontrast (WCAG AA/AAA)**:
* Brödtext ändrades till ren svart (`#000000`) mot ljus bakgrund (`#fcfbfa`).
* Sidhuvud och skicka-knapp fick mörkblå bakgrund (`#1c238b`) med vit text (`#ffffff`).
* Input-kanter mörkades till `#767676` för att uppfylla kraven på komponentkontrast.
* Felmeddelanden och ogiltiga fält uppdaterades till en mörkare, mer kontrastrik röd nyans (`#961515`) med anpassad bakgrund tonad i mjukt rött/rosa (`#ffdfe0`).


* **Bytt till sans-serif-typsnitt**: Bytte teckensnitt till `Arial, sans-serif` för maximal läsbarhet på skärm.
* **Anpassade input-fält & JS-begränsning**: Ändrade fälten till `<input type="number" min="0" step="1">` samt lade till en `keydown`-lyssnare i JavaScript som förhindrar inmatning av tecken som inte är siffror eller styr-tangenter.
* **Tydligare felåterkoppling och ARIA-koppling**:
* Felaktiga fält får en tydlig röd kantlinje (`border: 2px solid #961515`).
* Felmeddelanderutor fick en avvikande röd ram, tydlig text (`#961515`) och en tillhörande SVG-ikon (`.error-icon`).
* Fälten kopplades till felrutorna med `aria-describedby` och felmeddelandena uppdaterades med `aria-live="polite"`.


* **Separation av HTML och JavaScript**: Inline-koden `onclick` togs bort från avbryt-knappen och ersattes med ett unikt ID (`id="cancelBtn"`) för att hanteras via eventlyssnare i JavaScript.



---

## 3. Motivation till åtgärdsval

* **Semantik (`<header>`, `<main>`, `<fieldset>`)**: Hjälper skärmläsaranvändare att snabbt navigera mellan sidans landmärken och förstå strukturen samt vilka fält som hör ihop.


* **Färgkontrast & Läsbarhet (WCAG 2.1)**: Tydliga färgkontraster är ett krav för att personer med nedsatt syn eller färgblindhet ska kunna ta till sig innehållet. Användningen av den mörkare röda nyansen `#961515` mot `#ffdfe0` säkerställer god kontrast på felmeddelandena. Sans-serif (Arial) underlättar dessutom avsevärd läsning på skärmar.
* **Användarvänliga nummerfält (`type="number"` + JS-kontroll)**: Underlättar inmatningen på mobila enheter samt säkerställer att ogiltiga tecken (som bokstaven `e`, kommatecken eller minustecken) inte kan matas in av misstag.
* **Tillgänglig felrapportering (`aria-live="polite"`, `aria-describedby`)**: Säkerställer att skärmläsaren läser upp dynamiska felmeddelanden i ett lämpligt skede utan att avbryta användaren olämpligt, samtidigt som seende användare får tydliga visuella indikationer.
* **Separation of Concerns**: Håller HTML till ren struktur och JavaScript till funktionell logik, vilket resulterar i en säkrare, renare och mer lättunderhållen kodbas.