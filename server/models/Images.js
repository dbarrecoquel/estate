import mongoose from 'mongoose'

const imageSchema = new mongoose.Schema(

     {
    url: {
      type: String,
      required: [true, "L'URL de l’image est obligatoire"],
      trim: true
    },

    alt: {
      type: String,
      trim: true,
      maxlength: [200, "Le texte alternatif ne peut pas dépasser 200 caractères"]
    },

    isCover: {
      type: Boolean,
      default: false
    },

    order: {
      type: Number,
      default: 0
    }
  },
  {
    _id: false // pas d’ObjectId pour les images
  }
)

export default imageSchema