const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const SkillSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
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
SkillSchema.plugin(mongooseDelete, { deletedAt: true, overrideMethods: 'all' });

module.exports = mongoose.model('Skill', SkillSchema);