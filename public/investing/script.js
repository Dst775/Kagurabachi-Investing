const chapterCount = 35;
const datasets = [
    {
        label: 'Utagawa Squad 1',
        data: getRandomData(chapterCount),
        fill: false,
        borderColor: 'rgba(180,140,228, 1.0)',
        tension: 0.1
    },
    {
        label: 'Oji Squad 2',
        data: getRandomData(chapterCount),
        fill: false,
        borderColor: 'rgba(75, 192, 192, 1.0)',
        tension: 0.1
    },
    {
        label: 'Kakizaki Squad 3',
        data: getRandomData(chapterCount),
        fill: false,
        borderColor: 'rgba(255, 99, 132, 1.0)',
        tension: 0.1
    },
    {
        label: 'Kitazoe Squad 4',
        data: getRandomData(chapterCount),
        fill: false,
        borderColor: 'rgba(54, 162, 235, 1.0)',
        tension: 0.1
    },
    {
        label: 'Kuruma Squad 5',
        data: getRandomData(chapterCount),
        fill: false,
        borderColor: 'rgba(255, 206, 86, 1.0)',
        tension: 0.1
    },
    {
        label: 'Kodera Squad 6',
        data: getRandomData(chapterCount),
        fill: false,
        borderColor: 'rgba(153, 102, 255, 1.0)',
        tension: 0.1
    },
    {
        label: 'Suwa Squad 7',
        data: getRandomData(chapterCount),
        fill: false,
        borderColor: 'rgba(255, 159, 64, 1.0)',
        tension: 0.1
    },
    {
        label: 'Ninomiya Squad 8',
        data: getRandomData(chapterCount),
        fill: false,
        borderColor: 'rgba(75, 192, 192, 1.0)',
        tension: 0.1
    },
    {
        label: 'Mizukami Squad 9',
        data: getRandomData(chapterCount),
        fill: false,
        borderColor: 'rgba(255, 99, 71, 1.0)',
        tension: 0.1
    },
    {
        label: 'Murakami Squad 10',
        data: getRandomData(chapterCount),
        fill: false,
        borderColor: 'rgba(75, 0, 130, 1.0)',
        tension: 0.1
    },
    {
        label: 'Wakamura Squad 11',
        data: getRandomData(chapterCount),
        fill: false,
        borderColor: 'rgba(60, 179, 113, 1.0)',
        tension: 0.1
    },
    {
        label: 'Brian',
        data: getRandomData(chapterCount),
        fill: false,
        borderColor: 'rgba(255, 255, 255, 1.0)',
        tension: 0.1
    }
];

const labels = [
    "207",
    "208",
    "209",
    "210",
    "211",
    "212",
    "213",
    "214",
    "215",
    "216",
    "217",
    "218",
    "219",
    "220",
    "221",
    "222",
    "223",
    "224",
    "225",
    "226",
    "227",
    "228",
    "229",
    "230",
    "231",
    "232",
    "233",
    "234",
    "235",
    "236",
    "237",
    "238",
    "239",
    "240",
    "241"
];
let chart;

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById("barGraph");
    const ctx = canvas.getContext("2d");
    canvas.height = window.innerHeight * 0.8;
    const data = {
        labels: labels,
        datasets: datasets
    };
    const config = {
        type: 'line',
        data: data,
        options: {
            maintainAspectRatio: false,
            scales: {
                x: {
                    ticks: {
                        color: 'white' // X-axis tick labels color
                    },
                    grid: {
                        color: 'white' // X-axis grid color
                    }
                },
                y: {
                    ticks: {
                        color: 'white'
                    },
                    grid: {
                        color: 'white'
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: 'white'
                    },
                    onHover: handleHover,
                    onLeave: handleLeave
                }
            }
        }
    };
    chart = new Chart(ctx, config);

    // Initialize Sliders
    const sliderMin = document.getElementById("minRange");
    sliderMin.oninput = updateChart;
});

function updateChart() {
    const sliderMin = document.getElementById("minRange");
    const minValue = parseInt(sliderMin.value);
    let trimmedLabels = labels.slice(minValue);
    for (let i = 0; i < datasets.length; i++) {
        datasets[i].data = getRandomData(chapterCount - minValue);
    }
    chart.data.labels = trimmedLabels;
    chart.update();

    document.getElementById("minRangeDisplay").innerText = 207 + minValue;
}

function getRandomData(numPoints) {
    let data = [];
    for (let i = 0; i < numPoints; i++) {
        data.push(Math.floor(Math.random() * 101));
    }
    return data;
}

// From Chart.JS

// Append '4d' to the colors (alpha channel), except for the hovered index
function handleHover(evt, item, legend) {
    datasets.forEach((data) => {
        if (data.label != item.text) {
            data.borderColor = data.borderColor.replace("1.0", "0.0");
        }
    });
    chart.update();
}

// Removes the alpha channel from background colors
function handleLeave(evt, item, legend) {
    datasets.forEach((data) => {
        data.borderColor = data.borderColor.replace("0.0", "1.0");
    });
    chart.update();
}