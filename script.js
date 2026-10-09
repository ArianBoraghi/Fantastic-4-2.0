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
    let mealErrors = [];
    let dateErrors = [];
    let mealInputsWithError = [];
    let dateInputsWithError = [];

    const participantsInput = document.getElementById('participants');
    const vegInput = document.getElementById('vegetarian');
    const veganInput = document.getElementById('vegan');
    
    const confInput = document.getElementById('conferenceDate');
    const delInput = document.getElementById('deliveryDate');

    const participants = parseAndValidateInteger(participantsInput);
    const veg = parseAndValidateInteger(vegInput);
    const vegan = parseAndValidateInteger(veganInput);

    if (participants === null || veg === null || vegan === null) {
        mealErrors.push('Alla fält för måltider måste fyllas i med icke-negativa heltal.');
        mealInputsWithError.push(participantsInput, vegInput, veganInput);
        isValid = false;
    }

    if (participants !== null && veg !== null && vegan !== null) {
        const totalPortions = veg + vegan;
        
        if (totalPortions > participants) {
            const diff = totalPortions - participants;
            mealErrors.push(`Portionerna (${totalPortions}) är fler än antalet deltagare (${participants}). Minska vegetariska eller veganska portioner med minst ${diff}.`);
            mealInputsWithError.push(participantsInput, vegInput, veganInput);
            isValid = false;
        } else if (participants > totalPortions) {
            const diff = participants - totalPortions;
            mealErrors.push(`Antalet deltagare (${participants}) är fler än antalet portioner (${totalPortions}). Öka vegetariska eller veganska portioner med minst ${diff}.`);
            mealInputsWithError.push(participantsInput, vegInput, veganInput);
            isValid = false;
        }
    }

    if (mealErrors.length > 0) {
        showError('mealError', mealErrors.join('<br>'), mealInputsWithError);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const confDate = parseDate(confInput.value);
    const delDate = parseDate(delInput.value);

    let dateHasIndividualError = false;

    if (!confDate || !delDate) {
        dateErrors.push('Vänligen ange giltiga datum.');
        dateInputsWithError.push(confInput, delInput);
        isValid = false;
        dateHasIndividualError = true;
    } else {
        if (confDate <= today) {
            dateInputsWithError.push(confInput);
            isValid = false;
            dateHasIndividualError = true;
        }
        if (delDate <= today) {
            dateInputsWithError.push(delInput);
            isValid = false;
            dateHasIndividualError = true;
        }
        if (dateHasIndividualError) {
            dateErrors.push('Både konferens- och leveransdatum måste ligga i framtiden.');
        }
    }

    if (!dateHasIndividualError) {
        const diffTime = confDate - delDate;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0 || diffDays > 1) {
            dateErrors.push('Leveransdatum måste vara samma datum som konferens eller dagen innan.');
            dateInputsWithError.push(confInput, delInput);
            isValid = false;
        }
    }

    if (dateErrors.length > 0) {
        showError('dateError', dateErrors.join('<br>'), dateInputsWithError);
    }

    return isValid;
}

function parseAndValidateInteger(inputElement) {
    const value = inputElement.value.trim();
    if (value === '' || !/^\d+$/.test(value)) {
        return null;
    }
    const num = parseInt(value, 10);
    if (num < 0) {
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
    if (inputElement) {
        inputElement.classList.add('is-invalid');
    }
}

function showError(containerId, message, inputElements = []) {
    const errorBox = document.getElementById(containerId);
    
    const svgIcon = `
        <span class="error-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 12l10 10 10-10L12 2zm0 3.8l6.2 6.2-6.2 6.2L5.8 12 12 5.8z"/>
                <path d="M11 8h2v5h-2zm0 6h2v2h-2z"/>
            </svg>
        </span>`;

    errorBox.innerHTML = `${svgIcon} <div>${message}</div>`;
    errorBox.classList.remove('hidden');

    inputElements.forEach(input => {
        markInvalid(input);
    });
}

function clearErrors() {
    document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
    document.querySelectorAll('.messages').forEach(el => {
        el.classList.add('hidden');
        el.innerHTML = '';
    });
}