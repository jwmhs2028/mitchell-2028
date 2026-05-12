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

    if(!container){
        return;
    }

    try{

        const response = await fetch(
        "https://docs.google.com/spreadsheets/d/e/2PACX-1vR5RuaHWBn_YylV0jvB7U6SevGSk9ayuiT1VO0M3uZ3rv4RCqcZrm333buUutaXExySMm5yHBT2KRAy/pub?output=csv"
        );

        const csv =
        await response.text();

        const rows =
        parseCSV(csv).slice(1);

        container.innerHTML = "";

        rows.forEach((row) => {

            if(row.length === 0) return;

            const title = row[0] || "";
            const description = row[1] || "";
            const image = row[2] || "";

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

/* =========================
   CSV PARSER
========================= */

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

async function loadStudentGuideCourses(){

    if(!courseList || !courseDetailPanel){
        return;
    }

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
                gradeLevel:row[7] || "Not listed",
                prerequisites:row[8] || "None listed",
                credits:row[9] || "Not listed",
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

    if(!select){
        return;
    }

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
    courseSearchInput
    ? courseSearchInput.value.toLowerCase().trim()
    : "";

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
                ${formatRating(course.rating)}${isNumericRating(course.rating) ? " ★" : ""}
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
                ${formatRating(course.rating)}${isNumericRating(course.rating) ? " ★" : ""}
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

/* =========================
   STUDENT GUIDE CLUBS
========================= */

const clubList =
document.getElementById("club-list");

const clubDetailPanel =
document.getElementById("club-detail-panel");

const clubTypeFilter =
document.getElementById("club-type-filter");

const clubCategoryFilter =
document.getElementById("club-category-filter");

const clubGradeFilter =
document.getElementById("club-grade-filter");

const clubSearchInput =
document.getElementById("club-search-input");

let allClubs = [];
let selectedClubIndex = 0;

const clubsSheetUrl =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vRTraMHVcYD9Ac9ki1fHVUAQgcvWBuS8GMIiyXf4lJ6nkEaRgVE-LNogJspvCemNYjgdvGkwvz6a23P/pub?output=csv";

async function loadStudentGuideClubs(){

    if(!clubList || !clubDetailPanel){
        return;
    }

    try{

        const response =
        await fetch(clubsSheetUrl);

        const csv =
        await response.text();

        const rows =
        parseCSV(csv).slice(1);

        allClubs = rows
        .filter(row => row.length >= 2 && row[1])
        .map((row, index) => {

            return {
                originalIndex:index,
                type:row[0] || "Other",
                title:row[1] || "Untitled Club",
                description:row[2] || "No description available yet.",
                rating:row[3] || "Official",
                reviews:row[4] || "Student Group",
                extraInfo:row[5] || "",
                category:row[6] || "General",
                gradeLevel:row[7] || "Not listed",
                meetingTime:row[8] || "Not listed",
                sponsor:row[9] || "Not listed",
                topics:row[10] || ""
            };

        });

        populateClubFilters();
        renderClubList();

        if(allClubs.length > 0){
            renderClubDetails(allClubs[0]);
        }

    }

    catch(error){

        console.error(error);

        clubList.innerHTML = `

        <div class="course-list-card">
            <div class="course-list-main">
                <h3>Unable To Load Clubs</h3>
                <p>Please try again later.</p>
            </div>
        </div>

        `;

        clubDetailPanel.innerHTML = `

        <div class="coming-soon-card">
            <h3>Clubs Unavailable</h3>
            <p>The clubs guide could not be loaded.</p>
        </div>

        `;

    }

}

function populateClubFilters(){

    populateClubSelect(clubTypeFilter, [
        "All",
        ...new Set(allClubs.map(club => club.type))
    ]);

    populateClubSelect(clubCategoryFilter, [
        "All",
        ...new Set(allClubs.map(club => club.category))
    ]);

    populateClubSelect(clubGradeFilter, [
        "All",
        ...new Set(allClubs.map(club => club.gradeLevel))
    ]);

}

function populateClubSelect(select, options){

    if(!select){
        return;
    }

    select.innerHTML = "";

    options.forEach((optionText) => {

        const option =
        document.createElement("option");

        option.value = optionText;

        option.textContent =
        optionText === "All"
        ? select.id.includes("type")
            ? "All Types"
            : select.id.includes("category")
                ? "All Categories"
                : "All Grades"
        : optionText;

        select.appendChild(option);

    });

}

function getFilteredClubs(){

    const searchTerm =
    clubSearchInput
    ? clubSearchInput.value.toLowerCase().trim()
    : "";

    return allClubs.filter((club) => {

        const matchesType =
        clubTypeFilter.value === "All"
        || club.type === clubTypeFilter.value;

        const matchesCategory =
        clubCategoryFilter.value === "All"
        || club.category === clubCategoryFilter.value;

        const matchesGrade =
        clubGradeFilter.value === "All"
        || club.gradeLevel === clubGradeFilter.value;

        const searchableText =
        `
        ${club.type}
        ${club.title}
        ${club.description}
        ${club.rating}
        ${club.reviews}
        ${club.extraInfo}
        ${club.category}
        ${club.gradeLevel}
        ${club.meetingTime}
        ${club.sponsor}
        ${club.topics}
        `.toLowerCase();

        const matchesSearch =
        searchableText.includes(searchTerm);

        return matchesType && matchesCategory && matchesGrade && matchesSearch;

    });

}

function renderClubList(){

    const filteredClubs =
    getFilteredClubs();

    clubList.innerHTML = "";

    if(filteredClubs.length === 0){

        clubList.innerHTML = `

        <div class="course-list-card">
            <div class="course-list-main">
                <h3>No Clubs Found</h3>
                <p>Try changing the filters or search term.</p>
            </div>
        </div>

        `;

        clubDetailPanel.innerHTML = `

        <div class="coming-soon-card">
            <h3>No Club Selected</h3>
            <p>Select a club to view more information.</p>
        </div>

        `;

        return;

    }

    filteredClubs.forEach((club) => {

        const card =
        document.createElement("div");

        card.className =
        `course-list-card ${club.originalIndex === selectedClubIndex ? "active" : ""}`;

        card.innerHTML = `

            <div class="course-icon">
                ${getClubIcon(club.category)}
            </div>

            <div class="course-list-main">

                <h3>${club.title}</h3>

                <div class="course-tags">
                    <span class="course-tag">${club.type}</span>
                    <span class="course-tag">${club.category}</span>
                </div>

            </div>

            <div class="course-grade">
                Grades: ${club.gradeLevel}
            </div>

            <div class="course-rating-small">
                ${formatRating(club.rating)}${isNumericRating(club.rating) ? " ★" : ""}
                <span>${club.reviews}</span>
            </div>

        `;

        card.addEventListener("click", () => {

            selectedClubIndex = club.originalIndex;

            renderClubList();
            renderClubDetails(club);

        });

        clubList.appendChild(card);

    });

}

function renderClubDetails(club){

    const topics =
    club.topics
    ? club.topics.split(",").map(topic => topic.trim()).filter(Boolean)
    : ["Leadership", "Community", "Activities", "Involvement"];

    clubDetailPanel.innerHTML = `

        <div class="detail-top">

            <div class="detail-title-wrap">

                <div class="course-icon">
                    ${getClubIcon(club.category)}
                </div>

                <div>
                    <h3>${club.title}</h3>

                    <div class="course-tags">
                        <span class="course-tag">${club.type}</span>
                        <span class="course-tag">${club.category}</span>
                    </div>
                </div>

            </div>

            <div class="detail-rating">
                ${formatRating(club.rating)}${isNumericRating(club.rating) ? " ★" : ""}
                <span>${club.reviews}</span>
            </div>

        </div>

        <p class="detail-description">
            ${club.description}
        </p>

        <div class="detail-info-grid">

            <div class="detail-info-item">
                <span>📅</span>
                <strong>Grade Level</strong>
                <p>${club.gradeLevel}</p>
            </div>

            <div class="detail-info-item">
                <span>🕒</span>
                <strong>Meeting Time</strong>
                <p>${club.meetingTime}</p>
            </div>

            <div class="detail-info-item">
                <span>👤</span>
                <strong>Sponsor</strong>
                <p>${club.sponsor}</p>
            </div>

            <div class="detail-info-item">
                <span>🏷️</span>
                <strong>Category</strong>
                <p>${club.category}</p>
            </div>

        </div>

        <div class="detail-topics">

            <h4>Club Focus</h4>

            <div class="topic-list">

                ${topics.map(topic => `
                    <div class="topic-item">${topic}</div>
                `).join("")}

            </div>

        </div>

        <div class="rating-breakdown">

            <h4>Student Interest</h4>

            ${generateRatingBars(club.rating)}

        </div>

    `;

}

/* =========================
   SHARED STUDENT GUIDE HELPERS
========================= */

function formatRating(rating){

    return String(rating)
    .replace("/5", "")
    .trim();

}

function isNumericRating(rating){

    return !Number.isNaN(parseFloat(formatRating(rating)));

}

function generateRatingBars(rating){

    const numeric =
    parseFloat(formatRating(rating));

    if(Number.isNaN(numeric)){

        return `

        <div class="rating-row">

            <span>Info</span>

            <div class="rating-bar">
                <div class="rating-fill" style="width:100%"></div>
            </div>

            <span>✓</span>

        </div>

        `;

    }

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

function getClubIcon(category){

    if(category === "Academic") return "🎓";
    if(category === "Science") return "⚗";
    if(category === "STEM") return "🤖";
    if(category === "Business") return "$";
    if(category === "Service") return "🤝";
    if(category === "Leadership") return "⭐";
    if(category === "Fine Arts") return "🎨";
    if(category === "Performing Arts") return "🎭";
    if(category === "Media") return "📰";
    if(category === "Medical") return "+";
    if(category === "Environment") return "🌱";
    if(category === "Culture") return "🌎";
    if(category === "Interest") return "♟";
    if(category === "Wellness") return "♡";
    if(category === "Civic") return "🏛";
    if(category === "Advocacy") return "📢";
    if(category === "World Languages") return "🗣";
    if(category === "Arts") return "✎";

    return "👥";

}

/* =========================
   STUDENT GUIDE EVENT LISTENERS
========================= */

[typeFilter, departmentFilter, gradeFilter].forEach((filter) => {

    if(!filter){
        return;
    }

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

if(courseSearchInput){

    courseSearchInput.addEventListener("input", () => {

        const filteredCourses =
        getFilteredCourses();

        if(filteredCourses.length > 0){
            selectedCourseIndex = filteredCourses[0].originalIndex;
            renderCourseDetails(filteredCourses[0]);
        }

        renderCourseList();

    });

}

[clubTypeFilter, clubCategoryFilter, clubGradeFilter].forEach((filter) => {

    if(!filter){
        return;
    }

    filter.addEventListener("change", () => {

        const filteredClubs =
        getFilteredClubs();

        if(filteredClubs.length > 0){
            selectedClubIndex = filteredClubs[0].originalIndex;
            renderClubDetails(filteredClubs[0]);
        }

        renderClubList();

    });

});

if(clubSearchInput){

    clubSearchInput.addEventListener("input", () => {

        const filteredClubs =
        getFilteredClubs();

        if(filteredClubs.length > 0){
            selectedClubIndex = filteredClubs[0].originalIndex;
            renderClubDetails(filteredClubs[0]);
        }

        renderClubList();

    });

}

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

        const panel =
        document.getElementById(`${selectedTab}-guide-panel`);

        if(panel){
            panel.classList.add("active");
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

function createCategoryRow(name = "", weight = "", earned = "", total = ""){

    if(!categoriesContainer){
        return;
    }

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

    if(finalGrade){
        finalGrade.textContent =
        `${grade.toFixed(2)}%`;
    }

}

function updateCategoryDropdown(){

    if(!nextCategory){
        return;
    }

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

const predictBtn =
document.getElementById("predict-btn");

if(predictBtn){

    predictBtn.addEventListener("click", () => {

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

        if(predictedGrade){
            predictedGrade.textContent =
            `${predicted.toFixed(2)}%`;
        }

    });

}

/* =========================
   ADD CATEGORY BUTTON
========================= */

if(addCategoryBtn){

    addCategoryBtn.addEventListener("click", () => {

        createCategoryRow();

    });

}

/* =========================
   FEEDBACK POLLS
========================= */

const featuredPollContainer =
document.getElementById("featured-poll-container");

const pollsContainer =
document.getElementById("polls-container");

const feedbackApiUrl =
"https://script.google.com/macros/s/AKfycbxICM-yhAspiDBV_n9dd-9rqGE47qtbcvx_JRH85T6k1AHEdistv1uBVrgNtVIcjmvw/exec";

async function loadFeedbackPolls(){

    if(!featuredPollContainer || !pollsContainer){
        return;
    }

    try{

        const response =
        await fetch(`${feedbackApiUrl}?action=getPolls&voterId=${encodeURIComponent(getVoterId())}`);

        const data =
        await response.json();

        if(!data.success){
            throw new Error("Polls could not be loaded");
        }

        const polls =
        data.polls;

        const featuredPoll =
        polls.find(poll => poll.featured) || polls[0];

        const regularPolls =
        polls.filter(poll => poll.id !== featuredPoll.id);

        featuredPollContainer.innerHTML =
        renderPollCard(featuredPoll, true);

        pollsContainer.innerHTML =
        regularPolls.map(poll => renderPollCard(poll, false)).join("");

        attachPollVoteButtons();

    }

    catch(error){

        console.error(error);

        featuredPollContainer.innerHTML = `

        <div class="featured-poll-card">

            <div>
                <div class="poll-label">Feedback Unavailable</div>
                <h3>Polls could not be loaded</h3>
                <p>Please try again later.</p>
            </div>

        </div>

        `;

    }

}

function renderPollCard(poll, featured){

    const yesPercent =
    Number(poll.yesPercent) || 0;

    const noPercent =
    Number(poll.noPercent) || 0;

    const yesWidth =
    poll.totalVotes > 0 ? yesPercent : 50;

    const noWidth =
    poll.totalVotes > 0 ? noPercent : 50;

    return `

    <div class="${featured ? "featured-poll-card" : "poll-card"}" data-poll-id="${poll.id}">

        <div class="poll-info">

            <div class="poll-label">
                ${featured ? "Featured Idea" : "Idea"}
            </div>

            <h3>${poll.title}</h3>

            <p>${poll.description}</p>

            <div class="poll-meta">

                <span class="poll-pill">
                    🏷 ${poll.category}
                </span>

                <span class="poll-pill">
                    🕒 ${poll.status}
                </span>

            </div>

        </div>

        <div class="poll-vote-area">

            <div class="poll-results">

               <div class="poll-bar">

                   <div class="poll-yes-fill" style="width:${yesWidth}%">
                       ${yesPercent > 0 ? `Yes ${yesPercent}%` : ""}
                   </div>
               
                   <div class="poll-no-fill ${noPercent > 0 && yesPercent > 0 ? "has-divider" : ""}" style="width:${noWidth}%">
                       ${noPercent > 0 ? `No ${noPercent}%` : ""}
                   </div>
               
               </div>

                <div class="poll-total">
                    Total Responses: ${poll.totalVotes}
                </div>

            </div>

            <div class="poll-actions">

                <button
                class="poll-vote-btn yes ${poll.userVote === "yes" ? "selected" : ""}"
                data-vote="yes"
                data-poll-id="${poll.id}"
                ${poll.hasVoted ? "disabled" : ""}>
                    ${poll.userVote === "yes" ? "You voted Yes" : "Yes"}
                </button>
               
                <button
                class="poll-vote-btn no ${poll.userVote === "no" ? "selected" : ""}"
                data-vote="no"
                data-poll-id="${poll.id}"
                ${poll.hasVoted ? "disabled" : ""}>
                    ${poll.userVote === "no" ? "You voted No" : "No"}
                </button>

            </div>

            <a href="#requests" class="suggest-change-btn" data-suggest-for="${poll.id}">
                💬 Suggest Changes
            </a>

        </div>

    </div>

    `;

}

function attachPollVoteButtons(){

    const voteButtons =
    document.querySelectorAll(".poll-vote-btn");

    voteButtons.forEach((button) => {

        button.addEventListener("click", async () => {

            const pollId =
            button.dataset.pollId;

            const vote =
            button.dataset.vote;

            button.disabled = true;
            button.textContent = "Saving...";

            try{

                await fetch(feedbackApiUrl, {
                    method:"POST",
                    body:JSON.stringify({
                        action:"vote",
                        pollId:pollId,
                        vote:vote,
                        voterId:getVoterId()
                    })
                });

                if(vote === "no"){

                    const suggestButton =
                    document.querySelector(`[data-suggest-for="${pollId}"]`);

                    if(suggestButton){
                        suggestButton.classList.add("show");
                    }

                }

                await loadFeedbackPolls();

                if(vote === "no"){

                    const suggestButton =
                    document.querySelector(`[data-suggest-for="${pollId}"]`);

                    if(suggestButton){
                        suggestButton.classList.add("show");
                    }

                }

            }

            catch(error){

                console.error(error);

                button.disabled = false;
                button.textContent =
                vote === "yes" ? "Yes" : "No";

                alert("Your vote could not be saved. Please try again.");

            }

        });

    });

}

function getVoterId(){

    let voterId =
    localStorage.getItem("jwmhs2028_voter_id");

    if(!voterId){

        voterId =
        "voter_" + crypto.randomUUID();

        localStorage.setItem("jwmhs2028_voter_id", voterId);

    }

    return voterId;

}

/* =========================
   INITIALIZE SITE
========================= */

loadUpdates();

loadFeedbackPolls();

loadStudentGuideCourses();
loadStudentGuideClubs();

createCategoryRow();
createCategoryRow();
