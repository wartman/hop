import Rabbit from '../../../src/Rabbit'
import StoreServiceProvider from './StoreServiceProvider'
import ViewServiceProvider from './ViewServiceProvider'

const Todo = Rabbit({
  placeholder: 'What needs to be done?'
}).services(
  StoreServiceProvider,
  ViewServiceProvider
).run().catch(e => console.error(e))
