import mongoose from 'mongoose'
import imageSchema from './Images.js'

const adsSchema = new mongoose.Schema(
    {
        title : {
            type : String,
            required : [true, 'le titre est obligatoire'],
            trim : true,   
            minlength: [2, 'Le nom doit contenir au moins 2 caractères'],
            maxlength: [200, 'Le nom ne peut pas dépasser 200 caractères'],
        },
        description: {
            type: String,
            trim: true,
            maxlength: [2000, 'La description ne peut pas dépasser 2000 caractères'],
        },
        price: {
            type: Number,
            required: [true, 'Le prix est obligatoire'],
            min: [0, 'Le prix ne peut pas être négatif'],
        },
         rooms: {
            type: Number,
            required: [true, 'Le nombre de piece est obligatoire'],
            min: [0, 'Le nombre de piece ne peut pas être négatif'],
        },
        surface : {
            type : Number,
            required : [true, 'la surface est obligatoire'],
            min : [0, 'la surface ne peut pas etre negative']
        },
        adsType : {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'AdsType',
            required: [true, 'le type d immobilier est obligatoire'],

        },
        images: {
            type: [imageSchema],
            validate: {
                validator: function (images) {
                return images && images.length > 0
                },
                message: 'Au moins une image est requise'
            }
        }
    },
    {   timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
     }
);

adsSchema.index({ title: 'text', description: 'text' });
adsSchema.index({ adsType: 1 });
adsSchema.index({ price: 1 });
adsSchema.index({ adsType: 1, price: 1 });

const Ads = mongoose.model('Ads', adsSchema);

export default Ads;