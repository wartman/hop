import { Application, Component, section, footer, p, a } from '@wartman/hop'
import Header from './Header'
import Main from './Main'

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
        this.app.make(Main)
      ]),
      footer('.info', [
        p('Double-click to edit a todo'),
        p(['Written by ',  a({attrs: {href: 'https://github.com/wartman'}}, 'wartman')]),
        p(['Part of ', a({attrs: {href: 'http://todomvc.com'}}, 'TodoMVC')])
      ])
    ]
  }

})

export default App
