// ----- State: the things the app needs to remember -----
let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth(); // 0 = January, 11 = December

// ----- Grab the page elements we want to control -----
const monthLabel = document.getElementById("month-label");
const daysInfo = document.getElementById("days-info");
const prevButton = document.getElementById("prev-month");
const nextButton = document.getElementById("next-month");

// ----- Helper: how many days are in a given month? -----
function daysInMonth(year, month) {
  // Day 0 of the NEXT month is the last day of this month
  return new Date(year, month + 1, 0).getDate();
}

// ----- Draw the current month on the page -----
function showMonth() {
  const date = new Date(currentYear, currentMonth, 1);
  monthLabel.textContent = date.toLocaleString("en-US", { month: "long", year: "numeric" });
  daysInfo.textContent = "This month has " + daysInMonth(currentYear, currentMonth) + " days.";
}

// ----- Move forward or backward by one month -----
function changeMonth(step) {
  currentMonth += step;

  if (currentMonth < 0) {      // went before January
    currentMonth = 11;
    currentYear--;
  }
  if (currentMonth > 11) {     // went past December
    currentMonth = 0;
    currentYear++;
  }

  showMonth();
}

// ----- Connect the buttons to the function -----
prevButton.addEventListener("click", () => changeMonth(-1));
nextButton.addEventListener("click", () => changeMonth(1));

// ----- Show the page for the first time -----
showMonth();