import React from 'react';
import { hashHistory, Link } from "react-router";

import './conditionQuery.css'

import { Table, Button, Modal, Input, Select, Row, Col } from 'antd';
import { Navbar, Hr } from "../../../../Components/index";

import {openNotificationWithIcon} from "../../../../asset/pfpsmas/zcms/js/common";
import { getQueryZoning } from "../../../../Service/pfpsmas/zcms/server";

const Option = Select.Option;

class ConditionQuery extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            requestList: [],    //  申请单存放数组

            zoningName: "", //行政区划名称 
            zoningCode: "", //区划代码
            assigningCode: "1",  //级次
            pageSize: 5,
            pageIndex: 1,
            total: ""
        }
    }

    handleInputChange(type, e) {
        if(type == "code"){
            this.setState({ zoningCode: e.target.value });
        }else if(type == "name"){
            this.setState({ zoningName: e.target.value });
        } 
    }

    /**
     * 级次代码变更
     */
    handleSelectChange(e) {
        console.log(e);
        this.setState({
            assigningCode: e
        })
    }

    /**
     * 区划条件查询
     */
    handleAxiosQueryZoning(type) {
        let getDataObj = {};
        let { zoningCode, zoningName, assigningCode, pageSize, pageIndex, total } = this.state;

        if(type == "code"){
            getDataObj.zoningCode = zoningCode;
            getDataObj.zoningName = "";
            getDataObj.assigningCode = "";
        }else if(type == "name"){
            getDataObj.zoningCode = "";
            getDataObj.zoningName = zoningName;
            getDataObj.assigningCode = assigningCode;
        }

        getDataObj.pageSize = pageSize;
        getDataObj.pageIndex = pageIndex;
        getDataObj.total = total;

        this.axiosQueryZoning(getDataObj);
    }

    /**
     * 按区划条件查询
     * @param {string} zoningCode 
     * @param {string} zoningName 
     * @param {string} assigningCode 
     * @param {string} pageSize 
     * @param {string} pageIndex 
     * @param {string} total 
     */
    async axiosQueryZoning(params) {
        let res = await getQueryZoning(params);
        let data = res.responseData.dataList;

        if (res.rtnCode = "000000") {
            openNotificationWithIcon("success", res.rtnMessage);
            this.setState({
                requestList: data
            })
        }else{
            openNotificationWithIcon("error", res.rtnMessage);
        }
    }

    render() {
        const columns = [
            {
                title: '区划代码',
                dataIndex: 'zoningCode',
                key: 'zoningCode',
                width: "1"
            }, {
                title: '区划名称',
                dataIndex: 'divisionName',
                key: 'divisionName',
                width: "1"
            }, {
                title: '区划全称',
                dataIndex: 'divisionFullName',
                key: 'divisionFullName',
                width: "1"
            }, {
                title: '级次',
                dataIndex: 'assigningCode',
                key: 'assigningCode',
                width: "1"
            }, {
                title: '上级区划代码',
                dataIndex: 'superiorZoningCode',
                key: 'superiorZoningCode',
                width: "1"
            }, {
                title: '上级区划名称',
                dataIndex: 'superiorDivisionFullName',
                key: 'superiorDivisionFullName',
                width: "1"
            }
        ];

        return (
            <div className="conditionQuery">

                {/* 按区划代码 */}
                <div className="cursor">
                    <span className='dm'>按区划代码</span>
                    <label className="label">区划代码
                        <span className="color-red-margin">*</span>
                        <Input className="c-input" value={this.state.zoningCode} onChange={this.handleInputChange.bind(this, "code")} />
                    </label>
                    <Button type="primary" size="large" className="c-query" onClick={this.handleAxiosQueryZoning.bind(this,"code")}>查询</Button>
                </div>

                {/* 按区划名称 */}
                <div className="cursor">
                    <span className='dm'>按区划名称</span>
                    <label className="label" >区划名称
                        <span className="color-red-margin">*</span>
                        <Input className="c-input" value={this.state.zoningName} onChange={this.handleInputChange.bind(this, "name")} />

                    </label>
                    <label className="label mc">区划层级
                        <span className="color-red-margin">*</span>
                        <Select className="select" size="large" defaultValue="1" onChange={this.handleSelectChange.bind(this)}>
                            <Option value="1">省级</Option>
                            <Option value="2">市级</Option>
                            <Option value="3">县级</Option>
                            <Option value="4">乡级</Option>
                            <Option value="5">村级</Option>
                        </Select>

                    </label>
                    <Button type="primary" size="large" className="c-query" onClick={this.handleAxiosQueryZoning.bind(this,"name")}>查询</Button>
                </div>

                {/* 下划线 */}
                <Hr></Hr>

                {/* 查询结果 */}
                <div style={{ marginTop: 20 }}>
                    <span className="t-title">查询结果</span>
                    <Table columns={columns} dataSource={this.state.requestList} pagination={{pageSize: this.state.pageSize}}/>
                </div>

            </div>
        )
    }
}
export default ConditionQuery;