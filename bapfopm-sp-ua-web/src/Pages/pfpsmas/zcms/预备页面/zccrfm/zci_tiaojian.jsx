import React from 'react';
import { hashHistory, Link } from "react-router";
import qs from 'qs'

import './test.css'

import { Table, Button, Modal, Input, Select, Row, Col } from 'antd';
import { queryZoning } from "../../../Service/pfpsmas/zcms/server";

const Option = Select.Option;

class Test extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            requestList: [],    //  申请单存放数组

            zoningName: "",//行政区划名称 
            zoningCode: "",//区划代码
            assigningCode: "",//级次
            pageSize: "",
            pageIndex: "",
            total: ""


        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleInputChangeMC = this.handleInputChangeMC.bind(this);
        this.getQueryZoningCode = this.getQueryZoningCode.bind(this);
        this.getQueryZoningName = this.getQueryZoningName.bind(this);
        this.assigningCodeToggle = this.assigningCodeToggle.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);
    }
    handleInputChange(e) {
        e.preventDefault();
        this.setState({ zoningCode: e.target.value });
    }
    handleInputChangeMC(e) {
        e.preventDefault();
        this.setState({ zoningName: e.target.value });
    }


    /**
     * 参数处理
     */
    getQueryZoningCode() {
        let getDataObj = {};
        let { zoningCode, zoningName, assigningCode, pageSize, pageIndex, total } = this.state;
        getDataObj.zoningCode = zoningCode;
        getDataObj.zoningName = zoningName;
        getDataObj.assigningCode = assigningCode;
        getDataObj.pageSize = pageSize;
        getDataObj.pageIndex = pageIndex;
        getDataObj.total = total;

        this.axiosRequestList(getDataObj);
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
    async axiosRequestList(params) {
        let res = await queryZoning(params);
        console.log('rtnCode-->', res.rtnCode)
        if (res.rtnCode = "999999") {
            alert('请输入需要查询的区划代码!');
        }
        if (res.rtnCode = "000000") {
            this.setState({
                requestList: res.responseData.dataList
            })
        }
    }

    //按区划名称查询
    getQueryZoningName() {
        let getDataObj = {};
        let { zoningCode, zoningName, assigningCode, pageSize, pageIndex, total } = this.state;
        getDataObj.zoningCode = zoningCode;
        getDataObj.zoningName = zoningName;
        getDataObj.assigningCode = assigningCode;
        getDataObj.pageSize = pageSize;
        getDataObj.pageIndex = pageIndex;
        getDataObj.total = total;

        this.axiosRequestListMC(getDataObj);
    }

    async axiosRequestListMC(params) {
        let res = await queryZoning(params);
        if (res.rtnCode = "999999") {
            alert('请输入需要查询的区划名称');
        }
        if (res.rtnCode = "000000") {
            this.setState({
                requestList: res.responseData.dataList
            })
        }
    }

    // 级次代码变更
    assigningCodeToggle(e) {
        this.setState({
            assigningCode: e.target.value
        })
    }


    handleSelectChange(e, value) {
        e.preventDefault();
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
            <div className="a">
                {/* 按区划代码 */}
                <div className="cursor">
                    <span className='dm'>按区划代码</span>
                    <label className="label">区划代码
                        <span className="xing">*</span>
                        <Input className="c-input" value={this.state.zoningCode} onChange={this.handleInputChange} />
                    </label>
                    <Button type="primary" size="large" className="c-query" onClick={this.getQueryZoningCode}>查询</Button>
                </div>

                {/* 按区划名称 */}
                <div className="cursor">
                    <span className='dm'>按区划名称</span>
                    <label className="label" >区划名称
                        <span className="xing">*</span>
                        <Input className="c-input" value={this.state.zoningName} onChange={this.handleInputChangeMC} />

                    </label>
                    <label className="label mc">区划层级
                        <span className="xing">*</span>
                        <Select className="select" size="large" defaultValue="1" onChange={this.handleSelectChange} optionFilterProp="children" >
                            <Option value="1" onChange={this.assigningCodeToggle}>省级</Option>
                            <Option value="2" onChange={this.assigningCodeToggle}>市级</Option>
                            <Option value="3" onChange={this.assigningCodeToggle}>县级</Option>
                            <Option value="4" onChange={this.assigningCodeToggle}>乡级</Option>
                            <Option value="5" onChange={this.assigningCodeToggle}>村级</Option>
                        </Select>

                    </label>
                    <Button type="primary" size="large" className="c-query" onClick={this.getQueryZoningName}>查询</Button>
                </div>

                {/* 查询结果 */}
                <div style={{ marginTop: 20 }}>
                    <span className="t-title">查询结果</span>
                    <Table columns={columns} dataSource={this.state.requestList} />
                </div>

            </div>
        )
    }
}
export default Test;