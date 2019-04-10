import axios from "axios";

//  rzc
//  区划代码接收与更新
//  在线上报
//  建立变更申请表
//  createChangeComparisonTable

/**
 * 用户申请单信息查询接口
 * @param {string} zoningCode 区划代码  
 * @param {number} pageSize 每个页面数据条数  
 * @param {number} pageIndex 当前页面  
 * @param {number} total 总条数  
 */
export let getZoningChangeRequestList = async (params) => {
    let response = await axios({
        url: 'zcmsapi1/zoningChangeManager/ZoningChangeRequestList',
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
        url: 'zcmsapi1/zoningChangeManager/addZoningChangeRequest',
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
        url: 'zcmsapi1/zoningChangeManager/findWritableZCCRequests',
        method: 'get'
    })
    return response.data
}

/**
 * 对照表中明细确认校验
 * @param {string} seqStr 申请单序号
 */
export let getDetailedConfirmationVerification = async (params) => {
    let response = await axios({
        url: 'zcmsapi1/zoningChangeManager/detailedConfirmationVerification',
        method: 'get',
        params: params
    })
    return response.data
}

//  rzc
//  区划代码接收与更新
//  在线上报
//  录入变更明细
//  inputChangeDetails


/**
 * 初始化区划变更明细对照数据录入界面接口
 * @param {string} zoningCode 登录人区划代码
 */
export let getInitAddDetails = async (params) => {
    let response = await axios({
        url: 'zcmsapi1/zoningChangeManager/initAddDetails',
        method: 'get',
        params: params
    })
    return response.data
}

/**
 * 获取子级区划接口
 * @param {string} zoningCode 区划代码
 */
export let getSubordinateZoning = async (params) => {
    let response = await axios({
        url: 'zcmsapi1/zoningChangeManager/getSubordinateZoning',
        method: 'get',
        params: params
    })
    return response.data
}

/**
 * 单个民政区划对比
 * @param {*} zoningCode 
 * @param {*} zoningName 
 */
export let getZoningCompareAffairByOne = async (params) => {
    let response = await axios({
        url: 'zcmsapi1/civilAffair/zoningCompareAffairByOne',
        method: 'get',
        params: params
    })
    return response.data
}

/**
 * 变更明细草稿箱
 * @param {string} requestSeq 申请单序号
 */
export let getDraftsOfDetails = async (params) => {
    let response = await axios({
        url: 'zcmsapi1/zoningChangeManager/getDraftsOfDetails',
        method: 'get',
        params: {
            requestSeq: params
        }
    })
    return response.data
}

/**
 * 删除草稿箱明细
 */
export let getRemoveDraftsOfDetails = async (params) => {
    let response = await axios({
        url: 'zcmsapi1/zoningChangeManager/removeDraftsOfDetails',
        method: 'get',
        params: {
            ids: params
        }
    })
    return response.data
}

/**
 * 保存明细前校验
 * @param {obj} params  变更明细对象
 */
export let getLogicCheckBeforeSave = async (params) => {
    let response = await axios({
        url: 'zcmsapi1/zoningChangeManager/logicCheckBeforeSave',
        method: 'get',
        params: {
            detail: params
        }
    })
    return response.data
}

/**
 * 保存明细前校验
 * @param {obj} params  变更明细对象
 */
export let getLogicCheckBeforeChange = async (params) => {
    let response = await axios({
        url: 'zcmsapi1/queryZoningData/logicCheckBeforeChange',
        method: 'get',
        params: {
            zoningCode: params
        }
    })
    return response.data
}

/**
 * 获取迁移并入区划数据
 * @param {string} rootCode    根区划     登录人区划
 * @param {string} excludeCode  排除区划   用户选择需要变更的原区划
 * @param {string} zoningCode  区划    用户选择迁移并入的现区划
 */
export let getZoningMergeSelectTree = async (params) => {
    let response = await axios({
        url: 'zcmsapi1/zoningChangeManager/zoningMergeSelectTree',
        method: 'get',
        params: params
    })
    return response.data
}

