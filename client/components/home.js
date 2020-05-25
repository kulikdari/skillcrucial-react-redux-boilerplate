import React, { useState, useEffect } from 'react'
import { Switch, Route, useParams } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import axios from 'axios'
import Header from './Header'
import InputView from './inputview'
import User from './User'
import Repodet from './Repodet'
import DumnyComponent from './dummy-view'

const Home = () => {
  const { username, repositoryname } = useParams()
  const [repos, setRepos] = useState([])

  useEffect(() => {
    if (typeof username !== 'undefined')
      axios.get(`https://api.github.com/users/${username}/repos`).then((it) => {
        setRepos(it.data.map((repo) => repo.name))
      })
    return () => {}
  }, [username])

  const [readMe, setReadMe] = useState('')

  useEffect(() => {
    if (typeof username !== 'undefined' && typeof repositoryname !== 'undefined') {
      const headers = { Accept: 'application/vnd.github.VERSION.html' }
      axios
        .get(`https://api.github.com/repos/${username}/${repositoryname}/readme`, {
          param: {},
          headers
        })
        .then((it) => setReadMe(it.data))
    }
    return () => {}
  }, [username, repositoryname])

  return (
    <div>
      <Header />
      <Switch>
        <Route exact path="/" component={() => <InputView />} />
        <Route exact path="/:username" component={() => <User list={repos} name={username} />} />
        <Route
          exact
          path="/:username/:repositoryname"
          component={() => <Repodet readMe={readMe} name={repositoryname} />}
        />
        <Route exact path="/" component={() => <DumnyComponent />} />
      </Switch>
    </div>
  )
}

Home.propTypes = {}

const mapStateToProps = () => ({})

const mapDispatchToProps = (dispatch) => bindActionCreators({}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Home)
