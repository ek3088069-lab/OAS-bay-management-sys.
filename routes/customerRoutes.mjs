import express from "express";
import Customers from '../models/Customers.mjs';

const router = express.Router();

router.get('/register', (req, res) => { // new
  res.render('customers');
});

//full route path is got by combining the path in app.use(..) and the path in router.get(...)
// /customers/register

router.post('/customers', async(req, res) => {
  try {
     const newCustomer = new Customers(req.body)
  await newCustomer.save()
  console.log(newCustomer);
  return res.redirect('/customers/register');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Failed to add customer.');
  }
 });
 

export default router;