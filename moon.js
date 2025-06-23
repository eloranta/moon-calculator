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

function sunHourAngle(dayNumber, longitude) {
  return rev(sunLocalSiderealTime(dayNumber, longitude) * 15 - sunRightAscension(dayNumber))
}

function sunX2(dayNumber, longitude) {
  return cos(sunHourAngle(dayNumber, longitude)) * cos(sunDeclination(dayNumber))
}

function sunY2(dayNumber, longitude) {
  return sin(sunHourAngle(dayNumber, longitude)) * cos(sunDeclination(dayNumber))
}

function sunZ2(dayNumber, longitude) {
  return sin(sunDeclination(dayNumber))
}

function sunXHorizontal(dayNumber, longitude, latitude) {
  return sunX2(dayNumber, longitude) * sin(latitude) - sunZ2(dayNumber, longitude) * cos(latitude)
}

function sunYHorizontal(dayNumber, longitude, latitude) {
  return sunY2(dayNumber, longitude)
}

function sunZHorizontal(dayNumber, longitude, latitude) {
  return sunX2(dayNumber, longitude) * cos(latitude) + sunZ2(dayNumber, longitude) * sin(latitude)
}

function sunAzimuth(dayNumber, longitude, latitude) {
  return rev(atan2(sunYHorizontal(dayNumber, longitude, latitude), sunXHorizontal(dayNumber, longitude, latitude)) + 180.0)
}

function sunElevation(dayNumber, longitude, latitude) {
  return asin(sunZHorizontal(dayNumber, longitude, latitude))
}

// Moon

function moonLongitudeOfAscendingNode(dayNumber) {
  return 125.1228 - 0.0529538083 * dayNumber
}

const moonInclination = 5.1454
  
function moonArgumentOfPerigee(dayNumber) {
  return 318.0634 + 0.1643573223 * dayNumber
}

const moonMeanDistance = 60.2666
const moonEccentricity = 0.054900

function moonMeanAnomaly(dayNumber) {
  return rev(115.3654 + 13.0649929509 * dayNumber)
}

function moonE0(dayNumber) {
  const M = moonMeanAnomaly(dayNumber)
  const e = moonEccentricity
  return M + (180 / Math.PI) * e * sin(M) * (1 + e * cos(M))
}
  
function moonE1(dayNumber, E0) {
  const M = moonMeanAnomaly(dayNumber)
  const e = moonEccentricity
  return E0 - (E0 - (180.0 / Math.PI) * e * sin(E0) - M) / (1 - e * cos(E0))
}

function moonE(dayNumber) {
  const E = moonE0(dayNumber)
  const E1 = moonE1(dayNumber, E)
  return E1
}

function moonx(dayNumber) {
  return moonMeanDistance * (cos(moonE(dayNumber)) - moonEccentricity)
}

function moony(dayNumber) {
  const e = moonEccentricity
  return moonMeanDistance * Math.sqrt(1 - e * e) * sin(moonE(dayNumber))
}

function moonR(dayNumber) {
  const x = moonx(dayNumber)
  const y = moony(dayNumber)
  return Math.sqrt(x * x + y * y)
}

function moonV(dayNumber) {
  const x = moonx(dayNumber)
  const y = moony(dayNumber)
  return rev(atan2(y, x))
 }

  function moonXeclip(dayNumber) {
  const N = moonLongitudeOfAscendingNode(dayNumber)
  const v = moonV(dayNumber)
  const w = moonArgumentOfPerigee(dayNumber)
  return moonR(dayNumber) * (cos(N) * cos(v + w) - sin(N) * sin(v + w) * cos(moonInclination))
}

function moonYeclip(dayNumber) {
  const N = moonLongitudeOfAscendingNode(dayNumber)
  const v = moonV(dayNumber)
  const w = moonArgumentOfPerigee(dayNumber)
  return moonR(dayNumber) * (sin(N) * cos(v + w) + cos(N) * sin(v + w) * cos(moonInclination))
}

function moonZeclip(dayNumber) {
  const v = moonV(dayNumber)
  const w = moonArgumentOfPerigee(dayNumber)
  return moonR(dayNumber) * sin(v + w) * sin(moonInclination)
}

function moonLongitudeEcl(dayNumber) {
  return rev(atan2(moonYeclip(dayNumber), moonXeclip(dayNumber)))
}

function moonLatitudeEcl(dayNumber) {
  const x = moonXeclip(dayNumber)
  const y = moonYeclip(dayNumber)
  return atan2(moonZeclip(dayNumber), Math.sqrt(x * x + y * y))
}

function moonMeanLongitude(dayNumber) {
  return moonLongitudeOfAscendingNode(dayNumber) + moonArgumentOfPerigee(dayNumber) + moonMeanAnomaly(dayNumber)
}

function moonMeanElongation(dayNumber) {
  return moonMeanLongitude(dayNumber) - sunMeanLongitude(dayNumber)
}

function moonArgumentOfLatitude(dayNumber) {
  return moonMeanLongitude(dayNumber) - moonLongitudeOfAscendingNode(dayNumber)
}

function moonDLongitude(dayNumber) {
  const Mm = moonMeanAnomaly(dayNumber)
  const D = moonMeanElongation(dayNumber)
  const Ms = sunMeanAnomaly(dayNumber)
  const F = moonArgumentOfLatitude(dayNumber)
  return -1.274 * sin(Mm - 2*D)
  +0.658 * sin(2*D)
  -0.186 * sin(Ms)
  -0.059 * sin(2*Mm - 2*D)
  -0.057 * sin(Mm - 2*D + Ms)
  +0.053 * sin(Mm + 2*D)
  +0.046 * sin(2*D - Ms)
  +0.041 * sin(Mm - Ms)
  -0.035 * sin(D)
  -0.031 * sin(Mm + Ms)
  -0.015 * sin(2*F - 2*D)
  +0.011 * sin(Mm - 4*D)
}

