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

            const clean = columns.map(col =>
                col.replace(/^"|"$/g, "").trim()
            );

            const title = clean[0] || "";
            const description = clean[1] || "";
            const image = clean[2] || "";

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
   AUTO ACTIVE TAB ON SCROLL
========================= */

const sections = document.querySelectorAll("section, header");

window.addEventListener("scroll", () => {

    let current = "";

    sections.forEach((section) => {

        const sectionTop = section.offsetTop - 150;
        const sectionHeight = section.offsetHeight;

        if(pageYOffset >= sectionTop &&
           pageYOffset < sectionTop + sectionHeight){

            current = section.getAttribute("id");
        }

    });

    tabs.forEach((tab) => {

        tab.classList.remove("active");

        if(tab.getAttribute("href") === `#${current}`){

            tab.classList.add("active");

        }

    });

});

/* =========================
   GRADE CALCULATOR
========================= */

const categoriesContainer =
document.getElementById("categories");

const addCategoryBtn =
document.getElementById("add-category");

const finalGrade =
document.getElementById("final-grade");

const nextCategory =
document.getElementById("next-category");

const predictedGrade =
document.getElementById("predicted-grade");

function createCategory(){

    const row =
    document.createElement("div");

    row.className = "grade-row";

    row.innerHTML = `

        <input
        type="text"
        placeholder="Category Name"
        class="cat-name">

        <input
        type="number"
        placeholder="Weight %"
        class="cat-weight">

        <div class="fraction-group">

            <input
            type="number"
            placeholder="Points Earned"
            class="cat-earned">

            <span>/</span>

            <input
            type="number"
            placeholder="Total Points"
            class="cat-total">

        </div>

    `;

    categoriesContainer.appendChild(row);

    updateDropdown();

    row.querySelectorAll("input")
    .forEach(input => {

        input.addEventListener(
            "input",
            calculateGrade
        );

        input.addEventListener(
            "input",
            updateDropdown
        );

    });

}

function calculateGrade(){

    const rows =
    document.querySelectorAll(".grade-row");

    let total = 0;
    let totalWeight = 0;

    rows.forEach((row) => {

        const weight =
        parseFloat(
        row.querySelector(".cat-weight").value
        ) || 0;

        const earned =
        parseFloat(
        row.querySelector(".cat-earned").value
        ) || 0;

        const totalPoints =
        parseFloat(
        row.querySelector(".cat-total").value
        ) || 0;

        let grade = 0;

        if(totalPoints > 0){

            grade =
            (earned / totalPoints) * 100;

        }

        total += grade * weight;

        totalWeight += weight;

    });

    const result =
    totalWeight > 0
    ? (total / totalWeight).toFixed(2)
    : 0;

    finalGrade.textContent =
    `${result}%`;
}

function updateDropdown(){

    nextCategory.innerHTML = "";

    const names =
    document.querySelectorAll(".cat-name");

    names.forEach((input, index) => {

        const option =
        document.createElement("option");

        option.value = index;

        option.textContent =
        input.value || `Category ${index + 1}`;

        nextCategory.appendChild(option);

    });

}

document.getElementById("predict-btn")
.addEventListener("click", () => {

    const rows =
    document.querySelectorAll(".grade-row");

    const assignmentGrade =
    parseFloat(
    document.getElementById("next-grade").value
    ) || 0;

    const selected =
    parseInt(nextCategory.value);

    let total = 0;
    let totalWeight = 0;

    rows.forEach((row, index) => {

        const weight =
        parseFloat(
        row.querySelector(".cat-weight").value
        ) || 0;

        const earned =
        parseFloat(
        row.querySelector(".cat-earned").value
        ) || 0;

        const totalPoints =
        parseFloat(
        row.querySelector(".cat-total").value
        ) || 0;

        let grade = 0;

        if(totalPoints > 0){

            grade =
            (earned / totalPoints) * 100;

        }

        if(index === selected){

            grade =
            (grade + assignmentGrade) / 2;

        }

        total += grade * weight;

        totalWeight += weight;

    });

    const predicted =
    totalWeight > 0
    ? (total / totalWeight).toFixed(2)
    : 0;

    predictedGrade.textContent =
    `${predicted}%`;

});
addCategoryBtn.addEventListener(
    "click",
    createCategory
);

createCategory();
createCategory();
