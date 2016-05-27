import Rabbit from '../../../src/Rabbit'
import StoreServiceProvider from './services/StoreServiceProvider'
import ViewServiceProvider from './services/ViewServiceProvider'
import ApiServiceProvider from './services/ApiServiceProvider'

const Todo = Rabbit({
  placeholder: 'What needs to be done?'
}).services(
  StoreServiceProvider,
  ApiServiceProvider,
  ViewServiceProvider
).run().catch(e => console.error(e))
