import express from "express";
import { getStockPage, createStockItem } from "../controllers/stockControllers.mjs";

const router = express.Router();

router.get('/inventory', getStockPage);
 
//full route path
// /registerStock/inventory

router.post('/add-stock', createStockItem);
  
export default router;