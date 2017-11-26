/*
	Vorgewende
	API Methods
	lineString (poly, (angle), (distance)) - Returns array consisting of a GeoJSON lineString for each headland for the given field
	Polygon (poly, workingWidth, (angle), (distance))- Returns an array consisting of a GeoJSON Polygon for each headland using the working width as its width for the given field
*/
const GJV = require("geojson-validation")

module.exports = {
	lineString: function (poly, angle, distance) {
		// first validate if polygon matches GeoJSON prerequisites
		GJV.isPolygon(poly, function(valid, err) {
			if (!valid) {
				throw "Invalid Polygon, " + err
			}
			const coords = turf.getCoords(poly)[0]
			// Will contain all headland LineStrings as features
			let headlands = []
			// Start with first two coordinates in order to create an initial path
			let curLineString = [coords[0], coords[1]]
			// Get angle between the starting coordinates as a reference
			let refAngle = angleCoords(coords[0],coords[1])
			let j = 1
			let curAngle, curDistance
			for (var i = 2; i < coords.length; i++) {
			  curAngle = angleCoords(coords[i-j],coords[i])
			  curDistance = turf.distance(turf.point(coords[i-j]), turf.point(coords[i])) * 1000
			  if (curDistance <= distance) {
			    curLineString.push(coords[i])
			    j++
			  }
			  else if (Math.abs(refAngle - curAngle) <= angle) {
			    curLineString.push(coords[i])
			    refAngle = curAngle
			    j = 1
			  }
			  else {
			    headlands.push(turf.lineString(curLineString))
			    curLineString = [coords[i-1], coords[i]]
			    refAngle = curAngle
			    j = 1
			  }
			}
			// Join headland LineStrings if first and last coordinates are equal,
			// as in this case the headland was drawn from the "middle" of the headland
			if (coords[0][0] === coords[coords.length -1][0] && coords[0][1] === coords[coords.length -1][1]) {
			  headlandPartA = curLineString
			  headlandPartB = turf.getCoords(headlands[0])
			  headlandConcat = headlandPartA.concat(headlandPartB)
			  headlands[0] = turf.lineString(headlandConcat)
			}
			// Push the last headland into the array if the headlands are not connected
			else {
			  headlands.push(turf.lineString(curLineString))
			}
			return headlands
		})

	}
}

function angleCoords(p1,p2) {
  return Math.atan2(p2[1] - p1[1], p2[0] - p1[0]) * 180 / Math.PI
}
