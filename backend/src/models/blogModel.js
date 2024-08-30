const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  category: {  
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
},{
    timestamps: true
});
BlogSchema.plugin(mongooseDelete, { deletedAt: true, overrideMethods: 'all' });

module.exports = mongoose.model('Blog', BlogSchema);
