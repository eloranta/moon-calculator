function div(x, y) {
  return ~~(x / y) // integer division
}

function rev(x) {
  return x - Math.floor(x / 360) * 360
}

function toDegrees(x) {
  return 180 * x / Math.PI
}

function toTime(degrees) {
 hours = Math.floor(degrees / 15)
 minutes = (degrees / 15 - hours) * 60
 return hours + ":" + Math.floor(minutes)
}

function sin(x) {
  return Math.sin(Math.PI * x / 180)
}

function cos(x) {
  return Math.cos(Math.PI * x / 180)
}

function tan(x) {
  return Math.tan(Math.PI * x / 180)
}

function asin(x) {
  return toDegrees(Math.asin(x))
}

function atan(x) {
  return toDegrees(Math.atan(x))
}

function atan2(x, y) {
  return toDegrees(Math.atan2(x, y))
}

function isValidLocator(value) {
  value = value.toUpperCase();
  const regex = /^[A-R][A-R][0-9][0-9][A-X][A-X]$/;
  return regex.test(value);
}

function longitude(locator) {
    locator = locator.toUpperCase()
    field = 20 * (locator.charCodeAt(0) - 65) - 180
    grid = 2 * (locator.charCodeAt(2) - 48)
    subGrid = 5 * (locator.charCodeAt(4) - 65) / 60
    return field + grid + subGrid + 1/24
}

function latitude(locator) {
  locator = locator.toUpperCase()
  field = 10 * (locator.charCodeAt(1) - 65) - 90
  grid = locator.charCodeAt(3) - 48
  subGrid = 2.5 * (locator.charCodeAt(5) - 65) / 60
  return field + grid + subGrid + 1/48
}

function julianDayNumber(year, month, day, hour) {
  return 367 * year - div((7 * (year + (div((month + 9), 12)))), 4) + div((275 * month), 9) + day - 730530 + hour / 24.0
}

function sunLongitudeOfPerihelion(dayNumber) {
  return 282.9404 + 4.70935e-5 * dayNumber
}

function sunEccentricity(dayNumber) {
  return 0.016709 - 1.151e-9 * dayNumber
}

function sunMeanAnomaly(dayNumber) {
  return rev(356.0470 + 0.9856002585 * dayNumber)
}

function sunMeanLongitude(dayNumber) {
  return rev(sunLongitudeOfPerihelion(dayNumber) + sunMeanAnomaly(dayNumber))
}

function sunEccentricAnomaly(dayNumber) {
  M = sunMeanAnomaly(dayNumber)
  e = sunEccentricity(dayNumber)
  E0 = M + (180 / Math.PI) * e * sin(M) * (1 + e * cos(M))
  return E0 // Schlyter
  // return E0 - (E0 - 180 * e * sin(E0) / Math.PI - M) / (1 - e * cos(E0))  // Taylor
}
  
function sunX(dayNumber) {
  return cos(sunEccentricAnomaly(dayNumber)) - sunEccentricity(dayNumber)
}

function sunY(dayNumber) {
  e = sunEccentricity(dayNumber)
  return sin(sunEccentricAnomaly(dayNumber)) * Math.sqrt(1 - e * e)
}

function sunDistance(dayNumber) {
  x = sunX(dayNumber)
  y = sunY(dayNumber)
  return Math.sqrt(x * x + y * y)
}

function sunTrueAnomaly(dayNumber) {
  x = sunX(dayNumber)
  y = sunY(dayNumber)
  return atan2(y, x)
}

function sunLongitude(dayNumber) {
  return rev(sunTrueAnomaly(dayNumber) + sunLongitudeOfPerihelion(dayNumber))
}

function sunXEcliptic(dayNumber) {
  return sunDistance(dayNumber) * cos(sunLongitude(dayNumber))
}

function sunYEcliptic(dayNumber) {
  return sunDistance(dayNumber) * sin(sunLongitude(dayNumber))
}

function sunXEquatorial(dayNumber) {
  return sunXEcliptic(dayNumber)
}


