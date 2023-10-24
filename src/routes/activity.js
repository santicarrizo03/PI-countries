const { Router } = require("express");
const { Activity, Country } = require("../db");
const { v4: uuidv4 } = require("uuid");

const router = Router();

router.post("/", async (res, req) => {
  const { countries, name, difficulty, duration, season } = req.body;
  try {
    const id = uuidv4();

    const createActivity = await Activity.create({
      id,
      name,
      difficulty,
      duration,
      season,
    });

    const findCountry = await Country.findAll({
      where: {
        id: countries,
      },
    });
    await createActivity.addCountries(findCountry);
    return res.send("Actividad creada");
  } catch (error) {
    res.send({ msg: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const activities = await Activity.findAll();
    return res.status(200).send(activities);
  } catch (error) {
    return res.status(400).send(error);
  }
});

module.exports = router;