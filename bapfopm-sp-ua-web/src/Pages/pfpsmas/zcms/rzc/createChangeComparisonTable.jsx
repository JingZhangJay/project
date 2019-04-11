import React from 'react';
import { hashHistory, Link } from "react-router";
import qs from 'qs'

import blue from "../../../../asset/pfpsmas/zcms/img/blue.png";
import black from "../../../../asset/pfpsmas/zcms/img/black.png"
import gray from "../../../../asset/pfpsmas/zcms/img/gray.png"

import './createChangeComparisonTable.css'

import { Table, Button, Modal, Input } from 'antd';
import { Navbar, Hr } from "../../../../Components/index";

import {openNotificationWithIcon, ownTimeFormat} from "../../../../asset/pfpsmas/zcms/js/common";
import { getZoningChangeRequestList, getAddZoningChangeRequest, getFindWritableZCCRequests, getDetailedConfirmationVerification } from "../../../../Service/pfpsmas/zcms/server";

class CreateChangeComparisonTable extends React.Component {
    constructor(props) {    
        super(props);
        this.state = {
            requestList: [],    //  申请单存放数组
            addRequestToggle: false, //  添加申请单确认框显隐开关
            isDisabled: false,   //  添加按钮是否禁用

            systemId: sessionStorage.getItem("systemId"),   //  系统id
            zoningName: sessionStorage.getItem("zoningName"),   //  行政区划名称
            levelCode: sessionStorage.getItem("levelCode"), //  级次代码

            name: "",   //  申请单名称
            notes: "",  //  申请单备注

            requestSeq: "", //  变更申请单序号
            nextRouter: "", //  下一步路由
        }
    }

    /**
     * 显示添加申请单模态框
     */
    showPrompt() {
        let myDate = new Date();
        let year = myDate.getFullYear();
        let month = myDate.getMonth() + 1;
        let { zoningName } = this.state;
        let name;
        name = `${zoningName}${year}年${month}月的区划代码变更表`;
        this.setState({
            addRequestToggle: true,
            name: name
        })
    }

    /**
     * 隐藏添加申请单模态框
     */
    handleCancel() {
        this.setState({
            addRequestToggle: false
        })
    }

    /**
     * 提交添加申请单
     */
    handleSubmit() {
        let postDataObj = {};
        let { name, notes, zoningName, levelCode } = this.state;
        postDataObj.name = name;
        postDataObj.notes = notes;
        postDataObj.zoningName = zoningName;
        postDataObj.levelCode = levelCode;
        console.log(postDataObj);

        postDataObj = qs.stringify({
            name: name,
            notes: notes,
            zoningName: zoningName,
            levelCode: levelCode,
        })

        this.axiosAddZoningChangeRequest(postDataObj);
    }

    handleNextRouter(record){        
        let postData = {};
        postData.seqStr = record.seq;
        this.setState({
            requestSeq: record.seq
        })
        sessionStorage.setItem("requestSeq", record.seq)
        this.axiosDetailedConfirmationVerification(postData);
    }

    changeName(e) {
        this.setState({
            name: e.target.value
        })
    }

    changeNote(e) {
        this.setState({
            notes: e.target.value
        })
    }

    /**
     *  查询申请单
     */
    async axiosZoningChangeRequestList() {
        let res = await getZoningChangeRequestList();
        console.log("数据", res);
        let data = res.responseData.dataList;
        data.forEach(item => {
            for(var key in item){
                if(key == "createDate"){
                    item[key] = ownTimeFormat(item[key]);
                }
            }
        })
        console.log(data)

        if (res.rtnCode == "000000") {
            this.setState({
                requestList: data
            })
        }
    }

    /**
     * 查询是否存在可录入的申请单
     */
    async axiosFindWritableZCCRequests() {
        let res = await getFindWritableZCCRequests();
        if (res.rtnCode == "000000" && res.responseData != 0) {
            this.setState({
                isDisabled: true
            })
        } else {
            this.setState({
                isDisabled: false
            })
        }
        console.log(this.state.isDisabled)
        return res;
    }

