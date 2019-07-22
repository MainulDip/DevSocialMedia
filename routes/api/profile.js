const express = require('express')
const request = require('request')
const config = require('config')
const router = express.Router()
const Profile = require('../../models/Profile')
const User = require('../../models/User')
const Post = require('../../models/Post')
const auth = require('../../middleware/auth')
const { check, validationResult } = require('express-validator')

// @route   GET api/profile/me
// @desc    Get Current User's Profile
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      'user',
      ['name', 'avatar']
    )
    if (!profile) {
      return res.status(400).json({ msg: 'Ther Is No Profile For This User' })
    }
    res.json(profile);
  } catch (err) {
    console.error(err)
    res.status(500).send('Server Error')
  }
})

// @route   post api/profile
// @desc    Create Or Update User Profile
// @access  Private

router.post(
  '/',
  [
    auth,
    [
      check('status', 'Status Is Required')
        .not()
        .isEmpty(),
      check('skills', 'Skills Are Required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin
    } = req.body

    // Build Profile Object
    const profileFields = {}
    profileFields.user = req.user.id
    if (company) profileFields.company = company
    if (website) profileFields.website = website
    if (location) profileFields.location = location
    if (bio) profileFields.bio = bio
    if (status) profileFields.status = status
    if (githubusername) profileFields.githubusername = githubusername
    if (skills) {
      profileFields.skills = skills.split(',').map(skill => skill.trim())
    }
    console.log(profileFields.skills)
    // Build Social Object
    profileFields.social = {}
    if (youtube) profileFields.social.youtube = youtube
    if (twitter) profileFields.social.twitter = twitter
    if (facebook) profileFields.social.facebook = facebook
    if (linkedin) profileFields.social.linkedin = linkedin
    if (instagram) profileFields.social.instagram = instagram
    // console.log(profileFields.social)

    try {
      let profile = await Profile.findOne({ user: req.user.id })
      if (profile) {
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        )
        return res.json(profile)
      }

      profile = new Profile(profileFields)
      await profile.save()
      res.json(profile)
    } catch (err) {
      console.error(err.message)
      res.status(500).send('Server Error')
    }
  }
)

// @route   GET api/profile
// @desc    Get All Profiles
// @access  Public

router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar'])
    res.json(profiles)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

// @route   GET api/profile/user/:user_id
// @desc    Gry Profile By user_id
// @access  Public

router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id
    }).populate('user', ['name', 'avatar'])

    if (!profile) {
      return res
        .status(400)
        .json({ msg: 'There Is No Profile For This User In DB' })
    }
    res.json(profile)
  } catch (err) {
    console.error(err.message)
    if (err.kind === 'ObjectId') {
      res.status(500).send('There Is No Profile For This User In DB')
    }
    res.status(500).send('Server Error')
  }
})

// @route   delete api/profile
// @desc    Delete Profile, User & Posts
// @access  Private

router.delete('/', auth, async (req, res) => {
  try {
    // @todo - remove users posts
    // Remove User Posts
    await Post.deleteMany({user: req.user.id})
    // Remove Profile
    const profile = await Profile.findOneAndRemove({
      user: req.user.id
    })
    // Remove User
    const user = await User.findOneAndRemove({
      _id: req.user.id
    })

    console.log(profile, user)

    res.json({ msg: 'User Removed' })
  } catch (err) {
    console.error(err.message)
    if (err.kind === 'ObjectId') {
      res.status(500).send('There Is No Profile For This User In DB')
    }
    res.status(500).send('Server Error')
  }
})

// @route   put api/profile/experience
// @desc    Add Profile Experience
// @access  Private

router.put(
  '/experience',
  [
    auth,
    [
      check('title', 'Title Is Required')
        .not()
        .isEmpty(),
      check('company', 'Company Is Required')
        .not()
        .isEmpty(),
      check('from', 'From Date Is Required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    } = req.body

    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    }

    try {
      const profile = await Profile.findOne({ user: req.user.id })
      profile.experience.unshift(newExp)
      await profile.save()
      res.json(profile)
    } catch (err) {
      console.error(err.message)
      res.status(500).send('Server Error There')
    }
  }
)

// @route   delete api/profile/experience/:exp_id
// @desc    Delete Experience Profile
// @access  Private
router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id })
    // Get Remove Index

    const removeIndex = profile.experience
      .map(item => item.id)
      .indexOf(req.params.exp_id)

    profile.experience.splice(removeIndex, 1)

    await profile.save()
    
    res.json(profile)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error There')
  }
})

// @route   put api/profile/education
// @desc    Add Profile Education
// @access  Private

router.put(
  '/education',
  [
    auth,
    [
      check('school', 'School Is Required')
        .not()
        .isEmpty(),
      check('degree', 'Degree Is Required')
        .not()
        .isEmpty(),
      check('fieldofstudy', 'Field Of Study Is Required')
        .not()
        .isEmpty(),
      check('from', 'From Date Is Required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    } = req.body

    const newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    }

    try {
      const profile = await Profile.findOne({ user: req.user.id })
      profile.education.unshift(newEdu)
      await profile.save()
      res.json(profile)
    } catch (err) {
      console.error(err.message)
      res.status(500).send('Server Error There')
    }
  }
)

// @route   delete api/profile/education/:edu_id
// @desc    Delete education Profile
// @access  Private
router.delete('/education/:edu_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id })
    // Get Remove Index

    const removeIndex = profile.education
      .map(item => item.id)
      .indexOf(req.params.edu_id)

    profile.education.splice(removeIndex, 1)

    await profile.save()
    res.json(profile)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error There')
  }
})

// @route   get api/profile/github/:username
// @desc    GET User Repos From Github
// @access  Public

router.get('/github/:username', (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=created:asc&client_id=${config.get(
        'githubClientId'
      )}&client_secret=${config.get('githubSecret')}`,
      method: 'GET',
      headers: { 'user-agent': 'node.js' }
    }
    request(options, (error, response, body) => {
      if (error) console.error(error)
      if (response.statusCode !== 200) {
        return res.status(400).json({ msg: 'No Github Profile Found!' })
      }
      return res.json(JSON.parse(body))
    })
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error There')
  }
})

module.exports = router
