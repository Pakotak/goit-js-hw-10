import flatpickr from "flatpickr";


import iziToast from "izitoast";


const inputEl = document.querySelector("#datetime-picker");
const startBtn = document.querySelector("[data-start]");

const daysEl = document.querySelector("[data-days]");
const hoursEl = document.querySelector("[data-hours]");
const minutesEl = document.querySelector("[data-minutes]");
const secondsEl = document.querySelector("[data-seconds]");

let userSelectedDate = null;
let intervalId = null;

startBtn.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
    minuteIncrement: 1,
  locale: {                
    weekdays: {
      ...flatpickr.l10ns.default.weekdays,
      shorthand: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
    },
  },
  

  onClose(selectedDates) {
    const chosenDate = selectedDates[0];
    const now = new Date();

    if (chosenDate <= now) {
      userSelectedDate = null;
      startBtn.disabled = true;

      iziToast.error({
        title: "Error",
        message: "Please choose a date in the future",
        position: "topRight",
      });

      return;
    }

    userSelectedDate = chosenDate;
    startBtn.disabled = false;
  },
};

flatpickr(inputEl, options);

function addLeadingZero(value) {
  return String(value).padStart(2, "0");
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function updateUI({ days, hours, minutes, seconds }) {
  daysEl.textContent = String(days);
  hoursEl.textContent = addLeadingZero(hours);
  minutesEl.textContent = addLeadingZero(minutes);
  secondsEl.textContent = addLeadingZero(seconds);
}

function setAllZero() {
  updateUI({ days: 0, hours: 0, minutes: 0, seconds: 0 });
}

startBtn.addEventListener("click", () => {
  if (!userSelectedDate) return;

  startBtn.disabled = true;
  inputEl.disabled = true;
  tick();

  intervalId = setInterval(tick, 1000);
});

function tick() {
  const now = Date.now();
  const target = userSelectedDate.getTime();
  const delta = target - now;

  if (delta <= 0) {
    clearInterval(intervalId);
    intervalId = null;

    setAllZero();

    inputEl.disabled = false;
    startBtn.disabled = true;
    userSelectedDate = null;

    return;
  }

  const time = convertMs(delta);
  updateUI(time);
}