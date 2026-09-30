document.addEventListener("DOMContentLoaded", () => {

    const header = document.createElement("header");

    header.className = "site-header";

    header.innerHTML = `
        <a href="/nanana/" class="logo">NANA</a>

        <nav class="main-nav">

            <a href="/nanana/travel-books/"
               class="nav-link"
               data-image="travel">
                TRAVEL BOOKS
            </a>

            <a href="/nanana/contact/"
               class="nav-link"
               data-image="contact">
                CONTACT
            </a>

        </nav>
    `;

    document.body.prepend(header);

});