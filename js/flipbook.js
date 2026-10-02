document.addEventListener("DOMContentLoaded", () => {
  const flipbook = document.getElementById("flipbook");
  const progress = document.querySelector(".flipbook-progress");
  const progressBar = document.querySelector(".flipbook-progress-bar");

  if (!flipbook) return;

  const pages = [];

  // --------------------------------
  // BOOK PAGES
  // --------------------------------

  // Front cover
  pages.push("cover.webp");

  // Interior pages
  for (let i = 2; i <= 78; i++) {
    pages.push(`page-${String(i).padStart(2, "0")}.webp`);
  }

  // --------------------------------
  // CREATE PAGE ELEMENTS
  // --------------------------------

  pages.forEach((page, index) => {
    const pageElement = document.createElement("div");

    pageElement.className = "book-page";

    const image = document.createElement("img");

    image.src = `pages/${page}`;
    image.alt = `Budapest Vienna Prague — Page ${index + 1}`;

    pageElement.appendChild(image);
    flipbook.appendChild(pageElement);
  });

  // --------------------------------
  // CREATE FLIPBOOK
  // --------------------------------

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

    maxShadowOpacity: 0.5,
  });

  pageFlip.loadFromHTML(document.querySelectorAll("#flipbook .book-page"));

  // --------------------------------
  // PROGRESS
  // --------------------------------

  const totalPages = pages.length;

  function updateProgress(pageIndex) {
    if (!progress || !progressBar) return;

    const percentage = (pageIndex / (totalPages - 1)) * 100;

    progressBar.style.width = `${percentage}%`;

    progress.setAttribute("aria-valuenow", pageIndex + 1);
  }

  // Initial position
  updateProgress(0);

  // --------------------------------
  // UPDATE WHEN BOOK TURNS
  // --------------------------------

  pageFlip.on("flip", (event) => {
    updateProgress(event.data);
  });

  // --------------------------------
  // CLICK / DRAG → CHANGE PAGE
  // --------------------------------

  let isDragging = false;

  function goToPosition(clientX) {
    const rect = progress.getBoundingClientRect();

    let position = (clientX - rect.left) / rect.width;

    // Keep position between 0 and 1
    position = Math.max(0, Math.min(1, position));

    // Convert position to page number
    const pageIndex = Math.round(position * (totalPages - 1));

    pageFlip.turnToPage(pageIndex);
  }

  // --------------------------------
  // CLICK
  // --------------------------------

  progress.addEventListener("click", (event) => {
    goToPosition(event.clientX);
  });

  // --------------------------------
  // MOUSE DRAG
  // --------------------------------

  progress.addEventListener("mousedown", (event) => {
    event.preventDefault();

    isDragging = true;
    goToPosition(event.clientX);
  });

  document.addEventListener("mousemove", (event) => {
    if (!isDragging) return;

    goToPosition(event.clientX);
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
  });

  // --------------------------------
  // TOUCH DRAG
  // --------------------------------

  progress.addEventListener(
    "touchstart",
    (event) => {
      isDragging = true;

      goToPosition(event.touches[0].clientX);
    },
    { passive: true },
  );

  progress.addEventListener(
    "touchmove",
    (event) => {
      if (!isDragging) return;

      goToPosition(event.touches[0].clientX);
    },
    { passive: true },
  );

  progress.addEventListener("touchend", () => {
    isDragging = false;
  });

  // --------------------------------
  // KEYBOARD ACCESS
  // --------------------------------

  progress.addEventListener("keydown", (event) => {
    const currentPage = pageFlip.getCurrentPageIndex();

    if (event.key === "ArrowRight") {
      event.preventDefault();

      pageFlip.turnToPage(Math.min(currentPage + 1, totalPages - 1));
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();

      pageFlip.turnToPage(Math.max(currentPage - 1, 0));
    }
  });
});
