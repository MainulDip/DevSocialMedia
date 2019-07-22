const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { check, validationResult } = require('express-validator')
const config = require('config')

const User = require('../../models/User')

// @route   GET api/auth
// @desc    Test Route
// @access  Public
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    res.json(user)
    // console.log(req.user.id)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error For Auth Middleware')
  }
})

// @route   POST api/auth
// @desc    Authenticate User And Get The Token
// @access  Public
router.post(
  '/',
  [
    check('email', 'Please Include A Valid Email').isEmail(),
    check('password', 'Please Enter A Valid Password').exists()
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    // console.log(util.inspect(obj, {depth: null}))
    // res.send(util.inspect(req, {depth: null}));

    const { email, password } = req.body
    try {
      // see if user exists in the MongoDB database through monggose
      let user = await User.findOne({ email })
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] })
      }

      const isMatch = await bcrypt.compare(password, user.password)

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] })
      }

      // return jsonwebtoken
      const payload = {
        user: {
          id: user.id
        }
      }

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err
          res.json({ token })
        }
      )

      // res.send('User Registered')
    } catch (err) {
      console.error(err.message)
      res.status(500).send('Server Error')
    }
  }
)

module.exports = router
