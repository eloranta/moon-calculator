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
 const hours = Math.floor(degrees / 15)
 const minutes = (degrees / 15 - hours) * 60
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
  const regex = /^[A-R][A-R][0-9][0-9][A-X][A-X]$/;
  return regex.test(value.toUpperCase());
}

function longitude(value) {
  const locator = value.toUpperCase()
  const field = 20 * (locator.charCodeAt(0) - 65) - 180
  const grid = 2 * (locator.charCodeAt(2) - 48)
  const subGrid = 5 * (locator.charCodeAt(4) - 65) / 60
  return field + grid + subGrid + 1/24
}

function latitude(value) {
  const locator = value.toUpperCase()
  const field = 10 * (locator.charCodeAt(1) - 65) - 90
  const grid = locator.charCodeAt(3) - 48
  const subGrid = 2.5 * (locator.charCodeAt(5) - 65) / 60
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
  const M = sunMeanAnomaly(dayNumber)
  const e = sunEccentricity(dayNumber)
  const E0 = M + (180 / Math.PI) * e * sin(M) * (1 + e * cos(M))
  return E0 // Schlyter
  // return E0 - (E0 - 180 * e * sin(E0) / Math.PI - M) / (1 - e * cos(E0))  // Taylor
}
  
function sunX(dayNumber) {
  return cos(sunEccentricAnomaly(dayNumber)) - sunEccentricity(dayNumber)
}

function sunY(dayNumber) {
  const e = sunEccentricity(dayNumber)
  return sin(sunEccentricAnomaly(dayNumber)) * Math.sqrt(1 - e * e)
}

function sunDistance(dayNumber) {
  const x = sunX(dayNumber)
  const y = sunY(dayNumber)
  return Math.sqrt(x * x + y * y)
}

function sunTrueAnomaly(dayNumber) {
  const x = sunX(dayNumber)
  const y = sunY(dayNumber)
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

function earthObliquity(dayNumber) {
  return 23.4393 - 3.563e-7 * dayNumber
}

function earthGclat(latitude) {
  return latitude - 0.1924 * sin(2 * latitude)
}

function earthRho(latitude) {
  return 0.99833 + 0.00167 * cos(2 * latitude)
}

function sunYEquatorial(dayNumber) {
  return sunYEcliptic(dayNumber) * cos(earthObliquity(dayNumber))
}

function sunZEquatorial(dayNumber) {
  return sunYEcliptic(dayNumber) * sin(earthObliquity(dayNumber))
}

function sunRightAscension(dayNumber) {
  return rev(atan2(sunYEquatorial(dayNumber), sunXEquatorial(dayNumber)))
}

function sunDeclination(dayNumber) {
  const x = sunXEquatorial(dayNumber)
  const y = sunYEquatorial(dayNumber)
  return atan2(sunZEquatorial(dayNumber), Math.sqrt((x * x + y * y)))
}

function sunGMST0(dayNumber) {
  return sunMeanLongitude(dayNumber) / 15 + 12
}

function sunLocalSiderealTime(dayNumber, longitude) {
  const UT = (dayNumber % 1) * 24
  return sunGMST0(dayNumber) + UT + longitude / 15
}




