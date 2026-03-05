import mongoose from 'mongoose'


const adsTypeSchema = new mongoose.Schema(
    {
        name : {
            type : String,
            required : [true, 'le nom est obligatoire'],
            trim : true,
            unique : true,   
            minlength: [2, 'Le nom doit contenir au moins 2 caractères'],
            maxlength: [200, 'Le nom ne peut pas dépasser 200 caractères'],
        }
    }
)
const AdsType = mongoose.model('AdsType', adsTypeSchema)

export default AdsType