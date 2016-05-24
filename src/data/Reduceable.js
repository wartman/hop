import Stamp from '../core/Stamp'
import {required} from '../core/Props'

const TYPE_NAME = Symbol('type-name')

/**
 * A simple way to handle basic reducers.
 *
 *    const Foo = Reduceable.type('foo')
 *  
 */
const Reduceable = Stamp.methods({

  // not sure if this is the best way to handle things :P
  reduce: required('reduce')

}).compose({

  propertyDescriptors: {
    
    /**
     * Marks this as a reduceable.
     *
     * @var {boolean}
     */
    $isReduceable: {
      value: true,
      writeable: false,
      enumerable: false
    }

  }

})

export default Reduceable
