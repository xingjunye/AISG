let arr = [];
// console.log(`我是随机数${}`)
for(let i = 0; i < Math.floor((Math.random() + 90) * 10); i++) {
  arr.push({
    key: i,
    flowControlId: i,
    authId: i,
    filterId: `${i}3${i}4${i}5${i}6${i}7${i}8${i}9`,
    filterName: `我是拦截器${i}`,
    createTime: `2019-01-01 01:02:03`,
    businessName: `我是模块${i}`,
    businessCode: `${i}3${i}4${i} - 5${i}6${i} - 7${i}8${i} - 9${i}7${i}`,
    status: `${i%2}`
  });
}

export default {
  'POST /api/safetyControl/search': (req, res) => {
    res.send({
      status: 'ok',
      total: arr.length,
      data: arr,     
    });
  },

  'POST /api/safetyControl/delete': (req, res) => {
    const { id } = req.body;
    arr = arr.filter( item=>item.flowControlId !== id);
    res.send({
      status: 'ok'
    });
  },

  'POST /api/safetyControl/update': (req, res) => {
    const {result, curRowDetail} = req.body;
    // result 0 新增 1 修改
    if(result) {
      arr = arr.map(item => {
        if(item.flowControlId === curRowDetail.flowControlId) {
          return {
            ...item,
            ...curRowDetail
          }
        }
        return item;
      });
    }else {
      arr.push({
        flowControlId: arr.length + 1,
        authId: arr.length + 1,
        ...curRowDetail
      });
    }
    res.send({
      status: 'ok',
      data: arr
    });
  },

  'POST /api/safetyControl/searchRules': (req, res) => {
    const rules = [];

    for(let i = 0; i < Math.floor((Math.random()) * 10); i++) {
      rules.push({
        key: i,
        ruleName: `我是规则${i}`,
        status: `${i % 2}`,
        treasuryCheck: i % 2 === 0 ? '是' : '否',
        filterUnit: i % 2 === 0 ? 'url' : 'request',
        hitParamName: `单元${i}`,
        hitParamValue: i % 2 === 0 ? 'url' : '127.0.0.1:8080',
        hitParamType: i % 2 === 0 ? '字符串' : '数字',
        triggerConditionCode: i % 2 === 0 ? 'EQ' : 'NEQ',
      });
    }
    res.send({
      status: 'ok',
      data: rules
    });
  }
}