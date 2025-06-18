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

const today = new Date().toISOString().split("T")[0];
document.getElementById("date").value = today;

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

function handleInputChange(input, datasetIndex) {
  const value = input.value;

  if (isValidLocator(value)) {
    updateChart(myChart, datasetIndex, moonElevation(), value);
    if (input.id === "myLocator") {
      localStorage.setItem("myLocator", value);
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


