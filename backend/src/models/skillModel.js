const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const SkillSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['technical', 'certification']
  },
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
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
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

SkillSchema.plugin(mongooseDelete, { deletedAt: true, overrideMethods: 'all' });

module.exports = mongoose.model('Skill', SkillSchema);