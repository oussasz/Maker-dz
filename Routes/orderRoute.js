import express from 'express';
import {
    createOrder,
    updateSellerOrders,
    getSellerOrders,
    updateOrderStatus,
    deleteOrder,
    getOrdersByStatus,
    getDashboardData,
} from '../controllers/orderController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/orders', authenticateUser, createOrder);
router.put('/sellers/:sellerId/orders', updateSellerOrders);
router.get('/sellers/:sellerId/orders', getSellerOrders);
router.get('/sellers/:sellerId/dashboard', getDashboardData);
router.put('/:sellerId/orders/:orderId', updateOrderStatus);
router.delete('/:sellerId/orders/:orderId', deleteOrder);
router.get('/sellers/:sellerId/orders/:status', getOrdersByStatus);

export default router;