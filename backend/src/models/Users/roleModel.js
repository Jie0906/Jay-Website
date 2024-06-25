const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const RoleSchema = new mongoose.Schema({
  roleName: {
    type: String,
    required: true,
    unique: true
  },
  permission: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Permission' 
  }],
},{
    timestamps: true
});
RoleSchema.plugin(mongooseDelete, { deletedAt: true, overrideMethods: 'all' });

module.exports = mongoose.model('Role', RoleSchema);