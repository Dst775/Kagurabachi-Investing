document.addEventListener('DOMContentLoaded', () => {
    const currentURL = window.location.href;
    const url = new URL(currentURL);
    const queryParams = new URLSearchParams(url.search);
    const characterID = queryParams.get("id");
    console.log(`Character ID: ${characterID}`);

    const ctx = document.getElementById("radarChart").getContext("2d");
    const data = {
        labels: [
            ['TRION', '6'],
            ['ATTACK', '14'.padStart(7, ' ')],
            ['DEFENSE', 'SUPPORT', '9'.padStart(8, ' ')],
            ['MOBILITY', '8'.padStart(8, ' ')],
            ['SKILL', '8'],
            ['RANGE', '2'.padEnd(6, ' ')],
            ['COMMAND', '7'.padEnd(8, ' ')],
            ['SPECIAL', 'TACTICS', '4'.padEnd(8, ' ')]
        ],
        datasets: [{
            label: '',
            data: [6, 14, 9, 8, 8, 2, 7, 4],
            fill: true,
            backgroundColor: 'rgba(140,140,140, 0.5)',
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