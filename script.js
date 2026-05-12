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
   STUDENT GUIDE COURSES
========================= */

const courseList =
document.getElementById("course-list");

const courseDetailPanel =
document.getElementById("course-detail-panel");

const typeFilter =
document.getElementById("course-type-filter");

const departmentFilter =
document.getElementById("course-department-filter");

const gradeFilter =
document.getElementById("course-grade-filter");

const courseSearchInput =
document.getElementById("course-search-input");

const guideTabs =
document.querySelectorAll(".guide-tab");

const guidePanels =
document.querySelectorAll(".guide-panel");

let allCourses = [];
let selectedCourseIndex = 0;

const courseSheetUrl =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vTraauIam0LG5jmQ6wRg9crrAGhDZEAwPU2E6kaiCN02afrLOuJop4SJK7JgptYRdcdeBQ_AgOuOl40/pub?output=csv";

function parseCSV(csv){

    const rows = [];
    let currentRow = [];
    let currentValue = "";
    let insideQuotes = false;

    for(let i = 0; i < csv.length; i++){

        const char = csv[i];
        const nextChar = csv[i + 1];

        if(char === '"' && insideQuotes && nextChar === '"'){
            currentValue += '"';
            i++;
        }

        else if(char === '"'){
            insideQuotes = !insideQuotes;
        }

        else if(char === "," && !insideQuotes){
            currentRow.push(currentValue.trim());
            currentValue = "";
        }

        else if((char === "\n" || char === "\r") && !insideQuotes){

            if(currentValue || currentRow.length){
                currentRow.push(currentValue.trim());
                rows.push(currentRow);
                currentRow = [];
                currentValue = "";
            }

            if(char === "\r" && nextChar === "\n"){
                i++;
            }

        }

        else{
            currentValue += char;
        }

    }

    if(currentValue || currentRow.length){
        currentRow.push(currentValue.trim());
        rows.push(currentRow);
    }

    return rows;

}

async function loadStudentGuideCourses(){

    try{

        const response =
        await fetch(courseSheetUrl);

        const csv =
        await response.text();

        const rows =
        parseCSV(csv).slice(1);

        allCourses = rows
        .filter(row => row.length >= 2 && row[1])
        .map((row, index) => {

            return {
                originalIndex:index,
                type:row[0] || "Other",
                title:row[1] || "Untitled Course",
                description:row[2] || "No description available yet.",
                rating:row[3] || "4.3/5",
                reviews:row[4] || "Student reviews",
                extraInfo:row[5] || "",
                department:row[6] || getDepartmentFromCourse(row[1] || "", row[0] || ""),
                gradeLevel:row[7] || "9-12",
                prerequisites:row[8] || "None listed",
                credits:row[9] || "1.0",
                topics:row[10] || ""
            };

        });

        populateGuideFilters();
        renderCourseList();

        if(allCourses.length > 0){
            renderCourseDetails(allCourses[0]);
        }

    }

    catch(error){

        console.error(error);

        courseList.innerHTML = `

        <div class="course-list-card">
            <div class="course-list-main">
                <h3>Unable To Load Courses</h3>
                <p>Please try again later.</p>
            </div>
        </div>

        `;

        courseDetailPanel.innerHTML = `

        <div class="coming-soon-card">
            <h3>Courses Unavailable</h3>
            <p>The course guide could not be loaded.</p>
        </div>

        `;

    }

}

function getDepartmentFromCourse(courseName, type){

    const name =
    courseName.toLowerCase();

    if(name.includes("english") || name.includes("writing") || name.includes("journalism") || name.includes("literature")){
        return "English";
    }

    if(name.includes("algebra") || name.includes("geometry") || name.includes("calculus") || name.includes("statistics") || name.includes("math") || name.includes("trigonometry")){
        return "Math";
    }

    if(name.includes("science") || name.includes("biology") || name.includes("chemistry") || name.includes("marine") || name.includes("anatomy") || name.includes("forensic") || name.includes("earth")){
        return "Science";
    }

    if(name.includes("history") || name.includes("government") || name.includes("economics") || name.includes("psychology") || name.includes("geography") || name.includes("law")){
        return "Social Studies";
    }

    if(name.includes("spanish")){
        return "World Languages";
    }

    if(name.includes("art") || name.includes("band") || name.includes("chorus") || name.includes("orchestra") || name.includes("music") || name.includes("photo") || name.includes("design") || name.includes("video")){
        return "Fine Arts";
    }

    if(name.includes("computer") || name.includes("digital") || name.includes("technology")){
        return "Technology";
    }

    if(name.includes("business") || name.includes("accounting") || name.includes("finance")){
        return "Business";
    }

    if(name.includes("healthcare") || name.includes("patient") || name.includes("medical")){
        return "Medical";
    }

    if(name.includes("hope") || name.includes("sports") || name.includes("training") || name.includes("basketball") || name.includes("tennis") || name.includes("volleyball")){
        return "Physical Education";
    }

    if(type === "NJROTC"){
        return "NJROTC";
    }

    return "Other";

}

