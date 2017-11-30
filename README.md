# vorgewende

[![experimental](http://badges.github.io/stability-badges/dist/experimental.svg)](http://github.com/badges/stability-badges)

Modul zur automatischen Berechnung von Vorgewenden aus GeoJSON Teilflaechen / Module for automatic headland calculation from GeoJSON plots

## Install
The script is still in beta phase, to install simply clone this repo.
In future:
Use [npm](https://npmjs.com/) to install.

```sh
npm install vorgewende --save
```

## Usage

[![NPM](https://nodei.co/npm/vorgewende.png)](https://www.npmjs.com/package/vorgewende)
The script (will) contain the following API methods:
### ```lineString(polygon, (angle), (minDistance))```

where

```polygon``` a GeoJSON feature (GeoJSON geometries need to be converted to features first)

```angle``` the maximal allowed turning angle in degrees, defaults to 30 deg

```minDistance``` the minimum distance in meters between two coordinates used for angle comparison, defaults to 10 m.

#### Returns
An array of GeoJSON lineString features representing each headland.

### ```polygons(polygon, headlandWidth, (angle), (minDistance))```

where

```headlandWidth``` Width of each headland in meters, typically equal to (half) the working width of the sprayer used.

else see ```lineString``` parameter description.

#### Returns
An array of GeoJSON polygon features representing each headland.


## License

MIT, see [LICENSE.md](http://github.com/Toffi-123/vorgewende/blob/master/LICENSE.md) for details.
