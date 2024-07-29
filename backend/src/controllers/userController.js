const User = require('../models/Users/userModel')
const jwtHandler = require('../middlewares/jwtHandler')
const sessionHandler = require('../middlewares/sessionHandler')
const {
    encrypt: encrypt,
    decrypt: decrypt,
} = require('../utils/passwordEncrypt')
class UserController {
    createUser = async (req, res, next) => {
        try {
            const { name, username, password, email } = req.body

            if ( !name || !username || !password || !email ) {
                const error = new Error('Field cannot be empty.')
                error.status = 400
                throw error
            }
            //密碼加鹽
            const encryptPassword = await encrypt(password)
            let infor = {
                name: name,
                username: username,
                password: encryptPassword,
                email: email,
            }
            //新增user
            await User.create(infor)
            return res.status(201).json({
                message: `User ${req.body.name} created successfully! `
            })
        }
        catch (error) {
            next(error)
        }
    }
    login = async (req, res, next) => {
        /*登入邏輯
            建立redis連線 -> 確認帳號密碼 -> 根據使用者資訊生成jwt & sessionID return 給 client -> sessionData儲存用戶登入狀態並設定時效 -> 將sessionData 存至 redis    
         */
        try {
          const { username, password } = req.body
          const userExist = await User.findOne({username: username})
          if (!userExist) {
            const error = new Error('User did not exist.')
            error.status = 404
            throw error
            }
          const userId = userExist._id
          const payload = {
            name: userExist.name,
            email: userExist.email
          }
          if (!username || !password) {
            const error = new Error('Field cannot be empty.')
            error.status = 400
            throw error
          }
          const checkPassword = await decrypt(password, userExist.password);
          const jsonWebToken = await jwtHandler.signJWT({ payload })
          const sessionId = await sessionHandler.SavingSessionDataToRedis(userExist.role, userId)
          res.cookie('sessionId', sessionId, {
            signed: true,
            httpOnly: true,
            sameSite: 'Strict'
          });
          res.cookie('jsonWebToken', jsonWebToken, {
              signed: true,
              httpOnly: true,
              sameSite: 'Strict'
          });        
          return res.status(200).json({
          message: `Login successfully! Welcome back ${userExist.name}.`,
          accessToken: jsonWebToken,
          sessionId: sessionId
          })
     
        } catch (error) {
            next(error)
        }
      }

      logout = async (req, res, next) => {
        try {
          const sessionId = req.cookies.sessionId;
          const token = req.cookies.jsonWebToken;
          if ( !sessionId || !token ) {
            const error = new Error('No sessionId provided')
            error.status = 400
            throw error
          }
            await sessionHandler.clearSession(sessionId);
            // 清除 client 端的 cookie
            res.clearCookie('sessionId');
            res.clearCookie('jsonWebToken');
    
            return res.status(200).json({ message: 'Logout successful' });
        } catch (error) {
            next (error)
        }
      }

}

module.exports = new UserController()