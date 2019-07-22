import React, { Fragment, useState } from 'react'
// import axios from 'axios'
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { setAlert } from '../../actions/alert'
import { register } from '../../actions/auth'
import PropTypes from 'prop-types'

// Use Of React Hook
const Register = ({ setAlert, register, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: ''
  })

  // Object DeStructuring
  const { name, email, password, password2 } = formData

  // Form Values Are Populated From onChange Method
  const onChange = e => {
    // copy of formData will be replaced by key's targeted value
    // setFormData call will update the state with new value
    return setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const onSubmit = async e => {
    e.preventDefault()
    if (password !== password2) {
      setAlert('password do no matches', 'danger')
    } else {
      register({name, email, password});
      //   const newUser = {
      //     // same as {name: name, email: email, password: password}
      //     name,
      //     email,
      //     password
      //   }
      try {
        // const config = {
        //   headers: {
        //     'Content-Type': 'application/json'
        //   }
        // }
        // const body = JSON.stringify(newUser)
        // const res = await axios.post('/api/users', body, config)
        // console.log(res.data)
        console.log(formData)
      } catch (err) {
        console.log(err.response.data)
      }
    }
  }

  if(isAuthenticated){
    return <Redirect to="/dashboard" />
  }

  return (
    <Fragment>
      <h1 className='large text-primary'>Sign Up</h1>
      <p className='lead'>
        <i className='fas fa-user' /> Create Your Account
      </p>
      <form className='form' onSubmit={e => onSubmit(e)}>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Name'
            name='name'
            value={name}
            onChange={e => onChange(e)}
            required
          />
        </div>
        <div className='form-group'>
          <input
            type='email'
            placeholder='Email Address'
            name='email'
            value={email}
            onChange={e => onChange(e)}
            required
          />
          <small className='form-text'>
            This site uses Gravatar so if you want a profile image, use a
            Gravatar email
          </small>
        </div>
        <div className='form-group'>
          <input
            type='password'
            placeholder='Password'
            name='password'
            minLength='6'
            value={password}
            onChange={e => onChange(e)}
            required
          />
        </div>
        <div className='form-group'>
          <input
            type='password'
            placeholder='Confirm Password'
            name='password2'
            minLength='6'
            value={password2}
            onChange={e => onChange(e)}
            required
          />
        </div>
        <input type='submit' className='btn btn-primary' value='Register' />
      </form>
      <p className='my-1'>
        Already have an account? <Link to='/login'>Sign In</Link>
      </p>
    </Fragment>
  )
}

Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
})

// exporting connect()(Component) will allow us to use setAlert call inside Register function through props.setAlert
export default connect(
  mapStateToProps,
  { setAlert, register }
)(Register)
