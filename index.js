import Rabbit from './src/Rabbit'

import Stamp from './src/core/Stamp'
import Container from './src/core/Container'
import Injectable from './src/core/Injectable'

import Shape from './src/data/Shape'
import Update from './src/data/Update'
import Store from './src/data/Store'

import Config from './src/support/Config'
import ServiceProvider from './src/support/ServiceProvider'

import Component from './src/view/Component'
import Element from './src/view/Element'
import Patch from './src/view/Patch'
import * as elements from './src/view/elements'

/**
 * Access to Rabbit modules.
 *
 * Use like: 
 *
 *    import { View, Data } from 'rabbit'
 *
 */

const Data = {
  Shape,
  Update,
  Store
}

const View = Object.assign({
  Component,
  Patch,
  Element
}, elements)

export default Rabbit
export {
  Stamp,
  Injectable,
  Container,
  Config,
  ServiceProvider,
  Data,
  Support,
  View
}