function populateGuideFilters(){

    populateSelect(typeFilter, [
        "All",
        ...new Set(allCourses.map(course => course.type))
    ]);

    populateSelect(departmentFilter, [
        "All",
        ...new Set(allCourses.map(course => course.department))
    ]);

    populateSelect(gradeFilter, [
        "All",
        ...new Set(allCourses.map(course => course.gradeLevel))
    ]);

}

function populateSelect(select, options){

    select.innerHTML = "";

    options.forEach((optionText) => {

        const option =
        document.createElement("option");

        option.value = optionText;

        option.textContent =
        optionText === "All"
        ? select.id.includes("type")
            ? "All Types"
            : select.id.includes("department")
                ? "All Departments"
                : "All Grades"
        : optionText;

        select.appendChild(option);

    });

}

function getFilteredCourses(){

    const searchTerm =
    courseSearchInput.value.toLowerCase().trim();

    return allCourses.filter((course) => {

        const matchesType =
        typeFilter.value === "All"
        || course.type === typeFilter.value;

        const matchesDepartment =
        departmentFilter.value === "All"
        || course.department === departmentFilter.value;

        const matchesGrade =
        gradeFilter.value === "All"
        || course.gradeLevel === gradeFilter.value;

        const searchableText =
        `
        ${course.type}
        ${course.title}
        ${course.description}
        ${course.rating}
        ${course.reviews}
        ${course.extraInfo}
        ${course.department}
        ${course.gradeLevel}
        ${course.prerequisites}
        ${course.credits}
        ${course.topics}
        `.toLowerCase();

        const matchesSearch =
        searchableText.includes(searchTerm);

        return matchesType && matchesDepartment && matchesGrade && matchesSearch;

    });

}

function renderCourseList(){

    const filteredCourses =
    getFilteredCourses();

    courseList.innerHTML = "";

    if(filteredCourses.length === 0){

        courseList.innerHTML = `

        <div class="course-list-card">
            <div class="course-list-main">
                <h3>No Courses Found</h3>
                <p>Try changing the filters or search term.</p>
            </div>
        </div>

        `;

        courseDetailPanel.innerHTML = `

        <div class="coming-soon-card">
            <h3>No Course Selected</h3>
            <p>Select a course to view more information.</p>
        </div>

        `;

        return;

    }

    filteredCourses.forEach((course) => {

        const card =
        document.createElement("div");

        card.className =
        `course-list-card ${course.originalIndex === selectedCourseIndex ? "active" : ""}`;

        card.innerHTML = `

            <div class="course-icon">
                ${getCourseIcon(course.department)}
            </div>

            <div class="course-list-main">

                <h3>${course.title}</h3>

                <div class="course-tags">
                    <span class="course-tag">${course.type}</span>
                    <span class="course-tag">${course.department}</span>
                </div>

            </div>

            <div class="course-grade">
                Grades: ${course.gradeLevel}
            </div>

            <div class="course-rating-small">
                ${formatRating(course.rating)} ★
                <span>${course.reviews}</span>
            </div>

        `;

        card.addEventListener("click", () => {

            selectedCourseIndex = course.originalIndex;

            renderCourseList();
            renderCourseDetails(course);

        });

        courseList.appendChild(card);

    });

}

