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
  const longitude1 = valid1 ? longitude(locator1) : 0;
  document.getElementById("longitude1").textContent = valid1 ? longitude1.toFixed(2) : "";
  document.getElementById("longitude2").textContent = valid2 ? longitude(locator2).toFixed(2) : "";
  const latitude1 = valid1 ? latitude(locator1) : 0;
  document.getElementById("latitude1").textContent = valid1 ? latitude1.toFixed(2) : "";
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

/*   document.getElementById("longitudeOfPerihelion").textContent = sunLongitudeOfPerihelion(dayNumber);
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
  document.getElementById("sunYEquatorial").textContent = sunYEquatorial(dayNumber);
  document.getElementById("sunZEquatorial").textContent = sunZEquatorial(dayNumber);
  document.getElementById("sunRightAscension").textContent = sunRightAscension(dayNumber);
  document.getElementById("sunDeclination").textContent = sunDeclination(dayNumber);
  document.getElementById("sunGMST0").textContent = sunGMST0(dayNumber);
  document.getElementById("sunLocalSiderealTime").textContent = valid1 ? sunLocalSiderealTime(dayNumber, longitude1) : "";
  document.getElementById("sunHourAngle").textContent = valid1 ? sunHourAngle(dayNumber, longitude1) : "";
  document.getElementById("sunX2").textContent = valid1 ? sunX2(dayNumber, longitude1) : "";
  document.getElementById("sunY2").textContent = valid1 ? sunY2(dayNumber, longitude1) : "";
  document.getElementById("sunZ2").textContent = valid1 ? sunZ2(dayNumber, longitude1) : "";
  document.getElementById("sunXHorizontal").textContent = valid1 ? sunXHorizontal(dayNumber, longitude1, latitude1) : "";
  document.getElementById("sunYHorizontal").textContent = valid1 ? sunYHorizontal(dayNumber, longitude1, latitude1) : "";
  document.getElementById("sunZHorizontal").textContent = valid1 ? sunZHorizontal(dayNumber, longitude1, latitude1) : ""; */
  document.getElementById("sunAzimuth").textContent = valid1 ? sunAzimuth(dayNumber, longitude1, latitude1) : "";
  document.getElementById("sunElevation").textContent = valid1 ? sunElevation(dayNumber, longitude1, latitude1) : "";

  document.getElementById("moonLongitudeOfAscendingNode").textContent = moonLongitudeOfAscendingNode(dayNumber);
  document.getElementById("moonInclination").textContent = moonInclination;
  document.getElementById("moonArgumentOfPerigee").textContent = moonArgumentOfPerigee(dayNumber);
  document.getElementById("moonMeanDistance").textContent = moonMeanDistance;
  document.getElementById("moonEccentricity").textContent = moonEccentricity;
  document.getElementById("moonMeanAnomaly").textContent = moonMeanAnomaly(dayNumber);
  const E0 = moonE0(dayNumber);
  document.getElementById("moonE0").textContent = E0;
  document.getElementById("moonE1").textContent = moonE1(dayNumber, E0);
  document.getElementById("moonE").textContent = moonE(dayNumber);
  document.getElementById("moonx").textContent = moonx(dayNumber);
  document.getElementById("moony").textContent = moony(dayNumber);
  document.getElementById("moonXeclip").textContent = moonXeclip(dayNumber);
  document.getElementById("moonYeclip").textContent = moonYeclip(dayNumber);
  document.getElementById("moonZeclip").textContent = moonZeclip(dayNumber);
  document.getElementById("moonLongitudeEcl").textContent = moonLongitudeEcl(dayNumber);
  document.getElementById("moonLatitudeEcl").textContent = moonLatitudeEcl(dayNumber);
  document.getElementById("moonMeanLongitude").textContent = moonMeanLongitude(dayNumber);
  document.getElementById("moonMeanElongation").textContent = moonMeanElongation(dayNumber);
  document.getElementById("moonArgumentOfLatitude").textContent = moonArgumentOfLatitude(dayNumber);
  document.getElementById("moonDLongitude").textContent = moonDLongitude(dayNumber);
  document.getElementById("moonDLatitude").textContent = moonDLatitude(dayNumber);
  document.getElementById("moonDDistance").textContent = moonDDistance(dayNumber);
  document.getElementById("moonLongitude").textContent = moonLongitude(dayNumber);
  document.getElementById("moonLatitude").textContent = moonLatitude(dayNumber);
  document.getElementById("moonDistance").textContent = moonDistance(dayNumber);
  document.getElementById("moonX").textContent = moonX(dayNumber);
  document.getElementById("moonY").textContent = moonY(dayNumber);
  document.getElementById("moonZ").textContent = moonZ(dayNumber);
  document.getElementById("moonXEquat").textContent = moonXEquat(dayNumber);
  document.getElementById("moonYEquat").textContent = moonYEquat(dayNumber);
  document.getElementById("moonZEquat").textContent = moonZEquat(dayNumber);
  document.getElementById("moonRightAscension").textContent = moonRightAscension(dayNumber);
  document.getElementById("moonDeclination").textContent = moonDeclination(dayNumber);
  document.getElementById("moonMpar").textContent = moonMpar(dayNumber);
  document.getElementById("moonHA").textContent = valid1 ? moonHA(dayNumber, longitude1) : "";
  document.getElementById("moonG").textContent = valid1 ? moonG(dayNumber, longitude1, latitude1) : "";
  document.getElementById("moonTopRA").textContent = valid1 ? moonTopRA(dayNumber, longitude1, latitude1) : "";
  document.getElementById("moonTopDecl").textContent = valid1 ? moonTopDecl(dayNumber, longitude1, latitude1) : "";
  document.getElementById("moonHA2").textContent = valid1 ? moonHA2(dayNumber, longitude1, latitude1) : "";
  document.getElementById("moonAzimuth").textContent = valid1 ? moonAzimuth(dayNumber, longitude1, latitude1) : "";
  document.getElementById("moonElevation").textContent = valid1 ? moonElevation(dayNumber, longitude1, latitude1) : "";
}, 1000);




 