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

function isValidLocator(value) {
  value = value.toUpperCase();
  const regex = /^[A-R][A-R][0-9][0-9][A-X][A-X]$/;
  return regex.test(value);
}

function updateChart(chart, index, data, myLocator){
  chart.data.datasets[index].data = data;
  chart.data.datasets[index].label = myLocator.toUpperCase();
  chart.update(); 
}

function julianDayNumber(year, month, day, hour) {
  return 367 * year - div((7 * (year + (div((month + 9), 12)))), 4) + div((275 * month), 9) + day - 730530 + hour / 24.0
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
  document.getElementById("dayNumber").textContent = julianDayNumber(utcYear, utcMonth, utcDay, utcHour + utcMinutes / 60.0 + utcSeconds / 3600.0);

}, 1000);

function longitude(locator) {
    locator = locator.toUpperCase()
    let field = 20 * (locator.charCodeAt(0) - 65) - 180
    let grid = 2 * (locator.charCodeAt(2) - 48)
    let subGrid = 5 * (locator.charCodeAt(4) - 65) / 60
    return field + grid + subGrid + 1/24
}

function latitude(locator) {
  locator = locator.toUpperCase()
  let field = 10 * (locator.charCodeAt(1) - 65) - 90
  let grid = locator.charCodeAt(3) - 48
  let subGrid = 2.5 * (locator.charCodeAt(5) - 65) / 60
  return field + grid + subGrid + 1/48
}



 