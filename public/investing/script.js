import * as Globals from "../main.js";

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
window.datasets = datasets;

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

    // Stock Stuff
    loadStocks();
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
function handleHover(evt, item) {
    datasets.forEach((data) => {
        if (data.label != item.text) {
            data.borderColor = data.borderColor.replace("1.0", "0.0");
        }
    });
    chart.update();
}

// Removes the alpha channel from background colors
function handleLeave() {
    datasets.forEach((data) => {
        data.borderColor = data.borderColor.replace("0.0", "1.0");
    });
    chart.update();
}

/* Stock Stuff */

function loadStocks() {
    const stockContainer = document.getElementById("stockContainer");
    const stockNames = [
        { name: "Utagawa Squad", stock: "UTG" },
        { name: "Oji Squad", stock: "OJI" },
        { name: "Kakizaki Squad", stock: "KKZ" },
        { name: "Kitazoe Squad", stock: "KTZ" },
        { name: "Kuruma Squad", stock: "KRM" },
        { name: "Kodera Squad", stock: "KDR" },
        { name: "Suwa Squad", stock: "SWA" },
        { name: "Ninomiya Squad", stock: "NMY" },
        { name: "Mizukami Squad", stock: "MZK" },
        { name: "Murakami Squad", stock: "MRK" },
        { name: "Wakamura Squad", stock: "WKM" },
        { name: "Brian", stock: "BRI" },
    ];
    stockNames.forEach((stock, i) => {
        stockContainer.appendChild(createStockElement(stock, i))
    });

    const interval = setInterval(() => {
        if(!Globals.isLoggedIn()) {
            return;
        }
        clearInterval(interval);

    }, 2000);
}

/**
 * 
 * @param {object} stock 
 * @param {string} stock.name
 * @param {string} stock.stock
 * @param {number} stockNumber
 */
function createStockElement(stock, stockNumber) {
    const stockOption = document.createElement("stock-option");

    const p = document.createElement("p");
    p.id = "stockName";
    p.innerText = stock.name;
    const span = document.createElement("span");
    span.innerText = ` (${stock.stock})`;
    p.appendChild(span);

    const buyButton = document.createElement("button");
    buyButton.classList.add("btn", "btn-success");
    buyButton.innerText = "Buy";
    buyButton.addEventListener("click", () => { buyStock(stockNumber) });

    const sellButton = document.createElement("button");
    sellButton.classList.add("btn", "btn-error");
    sellButton.innerText = "Sell";
    sellButton.addEventListener("click", () => { sellStock(stockNumber) });

    const buttonContainer = document.createElement("div");
    buttonContainer.appendChild(buyButton);
    buttonContainer.appendChild(sellButton);

    const stockCount = document.createElement("p");
    stockCount.id = "stockCount";
    stockCount.innerText = `Stock: 0`;

    const stockValue = document.createElement("p");
    stockValue.id = "stockValue";
    stockValue.innerText = `Value: $153`;


    stockOption.appendChild(p);
    stockOption.appendChild(stockCount);
    stockOption.appendChild(stockValue);
    stockOption.appendChild(buttonContainer);
    return stockOption;
}

function buyStock(stockNumber) {
    console.log("buy", stockNumber);
}

function sellStock(stockNumber) {
    console.log("sell", stockNumber)
}