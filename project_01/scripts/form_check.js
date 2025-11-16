const textarea = document.getElementById("message");
const emailInput = document.getElementById("email");
const emailErrorDiv = document.getElementById('email-err');
const charCount = document.getElementById("char-count");
const popup = document.getElementById('popup-confirm');
const closeBtn = document.getElementById('closePopup');
const submitBtn = document.getElementById('form-submit')
const MAX_TEXTAREA_LEN = 200;


function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

textarea.addEventListener("input", () => {
  const remaining = MAX_TEXTAREA_LEN - textarea.value.length;
  charCount.textContent = `Maximum 200 characters (${remaining} remaining)`;
  if (remaining == 0) {
    charCount.style.color = "red";
  } else if (remaining < 20) charCount.style.color = "yellow";
});

emailInput.addEventListener("input", (e) => {
  e.preventDefault();
    if (!validateEmail(emailInput.value)) {
        emailErrorDiv.textContent = "Invalid Email Address!";
        emailErrorDiv.style.color = "red";
    }
    else emailErrorDiv.textContent= ""
});


submitBtn.addEventListener('click', (e) => {
  const form = document.getElementById("contact-form");
  e.preventDefault();  
  if (!form.checkValidity() || !validateEmail(emailInput.value)){
      form.reportValidity(); 
  }
  else {
    popup.classList.add('show');  
  }
});

closeBtn.addEventListener('click', () => {
    popup.classList.remove('show');
});

popup.addEventListener('click', (e) => {
    if (e.target === popup) {
        popup.classList.remove('show');
    }
});
