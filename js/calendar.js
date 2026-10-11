const memories = [
  {
    id: "photo-wall",
    start: "2026-10-09",
    end: "2026-10-09",
    symbolImage: "../images/memories/20261009.png",
    title: "wall of fame?",
    text: "Today I gathered my photos and taped them all to the wall, capturing the plot so far.",
    photos: [
      {
        src: "../images/memories/20261009-photowall.jpg",
        caption: "my photo wall",
      },
    ],
  },
  {
    id: "headphone",
    start: "2026-10-11",
    end: "2026-10-11",
    symbolImage: "../images/memories/20261011.png",
    title: "good news bad news",
    text: "Bad news: my headphones started having connectivity issues after just 10 months. \nGood news: the repair was covered by warranty (otherwise, it would've cost me $300+). \nTo recover from this little tragedy, I treated myself to a blind-box jewelry case.",
    photos: [
      {
        src: "../images/memories/20261011-apm.jpg",
        caption: "the survivors",
      },
      {
        src: "../images/memories/20261011-coffee.jpg",
        caption: "the pattern matches!",
      },
      {
        src: "../images/memories/20261011-blindbox.jpg",
        caption: "a little treat",
      },
    ],
  },
];

const daysEl = document.getElementById("calendar-days");
const monthLabel = document.getElementById("month-label");
const overlay = document.getElementById("memory-overlay");
const deck = document.getElementById("photo-deck");

const today = new Date();

let displayedMonth = new Date(today.getFullYear(), today.getMonth(), 1);

let lastFocused = null;

const pad = (n) => String(n).padStart(2, "0");

const dateKey = (d) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

const formatDate = (iso) =>
  new Date(iso + "T12:00:00").toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

const dateInRange = (iso, start, end) => iso >= start && iso <= end;

// ========================================
// Render calendar
// ========================================

function renderCalendar() {
  const year = displayedMonth.getFullYear();
  const month = displayedMonth.getMonth();

  monthLabel.textContent = displayedMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  daysEl.innerHTML = "";

  const firstDay = new Date(year, month, 1).getDay();
  const count = new Date(year, month + 1, 0).getDate();
  const totalCells = Math.ceil((firstDay + count) / 7) * 7;

  for (let cell = 0; cell < totalCells; cell++) {
    const dayNum = cell - firstDay + 1;

    const cellDate =
      dayNum > 0 && dayNum <= count ? new Date(year, month, dayNum) : null;

    const cellEl = document.createElement("div");
    cellEl.className = "day";

    if (!cellDate) {
      cellEl.classList.add("empty");
      cellEl.setAttribute("aria-hidden", "true");
      daysEl.appendChild(cellEl);
      continue;
    }

    const iso = dateKey(cellDate);

    const memory = memories.find((m) => dateInRange(iso, m.start, m.end));

    const number = document.createElement("span");
    number.className = "day-number";
    number.textContent = dayNum;

    cellEl.appendChild(number);

    if (memory) {
      cellEl.classList.add("has-memory");
      cellEl.tabIndex = 0;
      cellEl.setAttribute("role", "button");

      const rangeText =
        memory.end > memory.start ? ` to ${formatDate(memory.end)}` : "";

      cellEl.setAttribute(
        "aria-label",
        `${formatDate(memory.start)}${rangeText}: ${memory.title}`,
      );

      const doodle = document.createElement("span");
      doodle.className = "doodle";

      const art = document.createElement("span");
      art.className = "doodle-art";

      if (memory.symbolImage) {
        const img = document.createElement("img");
        img.src = memory.symbolImage;
        img.alt = "";
        img.className = "calendar-symbol-image";

        art.appendChild(img);
      } else {
        art.textContent = memory.symbol || "✦";
      }

      doodle.appendChild(art);

      if (memory.label) {
        const label = document.createElement("span");
        label.className = "doodle-label";
        label.textContent = memory.label;

        doodle.appendChild(label);
      }

      cellEl.appendChild(doodle);

      cellEl.addEventListener("click", () => {
        openMemory(memory);
      });

      cellEl.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openMemory(memory);
        }
      });
    }

    daysEl.appendChild(cellEl);
  }
}

