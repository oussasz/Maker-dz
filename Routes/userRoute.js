
import express from 'express';
import { likeProduct, getSellers, getUser } from '../controllers/userController.js';

const router = express.Router();

router.put('/user/:userId/liked/:productId', likeProduct);
router.get('/sellers', getSellers);
router.get('/users/:userId', getUser);

export default router;
