import { displayWeather } from './modules/ui-controller.js';

const sampleWeathers = {
  Clear: "Cer senin",
  Clouds: "Înnorat",
  Rain: "Ploaie",
  Snow: "Ninsoare",
  Thunderstorm: "Furtună",
  Mist: "Ceață",
  Drizzle: "Burniță"
};

const generateMockData = (type) => ({
  name: "TestVille",
  sys: {
    country: "RO",
    sunrise: Math.floor(Date.now() / 1000) - 3600,
    sunset: Math.floor(Date.now() / 1000) + 3600
  },
  timezone: 10800, // GMT+3
  main: { temp: 21, humidity: 55 },
  wind: { speed: 3 },
  weather: [{ main: type, description: sampleWeathers[type] }]
});

document.addEventListener("DOMContentLoaded", () => {
  const panel = document.createElement("div");
  panel.id = "demo-panel";
  panel.innerHTML = `
    <h3>Simulare meteo locală</h3>
    <div class="buttons">
      ${Object.keys(sampleWeathers)
        .map((type) => `<button data-type="${type}">${type}</button>`)
        .join("")}
    </div>
  `;
  document.body.prepend(panel);

  panel.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
      const type = e.target.dataset.type;
      const data = generateMockData(type);
      displayWeather(data);
    }
  });
});
