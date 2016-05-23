import EventEmitter3 from 'eventemitter3'
import Stamp from '../core/Stamp'

/**
 * A simple wrapper to make EventEmitter work with Stamps.
 */
const EventEmitter = Stamp.init((options, {instance}) => {
  return EventEmitter3.call(instance)
}).methods(EventEmitter3.prototype)

export default EventEmitter
