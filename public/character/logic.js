"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rankings_js_1 = require("./rankings.js");
var character_js_1 = require("./character.js");
document.addEventListener('DOMContentLoaded', function () {
    // Get Character
    var currentURL = window.location.href;
    var url = new URL(currentURL);
    var queryParams = new URLSearchParams(url.search);
    var characterID = queryParams.get("id");
    var characterData = character_js_1.default[Number(characterID || "0")];
    // Emblem
    document.getElementById("emblem").addEventListener("load", function () {
        var emblemElement = document.querySelector("#emblem");
        if (emblemElement) {
            var contentDocument = emblemElement.contentDocument;
            if (contentDocument) {
                contentDocument.querySelector("#RankABC").textContent = rankings_js_1.default[characterData.Squad].rank;
                contentDocument.querySelector("#RankText").textContent = rankings_js_1.default[characterData.Squad].position;
                if (rankings_js_1.default[characterData.Squad].rank == "B") {
                    contentDocument.querySelector("#RankText").style.fontSize = "7.9";
                }
                contentDocument.querySelector("#RankFill").style.fill = rankings_js_1.default[characterData.Squad].color;
                contentDocument.querySelector("#image1").setAttribute("href", "");
            }
        }
    });
    // Name + Other Text
    document.getElementById("characterName").innerText = characterData["Name (Western)"];
    document.getElementById("position").innerText = "POSITION: ".concat(characterData.Position.toUpperCase() || "UNKNOWN");
    document.getElementById("age").innerText = "AGE: ".concat(characterData.Age || "?", " YEARS OLD");
    document.getElementById("birthday").innerText = "BIRTHDAY: ".concat(convertDateToString(characterData.BirthMonth, characterData.BirthDay) || "UNKNOWN");
    document.getElementById("height").innerText = "HEIGHT: ".concat(characterData.Height || "UNKNOWN ", "CM");
    document.getElementById("bloodType").innerText = "BLOOD TYPE: ".concat(characterData.BloodType || "UNKNOWN");
    document.getElementById("zodiac").innerText = "ZODIAC: THE ".concat(characterData.Zodiac.toUpperCase() || "UNKNOWN");
    // document.getElementById("occupation").innerText = `OCCUPATION: ` + characterData.Occupation; // TODO
    // document.getElementById("likes").innerText = `LIKES: ` + characterData.Likes; // TODO
    displayTriggers(characterData);
    // Radar Chart
    document.getElementById("totalNumber").innerText = String(Number(characterData.Trion) + Number(characterData.Attack) + Number(characterData.DefenceSupport) + Number(characterData.Mobility) + Number(characterData.Skill) + Number(characterData.Range) + Number(characterData.Command) + Number(characterData.SpecialTactics));
    var ctx = document.getElementById("radarChart").getContext("2d");
    var data = {
        labels: [
            ['TRION', "".concat(characterData.Trion || 1)],
            ['ATTACK', "".concat(characterData.Attack).padStart(7, ' ')],
            ['DEFENSE', 'SUPPORT', "".concat(characterData.DefenceSupport).padStart(8, ' ')],
            ['MOBILITY', "".concat(characterData.Mobility).padStart(8, ' ')],
            ['SKILL', "".concat(characterData.Skill)],
            ['RANGE', "".concat(characterData.Range).padEnd(6, ' ')],
            ['COMMAND', "".concat(characterData.Command).padEnd(8, ' ')],
            ['SPECIAL', 'TACTICS', "".concat(characterData.SpecialTactics).padEnd(8, ' ')]
        ],
        datasets: [{
                label: '',
                data: [
                    "".concat(characterData.Trion || 1),
                    "".concat(characterData.Attack),
                    "".concat(characterData.DefenceSupport),
                    "".concat(characterData.Mobility),
                    "".concat(characterData.Skill),
                    "".concat(characterData.Range),
                    "".concat(characterData.Command),
                    "".concat(characterData.SpecialTactics)
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
function displayTriggers(characterData) {
    var mainTriggers = [characterData.Main1, characterData.Main2, characterData.Main3, characterData.Main4];
    var subTriggers = [characterData.Sub1, characterData.Sub2, characterData.Sub3, characterData.Sub4];
    for (var i = 1; i <= 4; i++) {
        if (mainTriggers[i - 1] === "") {
            document.getElementById("mainTrigger".concat(i)).classList.add("freeTrigger");
        }
        else {
            document.getElementById("mainTrigger".concat(i)).classList.remove("freeTrigger");
        }
        document.getElementById("main".concat(i, "Image")).setAttribute("src", getTriggerImage(mainTriggers[i - 1]));
        document.getElementById("main".concat(i, "Name")).innerText = mainTriggers[i - 1].toUpperCase().replace(":", ":\n") || "FREE TRIGGER";
        document.getElementById("main".concat(i, "Type")).innerText = getTriggerType(mainTriggers[i - 1]);
        if (subTriggers[i - 1] === "") {
            document.getElementById("subTrigger".concat(i)).classList.add("freeTrigger");
        }
        else {
            document.getElementById("subTrigger".concat(i)).classList.remove("freeTrigger");
        }
        document.getElementById("sub".concat(i, "Image")).setAttribute("src", getTriggerImage(subTriggers[i - 1]));
        document.getElementById("sub".concat(i, "Name")).innerText = subTriggers[i - 1].toUpperCase().replace(":", ":\n") || "FREE TRIGGER";
        document.getElementById("sub".concat(i, "Type")).innerText = getTriggerType(subTriggers[i - 1]);
    }
}
function getTriggerImage(triggerName) {
    var triggerImageMap = {
        "Opt": "../images/triggers/opt.png",
        "Shield": "../images/triggers/shi.png",
        "Switchbox": "../images/triggers/switchbox.png",
        "Free": "../images/triggers/free.png",
        // Sniper
        "Egret": "../images/triggers/egret.png",
        "Ibis": "../images/triggers/ibis.png",
        "Lightning": "../images/triggers/light.png",
        // Gunner
        "handgun": "../images/triggers/handgun.png",
        "grenade launcher": "../images/triggers/grenade.png",
        "shotgun": "../images/triggers/shot.png",
        "assault rifle": "../images/triggers/arifle.png",
        // Shooter
        "Asteroid": "../images/triggers/aster.png",
        "Hound": "../images/triggers/hound.png",
        "Meteor": "../images/triggers/mete.png",
        "Viper": "../images/triggers/viper.png",
        // Attacker
        "Kogetsu": "../images/triggers/koget.png",
        "Raygust": "../images/triggers/ray.png",
        "Scorpion": "../images/triggers/sco.png",
        "spear": "../images/triggers/speark.png",
        "Sogetsu": "../images/triggers/soget.png"
    };
    if (triggerName === "") {
        return triggerImageMap.Free;
    }
    for (var currentTrigger in triggerImageMap) {
        if (triggerName.includes(currentTrigger)) {
            return triggerImageMap[currentTrigger];
        }
    }
    return triggerImageMap.Opt;
}
function getTriggerType(triggerName) {
    var triggerTypeMap = {
        "Opt": "OPTION TRIGGER",
        "Shield": "DEFENSE TRIGGER",
        "Switchbox": "TRAPPER TRIGGER",
        "Free": "FREE TRIGGER",
        // Sniper
        "Egret": "SNIPER TRIGGER",
        "Ibis": "SNIPER TRIGGER",
        "Lightning": "SNIPER TRIGGER",
        // Gunner
        "handgun": "GUNNER TRIGGER",
        "grenade launcher": "GUNNER TRIGGER",
        "shotgun": "GUNNER TRIGGER",
        "assault rifle": "GUNNER TRIGGER",
        // Shooter
        "Asteroid": "SHOOTER TRIGGER",
        "Hound": "SHOOTER TRIGGER",
        "Meteor": "SHOOTER TRIGGER",
        "Viper": "SHOOTER TRIGGER",
        // Attacker
        "Kogetsu": "ATTACKER TRIGGER",
        "Raygust": "ATTACKER TRIGGER",
        "Scorpion": "ATTACKER TRIGGER",
        "spear": "ATTACKER TRIGGER",
        "Sogetsu": "ATTACKER TRIGGER"
    };
    if (triggerName === "") {
        return triggerTypeMap.Free;
    }
    for (var currentTrigger in triggerTypeMap) {
        if (triggerName.includes(currentTrigger)) {
            return triggerTypeMap[currentTrigger];
        }
    }
    return triggerTypeMap.Opt;
}
function convertDateToString(month, day) {
    if (month === "" || day === "") {
        return "";
    }
    var months = [
        "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
        "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
    ];
    var monthNum = Number(month);
    var dayNum = Number(day);
    var monthName = months[monthNum - 1];
    var ordinalSuffix = getOrdinalSuffix(dayNum);
    return "".concat(monthName, " ").concat(day).concat(ordinalSuffix);
}
function getOrdinalSuffix(day) {
    if (day > 3 && day < 21)
        return "TH";
    switch (day % 10) {
        case 1: return "ST";
        case 2: return "ND";
        case 3: return "RD";
        default: return "TH";
    }
}
