"use strict";

const form = document.getElementById("tattoo-booking-form");

const steps = Array.from(
    document.querySelectorAll(".form-step")
);

const previousButton =
    document.getElementById("previous-button");

const nextButton =
    document.getElementById("next-button");

const submitButton =
    document.getElementById("submit-button");

const progressFill =
    document.getElementById("progress-fill");

const stepLabel =
    document.getElementById("step-label");

const stepName =
    document.getElementById("step-name");

const confirmationModal =
    document.getElementById("confirmation-modal");

const reviewSummary =
    document.getElementById("review-summary");

let currentStep = 0;

/*
|--------------------------------------------------------------------------
| Step navigation
|--------------------------------------------------------------------------
*/

function displayStep() {
    steps.forEach((step, index) => {
        step.classList.toggle(
            "active",
            index === currentStep
        );
    });

    const stepNumber = currentStep + 1;

    progressFill.style.width =
        `${(stepNumber / steps.length) * 100}%`;

    stepLabel.textContent =
        `Step ${stepNumber} of ${steps.length}`;

    stepName.textContent =
        steps[currentStep].dataset.name;

    previousButton.disabled =
        currentStep === 0;

    if (currentStep === steps.length - 1) {
        nextButton.style.display = "none";
        submitButton.style.display = "block";

        buildReview();
    } else {
        nextButton.style.display = "block";
        submitButton.style.display = "none";
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

/*
|--------------------------------------------------------------------------
| Validation
|--------------------------------------------------------------------------
*/

function validateCurrentStep() {
    const currentSection = steps[currentStep];

    const requiredFields =
        currentSection.querySelectorAll(
            "input[required], select[required], textarea[required]"
        );

    for (const field of requiredFields) {
        if (!field.checkValidity()) {
            field.reportValidity();
            return false;
        }
    }

    return true;
}

nextButton.addEventListener("click", () => {
    if (!validateCurrentStep()) {
        return;
    }

    if (currentStep < steps.length - 1) {
        currentStep++;
        displayStep();
    }
});

previousButton.addEventListener("click", () => {
    if (currentStep > 0) {
        currentStep--;
        displayStep();
    }
});

/*
|--------------------------------------------------------------------------
| Cover-up conditional field
|--------------------------------------------------------------------------
*/

const coverupRadios =
    document.querySelectorAll(
        'input[name="coverup"]'
    );

const coverupPhotoField =
    document.getElementById(
        "coverup-photo-field"
    );

coverupRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
        if (radio.value === "Yes" && radio.checked) {
            coverupPhotoField.classList.add("visible");
        }

        if (radio.value === "No" && radio.checked) {
            coverupPhotoField.classList.remove("visible");
        }
    });
});

/*
|--------------------------------------------------------------------------
| Review screen
|--------------------------------------------------------------------------
*/

function getCheckedValue(name) {
    const item = document.querySelector(
        `input[name="${name}"]:checked`
    );

    return item ? item.value : "Not provided";
}

function getCheckedValues(name) {
    const items = document.querySelectorAll(
        `input[name="${name}"]:checked`
    );

    const values = Array.from(items).map(
        (item) => item.value
    );

    return values.length
        ? values.join(", ")
        : "Not provided";
}

function getValue(id) {
    const field = document.getElementById(id);

    return field && field.value
        ? field.value
        : "Not provided";
}

function addReviewRow(label, value) {
    const row = document.createElement("div");

    row.className = "review-row";

    row.innerHTML = `
        <div class="review-label">
            ${label}
        </div>

        <div class="review-value">
            ${value}
        </div>
    `;

    reviewSummary.appendChild(row);
}

function buildReview() {
    reviewSummary.innerHTML = "";

    addReviewRow(
        "Client",
        `${getValue("first-name")} ${getValue("last-name")}`
    );

    addReviewRow(
        "Email",
        getValue("email")
    );

    addReviewRow(
        "Phone",
        getValue("phone")
    );

    addReviewRow(
        "Returning Client",
        getCheckedValue("returningClient")
    );

    addReviewRow(
        "Placement",
        getValue("placement")
    );

    addReviewRow(
        "Cover-Up",
        getCheckedValue("coverup")
    );

    addReviewRow(
        "Size",
        `${getValue("height")} H × ${getValue("width")} W`
    );

    addReviewRow(
        "Style",
        getValue("style")
    );

    addReviewRow(
        "Color",
        getCheckedValue("colorPreference")
    );

    addReviewRow(
        "Description",
        getValue("description")
    );

    addReviewRow(
        "Session",
        getCheckedValue("sessionType")
    );

    addReviewRow(
        "Budget",
        getValue("budget")
    );

    addReviewRow(
        "Preferred Days",
        getCheckedValues("preferredDays")
    );

    addReviewRow(
        "Specific Dates",
        getValue("specific-dates")
    );
}

/*
|--------------------------------------------------------------------------
| Demo submission
|--------------------------------------------------------------------------
*/

form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    confirmationModal.classList.add("active");

    confirmationModal.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.classList.add("no-scroll");
});

/*
|--------------------------------------------------------------------------
| Initialize
|--------------------------------------------------------------------------
*/

displayStep();