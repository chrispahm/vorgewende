/*
	Vorgewende
	API Methods
	lineString (poly, (angle), (distance)) - Returns array consisting of a GeoJSON lineString for each headland for the given field
	Polygon (poly, workingWidth, (angle), (distance))- Returns an array consisting of a GeoJSON Polygon for each headland using the working width as its width for the given field
*/
const GJV = require("geojson-validation")
const turf = require('@turf/turf')

module.exports = {
	lineString: function (poly, angle = 30, distance = 10) {
		//console.log(angle)
		// Will contain all headland LineStrings as features
		let headlands = []
		// first validate if polygon matches GeoJSON prerequisites
		GJV.isPolygon(poly.geometry, function(valid, err) {
			if (!valid) {
				throw "Invalid Polygon, " + err
			}
			const coords = turf.getCoords(poly)[0]
			// Start with first two coordinates in order to create an initial path
			let curLineString = [coords[0], coords[1]]
			// Get angle between the starting coordinates as a reference
			let refAngle = angleCoords(coords[0],coords[1])
			let j = 1
			let uncertainPolys = []
			let curAngle, curDistance, angleDiff
			for (var i = 2; i < coords.length; i++) {
			  curAngle = angleCoords(coords[i-j],coords[i])
			  curDistance = turf.distance(turf.point(coords[i-j]), turf.point(coords[i])) * 1000
			  angleDiff = angleBetCoords(refAngle, curAngle)
			  if (curDistance <= distance && angleDiff <= angle && angleDiff >= -angle) {
			    curLineString.push(coords[i])
			    j++
			  }
				else if (curDistance <= distance && angleDiff >= angle && angleDiff <= -angle) {
					uncertainPolys.push(coords[i])
			    j++
				}
			  else if (angleDiff <= angle && angleDiff >= -angle) {
					if (j > 1) {
						curLineString = curLineString.concat(uncertainPolys)
						uncertainPolys = []
						j = 1
					}
			    curLineString.push(coords[i])
			    refAngle = curAngle
			  }
			  else {
			  	console.log(angleDiff, coords[i-1], refAngle, curAngle, i-1)
					Draw.add(turf.point(coords[i-1]))
					var el = document.createElement('div');
  				el.className = 'marker';
					new mapboxgl.Marker(el)
					  .setLngLat(coords[i-1])
					  .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
					  .setHTML('<h3>' + (i-1) + '</h3><p>Eingangswinkel: ' +  refAngle + '\n Ausgangwinkel: ' + curAngle + '\n Winkeldifferenz: ' + angleDiff + '</p>'))
					  .addTo(map);
			    headlands.push(turf.lineString(curLineString))
					if (j > 1 && uncertainPolys.length > 0) {
						curLineString = []
						curLineString.push(coords[i - j])
						curLineString = curLineString.concat(uncertainPolys)
						curLineString.push(coords[i])
						uncertainPolys = []
						j = 1
					}
					else {
						curLineString = [coords[i-1], coords[i]]
					}
					refAngle = curAngle
			  }
			}
			// Join headland LineStrings if first and last coordinates are equal,
			// as in this case the headland was drawn from the "middle" of the headland
			let finalAngle = angleBetCoords(angleCoords(coords[0],coords[1]), curAngle)
			if (finalAngle <= angle && finalAngle >= -angle) {
			  headlandPartA = curLineString
			  headlandPartB = turf.getCoords(headlands[0])
			  headlandConcat = headlandPartA.concat(headlandPartB)
			  headlands[0] = turf.lineString(headlandConcat)
			}
			// Push the last headland into the array if the headlands are not connected
			else {
				console.log(finalAngle, coords[i-1], angleCoords(coords[0],coords[1]), curAngle, i-1)
				Draw.add(turf.point(coords[i-1]))
				var el = document.createElement('div');
				el.className = 'marker';
				new mapboxgl.Marker(el)
					.setLngLat(coords[i-1])
					.setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
					.setHTML('<h3>' + (i-1) + '</h3><p>Eingangswinkel: ' +  angleCoords(coords[0],coords[1]) + '\n Ausgangwinkel: ' + curAngle + '\n Winkeldifferenz: ' + finalAngle + '</p>'))
					.addTo(map);
			  headlands.push(turf.lineString(curLineString))
			}

		})
		return headlands
	}
}

function angleCoords(p1,p2) {
  return Math.atan2(p2[1] - p1[1], p2[0] - p1[0]) * 180 / Math.PI
}

function angleBetCoords(a,b) {
	let difference = a - (b)
	if (difference < - 180) difference += 360
	else if (difference > 180) difference -= 360
	return difference
}
