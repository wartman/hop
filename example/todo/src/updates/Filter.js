import { Update, Action, Shape } from '@wartman/hop'

const ALL = 0
const ACTIVE = 1
const COMPLETED = 2

const Filter = Update.type('filter').shape({
  label: Shape.string.isRequired,
  value: Shape.number.isRequired
}).actions({

  active: Action((state) => {
    return {
      label: 'Active',
      value: ACTIVE
    }
  }),

  completed: Action((state) => {
    return {
      label: 'Completed',
      value: COMPLETED
    }
  }),

  all: Action((state) => {
    return {
      label: 'All',
      value: ALL
    }
  })

})

export default Filter
export { ALL, ACTIVE, COMPLETED }
