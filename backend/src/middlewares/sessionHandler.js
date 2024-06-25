const { generateSessionId } = require('../utils/uuid')
const connectRedis = require('../config/redisClient.config')
class SessionHandler  {
    async SavingSessionDataToRedis(role, userId){
        try{
            console.log(connectRedis)  
            const redisClient = await connectRedis()
            const sessionIdKey = `userId:${userId}` //創建sessionId 映射 userId
            const redisSessionIdExist = await redisClient.GET(sessionIdKey) //由sessionIdKey 查詢user 是否存在
            let sessionId
            if (!redisSessionIdExist) { // 如user不存在則生成新的 sessionID
              sessionId = String(generateSessionId())
              // 創建 sessionData 儲存用戶登入狀態
              const sessionData = {
                  userId: userId,
                  role: role,
                  loggedIn: true // 用户的登入狀態
              }
              await redisClient.set(sessionId, JSON.stringify(sessionData))
              await redisClient.expire(sessionId, '3600')
              await redisClient.set(sessionIdKey, sessionId, 'EX','3600')
              await redisClient.expire(sessionIdKey, '3600')
              console.log(`Generated new sessionId: ${sessionId}`)
          }
          else{
              //若user已存在
              sessionId = redisSessionIdExist
              const data = await redisClient.get(String(sessionId));
                  if (data) {
                      const updatedSessionData = JSON.parse(data);
                      await redisClient.expire(sessionId, '3600')
                      await redisClient.expire(sessionIdKey, '3600')
                      console.log(`Refeshed the sessionId: ${sessionId}`)
                  } else {
                      console.error(`Failed to refresh the session data for sessionId: ${sessionId}`);
                  }
          }
          return sessionId
        }catch(err){
            console.log(err)
            return false
        }
    }
    async clearSession(sessionId) {
        try {
            const redisClient = await connectRedis();
            const sessionData = await redisClient.get(String(sessionId));
            if (sessionData) {
                const parsedSessionData = JSON.parse(sessionData);
                const sessionIdKey = `userId:${parsedSessionData.userId}`;
                await redisClient.del(sessionId);
                await redisClient.del(sessionIdKey);
                console.log(`Cleared sessionId: ${sessionId}`);
            } else {
                console.log(`Session data not found for sessionId: ${sessionId}`);
            }
        } catch (err) {
            console.log('Error clearing session:', err);
            throw new Error('Failed to clear session');
        }
    }
    async verifySessionId (req, res, next){
        try{
            const redisClient = await connectRedis()
            const sessionId = req.cookies.sessionId
            if (!sessionId) {
                const error = new Error('Did not have sessionId.')
                error.status = 401
                throw error
            }
            const sessionData = await redisClient.get(String(sessionId))
            if (!sessionData){
                const error = new Error('Did not have sessionData.')
                error.status = 401
                throw error
            }
            const parseSessionData = JSON.parse(sessionData)
            //console.log(sessionId,'$$$')
            //console.log(parseSessionData.loggedIn,typeof(parseSessionData),'###')
            if (parseSessionData.loggedIn === true){
                console.log('sessionId check ok')
                return next()
            }
            else{
                const error = new Error('SessionId check did not pass.')
                error.status = 401
                throw error
            }

        }catch (error) {
            next(error)
          }
    }
}

module.exports = new SessionHandler()