import { search, update, remove, searchRules, delRule } from '@/services/systemMenus/safetyControl'

const searchJson = {
  availability: "",
  businessCode: "",
  businessName: "",
  createTime: "",
  filterName: "",
  page: 1,
  size: 10
}

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

    //新增规则
    add (state) {
      const json = {
        filterId: state.rulesDataCopy.filterId,
        filterUnit: "",
        hitParamName: "",
        hitParamType: "STRING",
        hitParamValue: "",
        ruleId: '',
        ruleName: "",
        status: 1,
        treasuryCheck: 0,
        triggerConditionCode: "EQ",
      };
      state.rulesDataCopy.filterRules.push(json);
      state.rulesData.filterRules.push(json);
      return {...state}
    },

    //重置
    reset(state) {
      state.rulesDataCopy = JSON.parse(JSON.stringify(state.rulesData));
      console.log('1111')
      return {...state}
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

    saveRules(state) {
      state.rulesData = JSON.parse(JSON.stringify(state.rulesDataCopy));
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

    //查询规则
    *searchRules({ payload: { filterId }}, { call, put }) {
      const res = yield call(searchRules, filterId);
      yield put({
        type: 'addTabs',
        res: res.data
      });
    },

    *addFilter({ payload: { data }, callback}, { call, put }) {
      const res = yield call(update, data);
      if(res.rtnCode == 200){
        yield put({
          type: 'search',
          payload: {
            ...searchJson
          }
        });

        if(callback) callback(res.rtnCode);
      };
    },

    //修改
    *update({ callback }, { select, call, put }) {
      const data = yield select(state => state.safetyControl.rulesDataCopy);
      console.log(data);
      const res = yield call(update, data);
      if(res.rtnCode == 200) {
        yield put({
          type: 'saveRules',
          res
        });
        // message.success('修改成功！');
        if(callback) callback()
      }
    },

    //删除拦截器
    *delete({ payload, callback }, { select, call, put }) {
      const res = yield call(remove, payload);
      if(res.rtnCode == 200) {
        yield put({
          type: 'search',
          payload: {
            ...searchJson
          }
        });
        // message.success('修改成功！');
        if(callback) callback()
      }
    },

    //delRule 删除规则
    *delRule({ payload, callback }, {call, put} ) {
      const res = yield call(delRule, {id: payload.ruleId});
      if(res.rtnCode == 200){
        yield put({
          type: 'searchRules',
          payload: {
            filterId: payload.filterId
          }
        });
        if(callback) callback(res.rtnCode);
      };
    }
  }
}