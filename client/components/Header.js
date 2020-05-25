import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

const Header = () => {
  const { username, repositoryname } = useParams()

  return (
    <div>
      <nav className="flex items-center justify-between flex-wrap bg-blue-400 text-white ">
        <div className="flex items-center items-center flex-shrink-20 mr-10 ">
          <div id="repositories-name" className="text-blue sm:text-center">
            {repositoryname || username || 'Welcome'}
          </div>
        </div>

        {username && (
          <Link id="go back" to="/">
            <button
              type="button"
              className="bg-grey-400 hover:bg-blue-700 text-white font-bold py-2 px-2"
            >
              <div className="  px-0 sm:px-0 lg:px-0"> Main</div>
            </button>
          </Link>
        )}

        {repositoryname && (
          <Link id="go-repository-list" to={`/${username}`}>
            <button
              type="button"
              className="bg-grey-400 hover:bg-blue-700 text-blue font-bold py-2 px-2"
            >
              <div className=" px-0 sm:px-2 lg:px-2">Back to Repository List</div>
            </button>
          </Link>
        )}
      </nav>
    </div>
  )
}
Header.propTypes = {}

const mapStateToProps = () => ({})

const mapDispatchToProps = (dispatch) => bindActionCreators({}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Header)
