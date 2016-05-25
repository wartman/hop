import Rabbit from '../../../src/Rabbit'
import StoreServiceProvider from './StoreServiceProvider'
import ViewServiceProvider from './ViewServiceProvider'

const Todo = Rabbit({
  // config?
}).services(
  StoreServiceProvider,
  ViewServiceProvider
).run().catch(e => console.error(e))
