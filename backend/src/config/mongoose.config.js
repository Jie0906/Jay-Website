const dotenv = require('dotenv')
const mongoose = require('mongoose')
const User = require('../models/Users/userModel')
const Role = require('../models/Users/roleModel')
const Permission = require('../models/Users/permissionModel')

dotenv.config();

const createInitialData = async () => {
  try {
    // 檢查是否已經存在初始數據，避免重複插入
    const adminCheck = await Role.findOne({ roleName: 'admin' });
    if (adminCheck) {
      console.log('Initial data already exists.');
      return;
    }

    // 創建權限
    const readPermission = new Permission({ permissionName: 'read' });
    const writePermission = new Permission({ permissionName: 'write' });
    await readPermission.save();
    await writePermission.save();

    // 創建角色並分配權限
    const adminRole = new Role({ roleName: 'admin', permission: [readPermission._id, writePermission._id] });
    const userRole = new Role({ roleName: 'user', permission: [readPermission._id] });
    await adminRole.save();
    await userRole.save();

    // 創建用戶並分配角色
    const adminUser = new User({ name: '管理者', username: 'admin', password: 'adminpassword', email: 'admin@example.com', role: [adminRole._id] });
    const normalUser = new User({ name: '預設用戶1', username: 'user', password: 'userpassword', email: 'user@example.com', role: [userRole._id] });
    await adminUser.save();
    await normalUser.save();

    console.log('Initial data created successfully.');
  } catch (error) {
    console.error('Error creating initial data:', error);
  }
};

const connectDB = async () => {
    try {
      await mongoose.connect(process.env.MONGO_URI)
      console.log('MongoDB connected');
      await createInitialData();
    } catch (error) {
      console.error('MongoDB connection error:', error);
      process.exit(1)
    }
  };

  module.exports = connectDB;