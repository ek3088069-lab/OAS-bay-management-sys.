import express from "express";
import {getRegisterForm, getLoginForm, registerUser, loginUser, logoutUser} from "../controllers/authControllers.mjs";


const router = express.Router();

// router.get('/signup', (req, res) => {
//   res.redirect('/?signup=true');
// });
router.get('/signup',getRegisterForm) 

router.post('/signup', registerUser);

router.get('/login', getLoginForm);
router.post('/login', loginUser);
router.get('/logout', logoutUser);
 
export default router;
