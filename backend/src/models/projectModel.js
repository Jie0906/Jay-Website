const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const ProjectSchema = new mongoose.Schema({
  title: {
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
  },
  date: {
    type: Date,
    default: Date.now,
  },
},{
    timestamps: true
});
ProjectSchema.plugin(mongooseDelete, { deletedAt: true, overrideMethods: 'all' });

module.exports = mongoose.model('Project', ProjectSchema);
