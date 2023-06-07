const Coordinates = {
  Bangalore: [12.972442, 77.580643, 15000],
  bangalore: [12.972442, 77.580643, 15000],
  Mumbai: [19.07609, 72.8777, 20000],
  mumbai: [19.07609, 72.8777, 20000],
  Pune: [18.5204, 73.8567, 15000],
  pune: [18.5204, 73.8567, 15000],
  chennai: [13.0827, 80.2707, 15000],
  Chennai: [13.0827, 80.2707, 15000],
  gurgaon: [28.4595, 77.0266, 10000],
  Gurgaon: [28.4595, 77.0266, 10000],
  gurugram: [28.4595, 77.0266, 10000],
  Gurugram: [28.4595, 77.0266, 10000],
  hyderabad: [17.385, 78.4867, 10000],
  Hyderabad: [17.385, 78.4867, 10000],
  delhi: [28.7041, 77.1025, 10000],
  Delhi: [28.7041, 77.1025, 10000],
  Noida: [28.5355, 77.391, 10000],
  noida: [28.5355, 77.391, 10000],
};

const PropertyType = ["Apartment", "Independent House", "Gated Community"];

const BHKType = ["1 RK", "1 BHK", "2 BHK", "3 BHK", "4 BHK", "4+ BHK"];

const PropertyAge = [
  "Less than 1 year",
  "Between 1 to 3 year",
  "Between 3 to 5 year",
  "Between 5 to 10 year",
  "Greater than 10 year",
];

const Facing = [
  "North",
  "South",
  "East",
  "West",
  "North-East",
  "South-East",
  "North-West",
  "South-West",
];

const PreferredTenants = ["Family", "Bachelor", "Both"];

const Furnishing = ["Fully Furnished", "Semi Furnished", "Unfurnished"];

const Parking = ["Bike", "Car", "Both", "None"];

const WATER_SUPPLY = ["BOREWELL", "CORPORATION", "BOTH"];

module.exports = {
  Coordinates,
  PropertyType,
  BHKType,
  Facing,
  PropertyAge,
  PreferredTenants,
  Furnishing,
  Parking,
  WATER_SUPPLY,
};
