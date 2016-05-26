import Component from '../../../../src/view/Component'
import Store from '../../../../src/data/Store'
import {button, p} from '../../../../src/view/elements'
import Filter from '../actions/Filter'

const Footer = Component.tag('footer').id('footer').inject({
  store: Store,
  filter: Filter
}).init(function () {
  this.state = this.store.getState()
  this.store.subscribe(() => this.setState(this.store.getState()))
}).methods({

  render() {
    const {filter} = this.state
    return [
      p([filter.label]),
      button('.toggle', {on: {click: this.showActive.bind(this)}}, 'Active'),
      button('.toggle', {on: {click: this.showCompleted.bind(this)}}, 'Completed'),
      button('.toggle', {on: {click: this.showAll.bind(this)}}, 'All')
    ]
  },

  showActive() {
    this.store.dispatch(this.filter.active())
  },

  showCompleted() {
    this.store.dispatch(this.filter.completed())
  },

  showAll() {
    this.store.dispatch(this.filter.all())
  }

})

export default Footer
