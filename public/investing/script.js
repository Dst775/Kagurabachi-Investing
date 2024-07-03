import * as Globals from "../main.js";
Globals.loginListeners.push(loadIndividualData);
Globals.loginListeners.push(loadBalance);

const latestChapter = 243;
const chapterCount = latestChapter - 207 + 1;
const datasets = [];
const labels = [];
for(let i = 207; i <= latestChapter; i++) {
    labels.push(i.toString());
}

let stockData;
let chart;
let stockCounts = [];
let personalStocks;

document.addEventListener('DOMContentLoaded', async () => {
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
    const startingSlider = 237;
    sliderMin.value = startingSlider;
    sliderMin.max = latestChapter;
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
        "rgba(180,140,228, 1.0)",
        "rgba(75, 192, 192, 1.0)",
        "rgba(255, 99, 132, 1.0)",
        "rgba(54, 162, 235, 1.0)",
        "rgba(255, 206, 86, 1.0)",
        "rgba(153, 102, 255, 1.0)",
        "rgba(255, 159, 64, 1.0)",
        "rgba(75, 192, 192, 1.0)",
        "rgba(255, 99, 71, 1.0)",
        "rgba(75, 0, 130, 1.0)",
        "rgba(60, 179, 113, 1.0)",
        "rgba(255, 255, 255, 1.0)"
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
        stockCounts.push(0);
    }
    loadIndividualData();
}

function updateChart() {
    const sliderMin = document.getElementById("minRange");
    const minValue = parseInt(sliderMin.value) - 207;
    let trimmedLabels = labels.slice(minValue);
    for (let i = 0; i < datasets.length; i++) {
        datasets[i].data = getRandomData(chapterCount - minValue);
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
    personalStocks = stockArr;
    stockArr.forEach((stock) => {
        stockCounts[stock.sID]++;
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
    console.log("Bought Stock", json);
    if (res.status == 200) {
        stockCounts[stockNumber] += buyCount;
        console.log(stockCounts);
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
    console.log("Sold Stock", json);
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