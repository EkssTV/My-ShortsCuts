let mode = null;
let teams = [];
let timer = null;
let timerValue = 0;
let pointsToWin = 0;

// --- Choix du mode ---
document.querySelectorAll(".mode-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        mode = btn.dataset.mode;
        document.getElementById("mode-selection").classList.add("hidden");
        document.getElementById("game-settings").classList.remove("hidden");
    });
});

// --- Génération des champs de noms d'équipe ---
document.getElementById("team-count").addEventListener("input", () => {
    const count = parseInt(document.getElementById("team-count").value);
    if(count > 10){
        return
    }
    const container = document.getElementById("team-names");
    container.innerHTML = "";

    for (let i = 1; i <= count; i++) {
        container.innerHTML += `
            <label>Nom équipe ${i} :</label>
            <input type="text" class="team-name">
        `;
    }
});

// --- Lancer la partie ---
document.getElementById("start-game").addEventListener("click", () => {
    const nameInputs = document.querySelectorAll(".team-name");
    teams = Array.from(nameInputs).map(input => ({
        name: input.value,
        score: 0
    }));

    timerValue = parseInt(document.getElementById("timer-duration").value);
    pointsToWin = parseInt(document.getElementById("points-to-win").value);

    document.getElementById("game-settings").classList.add("hidden");
    document.getElementById("game-area").classList.remove("hidden");

    startRound();
});

// --- Démarrer un round ---
function startRound() {
    loadWord();
    startTimer();
}

// --- Charger un mot selon le mode ---
async function loadWord() {
    const res = await fetch("../kakaroke/json/mot.json");
    const data = await res.json();

    let word = "Mot introuvable";

    if (mode === "simple") {
        word = data.simple[Math.floor(Math.random() * data.simple.length)];
    } else if (mode === "categorie") {
        word = data.categorie[Math.floor(Math.random() * data.categorie.length)];
    } else if (mode === "expert") {
        word = data.expert[Math.floor(Math.random() * data.expert.length)];
    }

    document.getElementById("word-display").textContent = word;
}

// --- Timer ---
function startTimer() {
    let time = timerValue;
    document.getElementById("timer-display").textContent = time;

    timer = setInterval(() => {
        time--;
        document.getElementById("timer-display").textContent = time;

        if (time <= 0) {
            clearInterval(timer);
            showScoreSelection();
        }
    }, 1000);
}

// --- HIT ---
document.getElementById("hit-btn").addEventListener("click", () => {
    clearInterval(timer);
    showScoreSelection();
});

// --- Choix de l'équipe qui marque ---
function showScoreSelection() {
    const container = document.getElementById("team-score-buttons");
    container.innerHTML = "";

    teams.forEach((team, index) => {
        container.innerHTML += `
            <button class="team-score-btn" data-index="${index}">
                ${team.name}
            </button>
        `;
    });

    document.getElementById("score-selection").classList.remove("hidden");
}

// --- Validation du score ---
document.getElementById("validate-score").addEventListener("click", () => {
    const points = parseInt(document.getElementById("points-given").value);
    const selected = document.querySelector(".team-score-btn.selected");

    if (!selected) return;

    const index = parseInt(selected.dataset.index);
    teams[index].score += points;

    document.getElementById("score-selection").classList.add("hidden");

    checkWin();
});

// --- Sélection visuelle ---
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("team-score-btn")) {
        document.querySelectorAll(".team-score-btn").forEach(btn => btn.classList.remove("selected"));
        e.target.classList.add("selected");
    }
});

// --- Vérifier si une équipe gagne ---
function checkWin() {
    const winner = teams.find(t => t.score >= pointsToWin);

    if (winner) {
        alert(`Victoire de ${winner.name} !`);
        // Ici tu pourras faire un classement final
    } else {
        startRound();
    }
}
