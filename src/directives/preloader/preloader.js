import Loading from './Preloader.vue';
const vueLoading = Vue => {
  const Mask = Vue.extend(Loading);
  const toggleLoading = (el, binding, vnode) => {
    const store = vnode.context.$store
    if (!binding.modifiers.full && !binding.value.full) {
      if (el.style.position === '') el.style.position = 'relative';
      el.mask.$el.style.position = 'absolute';
      el.appendChild(el.mask.$el);
    } else {
      el.mask.$el.style.position = 'fixed';
      // el.appendChild(el.mask.$el);
      document.body.appendChild(el.mask.$el);
    }
    if (Object.prototype.toString.call(binding.value) !== '[object Object]') {
      el.mask.isShow = binding.value;
    } else {
      el.mask.isShow = binding.value.show;
    }
    const unwatch = store.watch(state => {
      let background = '';
      let skin = state.appConfig.layout.skin
      background = skin == 'dark' ? 'rgb(24 21 21 / 66%)' : 'rgba(255, 255, 255, 0.82)';
      el.mask.background = background;
    })
    el.mask.isFull = binding.modifiers.full || binding.value.full;
    el.__loading_unwatch__ = unwatch
  };

  return {
    bind(el, binding, vnode) {
      el.mask = new Mask({
        el: document.createElement('div')
      });
      toggleLoading(el, binding, vnode);
    },
    update(el, binding) {
      if (Object.prototype.toString.call(binding.value) !== '[object Object]') {
        el.mask.isShow = binding.value;
      } else {
        el.mask.isShow = binding.value.show;
      }
    },
    unbind(el, binding) {
      if (!binding.modifiers.full && !binding.value.full) {
        el.removeChild(el.mask.$el);
      } else {
        document.body.removeChild(el.mask.$el);
      }
      el.__loading__unwatch && el.__loading__unwatch()
    }
  };
};

export default vueLoading;