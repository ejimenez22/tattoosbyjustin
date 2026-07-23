"use strict";

const currentYear = document.getElementById("current-year");

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightbox-image");
const lightboxClose = document.getElementById("lightbox-close");

const bookingButton = document.getElementById("demo-booking-button");
const bookingModal = document.getElementById("booking-modal");
const bookingModalClose = document.getElementById("booking-modal-close");

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}

/*
|--------------------------------------------------------------------------
| Portfolio lightbox
|--------------------------------------------------------------------------
*/

document.querySelectorAll(".portfolio-image").forEach((item) => {
    item.addEventListener("click", () => {
        const fullImage = item.dataset.full;

        if (!fullImage) {
            return;
        }

        lightboxImage.src = fullImage;
        lightbox.classList.add("active");
        lightbox.setAttribute("aria-hidden", "false");
        document.body.classList.add("no-scroll");
    });
});

function closeLightbox() {
    lightbox.classList.remove("active");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");

    setTimeout(() => {
        lightboxImage.src = "";
    }, 250);
}

lightboxClose.addEventListener("click", closeLightbox);

lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
        closeLightbox();
    }
});

/*
|--------------------------------------------------------------------------
| FAQ
|--------------------------------------------------------------------------
*/

document.querySelectorAll(".faq-item").forEach((item) => {
    const question = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");

    question.addEventListener("click", () => {
        const isOpen = item.classList.contains("active");

        document.querySelectorAll(".faq-item").forEach((otherItem) => {
            otherItem.classList.remove("active");

            const otherAnswer = otherItem.querySelector(".faq-answer");

            otherAnswer.style.maxHeight = null;
        });

        if (!isOpen) {
            item.classList.add("active");
            answer.style.maxHeight = `${answer.scrollHeight}px`;
        }
    });
});

/*
|--------------------------------------------------------------------------
| Demo booking modal
|--------------------------------------------------------------------------
*/

function closeBookingModal() {
    bookingModal.classList.remove("active");
    bookingModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
}

bookingButton.addEventListener("click", () => {
    bookingModal.classList.add("active");
    bookingModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
});

bookingModalClose.addEventListener("click", closeBookingModal);

bookingModal.addEventListener("click", (event) => {
    if (event.target === bookingModal) {
        closeBookingModal();
    }
});

/*
|--------------------------------------------------------------------------
| Escape key
|--------------------------------------------------------------------------
*/

document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") {
        return;
    }

    if (lightbox.classList.contains("active")) {
        closeLightbox();
    }

    if (bookingModal.classList.contains("active")) {
        closeBookingModal();
    }
});