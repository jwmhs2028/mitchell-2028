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

const tabs = document.querySelectorAll(".tab");

tabs.forEach((tab) => {

    tab.addEventListener("click", () => {

        tabs.forEach((t) => {
            t.classList.remove("active");
        });

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

            const columns = row.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g);

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
   COURSES DIRECTORY
========================= */

const coursesContainer =
document.getElementById("courses-container");

const courseFilters =
document.getElementById("course-filters");

const courseSearch =
document.getElementById("course-search");

let allCourses = [];
let activeType = "All";

async function loadCourses(){

    try{

        const response = await fetch(
        "https://docs.google.com/spreadsheets/d/e/2PACX-1vTraauIam0LG5jmQ6wRg9crrAGhDZEAwPU2E6kaiCN02afrLOuJop4SJK7JgptYRdcdeBQ_AgOuOl40/pub?output=csv"
        );

        const csv =
        await response.text();

        const rows =
        csv.trim().split("\n").slice(1);

        allCourses = [];

        rows.forEach((row) => {

            if(!row.trim()) return;

            const columns =
            row.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g);

            if(!columns) return;

            const clean = columns.map(col =>
                col.replace(/^"|"$/g, "").trim()
            );

            const type = clean[0] || "Other";
            const title = clean[1] || "Untitled";
            const description = clean[2] || "";
            const rating = clean[3] || "Not rated";
            const extraInfo = clean[4] || "";

            allCourses.push({
                type,
                title,
                description,
                rating,
                extraInfo
            });

        });

        generateCourseFilters();
        renderCourses();

    }

    catch(error){

        console.error(error);

        coursesContainer.innerHTML = `

        <div class="directory-card">

            <h3>Unable To Load Courses</h3>

            <p>
            Please try again later.
            </p>

        </div>

        `;

    }

}

function generateCourseFilters(){

    const uniqueTypes = [
        "All",
        ...new Set(allCourses.map(course => course.type))
    ];

    courseFilters.innerHTML = "";

    uniqueTypes.forEach((type) => {

        const button =
        document.createElement("button");

        button.className =
        `filter-btn ${type === "All" ? "active" : ""}`;

        button.textContent = type;

        button.addEventListener("click", () => {

            activeType = type;

            document
            .querySelectorAll(".filter-btn")
            .forEach((btn) => {
                btn.classList.remove("active");
            });

            button.classList.add("active");

            renderCourses();

        });

        courseFilters.appendChild(button);

    });

}

function renderCourses(){

    const searchTerm =
    courseSearch.value.toLowerCase();

    coursesContainer.innerHTML = "";

    const filteredCourses =
    allCourses.filter((course) => {

        const matchesType =
        activeType === "All"
        || course.type === activeType;

        const matchesSearch =
        course.title.toLowerCase().includes(searchTerm)
        || course.description.toLowerCase().includes(searchTerm)
        || course.type.toLowerCase().includes(searchTerm)
        || course.rating.toLowerCase().includes(searchTerm)
        || course.extraInfo.toLowerCase().includes(searchTerm);

        return matchesType && matchesSearch;

    });

    if(filteredCourses.length === 0){

        coursesContainer.innerHTML = `

        <div class="directory-card">

            <h3>No Courses Found</h3>

            <p>
            Try adjusting your search.
            </p>

        </div>

        `;

        return;

    }

    filteredCourses.forEach((course) => {

        const card = `

        <div class="directory-card fade-up">

            <span class="directory-type">
                ${course.type}
            </span>

            <h3>${course.title}</h3>

            <p>${course.description}</p>

            <div class="course-meta">

                <span class="course-pill">
                    ⭐ ${course.rating}
                </span>

                ${course.extraInfo ? `
                <span class="course-pill">
                    ${course.extraInfo}
                </span>
                ` : ""}

            </div>

        </div>

        `;

        coursesContainer.innerHTML += card;

    });

    document.querySelectorAll(".fade-up")
    .forEach((el) => observer.observe(el));

}

courseSearch.addEventListener("input", renderCourses);

loadCourses();

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

function createCategoryRow(name = "", weight = "", earned = "", total = ""){

    const row = document.createElement("div");

    row.className = "grade-row";

    row.innerHTML = `

        <input
        type="text"
        class="cat-name"
        placeholder="Category Name"
        value="${name}">

        <input
        type="number"
        class="cat-weight"
        placeholder="Weight %"
        value="${weight}">

        <div class="fraction-group">

            <input
            type="number"
            class="cat-earned"
            placeholder="Points Earned"
            value="${earned}">

            <span>/</span>

            <input
            type="number"
            class="cat-total"
            placeholder="Total Points"
            value="${total}">

        </div>

    `;

    categoriesContainer.appendChild(row);

    attachListeners();
    updateCategoryDropdown();
    calculateGrade();

}

function attachListeners(){

    const inputs =
    document.querySelectorAll(
        ".cat-name, .cat-weight, .cat-earned, .cat-total"
    );

    inputs.forEach((input) => {

        input.removeEventListener("input", calculateGrade);

        input.addEventListener("input", () => {

            calculateGrade();
            updateCategoryDropdown();

        });

    });

}

function calculateGrade(){

    const rows =
    document.querySelectorAll(".grade-row");

    let weightedTotal = 0;
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

        const total =
        parseFloat(
            row.querySelector(".cat-total").value
        ) || 0;

        if(total > 0 && weight > 0){

            const percent =
            (earned / total) * 100;

            weightedTotal +=
            percent * (weight / 100);

            totalWeight += weight;

        }

    });

    let grade = 0;

    if(totalWeight > 0){

        grade =
        (weightedTotal / totalWeight) * 100;

    }

    finalGrade.textContent =
    `${grade.toFixed(2)}%`;

}

function updateCategoryDropdown(){

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

/* =========================
   PREDICT NEXT ASSIGNMENT
========================= */

document
.getElementById("predict-btn")
.addEventListener("click", () => {

    const rows =
    document.querySelectorAll(".grade-row");

    let weightedTotal = 0;
    let totalWeight = 0;

    const selectedIndex =
    parseInt(nextCategory.value);

    const nextEarned =
    parseFloat(
        document.getElementById("next-earned").value
    ) || 0;

    const nextTotal =
    parseFloat(
        document.getElementById("next-total").value
    ) || 0;

    rows.forEach((row, index) => {

        const weight =
        parseFloat(
            row.querySelector(".cat-weight").value
        ) || 0;

        let earned =
        parseFloat(
            row.querySelector(".cat-earned").value
        ) || 0;

        let total =
        parseFloat(
            row.querySelector(".cat-total").value
        ) || 0;

        if(index === selectedIndex){

            earned += nextEarned;
            total += nextTotal;

        }

        if(total > 0 && weight > 0){

            const percent =
            (earned / total) * 100;

            weightedTotal +=
            percent * (weight / 100);

            totalWeight += weight;

        }

    });

    let predicted = 0;

    if(totalWeight > 0){

        predicted =
        (weightedTotal / totalWeight) * 100;

    }

    predictedGrade.textContent =
    `${predicted.toFixed(2)}%`;

});

/* =========================
   ADD CATEGORY BUTTON
========================= */

addCategoryBtn.addEventListener("click", () => {

    createCategoryRow();

});

/* =========================
   DEFAULT ROWS
========================= */

createCategoryRow();
createCategoryRow();
