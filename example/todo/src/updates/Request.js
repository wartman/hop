import { Update, Action, Shapes } from '../../../../data'

/**
 * Here's a contrived example of how we might dispatch requests.
 *
 * This Update doesn't know anything about how the request will be handled:
 * it only passes along the request data.
 */
const Request = Update.type('request').shape({
  status: Shapes.StringType().require(),
  type: Shapes.StringType(),
  action: Shapes.StringType(),
  id: Shapes.NumberType()
}).actions({

  fetch: Action('id', (state, id) => {
    return {
      status: 'pending',
      type: 'todo',
      action: 'read',
      id
    }
  }),

  fetchAll: Action((state) => {
    return {
      status: 'pending',
      type: 'todo',
      action: 'browse'
    }
  }),

  received: Action((state) => {
    return {
      status: 'completed'
    }
  })

})

export default Request
