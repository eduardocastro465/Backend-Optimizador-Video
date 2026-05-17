import { Router } from 'express';
import {
    getLogs, getLogById, getLogsByUserId, getLogsByDate, getLogsByLevel,
    getLogsByPath, getLogsByDateRange, getLogsByStatusCode, getLogsStats
} from '../../controllers/auth/log.controller.js';
import { deleteLog, deleteLogsByDateRange, deleteAllLogs }
    from '../../controllers/auth/log.controller.js';


const router = Router();

router.get('/', getLogs);
router.get('/stats', getLogsStats);
router.get('/path', getLogsByPath);
router.get('/rango', getLogsByDateRange);
router.get('/level/:level', getLogsByLevel);
router.get('/status/:status', getLogsByStatusCode);
router.get('/date/:date', getLogsByDate);
router.get('/user/:id', getLogsByUserId);
router.get('/:id', getLogById);


router.delete('/:id', deleteLog);
router.delete('/rango', deleteLogsByDateRange);
router.delete('/', deleteAllLogs);

export default router;