// ----- State: the things the app needs to remember -----
let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth(); // 0 = January, 11 = December

let habits = [];   // list of habits, e.g. [{ id: 1, name: "Drink water" }]
let entries = {};  // done days, e.g. { "2026-10": { "1": { "5": true } } }
let nextId = 1;    // gives every new habit its own unique id

// ----- Grab the page elements we want to control -----
const monthLabel = document.getElementById("month-label");
const prevButton = document.getElementById("prev-month");
const nextButton = document.getElementById("next-month");
const habitTable = document.getElementById("habit-table");
const addHabitButton = document.getElementById("add-habit");

// ----- Helpers -----
function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

// A text key like "2026-10" so each month has its own checkmarks
function monthKey() {
  return currentYear + "-" + (currentMonth + 1);
}

function isDone(habitId, day) {
  const month = entries[monthKey()];
  return !!(month && month[habitId] && month[habitId][day]);
}

// ----- Actions -----
function toggleDay(habitId, day) {
  const key = monthKey();
  if (!entries[key]) entries[key] = {};
  if (!entries[key][habitId]) entries[key][habitId] = {};

  entries[key][habitId][day] = !entries[key][habitId][day];
  renderHabitTable();
}

function addHabit() {
  habits.push({ id: nextId, name: "" });
  nextId++;
  renderHabitTable();

  // put the cursor in the new habit's name box
  const inputs = document.querySelectorAll(".habit-input");
  inputs[inputs.length - 1].focus();
}

function removeHabit(habitId) {
  habits = habits.filter(function (habit) {
    return habit.id !== habitId;
  });
  // also forget its checkmarks in every month
  for (const key in entries) {
    delete entries[key][habitId];
  }
  renderHabitTable();
}

// ----- Draw the habit grid -----
function renderHabitTable() {
  const totalDays = daysInMonth(currentYear, currentMonth);
  habitTable.innerHTML = "";

  // header row: "Habit", 1, 2, 3 ... last day
  const headRow = document.createElement("tr");
  const corner = document.createElement("th");
  corner.textContent = "Habit";
  corner.className = "habit-col";
  headRow.appendChild(corner);

  for (let day = 1; day <= totalDays; day++) {
    const th = document.createElement("th");
    th.textContent = day;
    headRow.appendChild(th);
  }
  habitTable.appendChild(headRow);

  // one row per habit
  habits.forEach(function (habit) {
    const row = document.createElement("tr");

    // first cell: name box + remove button
    const nameCell = document.createElement("td");
    nameCell.className = "habit-col";

    const input = document.createElement("input");
    input.className = "habit-input";
    input.placeholder = "Habit name";
    input.value = habit.name;
    input.addEventListener("input", function () {
      habit.name = input.value;
    });

    const removeButton = document.createElement("button");
    removeButton.className = "remove-btn";
    removeButton.textContent = "×";
    removeButton.addEventListener("click", function () {
      removeHabit(habit.id);
    });

    nameCell.appendChild(input);
    nameCell.appendChild(removeButton);
    row.appendChild(nameCell);

    // one clickable cell for each day
    for (let day = 1; day <= totalDays; day++) {
      const cell = document.createElement("td");
      cell.className = "day-cell";
      if (isDone(habit.id, day)) {
        cell.classList.add("done");
        cell.textContent = "✓";
      }
      cell.addEventListener("click", function () {
        toggleDay(habit.id, day);
      });
      row.appendChild(cell);
    }

    habitTable.appendChild(row);
  });
}

// ----- Draw the whole page for the current month -----
function showMonth() {
  const date = new Date(currentYear, currentMonth, 1);
  monthLabel.textContent = date.toLocaleString("en-US", { month: "long", year: "numeric" });
  renderHabitTable();
}

function changeMonth(step) {
  currentMonth += step;

  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }

  showMonth();
}

// ----- Connect the buttons -----
prevButton.addEventListener("click", function () { changeMonth(-1); });
nextButton.addEventListener("click", function () { changeMonth(1); });
addHabitButton.addEventListener("click", addHabit);

// ----- Start -----
showMonth();