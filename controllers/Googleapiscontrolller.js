const axios = require("axios");
require("dotenv").config();
const { Coordinates } = require("../constants");

const suggestionAutocomplete = async (req, res) => {
  try {
    const { city, text } = req.query;

    if (!Coordinates[city] || !Coordinates[city][0] || !Coordinates[city][1]) {
      throw new Error("wrong city Name");
    }

    var config1 = {
      method: "get",
      url: `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${text}&types=geocode&location=${Coordinates[city][0]},${Coordinates[city][1]}&radius=${Coordinates[city][2]}&strictbounds=true&key=${process.env.GMAP_API_KEY}`,
      headers: {},
    };
    var config2 = {
      method: "get",
      url: `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${text}&types=route|sublocality|street_address|postal_town|intersection&location=${Coordinates[city][0]},${Coordinates[city][1]}&radius=${Coordinates[city][2]}&strictbounds=true&key=${process.env.GMAP_API_KEY}`,
      headers: {},
    };
    var config3 = {
      method: "get",
      url: `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${text}&types=establishment&location=${Coordinates[city][0]},${Coordinates[city][1]}&radius=${Coordinates[city][2]}&strictbounds=true&key=${process.env.GMAP_API_KEY}`,
      headers: {},
    };

    const response = await Promise.all([
      axios(config1),
      axios(config2),
      axios(config3),
    ]);

    const suggestions = response.map((res) =>
      res.data.predictions.map((locationData) => {
        return locationData;
      })
    );

    const suggestionSet = new Set();
    const allSuggestions = [];
    for (let description of suggestions.flat()) {
      if (!suggestionSet.has(description.place_id)) {
        allSuggestions.push(description);
      }
      suggestionSet.add(description.place_id);
    }

    res.status(200).json(allSuggestions);
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

const getCoordinatesByLocation = async (place) => {
  try {
    var config = {
      method: "get",
      url: `https://maps.googleapis.com/maps/api/geocode/json?address=${place}&key=${process.env.GMAP_API_KEY}`,
      headers: {},
    };

    const response = await axios(config);

    const latAndLang = Object.values(
      response.data.results[0].geometry.location
    );
    return latAndLang;
  } catch (error) {
    return null;
  }
};

const getLocationByCoordinates = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    const config = {
      method: "get",
      url: `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.GMAP_API_KEY}`,
      headers: {},
    };

    const response = await axios(config);

    if (response.data.status === "OK" && response.data.results.length > 0) {
      //console.log(response.data);

      const address = response.data.results.map((place) => {
        return place.formatted_address;
      });
      console.log(address);
      return address;
    } else {
      return [];
    }
  } catch (error) {
    return [];
  }
};

const nearbyLocalities = async (req, res) => {
  try {
    const { text } = req.query;
    const coordinates = await getCoordinatesByLocation(text);

    if (!coordinates) {
      throw new Error("Unable to get Coordinates of the Locality");
    }

    var config1 = {
      method: "get",
      url: `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${coordinates[0]},${coordinates[1]}&radius=10000&types=sublocality_level_3&key=${process.env.GMAP_API_KEY}`,

      headers: {},
    };
    var config2 = {
      method: "get",
      url: `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${coordinates[0]},${coordinates[1]}&radius=10000&types=sublocality&key=${process.env.GMAP_API_KEY}`,

      headers: {},
    };
    var config3 = {
      method: "get",
      url: `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${coordinates[0]},${coordinates[1]}&radius=10000&types=sublocality_level_1&key=${process.env.GMAP_API_KEY}`,

      headers: {},
    };
    var config4 = {
      method: "get",
      url: `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${coordinates[0]},${coordinates[1]}&radius=10000&types=sublocality_level_2&key=${process.env.GMAP_API_KEY}`,

      headers: {},
    };

    const response = await Promise.all([
      axios(config1),
      axios(config2),
      axios(config3),
      axios(config4),
    ]);

    const suggestions = response.map((res) =>
      res.data.results.map((locationData) => locationData)
    );

    const allSuggestions = [...new Set(suggestions.flat())];

    res.status(200).json(allSuggestions);
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};
module.exports = {
  suggestionAutocomplete,
  nearbyLocalities,
  getCoordinatesByLocation,
  getLocationByCoordinates,
};
