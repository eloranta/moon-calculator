document.addEventListener("DOMContentLoaded", () => {

  document.getElementById("myLocator").focus();
  document.getElementById("myLocator").value = localStorage.getItem("myLocator");
  const input = document.getElementById("myLocator");
  if (isValidLocator(input.value)) {
		updateChart(myChart, 0, moonElevation(), input.value);
		input.classList.remove("error");
	}
else {
		updateChart(myChart, 0, [], "");
		input.classList.add("error");
}
});

const input = document.getElementById("myLocator");
input.addEventListener("input", function () {
if (isValidLocator(input.value)) {
		updateChart(myChart, 0, moonElevation(), input.value);
		localStorage.setItem("myLocator", input.value);
		input.classList.remove("error");
	}
else {
		updateChart(myChart, 0, [], "");
		input.classList.add("error");
}
});

const input2 = document.getElementById("dxLocator");
input2.addEventListener("input", function () {
if (isValidLocator(input2.value)) {
		updateChart(myChart, 1, moonElevation(), input2.value);
		input2.classList.remove("error");
	}
else {
		updateChart(myChart, 1, [], "");
		input2.classList.add("error");
}
});
  
const xValues = generateHalfHourSlots();

const myChart = new Chart("myChart", {
  type: "line",
  data: {
    labels: xValues,
    datasets: [{
      fill: true,
      borderColor: "Green",
      backgroundColor: "LightGreen"
    },{
      fill: true,
      borderColor: "Red",
      backgroundColor: "Salmon"
	}]
  },
  options: {
    legend: {display: true},
    scales: {
      yAxes: [{ticks: {beginAtZero: true}}],
    }
  }
});

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
