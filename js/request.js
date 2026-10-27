"use strict";

const REQUEST_API_URL =
    "https://script.google.com/macros/s/AKfycbwTbkoSVIQM04i2mFwB1DReewr8Y5N_sPIYJESEccdK7FeV8wvgk_NcTytE6sdnGJYn1A/exec";

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
    const currentSection =
        steps[currentStep];

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
| Placement conditional field
|--------------------------------------------------------------------------
*/

const placementSelect =
    document.getElementById("placement");

const otherPlacementField =
    document.getElementById("other-placement-field");

const otherPlacementInput =
    document.getElementById("other-placement");


placementSelect.addEventListener("change", () => {
    const isOther =
        placementSelect.value === "Other";

    otherPlacementField.classList.toggle(
        "visible",
        isOther
    );

    otherPlacementInput.required = isOther;

    if (!isOther) {
        otherPlacementInput.value = "";
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

const coverupPhotoInput =
    document.getElementById(
        "coverup-photo"
    );


coverupRadios.forEach((radio) => {
    radio.addEventListener("change", () => {

        if (radio.value === "Yes" && radio.checked) {
            coverupPhotoField.classList.add("visible");
        }

        if (radio.value === "No" && radio.checked) {
            coverupPhotoField.classList.remove("visible");

            if (coverupPhotoInput) {
                coverupPhotoInput.value = "";
            }
        }
    });
});


/*
|--------------------------------------------------------------------------
| Review screen helpers
|--------------------------------------------------------------------------
*/

function getCheckedValue(name) {
    const item =
        document.querySelector(
            `input[name="${name}"]:checked`
        );

    return item
        ? item.value
        : "Not provided";
}


function getValue(id) {
    const field =
        document.getElementById(id);

    return field && field.value
        ? field.value
        : "Not provided";
}


function getPlacementValue() {
    const placement =
        getValue("placement");

    if (placement === "Other") {
        return getValue(
            "other-placement"
        );
    }

    return placement;
}


function addReviewRow(label, value) {
    const row =
        document.createElement("div");

    row.className =
        "review-row";

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


/*
|--------------------------------------------------------------------------
| Build review screen
|--------------------------------------------------------------------------
*/

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
        getPlacementValue()
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
}


/*
|--------------------------------------------------------------------------
| File upload helpers
|--------------------------------------------------------------------------
*/

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            const result = reader.result;
            const base64 = result.split(",")[1];

            resolve({
                name: file.name,
                type: file.type,
                data: base64
            });
        };

        reader.onerror = reject;

        reader.readAsDataURL(file);
    });
}


async function addFileToBody(body, inputId, fieldName) {
    const input = document.getElementById(inputId);

    if (!input || !input.files.length) {
        return;
    }

    const file = input.files[0];

    /*
     * Keep uploads reasonable for Apps Script.
     * 5 MB max per image.
     */
    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
        throw new Error(
            `${file.name} is larger than 5 MB. Please choose a smaller image.`
        );
    }

    const encoded = await fileToBase64(file);

    body.append(
        `${fieldName}FileName`,
        encoded.name
    );

    body.append(
        `${fieldName}FileType`,
        encoded.type
    );

    body.append(
        `${fieldName}FileData`,
        encoded.data
    );
}


/*
|--------------------------------------------------------------------------
| Request submission
|--------------------------------------------------------------------------
*/

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!validateCurrentStep()) {
        return;
    }

    submitButton.disabled = true;

    const originalButtonText =
        submitButton.textContent;

    submitButton.textContent =
        "Uploading & Submitting...";

    try {

        const formData =
            new FormData(form);

        const body =
            new URLSearchParams();

        /*
         * Add normal text fields.
         */
        for (const [key, value] of formData.entries()) {

            if (value instanceof File) {
                continue;
            }

            body.append(
                key,
                value
            );
        }


        /*
         * Add image uploads.
         */

        await addFileToBody(
            body,
            "coverup-photo",
            "coverupPhoto"
        );

        await addFileToBody(
            body,
            "placement-photo",
            "placementPhoto"
        );

        await addFileToBody(
            body,
            "reference-one",
            "referenceOne"
        );

        await addFileToBody(
            body,
            "reference-two",
            "referenceTwo"
        );

        await addFileToBody(
            body,
            "reference-three",
            "referenceThree"
        );


        /*
         * Send everything to Apps Script.
         */

        await fetch(
            REQUEST_API_URL,
            {
                method: "POST",
                mode: "no-cors",
                body: body
            }
        );


        /*
         * Show confirmation.
         */

        confirmationModal.classList.add(
            "active"
        );

        confirmationModal.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.classList.add(
            "no-scroll"
        );

    } catch (error) {

        console.error(
            "Request submission failed:",
            error
        );

        alert(
            error.message ||
            "Something went wrong while submitting your request. Please try again."
        );

    } finally {

        submitButton.disabled = false;

        submitButton.textContent =
            originalButtonText;
    }
});


/*
|--------------------------------------------------------------------------
| Initialize
|--------------------------------------------------------------------------
*/

displayStep();