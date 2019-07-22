const express = require('express')
const router = express.Router()
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { check, validationResult } = require('express-validator')
const config = require('config')
// const util = require('util')

const UserModel = require('../../models/User')
// console.log(UserModel)

// @route   POST api/users
// @desc    Register User
// @access  Public
router.post(
  '/',
  [
    check('name', 'Name Is Required')
      .not()
      .isEmpty(),
    check('email', 'Please Include A Valid Email').isEmail(),
    check(
      'password',
      'Please Enter A Password With 6 Or More Charecture'
    ).isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    // console.log(util.inspect(obj, {depth: null}))
    // res.send(util.inspect(req, {depth: null}));

    const { name, email, password } = req.body
    try {
      // see if user exists
      let user = await UserModel.findOne({ email })
      console.log(user)
      if (user) {
        console.log(user)
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] })
      }
      // get users gravatars
      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm'
      })

      user = new User({
        name,
        email,
        avatar,
        password
      })
      console.log(user)

      // encrypt password
      // const salt = await bcrypt.getSalt(10);
      // user.password = await bcrypt.hash(password, salt);
      user.password = await bcrypt.hash(password, 10)

      // console.log(user.password)
      await user.save()
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
