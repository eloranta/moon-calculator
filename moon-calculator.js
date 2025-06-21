document.addEventListener("DOMContentLoaded", () => {
  const input1 = document.getElementById("myLocator");
  const input2 = document.getElementById("dxLocator");

  // Set initial state for input1
  input1.focus();
  input1.value = localStorage.getItem("myLocator") || "";
  handleInputChange(input1, 0);
  handleInputChange(input2, 1);

  // Attach input listeners
  input1.addEventListener("input", () => handleInputChange(input1, 0));
  input2.addEventListener("input", () => handleInputChange(input2, 1));
});

const xValues = generateHalfHourSlots();
const styles = getComputedStyle(document.documentElement);
const myChart = new Chart("myChart", {
  type: "line",
  data: {
    labels: xValues,
    datasets: [{
      fill: true,
      borderColor: styles.getPropertyValue('--chart-0-border').trim(),
      backgroundColor: styles.getPropertyValue('--chart-0-fill').trim()
    },{
      fill: true,
      borderColor: styles.getPropertyValue('--chart-1-border').trim(),
      backgroundColor: styles.getPropertyValue('--chart-1-fill').trim()
  }]
  },
  options: {
    legend: {display: true},
    scales: {
      yAxes: [{ticks: {beginAtZero: true}}],
    }
  }
});

const dateInput = document.getElementById("date");
const today = new Date().toISOString().split("T")[0];
dateInput.value = today;

function handleInputChange(input, datasetIndex) {
  const value = input.value;

  if (isValidLocator(value)) {
    updateChart(myChart, datasetIndex, moonElevation(), value);
    if (input.id === "myLocator") {
      localStorage.setItem("myLocator", value);
      document.getElementById("locator1").textContent = value.toUpperCase();
    }
    input.classList.remove("error");
  } else {
    updateChart(myChart, datasetIndex, [], "");
    input.classList.add("error");
  }
}

function generateHalfHourSlots() {
  const slots = [];
  for (let h = 0; h <= 24; h++) {
    for (let m of [0, 30]) {
      if (h === 24 && m > 0) break; // skip 24:30
      const hour = String(h).padStart(2, '0');
      const minute = String(m).padStart(2, '0');
      slots.push(`${hour}:${minute}`);
    }
  }
  return slots;
}

function moonElevation() {
  const elevations = [];
  const max_value = Math.random()*50.0;
  for (let h = 0; h <= 24; h+=0.5) {
  const elevation = max_value*Math.sin(Math.PI*h/24.0);
  elevations.push(elevation);
  }
  return elevations;
}

function updateChart(chart, index, data, myLocator){
  chart.data.datasets[index].data = data;
  chart.data.datasets[index].label = myLocator.toUpperCase();
  chart.update(); 
}

setInterval(() => {
  const locator1 = document.getElementById("myLocator").value.toUpperCase();
  const valid1 = isValidLocator(locator1);

  const locator2 = document.getElementById("dxLocator").value.toUpperCase();
  const valid2 = isValidLocator(locator2);
 
  document.getElementById("locator1").textContent = valid1 ? locator1 : "";
  document.getElementById("locator2").textContent = valid2 ? locator2 : "";
  document.getElementById("longitude1").textContent = valid1 ? longitude(locator1).toFixed(2) : "";
  document.getElementById("longitude2").textContent = valid2 ? longitude(locator2).toFixed(2) : "";
  document.getElementById("latitude1").textContent = valid1 ? latitude(locator1).toFixed(2) : "";
  document.getElementById("latitude2").textContent = valid2 ? latitude(locator2).toFixed(2) : "";
  
  const date = new Date();
  document.getElementById("utcDate").textContent = date.toISOString().slice(0, 10);
  document.getElementById("utcTime").textContent = date.toISOString().slice(11, 19);

  const utcYear = date.getUTCFullYear();
  const utcMonth = date.getUTCMonth() + 1
  const utcDay = date.getUTCDate();
  const utcHour = date.getUTCHours();
  const utcMinutes = date.getUTCMinutes();
  const utcSeconds = date.getUTCSeconds();
  const dayNumber = julianDayNumber(utcYear, utcMonth, utcDay, utcHour + utcMinutes / 60.0 + utcSeconds / 3600.0);
  document.getElementById("dayNumber").textContent = dayNumber;

  document.getElementById("longitudeOfPerihelion").textContent = sunLongitudeOfPerihelion(dayNumber);
  document.getElementById("sunEccentricity").textContent = sunEccentricity(dayNumber);
  document.getElementById("sunMeanAnomaly").textContent = sunMeanAnomaly(dayNumber);
  document.getElementById("sunMeanLongitude").textContent = sunMeanLongitude(dayNumber);
  document.getElementById("sunEccentricAnomaly").textContent = sunEccentricAnomaly(dayNumber);
  document.getElementById("sunX").textContent = sunX(dayNumber);
  document.getElementById("sunY").textContent = sunY(dayNumber);
  document.getElementById("sunDistance").textContent = sunDistance(dayNumber);
  document.getElementById("sunTrueAnomaly").textContent = sunTrueAnomaly(dayNumber);
  document.getElementById("sunLongitude").textContent = sunLongitude(dayNumber);
  document.getElementById("sunXEcliptic").textContent = sunXEcliptic(dayNumber);
  document.getElementById("sunYEcliptic").textContent = sunYEcliptic(dayNumber);
  document.getElementById("sunXEquatorial").textContent = sunXEquatorial(dayNumber);



}, 1000);




 