const { JWT_SECRET } = require("../secrets"); // use this secret!
const { findBy } = require('../users/users-model')
const jwt = require('jsonwebtoken')
  /*
    IMPLEMENT

    1- On valid token in the Authorization header, call next.

    2- On missing token in the Authorization header,
      the response body should include a string exactly as follows: "token required".

    3- On invalid or expired token in the Authorization header,
      the response body should include a string exactly as follows: "token invalid".
  */
function restricted(req, res, next) {
  const token = req.headers.authorization
  if (!token) {
    return next({ status: 401, message: 'Token required' })
  }
  jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
    if (err) {
      next({ status: 401, message: 'Token invalid' })
    } else {
      req.decodedToken = decodedToken
      next()
    }
  })
}

async function checkUsernameFree(req, res, next) {
  try {
    const users = await findBy({ username: req.body.username })
    if (!users.length) {
      next()
    }
    else {
      res.status(400).json({
        message: 'username taken',
      })
    }
  } catch (err) {
    next(err)
  }
}

function validateRegistration(req, res, next) {
  const { username, password } = req.body
  if (!username || !username.trim() || !password || !password.trim()) {
    res.status(400).json({
      message: 'username and password required',
    })
  } else {
      req.username = username.trim()
      req.password = password.trim()
    next()
  }
}

async function checkUsernameExists(req, res, next) {
  try {
    const [user] = await findBy({ username: req.body.username})
      if (!user ) {
        res.status(422).json({
          message: 'Invalid credentials',
        })
      } else {
        req.user = user
        next()
      }
    } catch (err) {
      next(err)
    }
}


module.exports = {
  restricted,
  checkUsernameFree,
  validateRegistration,
  checkUsernameExists,
}

// module.exports = (req, res, next) => {
//   next();
//   /*
//     IMPLEMENT
//     1- On valid token in the Authorization header, call next.
//     2- On missing token in the Authorization header,
//       the response body should include a string exactly as follows: "token required".
//     3- On invalid or expired token in the Authorization header,
//       the response body should include a string exactly as follows: "token invalid".
//   */
// };