function moonDLatitude(dayNumber) {
  const Mm = moonMeanAnomaly(dayNumber)
  const D = moonMeanElongation(dayNumber)
  const F = moonArgumentOfLatitude(dayNumber)
  return -0.173 * sin(F - 2*D)
  -0.055 * sin(Mm - F - 2*D)
  -0.046 * sin(Mm + F - 2*D)
  +0.033 * sin(F + 2*D)
  +0.017 * sin(2*Mm + F)
}

function moonDDistance(dayNumber) {
  const Mm = moonMeanAnomaly(dayNumber)
  const D = moonMeanElongation(dayNumber)
  return -0.58 * cos(Mm - 2*D)   // TODO: difference here between Schlyter and Taylor
  -0.46 * cos(2*D)
}

function moonLongitude(dayNumber) {
  return moonLongitudeEcl(dayNumber) + moonDLongitude(dayNumber)
}

function moonLatitude(dayNumber) {
  return moonLatitudeEcl(dayNumber) + moonDLatitude(dayNumber)
}

function moonDistance(dayNumber) {
  return moonR(dayNumber) + moonDDistance(dayNumber)
}

function moonX(dayNumber) {
  return cos(moonLatitude(dayNumber)) * cos(moonLongitude(dayNumber))
}

function moonY(dayNumber) {
  return cos(moonLatitude(dayNumber)) * sin(moonLongitude(dayNumber))
}

function moonZ(dayNumber) {
  return sin(moonLatitude(dayNumber))
}

function moonXEquat(dayNumber) {
  return moonX(dayNumber)
}

function moonYEquat(dayNumber) {
  const obliquity = earthObliquity(dayNumber)
  return moonY(dayNumber) * cos(obliquity) - moonZ(dayNumber) * sin(obliquity)
}

function moonZEquat(dayNumber) {
  const obliquity = earthObliquity(dayNumber)
  return moonY(dayNumber) * sin(obliquity) + moonZ(dayNumber) * cos(obliquity)
}

function moonRightAscension(dayNumber) {
   return rev(atan2(moonYEquat(dayNumber), moonXEquat(dayNumber)))
}

function moonDeclination(dayNumber) {
  const x = moonXEquat(dayNumber)
  const y = moonYEquat(dayNumber)
  return atan2(moonZEquat(dayNumber), Math.sqrt(x * x + y * y))
}

function moonMpar(dayNumber) {
  return asin(1/moonDistance(dayNumber))
}

function moonHA(dayNumber, longitude) {
  const LST = sunLocalSiderealTime(dayNumber, longitude) * 15  // this belongs to sun ?
  const RA = moonRightAscension(dayNumber)
  return rev(LST - RA)
}

function moonG(dayNumber, longitude, latitude) {
  const gclat = earthGclat(latitude)
  const HA = moonHA(dayNumber, longitude)
  return atan(tan(gclat) / cos(HA))
}
  
function moonTopRA(dayNumber, longitude, latitude) {
  const RA = moonRightAscension(dayNumber)
  const mpar = moonMpar(dayNumber)
  const rho = earthRho(latitude)
  const gclat = earthGclat(latitude)
  const HA = moonHA(dayNumber, longitude)
  const decl = moonDeclination(dayNumber)
  return RA - mpar * rho * cos(gclat) * sin(HA) / cos(decl)
}

function moonTopDecl(dayNumber, longitude, latitude) {
  const decl = moonDeclination(dayNumber)
  const mpar = moonMpar(dayNumber)
  const rho = earthRho(latitude)
  const gclat = earthGclat(latitude)
  const g = moonG(dayNumber, longitude, latitude)
  return decl - mpar * rho * sin(gclat) * sin(g - decl) / sin(g)
}
 
function moonHA2(dayNumber, longitude, latitude) {
   const lst = sunLocalSiderealTime(dayNumber, longitude) * 15
   const ra = moonTopRA(dayNumber, longitude, latitude)
   let ha = lst - ra
   if (ha > 180) ha = ha - 360
   if (ha < 180) ha = ha + 360
   return ha
}

function moonAzimuth(dayNumber, longitude, latitude) {
  const temp1 = sin(moonTopDecl(dayNumber, longitude, latitude))
  const temp2 = cos(moonTopDecl(dayNumber, longitude, latitude))
  const temp3 = sin(latitude) * temp1 + cos(latitude) * temp2 * cos(moonHA2(dayNumber, longitude, latitude))
  const temp4 = Math.sqrt(1 - temp3 * temp3)
  const temp5 = -sin(moonHA2(dayNumber, longitude, latitude)) * temp2 / temp4
  const temp6 = (temp1 - temp3 * sin(latitude)) / (temp4*cos(latitude))
  let temp7 = 0
  if (temp6 < 0) temp7 = (1 - temp6)/temp5
  if (temp6 > 0) temp7 = temp5 / (1 + temp6)
  let azimuth = 2 * atan(temp7)
  if (azimuth < 0) azimuth = azimuth + 360
  return azimuth
 }

function moonElevation(dayNumber, longitude, latitude) {
  const temp1 = sin(moonTopDecl(dayNumber, longitude, latitude))
  const temp2 = cos(moonTopDecl(dayNumber, longitude, latitude))
  const temp3 = sin(latitude) * temp1 + cos(latitude) * temp2 * cos(moonHA2(dayNumber, longitude, latitude))
  const temp4 = Math.sqrt(1 - temp3 * temp3)
  return atan(temp3 / temp4)
}
