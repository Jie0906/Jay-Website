const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const PermissionSchema = new mongoose.Schema({
  permissionName: {
    type: String,
    required: true,
    unique: true
  },
},{
    timestamps: true
});
PermissionSchema.plugin(mongooseDelete, { deletedAt: true, overrideMethods: 'all' });

module.exports = mongoose.model('Permission', PermissionSchema);