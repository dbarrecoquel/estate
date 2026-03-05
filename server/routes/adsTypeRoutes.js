import { Router } from 'express';

import { getAdsTypeById, getAllAdsType } from '../controllers/adsTypeController.js';

const router = Router();

router.get('/',getAllAdsType);
router.get('/:id',getAdsTypeById);

export default router;