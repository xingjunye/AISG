import request from '@/utils/request';

// 查询方法
export async function search(params) {
  return request('/api/safetyControl/page', {
    method: 'POST',
    data: params,
    params
  });
}

// 删除方法
export async function remove(params) {
  return request('/api/safetyControl', {
    method: 'DELETE',
    data: params,
    params,
  });
}

// 新增和修改方法
export async function update(params) {
  return request('/api/safetyControl', {
    method: 'POST',
    data: params,
  });
}

// 查询方法
export async function searchRules(params) {
  return request(`/api/safetyControl/desc/${params}`);
}

// 删除规则
export async function delRule(params) {
  return request('/api/safetyControl/delRule', {
    method: 'DELETE',
    params
  });
}