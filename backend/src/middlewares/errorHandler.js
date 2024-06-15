const errorHandler = (err, req, res, next) => {
    console.error(err.stack)
  
    const status = err.status || 500 
    const message = err.message || 'Internal Server Error' 
  
    switch (status) {
      case 400:
        res.status(400).json({
          error: {
            message: message || 'Bad Request',
            status: 400
          }
        })
        break
      case 401:
        res.status(401).json({
          error: {
            message: message || 'Unauthorized',
            status: 401
          }
        })
        break
      case 403:
        res.status(403).json({
          error: {
            message: message || 'Forbidden',
            status: 403
          }
        })
        break
      case 404:
        res.status(404).json({
          error: {
            message: message || 'Not Found',
            status: 404
          }
        })
        break
      default:
        res.status(status).json({
          error: {
            message: message,
            status: status
          }
        })
        break
        case 409:
          res.status(409).json({
            error: {
              message: message || 'Conflict',
              status: 409
            }
          })
          break
    }
  }
  
  const notFoundHandler = (req, res, next) => {
    const error = new Error('Not Found')
    error.status = 404
    next(error)
  }
  
  module.exports = { errorHandler, notFoundHandler }
  