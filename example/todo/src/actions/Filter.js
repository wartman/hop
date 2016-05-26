import Action, {Binding} from '../../../../src/data/Action'

const Filter = Action.type('filter').actions({

  active: Binding((state) => {
    return {
      label: 'Active',
      value: false
    }
  }),

  completed: Binding((state) => {
    return {
      label: 'Completed',
      value: true
    }
  }),

  all: Binding((state) => {
    return {
      label: 'All',
      value: null
    }
  })

})

export default Filter
