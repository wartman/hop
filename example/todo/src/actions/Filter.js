import Action, {Binding} from '../../../../src/data/Action'

const Filter = Action.type('filter').actions({

  active: Binding((state) => true),

  completed: Binding((state) => false),

  all: Binding((state) => null)

})

export default Filter
