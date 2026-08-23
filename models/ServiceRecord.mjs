import mongoose from "mongoose";

const serviceRecordSchema = new mongoose.Schema(
  {
    customerName: { 
      type: String,
      required: true,
      trim: true 
    },
    numberPlate: {
      type: String,
      required: true,
      trim: true,
      uppercase: true 
    },
    serviceCategory: {
      type: String,
      required: true,
      trim: true
    },
    serviceName: { 
      type: String, 
      required: true, 
      trim: true 
    },
    serviceDate: { 
      type: Date, 
      required: true 
    },
    technicianName: { 
      type: String, 
      required: true, 
      trim: true 
    },
    stockUsed: { 
      type: String, 
      trim: true, 
      default: "" 
    },
    totalServiceCost: { 
      type: Number, 
      required: true, 
      min: 20000
    },
    isPaid: { 
      type: Boolean, 
      default: false 
    },
    recordedBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
  },
  { timestamps: true },
);

export default mongoose.model("ServiceRecord", serviceRecordSchema);
