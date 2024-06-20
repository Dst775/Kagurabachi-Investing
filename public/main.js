document.addEventListener('DOMContentLoaded', () => {
    // Select the target element
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
`;
});  