/* =========================
   SCROLL ANIMATIONS
========================= */

const observer = new IntersectionObserver((entries) => {

    entries.forEach((entry) => {

        if(entry.isIntersecting){

            entry.target.classList.add("show");

        }

    });

}, {
    threshold: 0.1
});

document.querySelectorAll(".fade-up")
.forEach((el) => observer.observe(el));


/* =========================
   ACTIVE NAV TABS
========================= */

const tabs =
document.querySelectorAll(".tab");

tabs.forEach((tab) => {

    tab.addEventListener("click", () => {

        tabs.forEach((t) =>
            t.classList.remove("active")
        );

        tab.classList.add("active");

    });

});


/* =========================
   GOOGLE SHEETS UPDATES
========================= */

async function loadUpdates(){

    const container =
    document.getElementById("events-container");

    try{

        const response = await fetch(
        "https://docs.google.com/spreadsheets/d/e/2PACX-1vR5RuaHWBn_YylV0jvB7U6SevGSk9ayuiT1VO0M3uZ3rv4RCqcZrm333buUutaXExySMm5yHBT2KRAy/pub?output=csv"
        );

        const csv =
        await response.text();

        const rows =
        csv.trim().split("\n").slice(1);

        container.innerHTML = "";

        rows.forEach((row) => {

            if(!row.trim()) return;

            const columns =
            row.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g);

            if(!columns) return;

            const clean =
            columns.map(col =>
                col.replace(/^"|"$/g, "").trim()
            );

            const title =
            clean[0] || "";

            const description =
            clean[1] || "";

            const image =
            clean[2] || "";

            if(title){

                const card = `

                <div class="event-card fade-up">

                    ${image ? `
                    <img
                    src="${image}"
                    class="update-image"
                    alt="${title}">
                    ` : ""}

                    <h3>${title}</h3>

                    <p>${description}</p>

                </div>

                `;

                container.innerHTML += card;

            }

        });

        document.querySelectorAll(".fade-up")
        .forEach((el) => observer.observe(el));

    }

    catch(error){

        console.error(error);

        container.innerHTML = `

        <div class="event-card">

            <h3>Unable To Load Updates</h3>

            <p>
            Please try again later.
            </p>

        </div>

        `;

    }

}

loadUpdates();


/* =========================
   GRADE CALCULATOR
========================= */

const categoriesContainer =
document.getElementById("categories");

const nextCategorySelect =
document.getElementById("next-category");

const finalGradeText =
document.getElementById("final-grade");

const predictedGradeText =
document.getElementById("predicted-grade");


function createCategory(){

    const row =
    document.createElement("div");

    row.className = "grade-row";

    row.innerHTML = `

        <input
        type="text"
        class="category-name"
        placeholder="Category Name">

        <div class="fraction-group">

            <input
            type="number"
            class="earned-points"
            placeholder="Earned">

            <span>/</span>

            <input
            type="number"
            class="total-points"
            placeholder="Total">

        </div>

        <input
        type="number"
        class="category-weight"
        placeholder="Weight %">

    `;

    categoriesContainer.appendChild(row);

    updateCategoryDropdown();

    row.querySelectorAll("input")
    .forEach((input) => {

        input.addEventListener(
            "input",
            calculateGrade
        );

        input.addEventListener(
            "input",
            updateCategoryDropdown
        );

    });

}

document.getElementById("add-category")
.addEventListener("click", () => {

    createCategory();

});


function calculateGrade(){

    const rows =
    document.querySelectorAll(".grade-row");

    let total =
    0;

    let totalWeight =
    0;

    rows.forEach((row) => {

        const earned =
        parseFloat(
            row.querySelector(".earned-points").value
        ) || 0;

        const totalPoints =
        parseFloat(
            row.querySelector(".total-points").value
        ) || 0;

        const weight =
        parseFloat(
            row.querySelector(".category-weight").value
        ) || 0;

        if(totalPoints > 0){

            const average =
            (earned / totalPoints) * 100;

            total +=
            average * (weight / 100);

            totalWeight += weight;

        }

    });

    if(totalWeight > 0){

        finalGradeText.textContent =
        total.toFixed(2) + "%";

    }

    else{

        finalGradeText.textContent =
        "0%";

    }

}

function updateCategoryDropdown(){

    const names =
    document.querySelectorAll(".category-name");

    nextCategorySelect.innerHTML = "";

    names.forEach((input, index) => {

        const option =
        document.createElement("option");

        option.value =
        index;

        option.textContent =
        input.value || `Category ${index + 1}`;

        nextCategorySelect.appendChild(option);

    });

}


/* =========================
   PREDICTED GRADE
========================= */

document.getElementById("predict-btn")
.addEventListener("click", () => {

    const rows =
    document.querySelectorAll(".grade-row");

    const selected =
    parseInt(nextCategorySelect.value);

    const nextEarned =
    parseFloat(
        document.getElementById("next-earned").value
    ) || 0;

    const nextTotal =
    parseFloat(
        document.getElementById("next-total").value
    ) || 0;

    let total =
    0;

    let totalWeight =
    0;

    rows.forEach((row, index) => {

        let earned =
        parseFloat(
            row.querySelector(".earned-points").value
        ) || 0;

        let totalPoints =
        parseFloat(
            row.querySelector(".total-points").value
        ) || 0;

        const weight =
        parseFloat(
            row.querySelector(".category-weight").value
        ) || 0;

        if(index === selected){

            earned += nextEarned;
            totalPoints += nextTotal;

        }

        if(totalPoints > 0){

            const avg =
            (earned / totalPoints) * 100;

            total +=
            avg * (weight / 100);

            totalWeight += weight;

        }

    });

    if(totalWeight > 0){

        predictedGradeText.textContent =
        total.toFixed(2) + "%";

    }

    else{

        predictedGradeText.textContent =
        "0%";

    }

});


/* =========================
   DEFAULT CATEGORY
========================= */

createCategory();


/* =========================
   STUDENT GUIDE DROPDOWNS
========================= */

const guideHeaders =
document.querySelectorAll(".guide-header");

guideHeaders.forEach((header) => {

    header.addEventListener("click", () => {

        const card =
        header.parentElement;

        card.classList.toggle("open");

    });

});


/* =========================
   COURSE SEARCH
========================= */

const courseSearch =
document.getElementById("course-search");

if(courseSearch){

    courseSearch.addEventListener("input", () => {

        const value =
        courseSearch.value.toLowerCase();

        const cards =
        document.querySelectorAll(".guide-card");

        cards.forEach((card) => {

            const text =
            card.textContent.toLowerCase();

            if(text.includes(value)){

                card.style.display = "block";

            }

            else{

                card.style.display = "none";

            }

        });

    });

}
