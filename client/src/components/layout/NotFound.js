import React, { Fragment, useEffect } from 'react'

const NotFound = () => {
  useEffect(() => {
    document.getElementsByTagName('body')[0].classList.add('notfoundshow')
    document.getElementsByTagName('body')[0].style.overflow = 'hidden'
    return () => {
      document.getElementsByTagName('body')[0].classList.remove('notfoundshow')
      document.getElementsByTagName('body')[0].style.overflow = 'auto'
    }
  }, [])
  return (
    <Fragment>
      <div className=' bg-light p-3'>
        <h1 className='x-large text-primary'>
          <i className='fas fa-exclamation-triangle' />
          Page Not Found
        </h1>
        <p className='large'>Sorry, This Page Does Not Exists</p>
      </div>
    </Fragment>
  )
}

export default NotFound
