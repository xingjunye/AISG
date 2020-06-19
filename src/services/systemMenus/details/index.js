import request from '@/utils/request';

// 查询方法
export async function search(params) {
  let str = JSON.stringify({province:{label:'浙江省',key:'330000'},city:{label:'杭州市',key:'330100'}});

  const res = request('/api/flow/page', {
    method: 'POST',
    params: {
      page: params.current,
      size: params.pageSize
    },
    data: {
      ...params
    }

  });
  return res;
}

// 删除方法
export async function remove(params) {
  return request('/api/flow', {
    method: 'DELETE',
    params: {
      id: params.id
    }
  });
}

// 新增和修改方法
export async function update(params) {
  return request('/api/flow', {
    method: 'POST',
    data: params,
  });
}