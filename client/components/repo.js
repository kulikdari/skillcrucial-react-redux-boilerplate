import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

const Repo = (props) => {
  const { repo, username } = props
  return (
    <div>
      <Link id={repo} to={`/${username}/${repo}`}>
        {repo}
      </Link>
    </div>
  )
}

Repo.propTypes = {}

const mapStateToProps = () => ({})

const mapDispatchToProps = (dispatch) => bindActionCreators({}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Repo)
