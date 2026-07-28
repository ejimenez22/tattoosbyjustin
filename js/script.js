"use strict";

/*
|--------------------------------------------------------------------------
| Current year
|--------------------------------------------------------------------------
*/

const currentYear = document.getElementById("current-year");

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}

/*
|--------------------------------------------------------------------------
| FAQ accordion
|--------------------------------------------------------------------------
*/

const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");

    question.addEventListener("click", () => {
        const isOpen = item.classList.contains("active");

        faqItems.forEach((otherItem) => {
            const otherQuestion =
                otherItem.querySelector(".faq-question");

            const otherAnswer =
                otherItem.querySelector(".faq-answer");

            otherItem.classList.remove("active");
            otherQuestion.setAttribute("aria-expanded", "false");
            otherAnswer.style.maxHeight = null;
        });

        if (!isOpen) {
            item.classList.add("active");
            question.setAttribute("aria-expanded", "true");
            answer.style.maxHeight = `${answer.scrollHeight}px`;
        }
    });
});

/*
|--------------------------------------------------------------------------
| Portfolio lightbox
|--------------------------------------------------------------------------
*/

const portfolioItems =
    document.querySelectorAll(".portfolio-item");

const portfolioLightbox =
    document.getElementById("portfolio-lightbox");

const lightboxImage =
    document.getElementById("lightbox-image");

const closeLightboxButton =
    document.getElementById("close-lightbox");

function openLightbox(imageUrl) {
    if (!portfolioLightbox || !lightboxImage || !imageUrl) {
        return;
    }

    lightboxImage.src = imageUrl;
    portfolioLightbox.classList.add("active");
    portfolioLightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
}

function closeLightbox() {
    if (!portfolioLightbox || !lightboxImage) {
        return;
    }

    portfolioLightbox.classList.remove("active");
    portfolioLightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");

    setTimeout(() => {
        lightboxImage.src = "";
    }, 250);
}

portfolioItems.forEach((item) => {
    item.addEventListener("click", () => {
        openLightbox(item.dataset.full);
    });
});

if (closeLightboxButton) {
    closeLightboxButton.addEventListener(
        "click",
        closeLightbox
    );
}

if (portfolioLightbox) {
    portfolioLightbox.addEventListener(
        "click",
        (event) => {
            if (event.target === portfolioLightbox) {
                closeLightbox();
            }
        }
    );
}

/*
|--------------------------------------------------------------------------
| Booking modal
|--------------------------------------------------------------------------
*/

const bookingModal =
    document.getElementById("booking-modal");

const openBookingModalButton =
    document.getElementById("open-booking-modal");

const closeBookingModalButton =
    document.getElementById("close-booking-modal");

const confirmBookingModalButton =
    document.getElementById("confirm-booking-modal");

function openBookingModal() {
    if (!bookingModal) {
        return;
    }

    bookingModal.classList.add("active");
    bookingModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
}

function closeBookingModal() {
    if (!bookingModal) {
        return;
    }

    bookingModal.classList.remove("active");
    bookingModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
}

if (openBookingModalButton) {
    openBookingModalButton.addEventListener(
        "click",
        openBookingModal
    );
}

if (closeBookingModalButton) {
    closeBookingModalButton.addEventListener(
        "click",
        closeBookingModal
    );
}

if (confirmBookingModalButton) {
    confirmBookingModalButton.addEventListener(
        "click",
        closeBookingModal
    );
}

if (bookingModal) {
    bookingModal.addEventListener(
        "click",
        (event) => {
            if (event.target === bookingModal) {
                closeBookingModal();
            }
        }
    );
}

/*
|--------------------------------------------------------------------------
| Escape key
|--------------------------------------------------------------------------
*/

document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") {
        return;
    }

    if (
        portfolioLightbox &&
        portfolioLightbox.classList.contains("active")
    ) {
        closeLightbox();
    }

    if (
        bookingModal &&
        bookingModal.classList.contains("active")
    ) {
        closeBookingModal();
    }
});