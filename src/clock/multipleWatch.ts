import { Clock } from "./clock";
import { timezones } from "./timezones";
export class MultipleWatch {
  el: Element;
  clocks: Clock[] = [];
  timezone_options: HTMLSelectElement;
  add_watch_button: Element;
  current_timezone: string = "GMT±00:00";
  constructor(el: Element) {
    this.el = el;
    this.add_watch_button = document.createElement("Button");
    this.add_watch_button.innerHTML = "Create a new watch";
    this.add_watch_button.addEventListener("click", (e: Event) =>
      this.addWatch()
    );
    this.timezone_options = document.createElement(
      "select"
    ) as HTMLSelectElement;
    this.timezone_options.addEventListener("change", (e: Event) => {
      this.current_timezone = this.timezone_options.value;
    });
    timezones.forEach((e) => {
      const option = document.createElement("option");
      option.value = e.viewValue;
      option.text = e.viewValue;
      option.selected = e.viewValue === this.current_timezone;
      this.timezone_options.appendChild(option);
    });

    this.el.appendChild(this.add_watch_button);
    this.el.appendChild(this.timezone_options);
  }

  addWatch() {
    let new_watch = document.createElement("div");
    this.clocks.push(new Clock(new_watch, this.current_timezone));
    this.el.appendChild(new_watch);
  }
}
