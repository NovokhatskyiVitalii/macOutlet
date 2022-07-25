let slideIndex = 1;

const plusSlide = () => {
    showSlides((slideIndex += 1));
};

const minusSlide = () => {
    showSlides((slideIndex -= 1));
};

const currentSlide = (n) => {
    showSlides((slideIndex = n));
};

const showSlides = (n) => {
    const slides = document.getElementsByClassName("item");
    const dots = document.getElementsByClassName("dot");
    if (n > slides.length) {
        slideIndex = 1;
    }
    if (n < 1) {
        slideIndex = slides.length;
    }
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    for (let i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace("active", "");
    }
    slides[slideIndex - 1].style.display = "block";
    dots[slideIndex - 1].className += " active";
};
showSlides(slideIndex);