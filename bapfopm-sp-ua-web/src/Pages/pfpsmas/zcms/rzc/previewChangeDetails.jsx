import React from 'react';
import { hashHistory, Link } from "react-router";
import "./previewChangeDetails.css";

import blue from "../../../../asset/pfpsmas/zcms/img/blue.png";
import black from "../../../../asset/pfpsmas/zcms/img/black.png";
import gray from "../../../../asset/pfpsmas/zcms/img/gray.png";

//  自定义滚动条
import FreeScrollBar from 'react-free-scrollbar';

import { clearData, placeData, changeTypeConversion, openNotificationWithIcon } from "../../../../asset/pfpsmas/zcms/js/common";
import { getInitPreviewZoningData, getCheckPreviewZoning, getRejectionChangeDetails, getConfirmationChangeDetails, getFindChangeDetails, getDCVerification, getUpload } from "../../../../Service/pfpsmas/zcms/server";

import { Navbar, Hr } from "../../../../Components/index";
import { Table, Button, Input, Row, Col, Tooltip, Upload, message, Icon, } from 'antd';

class PreviewChangeDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            zoningCode: sessionStorage.getItem("zoningCode"), //  区划代码
            assigningCode: Number(sessionStorage.getItem("assigningCode")), //  级次代码
            systemId: sessionStorage.getItem("systemId"),

            //  省,市,县,乡,村,组   各级区划预览数据存放
            codeRankPreview: {
                "province": [],
                "city": [],
                "county": [],
                "township": [],
                "village": []
            },

            displayDetails: [], //  变更明细展示
            changeDetails: [], //   提交后未确认的变更明细

            requestSeq: "", //  申请单序号
            groupmc: "",

            //  各级选中区划,颜色样式状态标志
            activedColor: {
                "province": "",
                "city": "",
                "county": "",
                "township": "",
                "village": ""
            },

            isDisabled: true,    //  确认明细按钮禁用状态

            fileList: [],   //  批复文件上传列表
            uploading: false,
        }
    }

    /**
     * 获取预览表下级区划
     */
    handleAxiosCheckPreviewZoning(e) {
        let postData = {};
        let colorRank = {};

        let { codeRankPreview, activedColor } = this.state;
        let selectedAssigningCode = e.target.dataset.assigningcode;
        let selectedZoningCode = e.target.dataset.zoningcode;

        colorRank[selectedAssigningCode] = selectedZoningCode;

        placeData(colorRank, activedColor);

        postData.zoningCode = e.target.dataset.zoningcode;

        if(postData.zoningCode){
            this.axiosCheckPreviewZoning(postData);
            this.axiosFindChangeDetails(postData);
        }
        clearData(selectedAssigningCode, codeRankPreview);
    }

    changeNote(e) {
        this.setState({
            groupmc: e.target.value
        })
    }

    /**
     * 确认变更明细
     */
    handleAxiosConfirmationChangeDetails() {
        let { requestSeq, groupmc } = this.state;
        let postData = {};
        postData.seqStr = requestSeq;
        postData.groupmc = groupmc;

        if (groupmc == "") {
            openNotificationWithIcon("warning", "请填写批复说明!");
        } else {
            this.axiosConfirmationChangeDetails(postData);
        }
    }

    /**
     * 驳回变更明细
     */
    handleAxiosRejectionChangeDetails() {
        let { requestSeq, groupmc } = this.state;
        let postData = {};
        postData.seqStr = requestSeq;
        postData.groupmc = groupmc;
        console.log(postData);

        this.axiosRejectionChangeDetails(postData)
    }

    /**
     * 上传批复文件
     */
    handleUpload() {
        const { fileList } = this.state;
        const formData = new FormData();
        this.setState({
            uploading: true,
        });
        fileList.forEach((file) => {
            formData.append('file', file);
        });

        this.axiosUpload(formData);
    }

    /**
     * 初始化预览表数据
     */
    async axiosInitPreviewZoningData(params) {
        let { codeRankPreview } = this.state;
        let res = await getInitPreviewZoningData(params);
        if (res.rtnCode == "000000") {
            let dataCode = res.responseData;
            placeData(dataCode, codeRankPreview);
            this.setState({
                codeRankPreview: codeRankPreview
            })
        }
    }

    /**
     * 获取预览表下级区划
     */
    async axiosCheckPreviewZoning(params) {
        let res = await getCheckPreviewZoning(params);
        let { codeRankPreview } = this.state;
        if (res.rtnCode == "000000") {
            let dataCode = res.responseData;
            placeData(dataCode, codeRankPreview);
            this.setState({
                codeRankPreview: codeRankPreview
            })
        }
    }

    /**
     * 通过申请单获取全部未审核明细
     * @param {string} seqStr 申请单序号
     */
    async axiosDCVerification(params) {
        let res = await getDCVerification(params);
        let tempArr = [];
        if (res.rtnCode == "000000") {
            if (res.responseData.length != 0) {
                res.responseData.forEach(item => {
                    item.disChangeType = changeTypeConversion(item.changeType)
                    tempArr.push(item);
                });

                this.setState({
                    isDisabled: false
                })
            }

            this.setState({
                changeDetails: tempArr,
                displayDetails: tempArr
            })
        }
    }

    /**
     * 根据行政区划查询当月变更明细
     * @param {string} zoningCode 区划代码
     */
    async axiosFindChangeDetails(params) {
        let { changeDetails } = this.state;
        let res = await getFindChangeDetails(params);
        let tempArr = [];

        console.log(res);
        if (res.rtnCode == "000000") {

            let data = res.responseData;

            if (data.length == 0) {
                this.setState({
                    displayDetails: changeDetails,
                })
            } else {
                data.forEach(item => {
                    item.disChangeType = changeTypeConversion(item.changeType)
                    tempArr.push(item);
                });


                this.setState({
                    displayDetails: tempArr
                })
            }
        } else {
            openNotificationWithIcon("error", res.rtnMessage);
        }
    }

    /**
     * 确认变更明细
     * @param seqStr 申请单序号
     */
    async axiosConfirmationChangeDetails(params) {
        let res = await getConfirmationChangeDetails(params);
        console.log(res);
        if (res.rtnCode == "000000") {
            openNotificationWithIcon("success", res.rtnMessage);
            hashHistory.push({
                pathname: "/about/pfpsmas/zcms/inputChangeDetails",
                state: {
                    systemId: this.state.systemId
                }
            })
        } else {
            openNotificationWithIcon("error", res.rtnMessage);
        }
    }

    /**
     * 驳回变更明细
     * @param seqStr 申请单序号
     */
    async axiosRejectionChangeDetails(params) {
        let res = await getRejectionChangeDetails(params);
        console.log(res);
        if (res.rtnCode == "000000") {
            openNotificationWithIcon("success", res.rtnMessage);
            hashHistory.push({
                pathname: "/about/pfpsmas/zcms/inputChangeDetails",
                state: {
                    systemId: this.state.systemId
                }
            })
        } else {
            openNotificationWithIcon("error", res.rtnMessage);
        }
    }

    /**
     * 批复文件上传接口
     * @param {string} formId 上传文件id
     */
    async axiosUpload(params) {
        let res = await getUpload(params);
        // console.log('批复上传res--->', res)
        if (res.rtnCode == '000000') {
            openNotificationWithIcon("success", res.rtnMessage);
            this.setState({
                uploading: false,
                fileList: []
            })
        } else {
            openNotificationWithIcon("error", res.rtnMessage);
        }
    }

    componentWillMount() {
        let { zoningCode } = this.state;
        let postData = {};
        let requestSeq = this.props.location.state.requestSeq || sessionStorage.getItem("requestSeq");
        console.log(requestSeq);
        postData.zoningCode = zoningCode.substr(0, 6);
        this.axiosInitPreviewZoningData(postData);

        this.axiosDCVerification({ seqStr: requestSeq })
        this.setState({
            requestSeq: requestSeq
        })
    }

    render() {
        const navbar = [{
            name: "创建变更申请单",
            routerPath: "/about/pfpsmas/zcms/previewChangeDetails",
            imgPath: gray
        }, {
            name: "录入变更明细",
            routerPath: "/about/pfpsmas/zcms/previewChangeDetails",
            imgPath: gray
        }, {
            name: "变更明细预览",
            routerPath: "/about/pfpsmas/zcms/previewChangeDetails",
            imgPath: blue
        }];

        const columns = [{
            title: '原区划代码',
            dataIndex: 'originalZoningCode',
            key: 'originalZoningCode',
            width: 150,
        }, {
            title: '原区划名称',
            dataIndex: 'originalZoningName',
            key: 'originalZoningName',
            width: 150,
        }, {
            title: '调整类型',
            dataIndex: 'disChangeType',
            key: 'disChangeType',
            width: 150,
        }, {
            title: '现区划代码',
            dataIndex: 'targetZoningCode',
            key: 'targetZoningCode',
            width: 150,
        }, {
            title: '现区划名称',
            dataIndex: 'targetZoningName',
            key: 'targetZoningName',
            width: 150,
        },
            // {
            //     title: '备注',
            //     dataIndex: 'notes',
            //     key: 'notes',
            //     width: 150,
            // }
        ];

        const displayDom = (data, color) => Object.keys(data).map(key => {
            return (
                <Col span={4}>
                    <FreeScrollBar autohide="true">
                        {loop(data[key], color[key])}
                    </FreeScrollBar>
                </Col>
            )
        });

        const loop = (data, color) => data.map((item) => {

            return (
                <tr className={`zoningcode-tr ${color == item.zoningCode ? "zoningCode-actived" : null}`}
                    data-zoningCode={item.zoningCode}
                    data-zoningName={item.divisionName}
                    data-assigningCode={item.assigningCode}
                    data-sfbh={item.sfbh}
                    onClick={this.handleAxiosCheckPreviewZoning.bind(this)}
                >
                    <td className={`${(item.sfbh && item.sfbh == "1") ? "font-color-c33" : null}`}
                        data-zoningCode={item.zoningCode}
                        data-zoningName={item.divisionName}
                        data-assigningCode={item.assigningCode}
                        data-sfbh={item.sfbh}>
                        {item.divisionName} {item.ownCode}
                    </td>
                </tr>
            )
        })

        const upLoadProp = {
            onRemove: (file) => {
                this.setState((state) => {
                    const index = state.fileList.indexOf(file);
                    const newFileList = state.fileList.slice();
                    newFileList.splice(index, 1);
                    return {
                        fileList: newFileList,
                    };
                });
            },
            beforeUpload: (file) => {
                this.setState(state => ({
                    fileList: [...state.fileList, file],
                }));
                return false;
            },
        };

        return (
            <div className="outer-box">
                <div className="previewchangedetails inner-box">

                    <FreeScrollBar autohide="true">
                        <Navbar data={navbar}></Navbar>

                        <div className="preview-container">
                            <div className="preview-container-top">
                                <Row type="flex" justify="space-around">
                                    {displayDom(this.state.codeRankPreview, this.state.activedColor)}
                                </Row>
                            </div>

                            <Hr />

                            {/* 变更明细展示 */}
                            <div className="preview-container-center container-box">
                                <div className="container-title">
                                    <span>变更明细展示</span>
                                </div>

                                <div className="container-content"> 
                                    <Table
                                        dataSource={this.state.displayDetails}
                                        columns={columns}
                                        pagination={{ pageSize: 5 }}
                                        rowClassName={(record, index) => record.clztdm == "30" ? "font-color-c33" : ""}/>
                                </div>
                               
                            </div>

                            <div className="preview-container-bottom margin-top-10">
                                <Row>
                                    <Col span={2} offset={3}>
                                        <span className="font-color-fff text-algin-center" style={{ fontSize: 16 }}>批复说明</span>
                                    </Col>

                                    <Col span={8}>
                                        <Input type="textarea" onChange={this.changeNote.bind(this)} value={this.state.groupmc} style={{ fontSize: 14 }}></Input>
                                    </Col>

                                    <Col span={6} offset={1}>
                                        <Row>
                                            <Col span={12}>
                                                <Upload {...upLoadProp}>
                                                    <Button>
                                                        <Icon type="upload" /> 批复文件上传
                                                    </Button>
                                                </Upload>
                                            </Col>
                                            <Col span={12}>
                                                <Button 
                                                    type="primary"
                                                    onClick={this.handleUpload.bind(this)}
                                                    disabled={this.state.fileList.length === 0}
                                                    loading={this.state.uploading}
                                                    style={{width: "80%"}}
                                                >
                                                    {this.state.uploading ? '上传中' : '开始上传'}
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </div>

                            <div className="preview-container-footer margin-top-10">
                                <Button type="primary" size="large" onClick={this.handleAxiosRejectionChangeDetails.bind(this)}>{this.state.displayDetails.length == 0 ? `返回` : `驳回`}</Button>
                                <Button type="primary" size="large" style={{ marginLeft: 20 }} disabled={this.state.isDisabled} onClick={this.handleAxiosConfirmationChangeDetails.bind(this)}>确认</Button>
                            </div>


                        </div>

                    </FreeScrollBar>
                </div>
            </div>
        )
    }
}

export default PreviewChangeDetails;