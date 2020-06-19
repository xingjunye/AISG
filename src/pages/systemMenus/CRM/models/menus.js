export default {
  namespace: 'systemMenus',
  state: {
    arr: []
  },
  reducers: {
    addTags(state, { payload: { json } }) {
      if(!state.arr.some( a => a.name === json.name)) {
        state.arr.push(json)
      };
      return {...state};
    },

    closeTags(state, { payload: { json } }) {
      state.arr = state.arr.filter( item => item.name !== json.name);
      return {...state};
    },
  }
}