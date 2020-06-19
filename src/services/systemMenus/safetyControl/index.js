import request from '@/utils/request';

// 查询方法
export async function search(params) {
  return request('/api/safetyControl/page', {
    method: 'POST',
    data: params,
    params: params
  });
}

// 删除方法
export async function remove(params) {
  return request('/api/safetyControl/delete', {
    method: 'DELETE',
    data: params,
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