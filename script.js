document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('orderForm');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (validateForm()) {
            alert('Formuläret är giltigt! Beställningen har skickats.');
            form.reset();
        }
    });
});

function validateForm() {
    clearErrors();
    let isValid = true;

    const participantsInput = document.getElementById('participants');
    const vegInput = document.getElementById('vegetarian');
    const veganInput = document.getElementById('vegan');
    
    const confInput = document.getElementById('conferenceDate');
    const delInput = document.getElementById('deliveryDate');

    const participants = parseAndValidateInteger(participantsInput);
    const veg = parseAndValidateInteger(vegInput);
    const vegan = parseAndValidateInteger(veganInput);

    if (participants === null || veg === null || vegan === null) {
        showError('mealError', 'Alla fält för måltider måste fyllas i med icke-negativa heltal.', [participantsInput, vegInput, veganInput]);
        isValid = false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const confDate = parseDate(confInput.value);
    const delDate = parseDate(delInput.value);

    let dateHasIndividualError = false;

    if (!confDate || !delDate) {
        showError('dateError', 'Vänligen ange giltiga datum.', [confInput, delInput]);
        isValid = false;
        dateHasIndividualError = true;
    } else {
        if (confDate <= today) {
            markInvalid(confInput);
            isValid = false;
            dateHasIndividualError = true;
        }
        if (delDate <= today) {
            markInvalid(delInput);
            isValid = false;
            dateHasIndividualError = true;
        }
        if (dateHasIndividualError) {
            showError('dateError', 'Både konferens- och leveransdatum måste ligga i framtiden.');
        }
    }

    if (isValid && participants !== null && veg !== null && vegan !== null) {
        const totalPortions = veg + vegan;
        if (totalPortions > participants) {
            const diff = totalPortions - participants;
            showError(
                'mealError', 
                `Portionerna (${totalPortions}) är fler än antalet deltagare (${participants}). Minska vegetariska eller veganska portioner med minst ${diff}.`, 
                [participantsInput, vegInput, veganInput]
            );
            isValid = false;
        }
    }

    if (isValid && !dateHasIndividualError) {
        const diffTime = confDate - delDate;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0 || diffDays > 1) {
            showError(
                'dateError', 
                'Leveransdatum måste vara samma datum som konferens eller dagen innan.', 
                [confInput, delInput]
            );
            isValid = false;
        }
    }

    return isValid;
}

function parseAndValidateInteger(inputElement) {
    const value = inputElement.value.trim();
    if (value === '' || !/^\d+$/.test(value)) {
        markInvalid(inputElement);
        return null;
    }
    const num = parseInt(value, 10);
    if (num < 0) {
        markInvalid(inputElement);
        return null;
    }
    return num;
}

function parseDate(dateString) {
    if (!dateString) return null;
    const date = new Date(dateString);
    date.setHours(0, 0, 0, 0);
    return date;
}

function markInvalid(inputElement) {
    inputElement.classList.add('is-invalid');
}

function showError(containerId, message, inputElements = []) {
    const errorBox = document.getElementById(containerId);
    errorBox.innerHTML = `⟐ ${message}`;
    errorBox.classList.remove('hidden');

    inputElements.forEach(input => {
        if (input) markInvalid(input);
    });
}

function clearErrors() {
    document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
    document.querySelectorAll('.messages').forEach(el => {
        el.classList.add('hidden');
        el.textContent = '';
    });
}