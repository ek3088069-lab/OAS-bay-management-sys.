import mongoose from 'mongoose';

const InventorySchema = new mongoose.Schema({
    ItemName: {
        type: String
    },
    Category: {
        type: String
    },
    Quantity: {
        type: Number
    },
    'Unit Price (UGX)': {
        type: Number
    },
    Supplier: {
        type: String
    },
    DateReceived: {
        type: Date
    }
});

export default mongoose.model('Inventory', InventorySchema);