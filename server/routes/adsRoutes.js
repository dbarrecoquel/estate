import { Router } from 'express';

import { getAdsById, getAllAds } from '../controllers/adsController.js';

const router = Router();

router.get('/',getAllAds);
router.get('/:id',getAdsById);

export default router;