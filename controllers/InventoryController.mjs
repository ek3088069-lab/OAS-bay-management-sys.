import Inventory from '../models/Inventory.mjs';
import ActivityLog from '../models/ActivityLog.mjs';

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