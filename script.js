/* =========================
   PAGE NAVIGATION
========================= */

const tabs =
document.querySelectorAll(".tab");

const sections =
document.querySelectorAll(".page-section");

function switchTab(sectionId){

    sections.forEach((section) => {

        section.classList.remove("active-section");

    });

    const activeSection =
    document.getElementById(sectionId);

    if(activeSection){

        activeSection.classList.add("active-section");

        window.scrollTo({
            top:0,
            behavior:"smooth"
        });

    }

    tabs.forEach((tab) => {

        tab.classList.remove("active");

        if(tab.dataset.tab === sectionId){

            tab.classList.add("active");

        }

    });

}

tabs.forEach((tab) => {

    tab.addEventListener("click", () => {

        const sectionId =
        tab.dataset.tab;

        switchTab(sectionId);

    });

});

document.querySelectorAll("[data-tab]")
.forEach((button) => {

    button.addEventListener("click", () => {

        const sectionId =
        button.dataset.tab;

        switchTab(sectionId);

    });

});

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
    threshold:0.1
});

document.querySelectorAll(".fade-up")
.forEach((el) => observer.observe(el));

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
   GPA CALCULATOR
========================= */

function calculateGPA(){

    const grades = [

        Number(document.getElementById("grade1").value),
        Number(document.getElementById("grade2").value),
        Number(document.getElementById("grade3").value),
        Number(document.getElementById("grade4").value)

    ];

    let total = 0;

    grades.forEach((grade) => {

        if(grade >= 90){

            total += 4;

        }

        else if(grade >= 80){

            total += 3;

        }

        else if(grade >= 70){

            total += 2;

        }

        else if(grade >= 60){

            total += 1;

        }

        else{

            total += 0;

        }

    });

    const gpa =
    (total / grades.length).toFixed(2);

    document.getElementById("gpa-result")
    .innerText = `Estimated GPA: ${gpa}`;

}

/* =========================
   COIN FLIP
========================= */

function flipCoin(){

    const result =
    Math.random() < 0.5
    ? "Heads"
    : "Tails";

    document.getElementById("coin-result")
    .innerText = result;

}

/* =========================
   LUNCH PICKER
========================= */

function pickLunch(){

    const lunches = [

        "Chick-fil-A",
        "Chipotle",
        "McDonald's",
        "Canes",
        "Taco Bell",
        "Pizza",
        "Wendy's",
        "Panera",
        "Publix Sub",
        "Five Guys"

    ];

    const random =
    lunches[Math.floor(
        Math.random() * lunches.length
    )];

    document.getElementById("lunch-result")
    .innerText = random;

}

/* =========================
   DAY RATING
========================= */

function updateDayValue(){

    const slider =
    document.getElementById("day-slider");

    document.getElementById("day-value")
    .innerText = `${slider.value}/10`;

}

/* =========================
   QUOTES
========================= */

function generateQuote(){

    const quotes = [

        "Lock in.",
        "You got this.",
        "One assignment at a time.",
        "Future you will thank you.",
        "Stay motivated.",
        "Keep pushing forward.",
        "The weekend is almost here."

    ];

    const random =
    quotes[Math.floor(
        Math.random() * quotes.length
    )];

    document.getElementById("quote-result")
    .innerText = random;

}

/* =========================
   SPIRIT DAY
========================= */

function generateSpiritDay(){

    const days = [

        "PJ Day",
        "Jersey Day",
        "Beach Day",
        "Celebrity Day",
        "Decades Day",
        "Twin Day",
        "Country vs Country Club",
        "USA Day"

    ];

    const random =
    days[Math.floor(
        Math.random() * days.length
    )];

    document.getElementById("spirit-result")
    .innerText = random;

}

/* =========================
   WOULD YOU RATHER
========================= */

function generateWouldYouRather(){

    const questions = [

        "Would you rather skip exams or skip homework?",
        "Would you rather have free lunch forever or no homework forever?",
        "Would you rather have a 4-day school week or longer weekends?",
        "Would you rather have infinite phone battery or infinite money?",
        "Would you rather only take math or only take English?"

    ];

    const random =
    questions[Math.floor(
        Math.random() * questions.length
    )];

    document.getElementById("wyr-result")
    .innerText = random;

}

/* =========================
   HOMEWORK EXCUSE
========================= */

function generateExcuse(){

    const excuses = [

        "Canvas wouldn't load.",
        "My dog ate my charger.",
        "The WiFi stopped working.",
        "I accidentally submitted the wrong file.",
        "My computer updated for 3 hours.",
        "I thought it was due tomorrow."

    ];

    const random =
    excuses[Math.floor(
        Math.random() * excuses.length
    )];

    document.getElementById("excuse-result")
    .innerText = random;

}

/* =========================
   CLICKER GAME
========================= */

let clicks = 0;

function incrementClicks(){

    clicks++;

    document.getElementById("click-count")
    .innerText = `${clicks} Clicks`;

}

/* =========================
   REACTION TIME GAME
========================= */

const reactionBtn =
document.getElementById("reaction-btn");

const reactionResult =
document.getElementById("reaction-result");

let startTime = 0;
let waiting = true;

function startReactionGame(){

    waiting = true;

    reactionBtn.innerText = "Wait...";
    reactionBtn.style.background = "#777";

    const delay =
    Math.random() * 4000 + 2000;

    setTimeout(() => {

        waiting = false;

        reactionBtn.innerText = "CLICK!";
        reactionBtn.style.background = "#4caf50";

        startTime = Date.now();

    }, delay);

}

reactionBtn.addEventListener("click", () => {

    if(waiting){

        reactionResult.innerText =
        "Too early!";

        startReactionGame();

    }

    else{

        const reactionTime =
        Date.now() - startTime;

        reactionResult.innerText =
        `${reactionTime} ms`;

        startReactionGame();

    }

});

startReactionGame();
