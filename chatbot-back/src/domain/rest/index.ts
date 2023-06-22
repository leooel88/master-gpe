import { Router } from 'express';
import chatbot from './chatbot';

const router = Router();
router.use(chatbot);

export default router;
