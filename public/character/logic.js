document.addEventListener('DOMContentLoaded', () => {
    const currentURL = window.location.href;
    const url = new URL(currentURL);
    const queryParams = new URLSearchParams(url.search);
    const characterID = queryParams.get("id");
    console.log(`Character ID: ${characterID}`);

    const characterData = CharacterData[Number(characterID || "0")];
    document.getElementById("emblem").addEventListener("load", () => {
        document.querySelector("#emblem").contentDocument.querySelector("#RankText").textContent = "65";
        document.querySelector("#emblem").contentDocument.querySelector("#RankFill").style.fill = "#DD0022";
        document.querySelector("#emblem").contentDocument.querySelector("#image1").setAttribute("href", "https://cdn.discordapp.com/attachments/461506770037243915/1247755554462502922/461483989463597057_516213628442247168_xp.png?ex=66612e6a&is=665fdcea&hm=07a2b896610ac72e15a09c3a7028697f3252437a7c931cbfbb5b00dca4bc4dd9&");
    });

    document.getElementById("characterName").innerText = characterData.Name;
    const ctx = document.getElementById("radarChart").getContext("2d");
    const data = {
        labels: [
            ['TRION', `${characterData.Trion || 1}`],
            ['ATTACK', `${characterData.Attack}`.padStart(7, ' ')],
            ['DEFENSE', 'SUPPORT', `${characterData.DefenceSupport}`.padStart(8, ' ')],
            ['MOBILITY', `${characterData.Mobility}`.padStart(8, ' ')],
            ['SKILL', `${characterData.Skill}`],
            ['RANGE', `${characterData.Range}`.padEnd(6, ' ')],
            ['COMMAND', `${characterData.Command}`.padEnd(8, ' ')],
            ['SPECIAL', 'TACTICS', `${characterData.SpecialTactics}`.padEnd(8, ' ')]
        ],
        datasets: [{
            label: '',
            data: [
                `${characterData.Trion || 1}`,
                `${characterData.Attack}`,
                `${characterData.DefenceSupport}`,
                `${characterData.Mobility}`,
                `${characterData.Skill}`,
                `${characterData.Range}`,
                `${characterData.Command}`,
                `${characterData.SpecialTactics}`
            ],
            fill: true,
            backgroundColor: 'rgba(0,0,0, 0.5)',
            pointStyle: false,
            hoverRadius: 0,
            clip: {
                left: 5, top: -400, right: -200, bottom: 0
            }
        }]
    };
    new Chart(ctx, {
        type: 'radar',
        data: data,
        options: {
            layout: {
                padding: 10
            },
            events: [],
            elements: {
                line: {
                    borderWidth: 0
                }
            },
            scales: {
                r: {
                    min: 0,
                    max: 10,
                    ticks: {
                        stepSize: 2,
                        display: false
                    },
                    grid: {
                        lineWidth: 1.5,
                        color: "rgba(140, 140, 140, 1)"
                    },
                    angleLines: {
                        lineWidth: 1.5,
                        color: "rgba(140, 140, 140, 1)"
                    },
                    pointLabels: {
                        color: "#000",
                        font: {
                            size: 14,
                            weight: "bold"
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        },
    });
});