// ========================================
// Update photo deck layout
// ========================================

function updatePhotoDeck() {
  const cards = [...deck.querySelectorAll(".photo-card")];

  const selectedIndex = cards.findIndex((card) =>
    card.classList.contains("selected"),
  );

  // Clear previous side-card classes.
  cards.forEach((card) => {
    card.classList.remove("previous-photo", "next-photo");
  });

  if (selectedIndex === -1 || cards.length < 2) {
    return;
  }

  // Find the previous and next cards.
  const previousIndex = (selectedIndex - 1 + cards.length) % cards.length;

  const nextIndex = (selectedIndex + 1) % cards.length;

  // Show the neighboring cards.
  cards[previousIndex].classList.add("previous-photo");
  cards[nextIndex].classList.add("next-photo");
}

// ========================================
// Open memory and create photo cards
// ========================================

function openMemory(memory) {
  lastFocused = document.activeElement;

  document.getElementById("memory-date").textContent =
    memory.end > memory.start
      ? `${formatDate(memory.start)} — ${formatDate(memory.end)}`
      : formatDate(memory.start);

  document.getElementById("memory-title").textContent =
    memory.title || "A little moment";

  const text = document.getElementById("memory-text");

  text.textContent = memory.text || "";
  text.style.display = memory.text ? "block" : "none";

  // Remove cards from the previously opened memory.
  deck.innerHTML = "";

  // Create a photo card for each photo.
  (memory.photos || []).forEach((photo, i) => {
    const card = document.createElement("button");

    card.type = "button";

    // Select the first photo by default.
    card.className = "photo-card" + (i === 0 ? " selected" : "");

    card.setAttribute("aria-label", photo.caption || `Photo ${i + 1}`);

    const art = document.createElement("span");
    art.className = "photo-art";

    if (photo.src) {
      const img = document.createElement("img");

      img.src = photo.src;
      img.alt = photo.caption || "";

      art.appendChild(img);
    } else {
      const symbol = document.createElement("span");

      symbol.textContent = photo.symbol || "✧";

      art.appendChild(symbol);
    }

    const caption = document.createElement("span");

    caption.className = "photo-caption";
    caption.textContent = photo.caption || "";

    card.append(art, caption);

    // Select the clicked card and rearrange the deck.
    card.addEventListener("click", () => {
      deck
        .querySelectorAll(".photo-card")
        .forEach((c) => c.classList.remove("selected"));

      card.classList.add("selected");

      updatePhotoDeck();
    });

    deck.appendChild(card);
  });

  // Arrange the initial photo cards.
  updatePhotoDeck();

  overlay.classList.add("open");
  overlay.setAttribute("aria-hidden", "false");

  document.getElementById("close-memory").focus();
}

// ========================================
// Close memory
// ========================================

function closeMemory() {
  overlay.classList.remove("open");
  overlay.setAttribute("aria-hidden", "true");

  if (lastFocused && lastFocused.focus) {
    lastFocused.focus();
  }
}

// Close button.
document.getElementById("close-memory").addEventListener("click", closeMemory);

// Close when clicking the backdrop.
overlay.addEventListener("click", (e) => {
  if (e.target === overlay) {
    closeMemory();
  }
});

// Close with Escape.
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && overlay.classList.contains("open")) {
    closeMemory();
  }
});

// ========================================
// Month navigation
// ========================================

// Previous month.
document.getElementById("prev-month").addEventListener("click", () => {
  displayedMonth = new Date(
    displayedMonth.getFullYear(),
    displayedMonth.getMonth() - 1,
    1,
  );

  renderCalendar();
});

// Next month.
document.getElementById("next-month").addEventListener("click", () => {
  displayedMonth = new Date(
    displayedMonth.getFullYear(),
    displayedMonth.getMonth() + 1,
    1,
  );

  renderCalendar();
});

// ========================================
// Initial render
// ========================================

renderCalendar();
