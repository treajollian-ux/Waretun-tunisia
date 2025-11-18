import express from 'express';
import { 
  connectToVPN, 
  disconnectFromVPN, 
  getConnectionStatus,
  getStatistics 
} from '../controllers/vpnController.js';

const router = express.Router();

router.post('/connect', connectToVPN);
router.post('/disconnect', disconnectFromVPN);
router.get('/status', getConnectionStatus);
router.get('/stats', getStatistics);

export default router;
