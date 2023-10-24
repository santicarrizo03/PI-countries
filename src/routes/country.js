const { Router } = require("express");
const { Country, Activity } = require("../db");
const axios = require("axios");

const router = Router();

const getCountries = async () => {
  const countriesDb = await Country.findAll({
    include: [{ model: Activity }],
  });

  if (countriesDb.length === 0) {
    try {
      const apiUrl = await axios.get("https://restcountries.com/v3/all"); // peticion a la API
      const apiInfo = await apiUrl.data.map((e) => { // creo objeto con la info que necesito
        return {
          name: e.name.common,
          id: e.cca3,
          flag: e.flags[1],
          continent: e.continent[0],
          capital: e.capital,
          subregion: e.subregion,
          area: e.area,
          population: e.population,
        };
      });
      apiInfo.map(async(e) => {
        await Country.findOrCreate({
          where: {
            id: e.id,
            name: e.name.toUpperCase(),
            flag: e.flag,
            continent: e.continent,
            capital: e.capital ? e.capital[0] : "Capital not found",
            subregion: e.subregion ? e.subregion : "Subregion not found",
            area: e.area,
            population: e.population,
          },
        })
      })
      return apiInfo
    } catch (error) {
      console.log(error);
    }
  }else {
    return countriesDb
  }
};



module.exports = router;