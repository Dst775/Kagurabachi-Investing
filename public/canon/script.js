document.addEventListener('DOMContentLoaded', () => {
    loadDom();
});

const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("input", () => {
    loadDom(searchInput.value.toLowerCase());
});

function loadDom(filter = "") {
    console.log(filter);
    const container = document.getElementById("cardContainer");
    // Delete all Children
    while (container.firstChild) {
        container.removeChild(container.lastChild);
    }
    const colors = ["btn-info", "tachikawa", "kazama", "arashiyama", "miwa", "tamakoma", "ninomiya", "kageura", "suzunari", "azuma", "tamakoma", "katori", "suwa", "azuma", "nasu", "kakizaki", "brank", "crank", "arashiyama", "miwa", "suwa", "crank", "tachikawa", "crank", "azuma", "brank"];
    const newLineIndexes = [4, 8, 14, 20, 27, 32, 37, 41, 45, 49, 52, 56, 60, 64, 68, 72, 84, 89, 95, 100, 104, 108, 112, 115, 119];
    let colorIndex = 0;
    for (let i = 0; i < CharacterData.length; i++) {
        const character = CharacterData[i];
        if (!character.Name.toLowerCase().includes(filter)) {
            if (newLineIndexes.includes(i)) {
                let breakEl = document.createElement("div");
                breakEl.classList.add("break");
                container.appendChild(breakEl);
                colorIndex++;
            }
            continue;
        }
        let a = document.createElement("a");
        a.setAttribute("href", `/character?id=${i}`);
        const card = document.createElement("char-card");
        card.classList.add("btn", (colorIndex < colors.length ? colors[colorIndex] : 0) || "btn-info");

        const p = document.createElement("p");
        p.classList.add("name");
        p.innerText = character.Name;

        card.appendChild(p);
        a.appendChild(card);
        container.appendChild(a);

        if (newLineIndexes.includes(i)) {
            let breakEl = document.createElement("div");
            breakEl.classList.add("break");
            container.appendChild(breakEl);
            colorIndex++;
        }
    }
}