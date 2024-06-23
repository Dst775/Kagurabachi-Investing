"use strict";

let userID, userName;

document.addEventListener('DOMContentLoaded', () => {
    // Select the target element
    const headerElement = document.getElementById('header');
    headerElement.innerHTML = `<div class="navbar bg-success text-accent-content">
            <!--Navbar-->
            <div class="flex-none">
                <div class="drawer">
                    <!--Menu Drawer-->
                    <input id="menu-drawer" type="checkbox" class="drawer-toggle" />
                    <div class="drawer-content">
                        <!--Menu/Hamburger Icon-->
                        <label for="menu-drawer" class="btn btn-square btn-ghost drawer-button">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                class="inline-block w-5 h-5 stroke-current">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3"
                                    d="M4 6h16M4 12h16M4 18h16"></path>
                            </svg>
                        </label>
                    </div>
                    <div class="drawer-side">
                        <label for="menu-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
                        <ul class="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
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
                <a class="btn btn-ghost text-xl" href="/">Broader Briefing File</a>
            </div>
            <div class="flex-none navLinks hidden lg:flex">
                <ul class="menu menu-horizontal px-1">
                    <li><a href="/canon" id="canonNav">Canon</a></li>
                    <li><a href="/investing" id="investingNav">Investing</a></li>
                    <li><a href="/ocmaker" id="ocMakerNav">OC Maker v1</a></li>
                    <li><a href="/ocmaker2" id="ocMaker2Nav">OC Maker v2</a></li>
                </ul>
            </div>
            <div class="dropdown dropdown-end">
                <div tabindex="0" role="button">
                    <div class="flex-none w-10 rounded-full">
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
        <div class="toast toast-end">
            <div id="globalToastContainer">
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
                        <input type="text" class="grow" placeholder="Username" id="usernameInput" />
                    </label>
                    <label class="input input-bordered input-accent flex items-center gap-2 w-3/4 mb-2 m-auto">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"
                            class="w-4 h-4 opacity-70">
                            <path fill-rule="evenodd"
                                d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                                clip-rule="evenodd" />
                        </svg>
                        <input type="password" class="grow" value="password" id="passwordInput" />
                    </label>
                    <button class="btn btn-accent w-3/4 m-auto" id="modalLoginButton">Login</button>
                </form>
            </div>
            <form method="dialog" class="modal-backdrop" id="modalClose">
                <button id="modalCloseButton">close</button>
            </form>
        </dialog>`;

    getJWT();
    document.getElementById("modalLoginButton").addEventListener("click", login);
});

async function getJWT() {
    const data = await fetch("/auth/cookie");
    const tokenJSON = await data.json();

    if (data.status == 200) {
        // Success
        loggedInDropdown(tokenJSON);
        localStorage.setItem("token", tokenJSON.token);
    } else {
        const list = document.getElementById("profileDropdownList");
        list.innerHTML = ``;

        localStorage.removeItem("token");

        const loginLI = document.createElement("li");
        const loginA = document.createElement("a");
        loginA.id = "loginButton";
        loginA.innerText = `Login`;
        loginLI.appendChild(loginA);
        list.appendChild(loginLI);

        loginA.addEventListener("click", () => {
            document.getElementById("loginModal").showModal();
        });
    }
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
    console.log("Login");
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
function makeToast(msg, alertClass, timeSeconds) {
    const toastContainer = document.getElementById("globalToastContainer");
    const div = document.createElement("div");
    div.classList.add("alert", alertClass);
    const span = document.createElement("span");
    span.innerText = msg;

    div.appendChild(span);
    toastContainer.appendChild(div);
    setTimeout(() => {
        toastContainer.removeChild(div);
    }, timeSeconds * 1000);
}