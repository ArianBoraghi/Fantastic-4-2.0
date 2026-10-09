document.addEventListener("DOMContentLoaded", () => {
  const submitBtn = document.getElementById("submitBtn");

  // Fält
  const participantsInput = document.getElementById("participants");
  const vegetarianInput = document.getElementById("vegetarian");
  const veganInput = document.getElementById("vegan");
  const conferenceDateInput = document.getElementById("conferenceDate");
  const deliveryDateInput = document.getElementById("deliveryDate");

  // Felbehållare
  const portionErrorDiv = document.getElementById("portion-error");
  const dateErrorDiv = document.getElementById("date-error");
  const generalMessagesDiv = document.getElementById("general-messages");

  const allInputs = [
    participantsInput,
    vegetarianInput,
    veganInput,
    conferenceDateInput,
    deliveryDateInput
  ];

  submitBtn.addEventListener("click", () => {
    // 1. Rensa alla tidigare fel
    clearErrors(allInputs, [portionErrorDiv, dateErrorDiv, generalMessagesDiv]);

    let hasErrors = false;

    // --- HJÄLPFUNKTIONER ---
    function isValidNonNegativeInteger(val) {
      if (val === null || val === undefined) return false;
      const trimmed = val.trim();
      if (trimmed === "") return false;
      return /^\d+$/.test(trimmed);
    }

    // --- SEKTION 1: PORTIONSTAL (Individuell + Mellanfält) ---
    const pVal = participantsInput.value;
    const vegVal = vegetarianInput.value;
    const veganVal = veganInput.value;

    let portionErrors = [];

    // Individuell validering
    if (!isValidNonNegativeInteger(pVal)) {
      portionErrors.push("Antal deltagare måste vara ett heltal (0 eller fler).");
      participantsInput.classList.add("input-error");
    }
    if (!isValidNonNegativeInteger(vegVal)) {
      portionErrors.push("Antal vegetariska portioner måste vara ett heltal (0 eller fler).");
      vegetarianInput.classList.add("input-error");
    }
    if (!isValidNonNegativeInteger(veganVal)) {
      portionErrors.push("Antal veganportioner måste vara ett heltal (0 eller fler).");
      veganInput.classList.add("input-error");
    }

    // Mellanfältsvalidering (om alla tal var giltiga)
    if (portionErrors.length === 0) {
      const p = parseInt(pVal, 10);
      const veg = parseInt(vegVal, 10);
      const vegan = parseInt(veganVal, 10);

      if (veg + vegan > p) {
        portionErrors.push(`Portionerna (${veg + vegan}) är fler än antalet deltagare (${p}). Minska vegetariska eller veganska portioner.`);
        vegetarianInput.classList.add("input-error");
        veganInput.classList.add("input-error");
      }
    }

    // Visa fel för Sektion 1 om det finns några
    if (portionErrors.length > 0) {
      showError(portionErrorDiv, portionErrors.join(" "));
      hasErrors = true;
    }


    // --- SEKTION 2: DATUM (Individuell + Mellanfält) ---
    const confStr = conferenceDateInput.value;
    const delivStr = deliveryDateInput.value;

    let dateErrors = [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Individuell validering
    if (!confStr) {
      dateErrors.push("Ange konferensdatum.");
      conferenceDateInput.classList.add("input-error");
    } else {
      const confDate = new Date(confStr);
      if (confDate < today) {
        dateErrors.push("Konferensdatum måste vara i framtiden.");
        conferenceDateInput.classList.add("input-error");
      }
    }

    if (!delivStr) {
      dateErrors.push("Ange leveransdatum.");
      deliveryDateInput.classList.add("input-error");
    } else {
      const delivDate = new Date(delivStr);
      if (delivDate < today) {
        dateErrors.push("Leveransdatum måste vara i framtiden.");
        deliveryDateInput.classList.add("input-error");
      }
    }

    // Mellanfältsvalidering för datum (om båda datum är ifyllda)
    if (dateErrors.length === 0) {
      const confDate = new Date(confStr);
      const delivDate = new Date(delivStr);

      confDate.setHours(0, 0, 0, 0);
      delivDate.setHours(0, 0, 0, 0);

      const dayBeforeConf = new Date(confDate);
      dayBeforeConf.setDate(confDate.getDate() - 1);

      const isSameDay = delivDate.getTime() === confDate.getTime();
      const isDayBefore = delivDate.getTime() === dayBeforeConf.getTime();

      if (!isSameDay && !isDayBefore) {
        dateErrors.push("Leveransdatum måste vara samma datum som konferens eller dagen innan.");
        deliveryDateInput.classList.add("input-error");
      }
    }

    // Visa fel för Sektion 2 om det finns några
    if (dateErrors.length > 0) {
      showError(dateErrorDiv, dateErrors.join(" "));
      hasErrors = true;
    }


    // --- SLUTRESULTAT ---
    if (!hasErrors) {
      generalMessagesDiv.innerHTML = `
        <div class="success-box">
          ✅ Beställningen är giltig och har skickats!
        </div>
      `;
    }
  });

  function clearErrors(inputs, containers) {
    inputs.forEach(input => input.classList.remove("input-error"));
    containers.forEach(container => container.innerHTML = "");
  }

  function showError(container, message) {
    container.innerHTML = `<div class="error-box" role="alert">${message}</div>`;
  }
});