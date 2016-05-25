import Container from './core/Container'
import Config from './support/Config'

const Rabbit = Container.init(function (options = {}) {
  this.instance(Container, this)
  this.instance(Rabbit, this)
  this.addAlias(Rabbit, 'app')
  this.share(Config, c => {
    return Config(options)
  })
  this.$services = []
}).methods({

  /**
   * Add service providers. Do not pass instances here, but uninitialized Stamps. Order
   * matters as well -- service providers registered first will be run first, so keep that in
   * mind when setting up dependencies.
   *
   * @param {ServiceProvider} ...serviceProviders
   * @return {this}
   */
  services(...serviceProviders) {
    this.$services = this.$services.concat(serviceProviders)
    return this
  },

  /**
   * Run the application.
   *
   * @return {Promise}
   */
  run() {
    let services
    try {
      services = this.$services.map(serviceProvider => {
        let service = this.make(serviceProvider)
        service.register()
        return service
      })
    } catch(e) {
      return new Promise((resolve, reject) => reject(e))
    }

    return new Promise((resolve, reject) => {
      const next = (err) => {
        if (err) {
          return reject(err)
        }
        if (services.length <= 0) {
          return resolve()
        }
        let service = services.pop()
        try {
          if (service) {
            service.boot(next)
          } else {
            resolve()
          }
        } catch (e) {
          reject(e)
        }
      }
      next()
    })
  }

})

export default Rabbit
