import express from 'express';
const router = express.Router();
import studentController from '../controllers/student.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import {body} from 'express-validator';

router.post('/login' , [
    body('enrollmentNumber').isLength({min:5 , max:20}).withMessage('Enrollment number must be between 5 to 20 characters long'),
    body('password').isLength({min:6}).withMessage('Password must be at least 6 characters long')
],
    studentController.login
)

router.get('/profile' , authMiddleware.authStudent , studentController.getProfile);
router.get('/logout' , authMiddleware.authStudent , studentController.logout);
router.post('/forgot-password' , studentController.forgotPassword);
router.post('/reset-password' , studentController.resetPassword);

export default router;