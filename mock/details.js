let arr = [];
// console.log(`我是随机数${}`)
for(let i = 0; i < Math.floor((Math.random() + 90) * 1000); i++) {
  arr.push({
    key: i,
    flowControlId: i,
    authId: i,
    businessName: `代销商选号池${i}`,
    businessCode: `${i}3${i}4${i} - 5${i}6${i} - 7${i}8${i} - 9${i}7${i}`,
    threshold: `${i}22`,
    timeUnit: `2018-03-20 1:00:00`,
    disableTime: `2020-03-20 23:59:00`
  });
}

export default {
  'POST /api/details/search': (req, res) => {
    res.send({
      status: 'ok',
      total: arr.length,
      data: arr,     
    });
  },

  'POST /api/details/delete': (req, res) => {
    const { id } = req.body;
    arr = arr.filter( item=>item.flowControlId !== id);
    res.send({
      status: 'ok'
    });
  },

  'POST /api/details/update': (req, res) => {
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
}