/**
 * 提交区划变更对照明细接口
 * @param 存放文件序号,变更组名称 group
 * @param 存放变更明细数据 details
 * @param 区划代码 zoningCode
 * @param 申请单序号 requestSeq 
 */
export let getSaveDetails = async (params) => {
    let response = await axios({
        url: 'zcmsapi1/zoningChangeManager/saveDetails',
        method: 'post',
        transformRequest: [
            function (data) {
                let ret = '';
                for (let it in data) {
                    ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&';
                }
                console.log(ret);
                return ret;
            }
        ],
        data: params
    })
    return response.data
}

//  rzc
//  变更明细预览
//  在线上报
//  previewChangeDetails

/**
 * 获取预览表数据
 * @param {string} zoningCode 六位区划代码
 */
export let getInitPreviewZoningData = async (params) => {
    let response = await axios({
        url: 'zcmsapi1/queryZoningData/initPreviewZoningData',
        method: 'get',
        params: params
    })
    return response.data
}

/**
 * 获取预览表下级区划
 * @param {string} zoningCode 区划代码
 */
export let getCheckPreviewZoning = async (params) => {
    let response = await axios({
        url: 'zcmsapi1/queryZoningData/checkPreviewZoning',
        method: 'get',
        params: params
    })
    return response.data
}

/**
 * 通过申请单获取全部未审核明细
 * @param {string} seqStr 申请单序号
 */
export let getDCVerification = async (params) => {
    let response = await axios({
        url: 'zcmsapi1/zoningChangeManager/dCVerification',
        method: 'get',
        params: params
    })
    return response.data
}

/**
 * 根据行政区划查询当月变更明细
 * @param {string} zoningCode 区划代码
 */
export let getFindChangeDetails = async (params) => {
    let response = await axios({
        url: 'zcmsapi1/zoningChangeManager/findChangeDetails',
        method: 'get',
        params: params
    })
    return response.data
}

/**
 * 驳回变更明细
 * @param {string} seqStr 申请单序号
 */
export let getRejectionChangeDetails = async (params) => {
    let response = await axios({
        url: 'zcmsapi1/zoningChangeManager/rejectionChangeDetails',
        method: 'get',
        params: params
    })
    return response.data
}

/**
 * 确认变更明细
 * @param {string} seqStr 申请单序号
 */
export let getConfirmationChangeDetails = async (params) => {
    let response = await axios({
        url: 'zcmsapi1/zoningChangeManager/confirmationChangeDetails',
        method: 'get',
        params: params
    })
    return response.data
}

//  rzc
//  区划下载
//  download

/**
 * 查看区划发布信息 || 按照时间查询
 * @param {string} exportDate 导入时间起
 * @param {string} deadline 导入时间止
 * @param {number} pageNum 当前页码
 * @param {number} pageSize 每页显示条数
 */
export let getQueryReleaseFormalCode = async (params) => {
    let response = await axios({
        url: 'zcmsapi1/release/query/formalCode',
        method: 'get',
        params: params
    })
    return response.data
}

/**
 * 下载全国区划代码zip
 * @param {string} zipPath 文件路径
 */
export let getDownloadFormalRelease = (params) => {
    window.location.href = 'zcmsapi1/release/download/formalCodeZip?zipPath=' + params;
}

//  rzc
//  区划定时发布设置
//  timedTask

/**
 * 设置定时任务
 * @param {String} day  天
 * @param {String} hour 时
 * @param {String} minute   分
 * @param {String} second   秒
 */
export let getSettingTheCronExpression = async (params) => {
    let response = await axios({
        url: 'zcmsapi1/MyScheduledTask/settingTheCronExpression',
        method: 'get',
        params: params
    })
    return response.data
}

//  rzc
//  区划代码接收与更新
//  区划预览
//  previewFormalZoningCode

/**
 * 初始化已发布的正式区划代码
 * @param {string} zoningCode 区划代码
 */
export let getInitFormalZoningData = async (params) => {
    let response = await axios({
        url: 'zcmsapi1/queryZoningData/initFormalZoningData',
        method: 'get',
        params: params
    })
    return response.data
}

/**
 * 获取下级正式区划
 * @param {string} zoningCode 区划代码
 */
