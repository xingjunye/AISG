
import { search, update, remove } from '@/services/systemMenus/details'

export default {
  namespace: 'details',
  state: {
    total: 0,
    records: [],
    curRowDetail: null,
    spinning: false
  },
  reducers: {
    setSpinning(state) {
      return {...state, spinning: true}
    },

    // 保存状态的方法
    saveconnect(state, { res }) {
      return {
        ...state,
        ...res,
        spinning: false
      }
    },

    // 设置当前数据
    setCurRowDetail(state, {payload}) {
      const { curRowDetail } =  payload;
      return {...state, curRowDetail};
    }
  },

  effects: {
    // 删除方法
    *delete({ payload, callback }, { call }) {
      const res = yield call(remove, payload);
      if(res.rtnCode === 200){
        callback(1, '删除');
      };
    },

    // 查询方法
    *search({ payload }, { call, put }) {
      yield put({
        type: 'setSpinning'
      });
      const res = yield call(search, payload);
      yield put({
        type: 'saveconnect',
        res: res.data
      });
    },

    // 新增和修改
    *update({ payload, callback }, { call }) {
      const { curRowDetail} = payload;
      let [result, text] = [0, '新增'];
      // 如果数据有flowControlId是修改 否则是新增
      if(curRowDetail.hasOwnProperty('flowControlId')) {
        text = '修改';
        result = 1;
      }

      const res = yield call(update, {
        result,
        ...curRowDetail
      });

      if(res.rtnCode === 200){
        callback(1, text);
      };
    }
  }
}