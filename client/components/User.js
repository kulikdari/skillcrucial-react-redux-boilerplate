import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Head from './head'
import Repo from './repo'

const User = (props) => {
  const { name, list } = props
  return (
    <div>
      <Head title={name} />
      <div className="mb-2" />
      {list.map((repo) => {
        return (
          <div key={repo}>
            <button
              type="button"
              className="bg-blue-600 hover:bg-blue-700 flex items-center justify-center text-white font-bold py-2 px-2"
            >
              <Repo repo={repo} username={name} />
            </button>
          </div>
        )
      })}
    </div>
  )
}

User.propTypes = {}

const mapStateToProps = () => ({})

const mapDispatchToProps = (dispatch) => bindActionCreators({}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(User)
