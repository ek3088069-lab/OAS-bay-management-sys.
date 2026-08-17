import express from "express";

const router = express.Router();

router.get('/register', (req, res) => { // new
  res.render('vehicles');
});

//full route path is got by combining the path in app.use(..) and the path in router.get(...)
// /vehicles/register

router.post('/vehicles', (req, res) => { // new
  console.log(req.body);
  res.send('vehicle added successfully');
});

export default router;