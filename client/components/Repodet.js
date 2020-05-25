import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Markdown from 'markdown-to-jsx'
import Head from './head'

const Repodet = (props) => {
  const { name, readMe } = props
  return (
    <div>
      <Head title={name} />
      <div id="description">
        <Markdown>{readMe}</Markdown>
      </div>
    </div>
  )
}

Repodet.propTypes = {}

const mapStateToProps = () => ({})

const mapDispatchToProps = (dispatch) => bindActionCreators({}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Repodet)
