import Update, {Action} from '../../../../src/data/Update'
import { StringType, NumberType } from '../../../../src/data/Shape'

const ALL = 0
const ACTIVE = 1
const COMPLETED = 2

const Filter = Update.type('filter').shape({
  label: StringType().require(),
  value: NumberType().require()
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
