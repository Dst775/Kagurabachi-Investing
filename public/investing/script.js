const chapterCount = 35;
const datasets = [
    {
        label: 'Utagawa Squad 1',
        data: getRandomData(chapterCount),
        fill: false,
        borderColor: 'rgb(180,140,228)',
        tension: 0.1
    },
    {
        label: 'Oji Squad 2',
        data: getRandomData(chapterCount),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
    },
    {
        label: 'Asahi Squad 3',
        data: getRandomData(chapterCount),
        fill: false,
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1
    },
    {
        label: 'Kawasaki Squad 4',
        data: getRandomData(chapterCount),
        fill: false,
        borderColor: 'rgb(54, 162, 2chapterCount)',
        tension: 0.1
    },
    {
        label: 'Yamato Squad 5',
        data: getRandomData(chapterCount),
        fill: false,
        borderColor: 'rgb(255, 206, 86)',
        tension: 0.1
    },
    {
        label: 'Nagoya Squad 6',
        data: getRandomData(chapterCount),
        fill: false,
        borderColor: 'rgb(153, 102, 255)',
        tension: 0.1
    },
    {
        label: 'Kyoto Squad 7',
        data: getRandomData(chapterCount),
        fill: false,
        borderColor: 'rgb(255, 159, 64)',
        tension: 0.1
    },
    {
        label: 'Sapporo Squad 8',
        data: getRandomData(chapterCount),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
    },
    {
        label: 'Sendai Squad 9',
        data: getRandomData(chapterCount),
        fill: false,
        borderColor: 'rgb(255, 99, 71)',
        tension: 0.1
    },
    {
        label: 'Kobe Squad 10',
        data: getRandomData(chapterCount),
        fill: false,
        borderColor: 'rgb(75, 0, 130)',
        tension: 0.1
    },
    {
        label: 'Fukuoka Squad 11',
        data: getRandomData(chapterCount),
        fill: false,
        borderColor: 'rgb(60, 179, 113)',
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
    const ctx = document.getElementById("barGraph").getContext("2d");
    const data = {
        labels: labels,
        datasets: datasets
    };
    const config = {
        type: 'line',
        data: data,
        options: {
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
                    }
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

    document.getElementById("minRangeDisplay").innerText = minValue;
}

function getRandomData(numPoints) {
    let data = [];
    for (let i = 0; i < numPoints; i++) {
        data.push(Math.floor(Math.random() * 101));
    }
    return data;
}