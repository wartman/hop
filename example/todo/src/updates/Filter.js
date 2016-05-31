import { Update, Action, Shapes } from '../../../../data'

const ALL = 0
const ACTIVE = 1
const COMPLETED = 2

const Filter = Update.type('filter').shape({
  label: Shapes.StringType().require(),
  value: Shapes.NumberType().require()
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