export let getCheckFormalZoning = async (params) => {
    let response = await axios({
        url: 'zcmsapi1/queryZoningData/checkFormalZoning',
        method: 'get',
        params: params
    })
    return response.data
}

//  rzc
//  区划代码接收与更新
//  省级版本控制
//  provincialVersionControl

/**
 * 查询已发布版本
 */
export let getFindVersionExist = async () => {
    let response = await axios({
        url: 'zcmsapi1/zoningChangeManager/findVersionExist',
        method: 'get',
    })
    return response.data
}

/**
 * 查询版本记录
 */
export let getFindVersionRecord = async () => {
    let response = await axios({
        url: 'zcmsapi1/zoningChangeManager/findVersionRecord',
        method: 'get',
    })
    return response.data
}

/**
 * 提交版本记录
 * @param {string} dmxzqh 行政区划代码
 * @param {string} bbfbrq 版本发布日期
 */
export let getRecordVersion = async (params) => {
    let response = await axios({
        url: 'zcmsapi1/zoningChangeManager/recordVersion',
        method: 'get',
        params: params
    })
    return response.data
}

//  rzc
//  区划代码条件查询
//  conditionQuery

/**
 * 按区划条件查询
 * @param {string} zoningCode     区划代码
 * @param {string} zoningName     区划名称
 * @param {string} assigningCode  级次代码
 * @param {string} pageSize   每条页码数量
 * @param {string} pageIndex  当前页码
 * @param {string} total  总数
 */
export let getQueryZoning = async (params) => {
    let response = await axios({
        url: 'zcmsapi1/queryZoningData/queryZoning',
        method: 'get',
        params: params
    })
    return response.data
}

//  rzc
//  历史轨迹查询
//  historicalTrackQuery

/**
 * 历史轨迹数据获取接口
 * @param {string} zoningCode 区划代码
 * @param {string} timeInterval 时间间隔(所选时间到最近一次发布)   6位数
 */
export let getHistoricalTrack = async (params) => {
    let response = await axios({
        url: 'zcmsapi1/queryZoningData/query/historyDate',
        method: 'get',
        params: params
    })
    return response.data
}

//  rzc
//  区划代码接收与更新
//  在线上报
//  维护变更明细
//  maintainChangeComparisonTable

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
        url: 'zcmsapi1/zoningChangeManager/searchDetails',
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
        url: 'zcmsapi1/zoningChangeManager/updateZCCRequest',
        method: 'get',
        params: params
    })
    return response.data
}

/**
 * 导出变更明细对照数据接口  excel表格式
 * @param 申请单序号 requestSeq
 */
export let getExportExcel = (requestSeq) => {
    window.location.href = 'zcmsapi1/zoningChangeManager/exportExcel?seq=' + requestSeq
}

/**
 * 删除明细数据接口
 * @param {string} groupSeqs 变更组序号
 * @param {string} requestSeq 申请单序号
 */
export let getDeleteDetails = async (params) => {
    let response = await axios({
        url: 'zcmsapi1/zoningChangeManager/deleteDetails',
        method: 'get',
        params: params
    })
    return response.data
}

//  rzc
//  区划代码接收与更新
//  在线上报
//  变更明细审核
//  reviewChangeDetails

/**
 * 审核变更明细
 * @param {number} seqStr
 * @param {string} isPassed 
 * @param {string} msg 
 */
export let getAuditDetail = async (params) => {
    let response = await axios({
        url: 'zcmsapi1/zoningChangeManager/auditDetail',
        method: 'get',
        params: params
    })
    return response.data
}

//  rzc 
//  区划代码接收与更新
//  申请单复用
//  applicationFormReuse

/**
 * 查询申请单中可复用的变更明细
 * @param {number} requestSeq 申请单序号
 */
export let getTraceabilityOfChangeDetails = async (params) => {
    let response = await axios({
        url: 'zcmsapi1/zoningChangeManager/TraceabilityOfChangeDetails',
        method: 'get',
        params: params
    })
    return response.data
}

/**
 * 申请单复用
 * @param {number} seqStr 申请单序号
 */
