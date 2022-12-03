import { TimeFormat } from "./timeFormat";
import { getDifferenceByTimeZone } from "./timezones";

const MOD_NUMBERS = 3;
const DAY_MINUTES = 60 * 24;
const LIGHT_STYLE = "color: green";
const DARK_STYLE = "color: black";

export class Clock {
  el: Element;
  added_hours: number = 0;
  added_minutes: number = 0;
  mode_index: number = 0;
  timezone: string;
  timezone_difference_minutes: number;
  light: boolean = false;
  time_format: TimeFormat = TimeFormat._24_Hours;
  display_time: Element;
  modeButton: Element;
  increaseButton: Element;
  changeFormatButton: Element;
  toggleLightButton: Element;
  resetButton: Element;

  constructor(element: Element, _timezone: string) {
    this.timezone = _timezone;
    this.timezone_difference_minutes = getDifferenceByTimeZone(_timezone);

    this.el = element;
    this.display_time = document.createElement("p");
    this.display_time.setAttribute("style", DARK_STYLE);

    this.modeButton = document.createElement("Button");
    this.modeButton.innerHTML = "Mode";
    this.modeButton.addEventListener("click", (e: Event) => this.changeMode());

    this.increaseButton = document.createElement("Button");
    this.increaseButton.innerHTML = "Increase";
    this.increaseButton.addEventListener("click", (e: Event) =>
      this.increase()
    );

    this.toggleLightButton = document.createElement("Button");
    this.toggleLightButton.innerHTML = "Light";
    this.toggleLightButton.addEventListener("click", (e: Event) =>
      this.toggleLight()
    );

    this.resetButton = document.createElement("Button");
    this.resetButton.innerHTML = "Reset";
    this.resetButton.addEventListener("click", (e: Event) => this.reset());

    this.changeFormatButton = document.createElement("Button");
    this.changeFormatButton.innerHTML = "Change Format";
    this.changeFormatButton.addEventListener("click", (e: Event) =>
      this.switchTimeFormat()
    );

    this.el.appendChild(this.display_time);
    this.el.appendChild(this.modeButton);
    this.el.appendChild(this.increaseButton);
    this.el.appendChild(this.toggleLightButton);
    this.el.appendChild(this.resetButton);
    this.el.appendChild(this.changeFormatButton);
    setInterval(() => this.run(), 1000);
  }

  toggleLight() {
    this.light = !this.light;
    this.display_time.setAttribute(
      "style",
      this.light ? LIGHT_STYLE : DARK_STYLE
    );
  }

  getFormattedTime(hours: number, minutes: number, seconds: number): string {
    let minutes_str = minutes.toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false,
    });
    let seconds_str = seconds.toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false,
    });
    let XM = "";
    if (this.time_format === TimeFormat._12_Hours) {
      XM = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      if (hours == 0) hours = 12;
    }
    let hours_str = hours.toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false,
    });
    return `${hours_str}:${minutes_str}:${seconds_str} ${XM} | ${this.timezone}`;
  }

  run() {
    const time = new Date();
    let hours = time.getUTCHours();
    let minutes = time.getUTCMinutes();
    let seconds = time.getUTCSeconds();
    let time_in_minutes =
      (hours + this.added_hours) * 60 + (minutes + this.added_minutes);
    time_in_minutes += this.timezone_difference_minutes;
    time_in_minutes %= DAY_MINUTES;
    if (time_in_minutes < 0) {
      time_in_minutes += DAY_MINUTES;
    }
    hours = Math.floor(time_in_minutes / 60);
    minutes = time_in_minutes % 60;
    this.display_time.textContent = this.getFormattedTime(
      hours,
      minutes,
      seconds
    );
  }

  changeMode() {
    this.mode_index += 1;
    this.mode_index %= MOD_NUMBERS;
  }

  increaseHours() {
    this.added_hours += 1;
    this.added_hours %= 24;
  }

  increaseMinutes() {
    this.added_minutes += 1;
    this.added_minutes %= 60;
  }

  switchTimeFormat() {
    if (this.time_format === TimeFormat._12_Hours)
      this.time_format = TimeFormat._24_Hours;
    else if (this.time_format === TimeFormat._24_Hours)
      this.time_format = TimeFormat._12_Hours;
  }

  increase() {
    switch (this.mode_index) {
      case 1: {
        this.increaseHours();
        break;
      }
      case 2: {
        this.increaseMinutes();
        break;
      }
    }
  }

  reset() {
    this.added_hours = 0;
    this.added_minutes = 0;
  }
}
