import Update, {Action} from '../../../../src/data/Update'

const Filter = Update.type('filter').actions({

  active: Action((state) => {
    return {
      label: 'Active',
      value: false
    }
  }),

  completed: Action((state) => {
    return {
      label: 'Completed',
      value: true
    }
  }),

  all: Action((state) => {
    return {
      label: 'All',
      value: null
    }
  })

})

export default Filter