export let getChangeDetailedReproduction = async (params) => {
    let response = await axios({
        url: 'zcmsapi1/zoningChangeManager/ChangeDetailedReproduction',
        method: 'get',
        params: params
    })
    return response.data
}

//  rzc 
//  批复文件上传
//  uploadApprovalFile

/**
 * 批复文件上传接口
 * @param {string} formId 上传文件id
 */
export let getUpload = async (params) => {
    let instance = axios.create();
    let response = await instance({
        url: 'zcmsapi1/zoning/document/upload',
        method: 'post',
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        data: params
    })
    return response.data
}

/**
 * 批复文件列表展示已经上传的文档接口
 * @param {number} pageSize 每页条数
 * @param {number} pageIndex 当前页码
 * @param {string} start 创建时间起点
 * @param {string} end 创建时间终点
 */
export let getList = async (params) => {
    let response = await axios({
        url: 'zcmsapi1/zoning/document/list',
        method: 'get',
        params: params
    })
    return response.data
}

/**
 * 批复文件删除接口
 * @param {number} id 文档id
 */
export let getDelete = async (params) => {
    let response = await axios({
        url: 'zcmsapi1/zoning/document/delete',
        method: 'get',
        params: params
    })
    return response.data
}

//  rzc 
//  民政数据收集
//  importCivilzoningCode

/**
 * 导入民政区划 上传文件查询接口
 * @param {number} pageSize 每页显示条数
 * @param {number} pageIndex 当前页码
 */
export let getSelectCivilAffairZip = async (params) => {
    let response = await axios({
        url: 'zcmsapi1/civilAffair/selectCivilAffairZip',
        method: 'get',
        params: params
    })
    return response.data
}

/**
 * 导入民政区划 文件上传接口
 * @param {string} formId 表单ID
 */
export let getZipFlie = async (params) => {
    let instance = axios.create();
    let response = await instance({
        url: 'zcmsapi1/civilAffair/upload/zipFlie',
        method: 'post',
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        data: params
    })
    return response.data
}

/**
 * 删除民政区划文件
 * @param {number} zipXh 文件序号
 */
export let getDeleteCAZCodeByzipXh = async (params) => {
    let response = await axios({
        url: 'zcmsapi1/civilAffair/deleteCAZCodeByzipXh',
        method: 'get',
        params: params
    })
    return response.data
}

/**
 * 文件导入接口
 * @param {number} zipXh  文件序号
 * @param {string} filePath  文件路径
 */
export let getImportDate = async (params) => {
    let response = await axios({
        url: 'zcmsapi1/civilAffair/importDate',
        method: 'post',
        params: params
    })
    return response.data
}

//  rzc 
//  民政数据预览
//  previewCivilzoningCode

/**
 * 民政区划数据查询接口
 * @param {string} superiorZoningCode 民政区划代码
 */
export let getSelectCAZ = async (params) => {
    let response = await axios({
        url: 'zcmsapi1/civilAffair/selectCAZ',
        method: 'get',
        params: params
    })
    return response.data
}

/**
 * 民政区划与行政区划总体对比
 */
export let getZoningCompareAffair = async () => {
    let response = await axios({
        url: 'zcmsapi1/civilAffair/zoningCompareAffair',
        method: 'get',
    })
    return response.data
}

/**
 * 导出民政区划
 * @param {string} superiorZoningCode 区划代码
 * @param {string} type 导出类型
 */
export let getDownLoadCAZ = (params) => {
    var url = 'zcmsapi1/civilAffair/downLoadCAZ';
    window.location.href = url + '?superiorZoningCode=' + params.superiorZoningCode + '&type=' + params.type;
}

//  rzc 
//  民政数据收集
//  historicalTrace

/**
 * 历史轨迹数据获取接口
 * @param {string} zoningCode 区划代码
 * @param {string} timeInterval 时间间隔(所选时间到最近一次发布)   6位数
 */
export let getHistoryDate = async (params) => {
    let response = await axios({
        url: 'zcmsapi1/queryZoningData/query/historyDate',
        method: 'get',
        params: params
    })
    return response.data
}