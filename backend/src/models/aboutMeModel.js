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
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  company: {
    type: String
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

// 虛擬屬性：根據類型返回格式化的日期
AboutMeSchema.virtual('formattedDate').get(function() {
  switch(this.type) {
    case 'education':
      return this.date ? this.date.toLocaleDateString() : '';
    case 'experience':
      return `${this.startDate ? this.startDate.toLocaleDateString() : ''} - ${this.endDate ? this.endDate.toLocaleDateString() : '至今'}`;
    default:
      return '';
  }
});

AboutMeSchema.plugin(mongooseDelete, { deletedAt: true, overrideMethods: 'all' });

module.exports = mongoose.model('AboutMe', AboutMeSchema);