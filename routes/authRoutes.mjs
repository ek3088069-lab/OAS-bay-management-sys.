import express from "express";
import {getRegisterForm, getLoginForm, registerUser, loginUser, logoutUser} from "../controllers/authControllers.mjs";


const router = express.Router();

router.get('/signup', (req, res) => {
  res.redirect('/?signup=true');
});
router.post('/signup', registerUser);

router.get('/login', (req, res) => {
  res.redirect('/?login=true');
});
router.post('/login', loginUser);
router.get('/logout', logoutUser);
 
export default router;
