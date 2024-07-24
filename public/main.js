/* global loggedIn:writable */

let userID, userName;
/**
 * Push functions to be called after logging in is detected!
 * @type {Function[]}
 */
export const loginListeners = [];
document.addEventListener('DOMContentLoaded', () => {
    const headerElement = document.getElementById('header');
    getJWT();
    document.getElementById("modalLoginButton").addEventListener("click", login);
    document.getElementById("modalRegisterButton").addEventListener("click", register);
    accountRuleInputs();
});

function accountRuleInputs() {
    const usernameLogin = document.getElementById("usernameInput");
    const usernameRegister = document.getElementById("usernameInputRegister");
    usernameLogin.addEventListener("input", () => { rule1("loginRule1", usernameLogin) });
    usernameRegister.addEventListener("input", () => { rule1("registerRule1", usernameRegister) });

    const passwordLogin = document.getElementById("passwordInput");
    const passwordRegister = document.getElementById("passwordInputRegister");
    passwordLogin.addEventListener("input", () => { rule2("loginRule2", passwordLogin) });
    passwordRegister.addEventListener("input", () => { rule2("registerRule2", passwordRegister) });

    function rule1(id, inputElement) {
        const loginRule1 = document.getElementById(id);
        loginRule1.classList = "";
        if (inputElement.value.length >= 3 && inputElement.value.length <= 20) {
            loginRule1.classList.add("text-success");
        } else {
            loginRule1.classList.add("text-error");
        }
    }

    function rule2(id, inputElement) {
        const loginRule2 = document.getElementById(id);
        loginRule2.classList = "";
        if (inputElement.value.length >= 6 && inputElement.value.length <= 30) {
            loginRule2.classList.add("text-success");
        } else {
            loginRule2.classList.add("text-error");
        }
    }
}

async function getJWT() {
    const data = await fetch("/auth/cookie");
    const tokenJSON = await data.json();
    const loggedInArea = document.getElementById("loggedInArea");

    if (data.status == 200) {
        // Success
        loggedInDropdown(tokenJSON);
        if (loggedInArea) {
            loggedInArea.classList.remove("blockedArea");
        }
        loggedIn = true;
        console.log("Logged In", loginListeners);
        loginListeners.forEach(async f => {
            await f();
        });
    } else {
        loggedOutDropdown();
        if (loggedInArea) {
            loggedInArea.classList.add("blockedArea");
        }
        loggedIn = false;
    }
}

/**
 * @returns {boolean}
 */
export function isLoggedIn() {
    return loggedIn;
}

function loggedOutDropdown() {
    const list = document.getElementById("profileDropdownList");
    list.innerHTML = ``;

    const loginLI = document.createElement("li");
    const loginA = document.createElement("a");
    loginA.id = "loginButton";
    loginA.innerText = `Login`;
    loginLI.appendChild(loginA);
    list.appendChild(loginLI);

    loginA.addEventListener("click", () => {
        document.getElementById("loginModal").showModal();
    });

    const registerLI = document.createElement("li");
    const registerA = document.createElement("a");
    registerA.id = "registerButton";
    registerA.innerText = `Register`;
    registerLI.appendChild(registerA);
    list.appendChild(registerLI);

    registerA.addEventListener("click", () => {
        document.getElementById("registerModal").showModal();
    });
}

function loggedInDropdown(tokenJSON) {
    const list = document.getElementById("profileDropdownList");
    list.innerHTML = ``;

    userName = tokenJSON.msg.name;
    userID = tokenJSON.msg.userID;

    const nameLI = document.createElement("li");
    const nameA = document.createElement("a");
    nameA.innerText = `Logged in as ${tokenJSON.msg.name}`;
    nameLI.appendChild(nameA);
    list.appendChild(nameLI);

    const logoutLI = document.createElement("li");
    const logoutA = document.createElement("a");
    logoutA.id = "logoutButton";
    logoutA.innerText = `Logout`;
    logoutLI.appendChild(logoutA);
    list.appendChild(logoutLI);

    logoutA.addEventListener("click", logout);
}

async function login() {
    const loginButton = document.getElementById("modalLoginButton");
    loginButton.setAttribute("disabled", "true");
    const nameInput = document.getElementById("usernameInput");
    const passwordInput = document.getElementById("passwordInput");
    // Fetch
    const response = await fetch("/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: nameInput.value,
            password: passwordInput.value
        })
    });
    const data = await response.json();
    if (response.status == 200) {
        document.getElementById("modalCloseButton").click();
        makeToast(data.msg, "alert-success", 2);
        getJWT();
    } else {
        makeToast(data.msg, "alert-error", 2);
    }
    loginButton.removeAttribute("disabled");
}

async function register() {
    const registerButton = document.getElementById("modalRegisterButton");
    registerButton.setAttribute("disabled", "true");
    const nameInput = document.getElementById("usernameInputRegister");
    const passwordInput = document.getElementById("passwordInputRegister");
    // Fetch
    const response = await fetch("/auth/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: nameInput.value,
            password: passwordInput.value
        })
    });
    const data = await response.json();
    if (response.status == 200) {
        document.getElementById("modalRegisterCloseButton").click();
        makeToast(data.msg, "alert-success", 2);
        makeToast("Attempting Login", "alert-warning", 2);

        const loginNameInput = document.getElementById("usernameInput");
        const loginPasswordInput = document.getElementById("passwordInput");
        loginNameInput.value = nameInput.value;
        loginPasswordInput.value = passwordInput.value;
        login();
    } else {
        makeToast(data.msg, "alert-error", 2);
    }
    registerButton.removeAttribute("disabled");
}

async function logout() {
    await fetch("/auth/logout");
    getJWT();
}

/**
 * 
 * @param {string} msg The message for the toast 
 * @param {string} alertClass Color for toast, alert-info, alert-success, etc 
 * @param {number} timeSeconds Time to display in Seconds 
 */
export function makeToast(msg, alertClass, timeSeconds) {
    const toastContainer = document.getElementById("globalToastContainer");
    const div = document.createElement("div");
    div.classList.add("alert", "alert-outline", alertClass);
    const span = document.createElement("span");
    span.innerText = msg;

    div.appendChild(span);
    toastContainer.appendChild(div);
    setTimeout(() => {
        toastContainer.removeChild(div);
    }, timeSeconds * 1000);
}