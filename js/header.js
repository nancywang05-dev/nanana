document.addEventListener("DOMContentLoaded", () => {

    const header = document.createElement("header");

    header.className = "site-header";

    header.innerHTML = `
        <a href="/" class="logo">NANA</a>

        <nav class="main-nav">

            <a href="/travel-books/"
               class="nav-link"
               data-image="travel">
                TRAVEL BOOKS
            </a>

            <a href="/contact/"
               class="nav-link"
               data-image="contact">
                CONTACT
            </a>

        </nav>
    `;

    document.body.prepend(header);

});