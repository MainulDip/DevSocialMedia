import React, { Fragment, useEffect } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Landing from './components/layout/Landing'
import Register from './components/auth/Register'
import Login from './components/auth/Login'
// Redux Setup
import { Provider } from 'react-redux'
import store from './store'
import Alert from './components/layout/Alert'
import { loadUser } from './actions/auth'
import setAuthToken from './utils/setAuthToken'
import Dashboard from './components/dashboard/Dashboard'
import PrivateRoute from './components/routing/PrivateRoute'
import CreateProfile from './components/profile-form/CreateProfile'
import EditProfile from './components/profile-form/EditProfile'
import AddExperience from './components/profile-form/AddExperience'
import AddEducation from './components/profile-form/AddEducation'
import Profiles from './components/profiles/Profiles'
import Profile from './components/profile/Profile'
import Posts from './components/posts/Posts'
import Post from './components/post/Post'
import NotFound from './components/layout/NotFound'

import './App.css'

if (localStorage.token) {
  setAuthToken(localStorage.token)
}

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser())
  }, [])
  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          {/* <h1>App</h1> */}
          <Navbar />
          <Switch>
            <Route exact path='/' component={Landing} />
            <Route>
              <section className='container'>
                <Alert />
                <Switch>
                  <Route exact path='/register' component={Register} />
                  <Route exact path='/login' component={Login} />
                  <Route exact path='/profiles' component={Profiles} />
                  <Route exact path='/profile/:id' component={Profile} />
                  <PrivateRoute exact path='/dashboard' component={Dashboard} />
                  <PrivateRoute
                    exact
                    path='/create-profile'
                    component={CreateProfile}
                  />
                  <PrivateRoute
                    exact
                    path='/edit-profile'
                    component={EditProfile}
                  />
                  <PrivateRoute
                    exact
                    path='/add-experience'
                    component={AddExperience}
                  />
                  <PrivateRoute
                    exact
                    path='/add-education'
                    component={AddEducation}
                  />
                  <PrivateRoute exact path='/posts' component={Posts} />
                  <PrivateRoute exact path='/posts/:id' component={Post} />
                  <Route component={NotFound} />
                </Switch>
              </section>
            </Route>
          </Switch>
        </Fragment>
      </Router>
    </Provider>
  )
}

export default App
