import express from 'express';
import { getInventoryList, getInventoryPage, addInventoryItem, getAddStockForm,addStock} from '../controllers/InventoryController.mjs';

const router = express.Router();

const requireAuth = (req, res, next) => {
  if (!req.session?.userId) return res.redirect('/?login=true');
  next();
};

router.get('/', requireAuth, getInventoryList);
router.get('/add-inventory', requireAuth, getInventoryPage);
router.post('/add-inventory', requireAuth, addInventoryItem);
router.get('/addstock',requireAuth,getAddStockForm);
router.post('/addstock',requireAuth, addStock);
export default router;
