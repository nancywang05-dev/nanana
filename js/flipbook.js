document.addEventListener("DOMContentLoaded", () => {

    const flipbook = document.getElementById("flipbook");

    if (!flipbook) return;

    const pages = [];

    // Front cover
    pages.push("cover.webp");

    // Interior pages
    for (let i = 2; i <= 78; i++) {
        pages.push(`page-${String(i).padStart(2, "0")}.webp`);
    }

    // Create the page elements
    pages.forEach((page, index) => {

        const pageElement = document.createElement("div");

        pageElement.className = "book-page";

        const image = document.createElement("img");

        image.src = `pages/${page}`;
        image.alt = `Budapest Vienna Prague — Page ${index + 1}`;

        pageElement.appendChild(image);
        flipbook.appendChild(pageElement);

    });

    // Create the flipbook
    const pageFlip = new St.PageFlip(flipbook, {

        width: 900,
        height: 900,

        size: "stretch",

        minWidth: 300,
        maxWidth: 1400,

        minHeight: 300,
        maxHeight: 1400,

        drawShadow: true,
        flippingTime: 800,

        usePortrait: true,
        startPage: 0,

        showCover: true,
        mobileScrollSupport: true,

        maxShadowOpacity: 0.5
    });

    pageFlip.loadFromHTML(
        document.querySelectorAll("#flipbook .book-page")
    );

});