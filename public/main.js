let userID, userName;
/**
 * @type {boolean}
 */
let loggedIn = false;
/**
 * Push functions to be called after logging in is detected!
 * @type {Function[]}
 */
export const loginListeners = [];

document.addEventListener('DOMContentLoaded', () => {
    const headerElement = document.getElementById('header');
    headerElement.innerHTML = `
        <div class="navbar bg-success text-accent-content">
            <!--Navbar-->
            <div class="flex-none">
                <div class="drawer">
                    <!--Menu Drawer-->
                    <input id="menu-drawer" type="checkbox" class="drawer-toggle" />
                    <div class="drawer-content">
                        <!--Menu/Hamburger Icon-->
                        <label for="menu-drawer" class="btn btn-square btn-ghost drawer-button" id="hamburgerIcon">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                class="inline-block w-5 h-5 stroke-current">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3"
                                    d="M4 6h16M4 12h16M4 18h16" stroke="white" id="hamburgerPath"></path>
                            </svg>
                        </label>
                    </div>
                    <div class="drawer-side">
                        <label for="menu-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
                        <ul class="menu p-4 w-80 min-h-full bg-base-200 text-base-content" id="navSidebarList">
                            <!-- Sidebar content here -->
                            <li><a href="/">Home</a></li>
                            <li><a href="/canon">Canon</a></li>
                            <li><a href="/investing">Investing</a></li>
                            <li><a href="/ocmaker">OC Maker v1</a></li>
                            <li><a href="/ocmaker2">OC Maker v2</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="flex-1">
                <a class="btn btn-ghost md:text-4xl text-xl" href="/" id="navHeader">Broader Briefing File</a>
            </div>
            <div class="flex-none navLinks hidden lg:flex">
                <ul class="menu menu-horizontal px-1" id="topNav">
                    <li><a href="/canon" id="canonNav" class="text-xl">Canon</a></li>
                    <li><a href="/investing" id="investingNav" class="text-xl">Investing</a></li>
                    <li><a href="/ocmaker" id="ocMakerNav" class="text-xl">OC Maker v1</a></li>
                    <li><a href="/ocmaker2" id="ocMaker2Nav" class="text-xl">OC Maker v2</a></li>
                </ul>
            </div>
            <div class="dropdown dropdown-end">
                <div tabindex="0" role="button">
                    <div class="flex-none w-10 rounded-full" id="navbarPfpContainer">
                        <img alt="Tailwind CSS Navbar component" src="/images/NavbarProfilePicture.png"
                            id="navbarPfp" />
                    </div>
                </div>
                <ul tabindex="0"
                    class="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 text-base-content rounded-box w-52"
                    id="profileDropdownList">
                </ul>
            </div>
        </div>
        <dialog id="loginModal" class="modal">
            <div class="modal-box flex flex-col text-center">
                <form>
                    <h3 class="font-bold text-2xl">Login</h3>
                    <hr class="mt-1 mb-4" />
                    <label class="input input-bordered input-accent flex items-center gap-2 w-3/4 mb-2 m-auto">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"
                            class="w-4 h-4 opacity-70">
                            <path
                                d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                        </svg>
                        <input type="text" class="grow" placeholder="Username" id="usernameInput"
                            autocomplete="username" />
                    </label>
                    <label class="input input-bordered input-accent flex items-center gap-2 w-3/4 mb-2 m-auto">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"
                            class="w-4 h-4 opacity-70">
                            <path fill-rule="evenodd"
                                d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                                clip-rule="evenodd" />
                        </svg>
                        <input type="password" class="grow" placeholder="Password" id="passwordInput"
                            autocomplete="current-password" />
                    </label>
                    <button class="btn btn-accent w-3/4 m-auto" id="modalLoginButton">Login</button>

                    <hr class="mt-4 mb-2" />
                    <ul class="text-left">
                        <li class="text-error" id="loginRule1">Username must be between 3 and 20 characters (inclusive)
                        </li>
                        <li class="text-error" id="loginRule2">Password must be between 6 and 30 characters (inclusive)
                        </li>
                        <li class="text-error" id="loginRule3">Username shouldn't be Profane</li>
                    </ul>
                </form>
            </div>
            <form method="dialog" class="modal-backdrop" id="modalClose">
                <button id="modalCloseButton">close</button>
            </form>
        </dialog>
        <dialog id="registerModal" class="modal">
            <div class="modal-box flex flex-col text-center">
                <form>
                    <h3 class="font-bold text-2xl">Register</h3>
                    <hr class="mt-1 mb-4" />
                    <label class="input input-bordered input-accent flex items-center gap-2 w-3/4 mb-2 m-auto">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"
                            class="w-4 h-4 opacity-70">
                            <path
                                d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                        </svg>
                        <input type="text" class="grow" placeholder="Username" id="usernameInputRegister"
                            autocomplete="username" />
                    </label>
                    <label class="input input-bordered input-accent flex items-center gap-2 w-3/4 mb-2 m-auto">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"
                            class="w-4 h-4 opacity-70">
                            <path fill-rule="evenodd"
                                d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                                clip-rule="evenodd" />
                        </svg>
                        <input type="password" class="grow" placeholder="Password" id="passwordInputRegister"
                            autocomplete="new-password" />
                    </label>
                    <button class="btn btn-accent w-3/4 m-auto" id="modalRegisterButton">Register</button>

                    <hr class="mt-4 mb-2" />
                    <ul class="text-left">
                        <li class="text-error" id="registerRule1">Username must be between 3 and 20 characters
                            (inclusive)</li>
                        <li class="text-error" id="registerRule2">Password must be between 6 and 30 characters
                            (inclusive)</li>
                        <li class="text-error" id="registerRule3">Username shouldn't be Profane</li>
                    </ul>
                </form>
            </div>
            <form method="dialog" class="modal-backdrop" id="modalCloseRegister">
                <button id="modalRegisterCloseButton">close</button>
            </form>
        </dialog>`;

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