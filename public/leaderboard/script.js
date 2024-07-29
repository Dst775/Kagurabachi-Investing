import * as Globals from "../main.js";

document.addEventListener('DOMContentLoaded', async () => {
    const res = await fetch("/stockLeaderboard");
    let leaderboardData = await res.json();
    const table = document.getElementById("leaderboardTable");
    leaderboardData = leaderboardData.sort((a, b) => {
        return b.portfolio - a.portfolio;
    });
    console.table(leaderboardData);
    let rank = 1;
    let prevBalance = leaderboardData[0].portfolio;
    for (let i = 0; i < leaderboardData.length; i++) {
        const entry = leaderboardData[i];
        if (entry.portfolio != prevBalance) {
            rank = i + 1;
        }

        const tr = document.createElement("tr");

        const rankTD = document.createElement("td");
        rankTD.innerText = rank;

        const nameTD = document.createElement("td");
        nameTD.innerText = entry.name;

        const valueTD = document.createElement("td");
        valueTD.innerText = `$${entry.portfolio.toLocaleString()}`;

        tr.appendChild(rankTD);
        tr.appendChild(nameTD);
        tr.appendChild(valueTD);
        table.appendChild(tr);
    }
});