document.addEventListener("DOMContentLoaded", () => {
  const submitBtn = document.getElementById("submitBtn");
  const messagesDiv = document.getElementById("messages");

  // Input-fält
  const participantsInput = document.getElementById("participants");
  const vegetarianInput = document.getElementById("vegetarian");
  const veganInput = document.getElementById("vegan");
  const deliveryDateInput = document.getElementById("deliveryDate");
  const conferenceDateInput = document.getElementById("conferenceDate");

  const allInputs = [
    participantsInput,
    vegetarianInput,
    veganInput,
    deliveryDateInput,
    conferenceDateInput
  ];

  submitBtn.addEventListener("click", (e) => {
    e.preventDefault(); // Förhindra att formuläret skickas automatiskt
    
    // Nollställ tidigare felmeddelanden och röda kanter
    clearErrors(allInputs, messagesDiv);

    // 1. Del 1: Individuell validering per fält
    const individualErrors = validateIndividualFields({
      participants: participantsInput,
      vegetarian: vegetarianInput,
      vegan: veganInput,
      deliveryDate: deliveryDateInput,
      conferenceDate: conferenceDateInput
    });

    // 2. Del 2: Mellanfältsvalidering (beroenden mellan fält)
    // Utförs bara om de berörda fälten i sig har giltigt format
    let crossFieldErrors = [];
    if (individualErrors.length === 0) {
      crossFieldErrors = validateCrossFields({
        participants: participantsInput,
        vegetarian: vegetarianInput,
        vegan: veganInput,
        deliveryDate: deliveryDateInput,
        conferenceDate: conferenceDateInput
      });
    }

    // Samla alla fel
    const allErrors = [...individualErrors, ...crossFieldErrors];

    // 3. Hantera visning av fel eller framgång
    if (allErrors.length > 0) {
      displayErrors(allErrors, messagesDiv);
    } else {
      displaySuccess("Formuläret är giltigt! Din beställning har skickats.", messagesDiv);
    }
  });
});

/* ==========================================================================
   DEL 1: INDIVIDUELL VALIDERING (PER FÄLT)
   ========================================================================== */
function validateIndividualFields(fields) {
  const errors = [];

  // Hjälpfunktion: Kontrollerar om värdet är ett icke-negativt heltal (≥ 0)
  // Stoppar "5apa", "3,5", tomma strängar och negativa tal.
  function isValidNonNegativeInteger(val) {
    if (val === null || val === undefined) return false;
    const trimmed = val.trim();
    if (trimmed === "") return false;
    return /^\d+$/.test(trimmed);
  }

  // Hjälpfunktion: Kontrollerar om datumet är i framtiden (relativt till idag)
  function isFutureDate(dateStr) {
    if (!dateStr) return false;
    const inputDate = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Jämför enbart datum, inte klockslag
    return inputDate > today;
  }

  // 1. Portionstal (Deltagare, Vegetariskt, Veganskt)
  const numberFields = [
    { element: fields.participants, label: "Antal deltagare" },
    { element: fields.vegetarian, label: "Antal vegetariska portioner" },
    { element: fields.vegan, label: "Antal veganportioner" }
  ];

  numberFields.forEach(field => {
    if (!isValidNonNegativeInteger(field.element.value)) {
      errors.push(`${field.label} måste vara ett giltigt heltal (0 eller högre) och får inte vara tomt.`);
      field.element.classList.add("input-error");
    }
  });

  // 2. Datum i framtiden (Leveransdatum & Konferensdatum)
  if (!isFutureDate(fields.deliveryDate.value)) {
    errors.push("Leveransdatum måste vara ett datum i framtiden.");
    fields.deliveryDate.classList.add("input-error");
  }

  if (!isFutureDate(fields.conferenceDate.value)) {
    errors.push("Konferensdatum måste vara ett datum i framtiden.");
    fields.conferenceDate.classList.add("input-error");
  }

  return errors;
}

/* ==========================================================================
   DEL 2: MELLANFÄLTSVALIDERING (BEROENDEN MELLAN FÄLT)
   ========================================================================== */
function validateCrossFields(fields) {
  const errors = [];

  const participants = parseInt(fields.participants.value, 10);
  const vegetarian = parseInt(fields.vegetarian.value, 10);
  const vegan = parseInt(fields.vegan.value, 10);

  // Regler 1: Summan av vegetariska och veganska portioner får inte överstiga totala antalet deltagare.
  const totalSpecialPortions = vegetarian + vegan;
  if (totalSpecialPortions > participants) {
    errors.push(`Summan av vegetariska (${vegetarian}) och veganska (${vegan}) portioner (${totalSpecialPortions}) överstiger det totala antalet deltagare (${participants}).`);
    fields.vegetarian.classList.add("input-error");
    fields.vegan.classList.add("input-error");
  }

  // Regler 2: Leveransdatum måste vara samma dag som konferensdagen eller dagen före.
  // (Aldrig tidigare än dagen före och aldrig efter konferensdagen).
  const confDate = new Date(fields.conferenceDate.value);
  const delivDate = new Date(fields.deliveryDate.value);

  // Nollställ tid så jämförelsen blir exakt per dygn
  confDate.setHours(0, 0, 0, 0);
  delivDate.setHours(0, 0, 0, 0);

  // Beräkna dagen före konferensen
  const dayBeforeConf = new Date(confDate);
  dayBeforeConf.setDate(confDate.getDate() - 1);

  // Giltigt om leveransdatum är exakt lika med konferensdatum ELLER dagen före
  const isSameDay = delivDate.getTime() === confDate.getTime();
  const isDayBefore = delivDate.getTime() === dayBeforeConf.getTime();

  if (!isSameDay && !isDayBefore) {
    errors.push("Leveransdatum måste vara samma dag som konferensdagen eller dagen före.");
    fields.deliveryDate.classList.add("input-error");
  }

  return errors;
}

/* ==========================================================================
   HJÄLPFUNKTIONER FÖR VISNING / RENSNING
   ========================================================================== */
function clearErrors(inputs, container) {
  container.innerHTML = "";
  inputs.forEach(input => input.classList.remove("input-error"));
}

function displayErrors(errors, container) {
  errors.forEach(msg => {
    const box = document.createElement("div");
    box.className = "error-box";
    box.setAttribute("role", "alert"); // För skärmläsare (Del 3)
    box.textContent = msg;
    container.appendChild(box);
  });
}

function displaySuccess(message, container) {
  const box = document.createElement("div");
  box.className = "success-box";
  box.setAttribute("role", "status"); // För skärmläsare (Del 3)
  box.textContent = message;
  container.appendChild(box);
}