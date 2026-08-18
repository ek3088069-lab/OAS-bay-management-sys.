import express from 'express';
import { getInventoryList, getInventoryPage, addInventoryItem } from '../controllers/InventoryController.mjs';

const router = express.Router();

const requireAuth = (req, res, next) => {
  if (!req.session?.userId) return res.redirect('/?login=true');
  next();
};

router.get('/', requireAuth, getInventoryList);
router.get('/add-inventory', requireAuth, getInventoryPage);
router.post('/add-inventory', requireAuth, addInventoryItem);

export default router;
