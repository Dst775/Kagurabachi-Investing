"use strict";

let userID, userName;

document.addEventListener('DOMContentLoaded', () => {
    // Select the target element
    const headerElement = document.getElementById('header');
    /*headerElement.innerHTML = `
    <div class="navbar bg-success text-accent-content">
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
    </div>
`;*/

    getJWT();
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

function login() {

}

async function logout() {
    await fetch("/auth/logout");
    getJWT();
}