import Ads from '../models/Ads.js';
import AdsType from '../models/AdsType.js';
import mongoose from 'mongoose';
export const getAllAds = async (req, res) => {

    try {
        const { adsType, minPrice, maxPrice, search, page = 1, limit = 10 } = req.query;

        const filter = {};

        if (adsType)
            filter.adsType = adsType;
        if (minPrice || maxPrice)
        {
            filter.price ={}
            if (minPrice)
                filter.price.$gte = Number(minPrice);
            if (maxPrice)
                filter.price.$lte = Number (maxPrice);
            
        }
        if (search)
            filter.$text = {$search: search}
        
        const skip = (Number(page) - 1) * Number(limit);
        const total = await Ads.countDocuments(filter);
        const ads = await Ads.find(filter)
        .populate({
            path: 'adsType',
            select: 'name'
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean()

       res.status(200).json({
        success: true,
        count: ads.length,
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
        data: ads,
    });

    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }


};

export const getAdsById = async (req, res) => {
  try {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID invalide'
      })
    }

    const ads = await Ads.findById(id)
      .populate('adsType')
      .lean()

    if (!ads) {
      return res.status(404).json({
        success: false,
        message: 'Annonce non trouvée'
      })
    }

    res.status(200).json({
      success: true,
      data: ads
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    })
  }
}
