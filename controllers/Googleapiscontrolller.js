var axios = require("axios");
require('dotenv').config();
const {Coordinates}=require('../constants')



const suggestionAutocomplete = async (req,res) => {
  try{
    const {city,text}=req.query;
    
  var config = {
    method: "get",
    url:`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${text}&types=sublocality&location=${Coordinates[city][0]}%2C${Coordinates[city][1]}&radius=${Coordinates[city][2]}&key=${process.env.GMAP_API_KEY}`,
    headers: {},
  };

  const response=await axios(config);
   
      const suggestions=response.data.predictions.map((locationData)=>locationData.description);
      res.status(200).json(suggestions);
}
    catch(err){
      console.log(err);
    }
};

const getCoordinatesByLocation=async (place)=>{
try{
  var config={
    method:"get",
    url:`https://maps.googleapis.com/maps/api/geocode/json?address=${place}&key=${process.env.GMAP_API_KEY}`,
    headers: {},
  };

  const response =await axios(config)
  
    const latAndLang=Object.values(response.data.results[0].geometry.location);
    return latAndLang;
}
  catch(e){
    console.log(e);
    
  }


}
const nearbyLocalities=async(req,res)=>{


  try{
  const {text}=req.query;
 const coordinates=await getCoordinatesByLocation(text);
  var config={
    method:"get",
    url:`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${coordinates[0]}%2C${coordinates[1]}&radius=5000&&keyword=${text}&key=${process.env.GMAP_API_KEY}`,
    headers: {},
  };

  const response=await axios(config)
  console.log(response.data);
    // const suggestions=response.data.predictions.map((locationData)=>locationData.description);
    
    // res.status(200).json(suggestions);
 
}
catch(err){
console.log(err);
}

}
module.exports={
suggestionAutocomplete,
nearbyLocalities
}