    /**
     * 添加申请单
     * @param name — 申请单名字
     * @param levelCode — 上报区划的级别代码
     * @param notes — 备注
     * @param zoningName — 区划名称
     */
    async axiosAddZoningChangeRequest(params) {
        let res = await getAddZoningChangeRequest(params);
        if (res.rtnCode == "000000") {
            this.axiosZoningChangeRequestList();
            this.setState({
                isDisabled: true
            })
        } else {
            openNotificationWithIcon("error", res.rtnMessage);
        }
        this.setState({
            addRequestToggle: false
        })
    }

    /**
     * 变更对照表中是否存在未确认的变更明细
     * 存在 预览页面; 不存在  录入页面
     * @param {String} seqStr 
     */
    async axiosDetailedConfirmationVerification(params){
        let res = await getDetailedConfirmationVerification(params);
        if(res.rtnCode == "000000"){
            this.setState({
                nextRouter: "/about/pfpsmas/zcms/previewChangeDetails"
            },()=>{
                this.handleHashHistory();
            })
        }else{
            this.setState({
                nextRouter: "/about/pfpsmas/zcms/inputChangeDetails"
            },()=>{
                this.handleHashHistory();
            })
        }      
    }

    /**
     * 跳转
     */
    handleHashHistory(){
        let {nextRouter, systemId, requestSeq} = this.state;
        let data = {
            systemId: systemId,
            requestSeq: requestSeq
        }

        console.log(nextRouter);

        hashHistory.push({
            pathname: nextRouter,
            state: data
        }); 
    }

    componentWillMount() {
        this.axiosZoningChangeRequestList();
        this.axiosFindWritableZCCRequests();
    }

    render() {
        const columns = [{
            title: '区划代码',
            dataIndex: 'levelCode',
            key: 'levelCode',
        }, {
            title: '区划名称',
            dataIndex: 'zoningName',
            key: 'zoningName',
        }, {
            title: '变更对照表名称',
            dataIndex: 'name',
            key: 'name',
        }, {
            title: '备注',
            dataIndex: 'notes',
            key: 'notes',
        }, {
            title: '录入时间',
            dataIndex: 'createDate',
            key: 'createDate',
        }, {
            title: '操作',
            render: (text, record) => (
                <Button type="primary" size="large" onClick={this.handleNextRouter.bind(this, record)}>录入明细</Button>
            ),
        }];

        const navbar = [{
            name: "建立变更对照表",
            routerPath: "/about/pfpsmas/zcms/createChangeComparisonTable",
            imgPath: blue
        },
        {
            name: "录入变更明细",
            routerPath: "/about/pfpsmas/zcms/createChangeComparisonTable",
            imgPath: black
        },
        {
            name: "变更明细预览",
            routerPath: "/about/pfpsmas/zcms/createChangeComparisonTable",
            imgPath: black
        }];

        return (
            <div className="createChangeComparisonTable">
                <Navbar data={navbar}></Navbar>

                <div className="container"> 

                    <div className="container-top margin-top-10">
                        <Table columns={columns} dataSource={this.state.requestList} />
                    </div>

                    <div className="container-bottom margin-top-10">
                        <Button type="primary" size="large" disabled={this.state.isDisabled} onClick={this.showPrompt.bind(this)}>添加</Button>
                    </div>
                </div>
                
                <Modal title="添加申请单" 
                    visible={this.state.addRequestToggle}
                    okText="提交" 
                    maskClosable={false}
                    onOk={this.handleSubmit.bind(this)}
                    onCancel={this.handleCancel.bind(this)}
                >
                    <div>
                        <div>
                            <span>变更对照表名称</span>
                            <Input onChange={this.changeName.bind(this)} value={this.state.name}></Input>
                        </div>
                        <div>
                            <span>备注</span>
                            <Input type="textarea" onChange={this.changeNote.bind(this)} value={this.state.notes}></Input>
                        </div>
                    </div>
                </Modal>
            </div>
        )
    }
}
export default CreateChangeComparisonTable;