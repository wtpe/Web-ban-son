import mongoose from 'mongoose';

const ColorSchema = new mongoose.Schema({
    ColorId : String,

},{timestamps : true});

const Color = mongoose.models.Colors || mongoose.model('Colors', ColorSchema);

export default Color;