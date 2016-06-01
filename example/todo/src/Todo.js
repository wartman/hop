import Hop from '@wartman/hop'
import StoreServiceProvider from './services/StoreServiceProvider'
import ViewServiceProvider from './services/ViewServiceProvider'

const Todo = Hop({
  placeholder: 'What needs to be done?'
}).services(
  StoreServiceProvider,
  ViewServiceProvider
).run().catch(e => console.error(e))
