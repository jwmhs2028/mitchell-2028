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
   HIDDEN PANELS
========================= */

const funPanel =
document.getElementById("fun-section");

const requestPanel =
document.getElementById("requests-section");

function openFun(){

    funPanel.style.display = "block";

    requestPanel.style.display = "none";

    window.scrollTo({
        top: funPanel.offsetTop - 40,
        behavior: "smooth"
    });

}

function openRequests(){

    requestPanel.style.display = "block";

    funPanel.style.display = "none";

    window.scrollTo({
        top: requestPanel.offsetTop - 40,
        behavior: "smooth"
    });

}

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

    }

    catch(error){

        console.error(error);

        container.innerHTML = `

        <div class="event-card">

            <h3>Unable To Load Updates</h3>

            <p>Please try again later.</p>

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
        "Canes",
        "Pizza",
        "Publix Sub",
        "Taco Bell",
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
   DAY SLIDER
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
        "Stay focused.",
        "Keep pushing.",
        "Future you will thank you."

    ];

    const random =
    quotes[Math.floor(
        Math.random() * quotes.length
    )];

    document.getElementById("quote-result")
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
