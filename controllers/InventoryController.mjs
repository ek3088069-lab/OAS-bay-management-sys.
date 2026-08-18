import Inventory from '../models/Inventory.mjs';
import ActivityLog from '../models/ActivityLog.mjs';

export const getInventoryList = async (req, res) => {
    try {
        const items = await Inventory.find({}).sort({ Category: 1, ItemName: 1 }).lean();
        const lowStockItems = items.filter((item) => Number(item.Quantity || 0) <= 5);

        res.render('inventory', {
            session: req.session,
            items,
            lowStockItems,
        });
    } catch (error) {
        console.error('Error loading inventory:', error);
        res.status(500).send('Error loading inventory.');
    }
};

export const getInventoryPage = (req, res) => {
    res.render('addinventory');
};

export const addInventoryItem = async (req, res) => {
    try {
        const newItem = new Inventory(req.body);
        await newItem.save();

        await ActivityLog.create({
            user: req.session.userId,
            username: req.session.username,
            role: req.session.userRole,
            action: 'inventory_added',
            details: `Added inventory item ${req.body.ItemName || 'new inventory item'} with quantity ${req.body.Quantity || 0}.`
        });

        req.flash('success', 'Inventory Added Successfully!');
        res.redirect('/inventory/add-inventory');
    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to add inventory item.');
    }
};
