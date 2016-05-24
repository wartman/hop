function getUndefinedStateErrorMessage(key, action) {
  const actionType = action && action.type
  const actionName = actionType && `"${actionType.toString()}"` || '(anonymous)'
  return (
    `Given action ${actionName}, reducer "${key}" returned undefined. ` +
    `To ignore an action, you must explicitly return the previous state.`
  )
}

/**
 * Turns an object whose values are functions OR Reduceables into a single
 * function for use with the Store. It will call every child reducer and gather
 * their results into a single state object where each key corresponds to the
 * provided reducer.
 *
 * @param {Object} reducers
 * @return {Function}
 */
export default function combineReducers(reducers) {
  const keys = Object.keys(reducers)
  const finals = {}
  keys.forEach(key => {
    const reducer = reducers[key]
    if (reducer.$isReduceable === true) {
      finals[key] = (state, action) => reducer.handle(state, action)
    } else if ('function' === typeof reducer) {
      finals[key] = reducer
    }
  })
  const finalKeys = Object.keys(finals)

  return function reducer(state={}, action) {

    let hasChanged = false
    const nextState = {}

    finalKeys.forEach(key => {
      const reducer = finals[key]
      const previousStateForKey = state[key]
      const nextStateForKey = reducer(previousStateForKey, action)
      if ('undefined' === nextStateForKey) {
        throw new Error(getUndefinedStateErrorMessage(key, action))
      }
      nextState[key] = nextStateForKey
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey
    })
    return hasChanged ? nextState : state
  }
}
