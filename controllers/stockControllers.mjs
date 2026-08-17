import Stock from '../models/stock.mjs';

export const getStockPage = (req, res) => {
	res.render('registerStock');
};

export const createStockItem = async (req, res) => {
	try {
		const newStock = new Stock({
			...req.body,
			registeredBy: req.session.userId
		});
		await newStock.save();
		console.log(newStock);
	    res.redirect('/registerStock/inventory');
	} catch (error) {
		console.error(error);
		res.status(500).send('Failed to add stock item.');
	}
};

