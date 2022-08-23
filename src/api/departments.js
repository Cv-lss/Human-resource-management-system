import request from '@/utils/request'
/**
 * 获取组织架构数据
 **/
export function getDepartments() {
  return request({
    url: '/company/department'
  })
}

/**
 *  获取员工的简单列表
 * **/
export function getEmployeeSimple() {
  return request({
    url: '/sys/user/simple'
  })
}

/**
 *  新增部门接口
 *
 * ****/
export function addDepartments(data) {
  return request({
    url: '/company/department',
    method: 'post',
    data
  })
}
