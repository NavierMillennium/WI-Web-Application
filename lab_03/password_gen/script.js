
let minLen = document.getElementById('min-len');
let maxLen = document.getElementById('max-len');
let checkUpperCase = document.getElementById('uppercase');
let checkSpecialChar = document.getElementById('special-char');

let btnGen = document.getElementById('btn-gen');

btnGen.addEventListener('click', () => {
    const minLength = Number(minLen.value);
    const maxLength = Number(maxLen.value);

    // Validation
    if (!minLength || !maxLength) {
        alert("Wypełnij oba pola minimalnej i maksymalnej długości!");
        return; 
    }

    if (maxLength > 1000) {
        alert("Przekroczono maksymalną dozwoloną liczbę znaków");
        return; 
    }

    if (minLength > maxLength) {
        alert("Minimalna długość nie może być większa niż maksymalna!");
        return;
    }

    if (minLength < 1 || maxLength < 1) {
        alert("Wartości dla pól 'Minimalna/maksymalna długość hasła' nie mogą być miniejsze niż 1");
        return;
    }

    const letters = "abcdefghijklmnopqrstuvwxyz";
    const lettersUppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const digits = "0123456789";
    const specialChars = "!@#$%^&*()_+-=[]{}|;:',.<>/?`~\"\\";

    allChars = letters + digits;
    allChars = checkUpperCase.checked ? allChars+lettersUppercase: allChars
    allChars = checkSpecialChar.checked ? allChars + specialChars : allChars

    let password = "";

    const length = minLength + Math.floor(Math.random()*(maxLength - minLength))
    for (let i = 0; i < length; i++) {
        password += allChars[Math.floor(Math.random() * allChars.length)];
    }
    window.alert(password)
})