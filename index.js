/**
 * This is a bit unorthodox, but Hop is set up to export everything
 * from this single file. You can thus import dependencies like:
 *
 *    import { Component, Store, div, h1 } from '@wartman/hop'
 *
 * If you want more control, you could do the following instead:
 *
 *    import Component from '@wartman/hop/src/view/Component'
 *    import { div, h1 } from '@wartman/hop/src/view/elements'
 *
 * Note that I'm sill in the process of figuring out the best way to
 * consume this module, so things might change. For example, it may
 * make sense to break apart the dependency injector, Store and Views
 * into their own NPM modules.
 */

export { default as Container } from './src/core/Container'
export { default as Injectable } from './src/core/Injectable'
export { default as Stamp } from './src/core/Stamp'
export { default as ServiceProvider } from './src/core/ServiceProvider'
export { default as Config } from './src/core/Config'

export { default as Shape } from './src/data/Shape'
export { default as Store } from './src/data/Store'
export { default as Update, Action } from './src/data/Update'

export { default as Component } from './src/view/Component'
export { default as Patch } from './src/view/Patch'
export { default as Element } from './src/view/Element'
export * from './src/view/elements'

/**
 * Allow `Application` to be imported as:
 *
 *    import { Application } from '@wartman/hop'
 *
 * OR
 *    
 *    import Hop from '@wartman/hop'
 *
 */
import Application from './src/core/Application'
export { 
  Application as default,
  Application 
}
