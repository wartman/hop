import { Application } from '../../../../core'
import { Component, section, footer, p, a } from '../../../../view'
import Header from './Header'
import Main from './Main'
import Spinner from './Spinner'

const App = Component.inject({
  app: Application
}).node({
  tag: 'main',
  id: 'root'
}).methods({

  render() {
    return [
      section('.todoapp', [
        this.app.make(Header),
        this.app.make(Main),
        this.app.make(Spinner)
      ]),
      footer('.info', [
        p('Double-click to edit a todo'),
        p(['Written by ',  a({attrs: {href: 'http://shipwreckplanet.com'}}, 'wartman')]),
        p(['Part of ', a({attrs: {href: 'http://todomvc.com'}}, 'TodoMVC')])
      ])
    ]
  }

})

export default App
