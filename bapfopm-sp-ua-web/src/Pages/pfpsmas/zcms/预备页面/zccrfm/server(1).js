import axios from "axios";

//  rzc
//  区划代码接收与更新
//  在线上报
//  建立变更申请表

/**
 * 用户申请单信息查询接口
 * @param 区划代码 zoningCode 
 * @param 每个页面数据条数 pageSize 
 * @param  当前页面 pageIndex 
 * @param 总条数 total 
 */
export let getZoningChangeRequestList = async (params) => {
    let response = await axios({
        url: 'zcmsapi/zoningChangeManager/ZoningChangeRequestList',
        method: 'get',
        params: params
    })
    return response.data
}

/**
 * 建立申请单接口
 * @param {string} name 申请单名字
 * @param {string} levelCode 上报区划的级别代码
 * @param {string} notes 备注
 * @param {string} zoningName 区划名称
 */
export let getAddZoningChangeRequest = async (params) => {
    let response = await axios({
        url: 'zcmsapi/zoningChangeManager/addZoningChangeRequest',
        method: 'post',
        data: params
    })
    return response.data
}

/**
 * 查询存在可录入的变更申请单接口
 */
export let getFindWritableZCCRequests = async () => {
    let response = await axios({
        url: 'zcmsapi/zoningChangeManager/findWritableZCCRequests',
        method: 'get'
    })
    return response.data
}

//  rzc
//  区划代码接收与更新
//  在线上报
//  维护变更申请表

/**
 * 查看变更对照明细数据接口
 * @param {number} requestSeq 区划变更申请单序号
 * @param {string} changeType 变更类型
 * @param {string} assigningCode 操作区划的级次代码
 * @param {number} pageIndex 当前页码
 * @param {number} pageSize 每页条数
 */
export let getSearchDetails = async (params) => {
    let response = await axios({
        url: 'zcmsapi/zoningChangeManager/searchDetails',
        method: 'get',
        params: params
    })
    return response.data
}

/**
 * 修改申请单接口
 * @param {number} requestSeq 申请单序号
 * @param {string} name 申请单名称
 * @param {string} notes 备注
 */
export let getUpdateZCCRequest = async (params) => {
    let response = await axios({
        url: 'zcmsapi/zoningChangeManager/updateZCCRequest',
        method: 'get',
        params: params
    })
    return response.data
}

/**
 * 导出变更明细对照数据接口  excel表格式
 * @param 申请单序号 requestSeq
 */
let getExportExcel = (requestSeq) => {
    window.location.href = 'zcmsapi/zoningChangeManager/exportExcel?seq=' + requestSeq
}

/**
 * 删除明细数据接口
 * @param {string} groupSeqs 变更组序号
 * @param {string} requestSeq 申请单序号
 */
export let getDeleteDetails = async (params) => {
    let response = await axios({
        url: 'zcmsapi/zoningChangeManager/deleteDetails',
        method: 'get',
        params: params
    })
    return response.data
}

/**
   * 按区划条件查询
   * @param {*} zoningCode 
   * @param {*} zoningName 
   * @param {*} assigningCode 
   * @param {*} pageSize 
   * @param {*} pageIndex 
   * @param {*} total 
   */
export let queryZoning = async (params) => {
    let response = await axios({
        url: 'zcmsapi/queryZoningData/queryZoning',
        method: 'get',
        params: params
    })
    return response.data
}

/**
   * 历史轨迹数据获取接口
   * @param {string} zoningCode 区划代码
   * @param {string} timeInterval 时间间隔(所选时间到最近一次发布)   6位数
   */
export let historicalTrack = async (params) => {
    let response = await axios({
        url: 'zcmsapi/queryZoningData/query/historyDate',
        method: 'get',
        params: params
    })
    return response.data
}