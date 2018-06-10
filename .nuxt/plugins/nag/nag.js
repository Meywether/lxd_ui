import nag from '~/plugins/nag/nag.vue'

const Plugin = {
  install(Vue, options) {
    /**
     * Makes sure that plugin can be installed only once
     */
    if (this.installed) {
      return
    }
    this.installed = true

    /**
     * Registration of <nag/> component
     */
    Vue.component('nag', nag)
  }
};

export default Plugin
