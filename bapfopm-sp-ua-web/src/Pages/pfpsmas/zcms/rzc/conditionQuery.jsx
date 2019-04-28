import React from 'react';
import { hashHistory, Link } from "react-router";

//  自定义滚动条
import FreeScrollBar from 'react-free-scrollbar';

import './conditionQuery.css'

import { Table, Button, Modal, Input, Select, Row, Col } from 'antd';
import { Navbar, Hr } from "../../../../Components/index";

import { openNotificationWithIcon, assignConversion } from "../../../../asset/pfpsmas/zcms/js/common";
import { getQueryZoning } from "../../../../Service/pfpsmas/zcms/server";

const Option = Select.Option;

class ConditionQuery extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            requestList: [],    //  申请单存放数组

            type: "code",
            zoningName: "", //行政区划名称 
            zoningCode: "", //区划代码
            assigningCode: "1",  //级次
            pageSize: 5,
            pageIndex: 1,
            totalRecord: ""
        }
    }

    handleInputChange(type, e) {
        if (type == "code") {
            this.setState({
                zoningCode: e.target.value,
            });
        } else if (type == "name") {
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
        let { zoningCode, zoningName, assigningCode, pageSize, pageIndex, totalRecord } = this.state;

        this.setState({
            type: type
        })

        if (type == "code") {
            getDataObj.zoningCode = zoningCode;
            getDataObj.zoningName = "";
            getDataObj.assigningCode = "";
        } else if (type == "name") {
            getDataObj.zoningCode = "";
            getDataObj.zoningName = zoningName;
            getDataObj.assigningCode = assigningCode;
        }

        getDataObj.pageSize = pageSize;
        getDataObj.pageIndex = pageIndex;
        getDataObj.total = totalRecord;

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
        let temp = [];
        let obj;
        if (res.rtnCode = "000000") {
            let data = res.responseData.list;
            openNotificationWithIcon("success", res.rtnMessage);
            data.forEach(item => {
                obj = {};
                for (var key in item) {
                    obj[key] = item[key];
                    obj.assigning = assignConversion(item.assigningCode);
                }
                temp.push(obj);
            })
            this.setState({
                requestList: temp,
                totalRecord: res.responseData.total
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
                dataIndex: 'assigning',
                key: 'assigning',
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

        const pagination = {
            _this: this,
            total: this.state.totalRecord,
            pageSize: this.state.pageSize,
            onChange(current) {
                let postData = {};
                let { type, zoningCode, zoningName, assigningCode } = this._this.state;
                if (type == "code") {
                    postData.zoningCode = zoningCode;
                    postData.zoningName = "";
                    postData.assigningCode = "";
                } else if (type == "name") {
                    postData.zoningCode = "";
                    postData.zoningName = zoningName;
                    postData.assigningCode = assigningCode;
                }

                postData.pageSize = this._this.state.pageSize;
                postData.pageIndex = current;
                postData.total = this._this.state.totalRecord;
                this._this.axiosQueryZoning(postData);

                console.log('Current: ', current, this._this);
            },
        };

        return (
            <div className="outer-box">
                <div className="conditionQuery inner-box">
                    <FreeScrollBar autohide="true">

                        <div className="container">
                            {/* 按区划代码 */}
                            <div className="container-box margin-top-15">
                                <div className="container-title">
                                    <span>按区划代码查询</span>
                                </div>

                                <div className="container-centent text-algin-left" style={{ paddingLeft: 20 }}>
                                    <label className="label">区划代码
                                    <span className="color-red-margin">*</span>
                                        <Input className="c-input margin-left-20" value={this.state.zoningCode} onChange={this.handleInputChange.bind(this, "code")} />
                                    </label>
                                    <Button type="primary" size="large" className="c-query" onClick={this.handleAxiosQueryZoning.bind(this, "code")}>查询</Button>
                                </div>
                            </div>

                            {/* 按区划名称 */}
                            <div className="container-box margin-top-15">
                                <div className="container-title">
                                    <span>按区划名称查询</span>
                                </div>

                                <div className="container-centent">
                                    <Row>
                                        <Col span={8} style={{paddingLeft: 20}}>
                                            <label className="label">区划名称
                                                <span className="color-red-margin">*</span>
                                                <Input className="c-input margin-left-20" style={{width: "65%"}} value={this.state.zoningName} onChange={this.handleInputChange.bind(this, "name")} />
                                            </label>
                                        </Col>

                                        <Col span={8}>
                                            <label className="label">区划层级
                                                <span className="color-red-margin">*</span>
                                                <Select className="select margin-left-20" size="large" defaultValue="1" onChange={this.handleSelectChange.bind(this)}>
                                                    <Option value="1">省级</Option>
                                                    <Option value="2">市级</Option>
                                                    <Option value="3">县级</Option>
                                                    <Option value="4">乡级</Option>
                                                    <Option value="5">村级</Option>
                                                </Select>

                                            </label>
                                        </Col>
                                        <Col span={2}>
                                            <Button type="primary" size="large" style={{marginTop: 19}} onClick={this.handleAxiosQueryZoning.bind(this, "name")}>查询</Button>

                                        </Col>
                                    </Row>
                                </div>
                            </div>

                            {/* 下划线 */}
                            {/* <Hr></Hr> */}

                            {/* 查询结果 */}
                            <div className="container-box margin-top-15">
                                <div className="container-title">
                                    <span className="t-title">查询结果</span>
                                </div>

                                <div className="container-centent">
                                    <Table columns={columns} dataSource={this.state.requestList} pagination={pagination} />
                                </div>

                            </div>

                        </div>
                    </FreeScrollBar>
                </div>
            </div>
        )
    }
}
export default ConditionQuery;