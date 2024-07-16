const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const AboutMeSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['education', 'experience', 'autobiography']
  },
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String
  },
  content: {
    type: String,
    required: true
  },
  date: {
    type: Date
  },
  imagePath: {
    type: String
  },
  imageUrl: {
    type: String
  }
},{
    timestamps: true
});
AboutMeSchema.plugin(mongooseDelete, { deletedAt: true, overrideMethods: 'all' });
module.exports = mongoose.model('AboutMe', AboutMeSchema);
