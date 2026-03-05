
import AdsType from '../models/AdsType.js';
import mongoose from 'mongoose';
export const getAllAdsType = async (req, res) => {

    try {
       
        const filter = {};

       
        const ads = await AdsType.find(filter)
        .sort({ name: 1 })
        .lean()

       res.status(200).json({
        success: true,
        count: ads.length,
        data: ads,
    });

    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }


};

export const getAdsTypeById = async (req, res) => {
  try {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID invalide'
      })
    }

    const ads = await AdsType.findById(id)
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
