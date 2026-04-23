
/* =========================
   STATE
========================= */

let currentDate = new Date();

let projects = {};
let currentProject = null;

/* =========================
   TAB SWITCH
========================= */

function showTab(tab) {
  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  document.getElementById(tab).classList.add("active");

  if (tab === "calendar") renderCalendar();
  if (tab === "board") renderBoard();
}

/* =========================
   PROJECT SYSTEM (FIXED)
========================= */

function createProject() {
  const name = prompt("Project name:");
  if (!name) return;

  projects[name] = {
    tasks: {
      todo: [],
      progress: [],
      done: []
    },
    collaborators: [],
    calendar: {}
  };

  currentProject = name;
  updateProjectDropdown();
  renderBoard();
}

/* SWITCH PROJECT */
function switchProject() {
  currentProject = document.getElementById("projectSelect").value;
  renderBoard();
  renderCollaborators();
}

/* DROPDOWN */
function updateProjectDropdown() {
  const select = document.getElementById("projectSelect");
  if (!select) return;

  select.innerHTML = "";

  Object.keys(projects).forEach(p => {
    const opt = document.createElement("option");
    opt.value = p;
    opt.innerText = p;
    select.appendChild(opt);
  });

  select.value = currentProject;
}

/* =========================
   TASK SYSTEM (FIXED PROPERLY)
========================= */

function addTask(column) {
  if (!currentProject) return alert("Create a project first!");

  const text = prompt("Task:");
  if (!text) return;

  // SAVE IN DATA MODEL (IMPORTANT FIX)
  projects[currentProject].tasks[column].push(text);

  renderBoard();
}

/* RENDER BOARD FROM DATA (IMPORTANT FIX) */
function renderBoard() {
  if (!currentProject) return;

  ["todo", "progress", "done"].forEach(col => {
    const container = document.querySelector(`#${col} .task-list`);
    container.innerHTML = "";

    projects[currentProject].tasks[col].forEach(taskText => {
      const div = document.createElement("div");
      div.className = "task";
      div.innerText = taskText;
      container.appendChild(div);
    });
  });
}

/* =========================
   CALENDAR (FIXED LAYOUT)
========================= */

function renderCalendar() {
  const calendar = document.getElementById("calendarGrid");
  if (!calendar) return;

  calendar.innerHTML = "";

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();

  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  /* WRAPPER (FIX IMPORTANT FOR SHRINKING) */
  const wrapper = document.createElement("div");
  wrapper.className = "calendar-wrapper";

  /* HEADER */
  const header = document.createElement("div");
  header.className = "calendar-header";

  const prev = document.createElement("button");
  prev.innerText = "←";
  prev.onclick = () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
  };

  const title = document.createElement("h3");
  title.innerText = `${monthNames[month]} ${year}`;

  const next = document.createElement("button");
  next.innerText = "→";
  next.onclick = () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
  };

  header.append(prev, title, next);
  wrapper.appendChild(header);

  /* GRID */
  const grid = document.createElement("div");
  grid.className = "calendar-grid";

  const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

  days.forEach(d => {
    const el = document.createElement("div");
    el.className = "day-name";
    el.innerText = d;
    grid.appendChild(el);
  });

  const firstDay = new Date(year, month, 1).getDay();
  for (let i = 0; i < firstDay; i++) {
    grid.appendChild(document.createElement("div"));
  }

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let i = 1; i <= daysInMonth; i++) {
    const day = document.createElement("div");
    day.className = "day";
    day.innerHTML = `<strong>${i}</strong>`;

    day.onclick = () => {
      const text = prompt("Event:");
      if (!text) return;

      const event = document.createElement("div");
      event.className = "event";
      event.innerText = text;

      day.appendChild(event);
    };

    grid.appendChild(day);
  }

  wrapper.appendChild(grid);
  calendar.appendChild(wrapper);
}

/* =========================
   COLLABORATORS (FIXED PER PROJECT)
========================= */

function addCollaborator() {
  if (!currentProject) return alert("Create project first!");

  const email = document.getElementById("emailInput").value;
  if (!email) return;

  projects[currentProject].collaborators.push(email);

  renderCollaborators();

  document.getElementById("emailInput").value = "";
}

function renderCollaborators() {
  const box = document.getElementById("collaborators");
  if (!box) return;

  box.innerHTML = "";

  if (!currentProject) return;

  projects[currentProject].collaborators.forEach(email => {
    const div = document.createElement("div");
    div.innerText = email;
    box.appendChild(div);
  });
}

/* =========================
   INIT
========================= */

window.onload = () => {
  updateProjectDropdown();
};