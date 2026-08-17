import express from 'express';
import { getInventoryPage, addInventoryItem } from '../controllers/InventoryController.mjs';

const router = express.Router();

router.get('/add-inventory', getInventoryPage);
router.post('/add-inventory', addInventoryItem);

export default router;