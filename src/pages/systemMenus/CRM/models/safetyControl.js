import { search, update, remove, searchRules } from '@/services/systemMenus/safetyControl'

export default {
  namespace: 'safetyControl',
  state: {
    total: 0,
    data: [],
    curRowDetail: null,
    spinning: false,
    // tabs: [],
    // active: '0',
    show: true,
    rulesData: {
      "filterId": '',
      "authId": '',
      "filterName": "",
      "businessName": "",
      "businessCode": "",
      "availability": '1',
      "userId": '',
      "createTime": "",
      "updateTime": "",
      "filterRules": []
    },
    rulesDataCopy: {  //临时数据
      "filterId": '',
      "authId": '',
      "filterName": "",
      "businessName": "",
      "businessCode": "",
      "availability": '1',
      "userId": '',
      "createTime": "",
      "updateTime": "",
      "filterRules": []
    }
  },

  // tabs里 json数据格式
  // {
  //   index: '0',
  //   pData: {
  //     key: ,
  //     flowControlId: ,
  //     authId: ,
  //     filterId: ,
  //     filterName: ,
  //     createTime: ,
  //     businessName: ,
  //     businessCode: ,
  //     status: 
  //   },
  //   tableData: [

  //   ]
  // }
  reducers: {
     // 保存状态的方法
    saveconnect(state, { res }) {
      return {
        ...state,
        ...res,
        spinning: false
      }
    },

    setCopyData(state, { payload: { json } }) {
      state.rulesDataCopy = {
        ... state.rulesDataCopy,
        ... json
      };
      return {
        ...state
      }
    },

    isShow(state, { payload: { show }}) {
      state.show = show ;
      return { ...state };
    },

    setActive(state, { payload: { index } }) {
      state.active = index;
      return {
        ...state
      }
    },
    
    // 添加tab页
    addTabs(state, { res }) {
      // const i = state.tabs.findIndex(item => item.data.filterId === res.filterId);
      // let index = `${state.tabs.length + 1}`;
      // if(i > -1) {
      //   index = `${state.tabs[i].index}`;
      //   // state.tabs[i].pData = (i, 1, json);
      // }else {
      //   state.tabs.push({
      //     index,
      //     data: res
      //   });
      // }
      // state.active = index;
      state.rulesData = res;
      state.rulesDataCopy = JSON.parse(JSON.stringify(res)); //Object.assign({}, res);
      state.show = false;
      return {
        ...state
      }
    },

    saveRules(state, ) {
      console.log(state.rulesDataCopy);
      return{ ...state }
    }
  },


  effects: {
     // 查询方法
     *search({ payload }, { call, put }) {
      yield put({
        type: 'setSpinning'
      });
      const res = yield call(search, payload);
      yield put({
        type: 'saveconnect',
        res: {
          total: res.data.total,
          data: res.data.records
        }
      });
    },

    *searchRules({ payload: { filterId }}, { call, put }) {
      const res = yield call(searchRules, filterId);
      yield put({
        type: 'addTabs',
        res: res.data
      });
    }
  }
}