function renderCourseDetails(course){

    const topics =
    course.topics
    ? course.topics.split(",").map(topic => topic.trim()).filter(Boolean)
    : generateTopics(course);

    courseDetailPanel.innerHTML = `

        <div class="detail-top">

            <div class="detail-title-wrap">

                <div class="course-icon">
                    ${getCourseIcon(course.department)}
                </div>

                <div>
                    <h3>${course.title}</h3>

                    <div class="course-tags">
                        <span class="course-tag">${course.type}</span>
                        <span class="course-tag">${course.department}</span>
                    </div>
                </div>

            </div>

            <div class="detail-rating">
                ${formatRating(course.rating)} ★
                <span>${course.reviews}</span>
            </div>

        </div>

        <p class="detail-description">
            ${course.description}
        </p>

        <div class="detail-info-grid">

            <div class="detail-info-item">
                <span>📅</span>
                <strong>Grade Level</strong>
                <p>${course.gradeLevel}</p>
            </div>

            <div class="detail-info-item">
                <span>📌</span>
                <strong>Prerequisites</strong>
                <p>${course.prerequisites}</p>
            </div>

            <div class="detail-info-item">
                <span>📚</span>
                <strong>Credits</strong>
                <p>${course.credits}</p>
            </div>

            <div class="detail-info-item">
                <span>🏛️</span>
                <strong>Department</strong>
                <p>${course.department}</p>
            </div>

        </div>

        <div class="detail-topics">

            <h4>Topics Covered</h4>

            <div class="topic-list">

                ${topics.map(topic => `
                    <div class="topic-item">${topic}</div>
                `).join("")}

            </div>

        </div>

        <div class="rating-breakdown">

            <h4>Student Interest</h4>

            ${generateRatingBars(course.rating)}

        </div>

    `;

}

function formatRating(rating){

    return String(rating)
    .replace("/5", "")
    .trim();

}

function generateRatingBars(rating){

    const numeric =
    parseFloat(formatRating(rating)) || 4.3;

    const five =
    Math.min(85, Math.max(45, Math.round(numeric * 14)));

    const four =
    Math.max(8, Math.round((5 - numeric) * 18));

    const three = 8;
    const two = 3;
    const one = 1;

    const rows = [
        ["5", five],
        ["4", four],
        ["3", three],
        ["2", two],
        ["1", one]
    ];

    return rows.map(row => `

        <div class="rating-row">

            <span>${row[0]} ★</span>

            <div class="rating-bar">
                <div class="rating-fill" style="width:${row[1]}%"></div>
            </div>

            <span>${row[1]}%</span>

        </div>

    `).join("");

}

function generateTopics(course){

    if(course.department === "English"){
        return ["Reading", "Writing", "Analysis", "Communication"];
    }

    if(course.department === "Math"){
        return ["Problem Solving", "Equations", "Functions", "Applications"];
    }

    if(course.department === "Science"){
        return ["Lab Skills", "Scientific Thinking", "Analysis", "Research"];
    }

    if(course.department === "Social Studies"){
        return ["History", "Government", "Culture", "Critical Thinking"];
    }

    if(course.department === "Fine Arts"){
        return ["Creativity", "Performance", "Design", "Technique"];
    }

    if(course.department === "Technology"){
        return ["Digital Skills", "Software", "Problem Solving", "Projects"];
    }

    return ["Course Skills", "Projects", "Participation", "Career Readiness"];

}

function getCourseIcon(department){

    if(department === "English") return "✎";
    if(department === "Math") return "∑";
    if(department === "Science") return "⚗";
    if(department === "Social Studies") return "🌐";
    if(department === "World Languages") return "🗣";
    if(department === "Fine Arts") return "🎨";
    if(department === "Technology") return "</>";
    if(department === "Business") return "$";
    if(department === "Medical") return "+";
    if(department === "Physical Education") return "🏃";
    if(department === "NJROTC") return "⚓";

    return "📘";

}

[typeFilter, departmentFilter, gradeFilter].forEach((filter) => {

    filter.addEventListener("change", () => {

        const filteredCourses =
        getFilteredCourses();

        if(filteredCourses.length > 0){
            selectedCourseIndex = filteredCourses[0].originalIndex;
            renderCourseDetails(filteredCourses[0]);
        }

        renderCourseList();

    });

});

courseSearchInput.addEventListener("input", () => {

    const filteredCourses =
    getFilteredCourses();

    if(filteredCourses.length > 0){
        selectedCourseIndex = filteredCourses[0].originalIndex;
        renderCourseDetails(filteredCourses[0]);
    }

    renderCourseList();

});

guideTabs.forEach((tab) => {

    tab.addEventListener("click", () => {

        const selectedTab =
        tab.dataset.guideTab;

        guideTabs.forEach((button) => {
            button.classList.remove("active");
        });

        guidePanels.forEach((panel) => {
            panel.classList.remove("active");
        });

        tab.classList.add("active");

        document
        .getElementById(`${selectedTab}-guide-panel`)
        .classList.add("active");

    });

});

loadStudentGuideCourses();

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
