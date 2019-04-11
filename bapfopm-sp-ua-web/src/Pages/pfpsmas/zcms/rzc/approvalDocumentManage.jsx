import React from 'react';
import { hashHistory, Link } from "react-router";
import qs from 'qs'


import { Table, Button, Modal, DatePicker } from 'antd';
import { getList } from "../../../../Service/pfpsmas/zcms/server";
import { openNotificationWithIcon } from "../../../../asset/pfpsmas/zcms/js/common";

import './approvalDocumentManage.css'

class ApprovalDocumentManage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            requestList: [],
            zoningName: '',   //  行政区划名称
            zoningCode: '', //  级次代码

            startValue: null,//时间选择器起始时间
            endValue: null,//时间选择器结束时间
            endOpen: false,//

            pageSize: 1,//每页条数
            pageIndex: 1,//当前页码
            totalRecord: "",
        }
    }

    componentWillMount() {
        let postData = {};
        let { pageSize, pageIndex, start, end } = this.state;
        postData.pageSize = 5;
        postData.pageIndex = 1;
        postData.start = start;
        postData.end = end;

        this.axiosListInit(postData);
    }
    async axiosListInit(params) {
        let res = await getList(params);
        this.setState({
            requestList: res.responseData.dataList
        })
    }

    //以下都是时间选择器方法
    disabledStartDate(startValue) {
        if (!startValue || !this.state.endValue) {
            return false;
        }
        return startValue.getTime() >= this.state.endValue.getTime();
    }
    disabledEndDate(endValue) {
        if (!endValue || !this.state.startValue) {
            return false;
        }
        return endValue.getTime() <= this.state.startValue.getTime();
    }
    onChange(field, value) {
        console.log(field, 'change', value);
        this.setState({
            [field]: value,
        });
    }
    onStartChange(value) {
        this.onChange('startValue', value);
    }
    onEndChange(value) {
        this.onChange('endValue', value);
    }
    handleStartToggle({ open }) {
        if (!open) {
            this.setState({ endOpen: true });
        }
    }
    handleEndToggle({ open }) {
        this.setState({ endOpen: open });
    }

    handleReSet(){
        this.setState({
            startValue: "",
            endValue: "",
        })
    }

    /**
     * 列表展示已经上传的文档
     */
    handleAxiosList() {
        let postData = {};
        let { pageSize, pageIndex, startValue, endValue } = this.state;
        postData.pageSize = pageSize;
        postData.pageIndex = pageIndex;
        postData.start = startValue;
        postData.end = endValue;

        this.axiosList(postData);
    }

    /**
     * 批复文件列表展示已经上传的文档接口
     * @param {number} pageSize 每页条数
     * @param {number} pageIndex 当前页码
     * @param {string} start 创建时间起点
     * @param {string} end 创建时间终点
     */
    async axiosList(params) {
        let res = await getList(params);
        if (res.rtnCode == '000000') {
            // openNotificationWithIcon("success", res.rtnMessage);
            this.setState({
                totalRecord: res.responseData.totalRecord,
                requestList: res.responseData.dataList
            })
        } else {
            openNotificationWithIcon("error", res.rtnMessage);
        }
    }


    render() {
        const columns = [
            {
                title: '区划代码',
                dataIndex: 'zoningCode',
                key: 'zoningCode',
            }, {
                title: '区划名称',
                dataIndex: 'zoningName',
                key: 'zoningName',
            }, {
                title: '文件名',
                dataIndex: 'fileName',
                key: 'fileName',
            }, {
                title: '文件类型',
                dataIndex: 'suffix',
                key: 'suffix',
            }, {
                title: '年份',
                dataIndex: 'year',
                key: 'year',
            }, {
                title: '上传时间',
                dataIndex: 'createDate',
                key: 'createDate',
            }
        ];

        const pagination = {
            _this: this,
            total: this.state.totalRecord,
            pageSize: this.state.pageSize,
            onChange(current) {
                let postData = {};
                postData.pageSize = this._this.state.pageSize;
                postData.pageIndex = current;
                this._this.axiosList(postData)
                console.log('Current: ', current, this._this);
            },
        };

        return (
            <div className="ApprovalDocumentManage">
                {/* 时间选择器 */}
                <div className="button-group" style={{ marginTop: '15px' }}>
                    <span className='time-title'>导出时间起(YYYYMMDD): </span>
                    <DatePicker
                        disabledDate={this.disabledStartDate.bind(this)}
                        value={this.state.startValue}
                        placeholder="开始日期"
                        onChange={this.onStartChange.bind(this)}
                        toggleOpen={this.handleStartToggle.bind(this)}
                        size='large'
                    />
                    <span className='time-title'>导出时间止(YYYYMMDD): </span>
                    <DatePicker
                        disabledDate={this.disabledEndDate.bind(this)}
                        value={this.state.endValue}
                        placeholder="结束日期"
                        onChange={this.onEndChange.bind(this)}
                        open={this.state.endOpen}
                        toggleOpen={this.handleEndToggle.bind(this)}
                        size='large'
                    />
                </div>

                {/* 功能按钮组 */}
                <div className="button-group">
                    <Button type="primary" size="large" onClick={this.handleAxiosList.bind(this)}>查询</Button>
                    <Button type="primary" size="large" className="margin-left-20" onClick={this.handleReSet.bind(this)}>重置</Button>
                </div>

                {/* 申请单展示列表 */}
                <div style={{ marginTop: 15 }}>
                    <div className="table-title">
                        <span>查询信息结果展示</span>
                    </div>
                    <Table columns={columns} dataSource={this.state.requestList} pagination={pagination}/>
                </div>

            </div>
        )
    }
}

export default ApprovalDocumentManage;