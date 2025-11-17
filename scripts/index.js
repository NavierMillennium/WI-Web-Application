function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

setCookie("username", "John Doe", 7);


const slides = document.querySelectorAll(".slider-data");
let index = 0;

function showSlide(i) {
    slides.forEach(slide => slide.classList.remove("active"));
    slides[i].classList.add("active");
}


document.getElementById("next").addEventListener("click", () => {
    index = (index + 1) % slides.length;
    showSlide(index);
});

document.getElementById("prev").addEventListener("click", () => {
    index = (index - 1 + slides.length) % slides.length;
    showSlide(index);
});


showSlide(index);


setInterval(() => {
    index = (index + 1) % slides.length;
    showSlide(index);
}, 5000);