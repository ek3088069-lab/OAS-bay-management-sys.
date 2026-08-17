import mongoose from "mongoose";
import { hashPasswordHook } from "../utils/passwordUtil.mjs";
const UserSchema = new mongoose.Schema({
     username: {
        type: String,
         required: true,
     },
     password: {
        type: String,
         required: true,
     },
     email: {
        type: String,
        sparse: true,
        unique: true,
        trim: true 
       },
      phone: {
        type: String,
        sparse: true,
        unique: true,
        
     },
     role: {
        type: String,
        required: true,
     }
}) 
//
UserSchema.pre('save', hashPasswordHook); 
const User = mongoose.model('User', UserSchema);

export default User;