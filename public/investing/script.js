import * as Globals from "../main.js";
Globals.loginListeners.push(loadIndividualData);
Globals.loginListeners.push(loadBalance);

const datasets = [];
const ORIGINAL_DATASETS = [];
const labels = [];

let stockData;
let chart;
let stockCounts = [];

document.addEventListener('DOMContentLoaded', async () => {
    const latestChapter = 207 + (await (await fetch("/numChaps")).json()).count;
    const chapterCount = latestChapter - 207 + 1;
    for (let i = 207; i <= latestChapter; i++) {
        labels.push(i.toString());
    }


    await loadDataSet();

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
    const startingSlider = latestChapter - 6;
    sliderMin.value = startingSlider;
    sliderMin.max = latestChapter - 1;
    document.getElementById("minRangeDisplay").innerText = startingSlider;
    updateChart();

    const buySellCount = document.getElementById("buyCount");
    buySellCount.oninput = () => { updateSliderDisplay(buySellCount, "buySellDisplay") };
});

/**
 * 
 * @param {HTMLInputElement} original 
 * @param {String} id 
 */
function updateSliderDisplay(original, id) {
    document.getElementById(id).innerText = original.value;
}

/**
 * Load all of the values for Stocks.
 * Can be done without signing in.
 * Calls loadStocks() afterwards but may not happen if not signed in!
 */
async function loadDataSet() {
    const response = await fetch("/stockData");
    const json = await response.json();
    stockData = json;
    const borderColors = [
        "rgba(180,140,228, 1.0)", // Utagawa
        "rgba(175, 248, 251, 1.0)", // Oji
        "rgba(255, 151, 50, 1.0)", // Kakizaki
        "rgba(54, 162, 255, 1.0)", // Kitazoe
        "rgba(255, 206, 86, 1.0)", // Kuruma
        "rgba(153, 102, 255, 1.0)", // Kodera
        "rgba(141, 224, 151, 1.0)", // Suwa
        "rgba(20, 192, 220, 1.0)", // Ninomiya
        "rgba(255, 50, 71, 1.0)", // Mizukami
        "rgba(10, 255, 149, 1.0)", // Murakami
        "rgba(238, 49, 215, 1.0)", // Wakamura
        "rgba(255, 255, 255, 1.0)" // Brian
    ];

    for (let i = 0; i < json.length; i++) {
        const stock = json[i];
        const obj = {
            label: stock.stockName,
            data: stock.stockValues,
            fill: false,
            borderColor: borderColors[i],
            tensions: 0.1
        };
        obj.data.push(stock.stockValue);

        datasets.push(obj);
        ORIGINAL_DATASETS.push(obj.data.slice(0)); // Clone Data
        stockCounts.push(0);
    }
    loadIndividualData();
}

function updateChart() {
    const sliderMin = document.getElementById("minRange");
    const minValue = parseInt(sliderMin.value) - 207;
    let trimmedLabels = labels.slice(minValue);
    for (let i = 0; i < datasets.length; i++) {
        datasets[i].data = ORIGINAL_DATASETS[i].slice(minValue);
    }
    chart.data.labels = trimmedLabels;
    chart.update();
    updateSliderDisplay(sliderMin, "minRangeDisplay");
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

async function loadIndividualData() {
    if (!Globals.isLoggedIn() || stockData == undefined) {
        return;
    }
    for (let i = 0; i < stockCounts.length; i++) {
        // In case logging out and logging into someone else
        stockCounts[i] = 0;
    }
    const res = await fetch("/stocks/getAll");
    const stockArr = await res.json();
    console.log(stockArr);
    stockArr.forEach((stockCount, i) => {
        stockCounts[i] = stockCount;
    });

    loadStocks();
}

/* Stock Stuff */

/**
 * Generates the table of stocks to buy/sell
 * Should be done after Logging In
 * @returns Nothing
 */
function loadStocks() {
    if (!Globals.isLoggedIn() || stockData == undefined) {
        return;
    }
    const stockContainer = document.getElementById("stockContainer");
    // Delete all old UI in case of re-login
    while (stockContainer.firstChild) {
        stockContainer.removeChild(stockContainer.firstChild);
    }
    // Create UI
    stockData.forEach((stock, i) => {
        stockContainer.appendChild(createStockElement(stock, i))
    });
}

async function loadBalance() {
    if (!Globals.isLoggedIn()) {
        return;
    }
    const res = await fetch("/stocks/getBalance");
    if (res.status != 200) {
        console.log(res.msg);
        return Globals.makeToast("Error loading Balance.", "info-error", 3);
    }
    const json = await res.json();
    setBalance(json.balance);
}

/**
 * @param {number} balance 
 */
function setBalance(balance) {
    const balanceText = document.getElementById("balanceText");
    balanceText.innerText = balance.toLocaleString();
}

/**
 * 
 * @param {object} stock 
 * @param {string} stock.stockLabel
 * @param {number} stock.stockID
 * @param {string} stock.stockName
 * @param {number} stock.stockValue
 * @param {number[]} stock.stockValues
 * @param {number} stockNumber
 */
function createStockElement(stock, stockNumber) {
    const stockOption = document.createElement("stock-option");
    stockOption.id = `stock${stockNumber}`;

    const p = document.createElement("p");
    p.id = "stockName";
    p.innerText = stock.stockName;
    const span = document.createElement("span");
    span.innerText = ` (${stock.stockLabel})`;
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
    stockCount.innerText = `Stock: ${stockCounts[stockNumber]}`;

    const stockValue = document.createElement("p");
    stockValue.id = "stockValue";
    stockValue.innerText = `Value: $${stockData[stockNumber].stockValue}`;


    stockOption.appendChild(p);
    stockOption.appendChild(stockCount);
    stockOption.appendChild(stockValue);
    stockOption.appendChild(buttonContainer);
    return stockOption;
}

async function buyStock(stockNumber) {
    const buyCount = parseInt(document.getElementById("buyCount").value, 10);
    const data = {
        stockID: stockNumber,
        buyCount: buyCount
    };
    const res = await fetch("/stocks/buyStock", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    const json = await res.json();
    if (res.status == 200) {
        stockCounts[stockNumber] += buyCount;
        Globals.makeToast(`${json.msg}`, "alert-success", 2);
        setBalance(json.balance);
        const stockCount = document.querySelector(`#stock${stockNumber}`).querySelector("#stockCount");
        stockCount.innerText = `Stock: ${stockCounts[stockNumber].toLocaleString()}`;
    } else {
        Globals.makeToast(`${json.msg}`, "alert-error", 2);
    }
}

async function sellStock(stockNumber) {
    const sellCount = parseInt(document.getElementById("buyCount").value, 10);
    const data = {
        stockID: stockNumber,
        sellCount: sellCount
    };
    const res = await fetch("/stocks/sellStock", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    const json = await res.json();
    if (res.status == 200) {
        stockCounts[stockNumber] -= sellCount;
        Globals.makeToast(`${json.msg}`, "alert-success", 2);
        setBalance(json.balance);
        const stockCount = document.querySelector(`#stock${stockNumber}`).querySelector("#stockCount");
        stockCount.innerText = `Stock: ${stockCounts[stockNumber].toLocaleString()}`;
    } else {
        Globals.makeToast(`${json.msg}`, "alert-error", 2);
    }
}