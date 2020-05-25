import React, { useState } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { history } from '../redux'
import './inputview.css'

const InputView = () => {
  const [username, setUserName] = useState('')
  const handleClick = () => {
    history.push(`/${username}`)
  }
  const handleChange = (e) => {
    setUserName(e.target.value)
  }
  return (
    <div className="inputview">
      <div className="min-h-screen flex items-center justify-center bg-blue-50 px-4 sm:px-6 lg:px-8">
        <input
          type="text"
          id="input-field"
          placeholder="Write Name"
          className="bg-transparent hover:bg-blue text-blue-dark font-semibold hover:text-white py-2 px-4 border border-blue hover:border-transparent rounded mr-2"
          value={username}
          margin="top"
          onChange={handleChange}
        />
        <button
          type="button"
          id="search-button"
          className="bg-blue-500 hover:bg-blue-700 text-blue font-bold py-2 px-4 rounded"
          onClick={handleClick}
        >
          View repositories
        </button>
      </div>
    </div>
  )
}

InputView.propTypes = {}

const mapStateToProps = () => ({})

const mapDispatchToProps = (dispatch) => bindActionCreators({}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(InputView)
