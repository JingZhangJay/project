import React from 'react';
import { hashHistory, Link } from "react-router";

import blue from "../../../../asset/pfpsmas/zcms/img/blue.png";
import black from "../../../../asset/pfpsmas/zcms/img/black.png";
import gray from "../../../../asset/pfpsmas/zcms/img/gray.png";

import star from "../../../../asset/pfpsmas/zcms/img/xingxing.png"

import './inputChangeDetails.css'

//  自定义滚动条
import FreeScrollBar from 'react-free-scrollbar';

import { Table, Button, Modal, Input, Checkbox, Select, Row, Col, Tooltip, Tree, Icon } from 'antd';
import { Navbar, Hr } from "../../../../Components/index"

import { openNotificationWithIcon, clearData, placeData, sliceSpecifiedCode, combinSpecifiedCode, changeTypeConversion, getAssigningCode, getSubZoning, getSuperiorZoningCode } from "../../../../asset/pfpsmas/zcms/js/common";
import { getInitAddDetails, getSubordinateZoning, getZoningCompareAffairByOne, getLogicCheckBeforeSave, getDraftsOfDetails, getRemoveDraftsOfDetails, getLogicCheckBeforeChange, getZoningMergeSelectTree, getSaveDetails } from "../../../../Service/pfpsmas/zcms/server";

const Option = Select.Option;
const TreeNode = Tree.TreeNode;

class InputChangeDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            zoningCode: sessionStorage.getItem("zoningCode"), //  区划代码
            assigningCode: Number(sessionStorage.getItem("assigningCode")), //  级次代码

            //  省,市,县,乡,村,组   各级区划预览数据存放
            codeRankPreview: {
                "province": [],
                "city": [],
                "county": [],
                "township": [],
                "village": []
            },

            //  各级选中区划颜色状态判定
            activedColor: {
                "province": "",
                "city": "",
                "county": "",
                "township": "",
                "village": ""
            },

            //  获取下级区划代码
            selectedZoningCode: "", //  用户有效的点击，选中区划代码
            selectedZoningName: "", // 用户选中的区划区划名称
            selectedAssigningCode: "",   //  用户选择地区的级次代码,用户只能查看下级区划代码

            //  民政区划对比
            civilCode: '无',
            civilName: '无',
            resultType: '',
            codeEqual: '',
            nameEqual: '',

            //  变更明细数据
            originalZoningCodeArray: ["", "", "", "", "", ""], //  原区划代码分组展示的存放位置
            originalZoningCode: "", //  原区划代码
            originalZoningName: "", //  原区划名称
            targetZoningCodeArray: ["", "", "", "", "", ""], //  现区划代码分组展示的存放位置
            targetZoningCode: "", //   现区划代码
            targetZoningName: "", //  现区划名称

            changeType: "--请选择--",  //  变更类型
            notes: "", //   备注
            requestSeq: "", //  区划变更申请单序号
            requestName: "", //  变更组名称&&调整说明

            displayDetails: [], // 变更明细数据存放
            group: {},

            sourceId: null, //操作的区划id
            targetId: null, //目标区划的id
            level: 0, //  变更明细的级别代码
            ringFlag: 0,
            ringFlagToggle: false,    //  是否重用

            iconToggle: false, //  迁移，并入图标

            //  变更类型存放数组
            changeTypeOption: [
                { value: "11", text: "新增", disabled: true },
                { value: "21", text: "变更", disabled: true },
                { value: "31", text: "并入", disabled: true },
                { value: "41", text: "迁移", disabled: true },
            ],

            //用于储存环、链数据的容器
            basket: {
                list: [],
                map: {}
            },

            visible: false,  //  区划树模态框显隐标志

            //  区划树
            expandedKeys: [],
            searchValue: '',
            autoExpandParent: true,
            treeData: [],

            //  并入时有下级区划出现模态框的数据存放
            moreForMerge: [],
            //  并入时有下级区划出现模态框的显隐标识
            moreForMergeVisible: false,

            addCode: ""    //   新增区划自动补位
        }
    }

    //  选择需要录入的区划
    handleAxiosSubordinateZoning(e) {
        let { assigningCode, codeRankPreview, ringFlagToggle, activedColor } = this.state;
        let selectedAssigningCode = Number(e.target.dataset.assigningcode);
        let originalZoningCodeArray;
        let targetZoningCodeArray;
        let originalZoningName;
        let targetZoningName;
        let differ;
        let tempChangeTypeOption;
        let colorRank = {};

        tempChangeTypeOption = [
            { value: "11", text: "新增", disabled: true },
            { value: "21", text: "变更", disabled: true },
            { value: "31", text: "并入", disabled: true },
            { value: "41", text: "迁移", disabled: true },
        ];

        //  如果选择的级次发生变化,则将变更类型重置
        if (selectedAssigningCode != this.state.selectedAssigningCode) {
            this.setState({
                changeType: "--请选择--"
            })
        }

        //  用户权限判定 只能操作下级数据
        if (selectedAssigningCode >= assigningCode) {
            differ = selectedAssigningCode - assigningCode;

            colorRank[e.target.dataset.assigningcode] = e.target.dataset.zoningcode;
            //  将每个级次选中的区划存入对象中, 并转化
            placeData(colorRank, activedColor);

            if (ringFlagToggle) {
                if (differ != 0) {
                    tempChangeTypeOption[1].disabled = false;
                } else {

                }
            } else {
                if (differ == 0) {
                    tempChangeTypeOption[0].disabled = false;
                } else if (differ == 1) {
                    tempChangeTypeOption[0].disabled = false;
                    tempChangeTypeOption[1].disabled = false;
                    tempChangeTypeOption[2].disabled = false;
                } else {
                    tempChangeTypeOption[0].disabled = false;
                    tempChangeTypeOption[1].disabled = false;
                    tempChangeTypeOption[2].disabled = false;
                    tempChangeTypeOption[3].disabled = false;
                }
            }

            this.setState((prevState, props) => ({
                changeTypeOption: tempChangeTypeOption
            }));

            // 清理非直系下级数据，只保留亲子级数据
            clearData(selectedAssigningCode, codeRankPreview);
            clearData(selectedAssigningCode, activedColor);

            //  获取子级区划代码发送数据
            let postData = {};
            postData.zoningCode = e.target.dataset.zoningcode;
            postData.zoningName = e.target.dataset.zoningname;

            this.axiosSubordinateZoning(postData);
            this.axiosZoningCompareAffairByOne(postData);

            originalZoningCodeArray = sliceSpecifiedCode(e.target.dataset.zoningcode);
            targetZoningCodeArray = sliceSpecifiedCode(e.target.dataset.zoningcode);;
            originalZoningName = e.target.dataset.zoningname;
            targetZoningName = e.target.dataset.zoningname;

            this.setState({
                selectedAssigningCode: selectedAssigningCode,
                selectedZoningCode: e.target.dataset.zoningcode,
                selectedZoningName: e.target.dataset.zoningname,
                originalZoningCodeArray: originalZoningCodeArray,
                targetZoningCodeArray: targetZoningCodeArray,
                originalZoningName: originalZoningName,
                targetZoningName: targetZoningName,
                targetZoningCode: e.target.dataset.zoningcode,
            })

            this.render();
        }
    }

    handleChangeInputValue(name, e) {
        console.log(name)
        if (name == "requestName") {
            this.setState({
                requestName: e.target.value
            })
        } else if (name == "targetZoningName") {
            this.setState({
                targetZoningName: e.target.value
            })
        } else if (name == "notes") {
            this.setState({
                notes: e.target.value
            })
        }
    }

    /**
     * 编辑录入现区划代码 
     */
    handleChangeValue(e) {
        let val, index, tempArr;
        let { targetZoningCodeArray } = this.state;
        let targetZoningCode;
        tempArr = targetZoningCodeArray;

        val = e.target.value;
        index = e.target.dataset.index;

        tempArr[index] = val;

        console.log(this.state.targetZoningCodeArray);
        targetZoningCode = combinSpecifiedCode(targetZoningCodeArray)

        this.setState((prevState, props) => ({
            targetZoningCodeArray: tempArr,
            targetZoningCode: targetZoningCode
        }));
    }

    /**
     * 重用复选点击事件
     * 每次点击重用变更   变更类型都得做一次清空
     */
    handleChecked(e) {
        this.setState({
            ringFlagToggle: e.target.checked,
            changeType: "--请选择--",
            ringFlag: e.target.checked ? 1 : 0
        })

        let { assigningCode, ringFlagToggle, selectedAssigningCode } = this.state;
        let differ;
        let tempChangeTypeOption;

        tempChangeTypeOption = [
            { value: "11", text: "新增", disabled: true },
            { value: "21", text: "变更", disabled: true },
            { value: "31", text: "并入", disabled: true },
            { value: "41", text: "迁移", disabled: true },
        ];

        //  用户权限判定 只能操作下级数据
        if (selectedAssigningCode >= assigningCode) {
            differ = selectedAssigningCode - assigningCode;

            if (ringFlagToggle) {
                if (differ != 0) {
                    tempChangeTypeOption[1].disabled = false;
                } else {

                }
            } else {
                if (differ == 0) {
                    tempChangeTypeOption[0].disabled = false;
                } else if (differ == 1) {
                    tempChangeTypeOption[0].disabled = false;
                    tempChangeTypeOption[1].disabled = false;
                    tempChangeTypeOption[2].disabled = false;
                } else {
                    tempChangeTypeOption[0].disabled = false;
                    tempChangeTypeOption[1].disabled = false;
                    tempChangeTypeOption[2].disabled = false;
                    tempChangeTypeOption[3].disabled = false;
                }
            }

            this.setState((prevState, props) => ({
                changeTypeOption: tempChangeTypeOption
            }));
        }
    }

    /**
     * 变更类型更改
     */
    handleChangeType(e) {
        let { selectedZoningCode, selectedZoningName, ringFlag, ringFlagToggle, selectedAssigningCode, codeRankPreview, addCode } = this.state;
        let originalZoningCode, originalZoningName, originalZoningCodeArray = [];

        originalZoningCode = selectedZoningCode;
        originalZoningName = selectedZoningName;

        this.setState({
            targetZoningCodeArray: sliceSpecifiedCode(selectedZoningCode)
        })

        originalZoningCodeArray = sliceSpecifiedCode(originalZoningCode);

        this.axiosLogicCheckBeforeChange(selectedZoningCode);

        console.log("=====!!",this.state.selectedZoningCode, this.state.targetZoningCode, this.state.targetZoningCodeArray, this.state.selectedAssigningCode, addCode)


        //  是否选择环链变更
        //  是的话   取同级区划做叶子节点
        if (ringFlagToggle) {
            let data = [];

            switch (selectedAssigningCode + "") {
                case "1": data = codeRankPreview["province"];
                    break;
                case "2": data = codeRankPreview["city"];
                    break;
                case "3": data = codeRankPreview["county"];
                    break;
                case "4": data = codeRankPreview["township"];
                    break;
                case "5": data = codeRankPreview["village"];
                    break;
                default:
                    break;
            }

            this.setState({
                changeType: e,
                originalZoningCode: originalZoningCode,
                originalZoningCodeArray: originalZoningCodeArray,
                originalZoningName: originalZoningName,
                targetZoningCode: "",
                targetZoningName: "",
                targetZoningCodeArray: ["", "", "", "", "", ""],
                iconToggle: true,
                ringFlag: 1,
                treeData: data
            })

        } else {
            if (e == "11") {
                let {targetZoningCodeArray, targetZoningCode, selectedAssigningCode, addCode, selectedZoningCode} = this.state;
                let tempArr = sliceSpecifiedCode(selectedZoningCode);
                tempArr[selectedAssigningCode] = addCode;
                targetZoningCode = combinSpecifiedCode(tempArr)
                console.log(tempArr, targetZoningCodeArray, targetZoningCode)

                this.setState({
                    changeType: e,
                    originalZoningCode: "",
                    originalZoningCodeArray: ["", "", "", "", "", ""],
                    originalZoningName: "",
                    targetZoningName: "",
                    targetZoningCode: targetZoningCode,
                    targetZoningCodeArray: tempArr,
                    iconToggle: false,
                    ringFlag: 0
                })
            } else if (e == "21") {
                this.setState({
                    changeType: e,
                    originalZoningCode: originalZoningCode,
                    originalZoningCodeArray: originalZoningCodeArray,
                    originalZoningName: originalZoningName,
                    targetZoningName: originalZoningName,
                    targetZoningCodeArray: originalZoningCodeArray,
                    iconToggle: false,
                    ringFlag: 0
                })
            } else {
                this.setState({
                    changeType: e,
                    originalZoningCode: originalZoningCode,
                    originalZoningCodeArray: originalZoningCodeArray,
                    originalZoningName: originalZoningName,
                    targetZoningCode: "",
                    targetZoningName: "",
                    targetZoningCodeArray: ["", "", "", "", "", ""],
                    iconToggle: true,
                    ringFlag: 0
                })
            }
        }


    }

    /**
     * 保存明细
     */
    handleSaveDisplayDetails() {
        let tempArr = [];
        let obj = {};
        let group = {};
        let { requestName, requestSeq, notes, targetZoningName, targetZoningCode, changeType, originalZoningCode, originalZoningName, displayDetails } = this.state;

        tempArr = displayDetails;
        obj.requestName = requestName;
        obj.originalZoningCode = originalZoningCode;
        obj.originalZoningName = originalZoningName;
        obj.changeType = changeType;
        obj.targetZoningCode = targetZoningCode;
        obj.targetZoningName = targetZoningName;
        obj.notes = notes;
        obj.disChangeType = changeTypeConversion(changeType);

        group.requestSeq = requestSeq;
        group.name = requestName;

        this.setState({
            group: group,
            displayDetails: tempArr
        })

        if (targetZoningCode != "" && targetZoningName != "" && (changeType != "" || isNaN(Number(changeType)))) {
            this.checkAdd();
        } else {
            openNotificationWithIcon("warning", "完善变更明细数据后才能保存!");
        }
    }

    /**
     * 点击保存明细时触发的校验
     * @param 区划信息 changeInfo
     */
    checkAdd() {
        let { originalZoningCode, originalZoningName, targetZoningCode, targetZoningName, targetZoningCodeArray, selectedAssigningCode, changeType, notes, requestSeq, ringFlag, sourceId, targetId } = this.state;
        let changeInfo = {
            originalZoningCode: originalZoningCode,
            originalZoningName: originalZoningName,
            targetZoningCode: targetZoningCode,
            targetZoningName: targetZoningName,
            changeType: changeType,
            notes: notes,
            ringFlag: ringFlag,
            sourceId: sourceId,
            targetId: targetId,
            requestSeq: requestSeq
        };
        // let  changeType = changeInfo.changeType.toString();
        // basket = data.basket;

        if (!/(\d){15}/.test(changeInfo.targetZoningCode)) {
            openNotificationWithIcon("warning", "现区划代码不是符合规范的15位阿拉伯数字!");
        } else {

            if (changeType == "11") {
                this.axiosLogicCheckBeforeSave(changeInfo);

            } else if (changeType == "21") {
                if (changeInfo.targetZoningCode == changeInfo.originalZoningCode && changeInfo.targetZoningName == changeInfo.originalZoningName) {
                    openNotificationWithIcon("warning", "无效的变更，原区划代码、原区划名称与现区划代码、现区划名称完全一致!");
                } else {
                    this.axiosLogicCheckBeforeSave(changeInfo);
                }
            } else if (changeType == "31") {
                //并入，可以在点击“选择并入对象”时，校验对象是否有子级区划
                var targetAssCode = getAssigningCode(changeInfo.targetZoningCode),
                    originalAssCode = getAssigningCode(changeInfo.originalZoningCode);

                //比较区划级次
                if (targetAssCode !== originalAssCode) {
                    openNotificationWithIcon("warning", "并入的目标区划与原区划级次不一样!");
                } else {
                    let postData = {};
                    postData.zoningCode = originalZoningCode;

                    getSubordinateZoning(postData).then(res => {
                        let tempObj = res.responseData;
                        let tempArr = [];
                        let obj = {};
                        let targetParentCode = "";
                        targetZoningCodeArray.forEach((item, index) => {
                            if (index < selectedAssigningCode) {
                                targetParentCode += item;
                            }
                        })

                        for (var key in tempObj) {
                            if (tempObj[key].length > 0) {

                                //  拿到下级区划数据
                                tempObj[key].forEach(item => {
                                    obj.targetParentCode = targetParentCode
                                    obj.originalSubCode = item.zoningCode;
                                    obj.originalSubName = item.divisionName;
                                    obj.targetSubName = item.divisionName;
                                    tempArr.push(obj);
                                    obj = {};
                                })

                                openNotificationWithIcon("warning" ,`${originalZoningName}该区划存在下级`);
                            }
                        }

                        console.log(this.state.selectedAssigningCode)

                        this.setState({
                            moreForMerge: tempArr,
                            moreForMergeVisible: true
                        })
                    })

                    // this.axiosLogicCheckBeforeSave(changeInfo);
                }
            } else if (changeType == "41") {

                //迁移在前台其实不能做多少校验，需要使用ajax
                this.axiosLogicCheckBeforeSave(changeInfo);
            }
        }
    };

    /**
     * 刷新变更明细数据
     */
    flushDetails() {
        let { requestSeq, requestName } = this.state;
        let obj = {};
        obj.requestSeq = requestSeq;
        obj.name = requestName;


        this.setState({
            targetZoningCodeArray: ["", "", "", "", "", ""],
            targetZoningCode: "",
            targetZoningName: "",
            notes: "",
            changeType: "--请选择--",
            iconToggle: false,
            group: obj
        })

        //刷新数据草稿箱
        this.axiosDraftsOfDetails(requestSeq);
    }

    //清空录入的各数据
    clean() {
        this.setState({
            targetZoningCodeArray: ["", "", "", "", "", ""],
            targetZoningCode: "",
            targetZoningName: "",
            ringFlag: 0,
            notes: "",
        })
    }

    /**
     * 删除草稿箱明细
     */
    handleDelete(text, record) {
        console.log(text, record);
        this.axiosRemoveDraftsOfDetails(text.id);
    }

    /**
     * 提交区划变更对照明细
     */
    handleSubmitDetails() {
        let { group, displayDetails, zoningCode, requestSeq, basket } = this.state;

        if (displayDetails.length > 0) {

            //校验环状、链状变更是否有效
            if (basket.list.length > 0) {
                var list = basket.list,
                    first = list[0],
                    map = basket.map,
                    fullLink = [],
                    tail,
                    count = 0; //记录链头的数量

                //遍历重用变更明细
                //从区划树中选择的明细，都会有targetId
                //无targetId的明细，是手写的，那是链状变更
                list.forEach(function (e) {
                    if (e.targetId == "") {
                        tail = e;
                        count = count + 1;
                    }
                });

                //含有多条链
                if (count > 1) {
                    openNotificationWithIcon("warning", "本次的变更组中的重用变更明细数据具有多条链，不符合规范!");
                    return false;
                } else {

                    //这可能是个链
                    if (count === 1) {
                        var line = [],
                            size = list.length;

                        //将一条链完整地放入数组
                        (function (e) {
                            line.push(e);
                            var originalCode = e.originalZoningCode;
                            for (var i = 0; i < size; i++) {
                                if (list[i].targetZoningCode === originalCode) {
                                    return arguments.callee(list[i]);
                                }
                            }
                        })(tail);
                        if (line.length !== size) {
                            openNotificationWithIcon("warning", "变更组中的链状变更不是一条完整的链，请注意!");
                        }
                    }

                    //不存在链
                    else {
                        var ring = [first],
                            size = list.length;
                        if (size === 1) {
                            openNotificationWithIcon("warning", "变更组中的重用变更是不完整的环!");
                            return false;
                        } else {

                            //将环状数据依序放入数组，
                            //以环的任意一点为原点，往前找，直到回到原点结束
                            //将一个完整的环纳入
                            (function (e) {
                                var detail = map[e.targetZoningCode];
                                if (detail && detail != first) {
                                    ring.push(e);
                                    return arguments.callee(detail);
                                }
                            })(first);

                            if (ring.length !== size) {
                                openNotificationWithIcon("warning", "变更组中的重用变更不是单个环!");
                                return false;
                            }
                        }
                    }
                }
            }

            let postData = {};
            postData.group = JSON.stringify(group);
            postData.details = JSON.stringify(displayDetails);
            postData.zoningCode = zoningCode;
            postData.requestSeq = requestSeq;

            this.axiosSaveDetails(postData);
        } else {
            hashHistory.push({
                pathname: "/about/pfpsmas/zcms/previewChangeDetails",
                state: {
                    systemId: sessionStorage.getItem("systemId")
                }
            })
        }
    }

    /**
     * 区划树模态框确定函数
     */
    handleOk() {
        this.setState({
            visible: false
        })
    }

    handleMoveOk(e){
        console.log(e);
    }

    /**
     * 区划树模态框关闭函数
     * 合并时下级迁移模态框关闭函数
     */
    handleCancel() {
        this.setState({
            visible: false,
            moreForMergeVisible: false
        })
    }

    /**
     * 区划树加载函数
     */
    showTree() {
        let postData = {};
        let { zoningCode, originalZoningCode, ringFlagToggle } = this.state;

        postData.rootCode = zoningCode;
        postData.excludeCode = originalZoningCode;

        if(!ringFlagToggle){
            this.axiosZoningMergeSelectTree(postData).then(res => {
                if (res.rtnCode == "000000") {
                    this.setState({
                        treeData: res.responseData
                    })
                }
            });
        }
        
        this.setState({
            visible: true
        })
    }

    onSelectTreeNode(info, e) {
        console.log('selected', info, e.node.props.dataRef);
        let tempObj = e.node.props.dataRef;

        this.setState({
            targetZoningCode: tempObj.zoningCode,
            targetZoningName: tempObj.divisionName,
            targetZoningCodeArray: sliceSpecifiedCode(tempObj.zoningCode)
        })
    }

    inputMoveCode(record, text) {
        console.log(record, text);
    }

    /**
     * 异步加载区划树数据
     * @param {*} treeNode 
     */
    async onLoadData(treeNode) {
        let postData = {};
        let { zoningCode, originalZoningCode } = this.state;
        let zoningKey = treeNode.props.eventKey;

        postData.rootCode = zoningCode;
        postData.excludeCode = originalZoningCode;
        postData.zoningCode = zoningKey;

        console.log('=============', zoningKey)
        let res = await this.axiosZoningMergeSelectTree(postData);
        let data = res.responseData;
        treeNode.props.dataRef.children = data;
        console.log('-------------', treeNode);

        let treeData = [...this.state.treeData];
        console.log('-------------', treeData);

        this.setState({
            treeData: treeData
        })

        console.log(this.state.treeData)
    }

    /**
     * 初始化区划变更明细对照数据录入界面
     */
    async axiosInitAddDetails(params) {
        let res = await getInitAddDetails(params);
        let { codeRankPreview } = this.state;
        if (res.rtnCode == "000000") {
            let dataCode = res.responseData.previewData;
            let requestSeq = res.responseData.seq;
            placeData(dataCode, codeRankPreview);
            this.axiosDraftsOfDetails(requestSeq);
            this.setState({
                codeRankPreview: codeRankPreview,
                requestSeq: requestSeq
            })
        } else {
            openNotificationWithIcon("error", "数据加载异常，请联系管理员!");
        }
    }

    /**
     * 获取子级区划代码
     * @param zoningCode — 区划代码
     */
    async axiosSubordinateZoning(params) {
        let res = await getSubordinateZoning(params);
        let { codeRankPreview, selectedAssigningCode } = this.state;
        if (res.rtnCode == "000000") {
            let dataCode = res.responseData;
            console.log(dataCode)

            for(var key in dataCode){
                if(dataCode[key].length != 0){
                    var addCode = Number(dataCode[key][dataCode[key].length-1].ownCode) + 1;
                    if(addCode < 10){
                        addCode = selectedAssigningCode < 3 ? "0" + addCode : "00" + addCode;
                    }else if(addCode < 100){
                        addCode = selectedAssigningCode < 3 ? "" + addCode : "0" + addCode
                    }
                }else{
                    var addCode = selectedAssigningCode < 3 ? "01" : "001";
                }
            }
    
            console.log("=========12312", addCode)

            placeData(dataCode, codeRankPreview);
            // console.log("--------------", codeRankPreview)
            this.setState({
                codeRankPreview: codeRankPreview,
                addCode: addCode
            })
        }
    }

    /**
     * 单个民政区划对比
     */
    async axiosZoningCompareAffairByOne(params) {
        let res = await getZoningCompareAffairByOne(params);
        let {selectedAssigningCode, selectedZoningCode, codeRankPreview} = this.state;
        let temp = [];
        console.log(res);
        if (res.rtnCode == "000000") {
            let data = res.responseData;
            
            console.log(selectedZoningCode);

            switch(selectedAssigningCode){
                case 1 || "1": temp = codeRankPreview.province;
                    break;
                case 2 || "2": temp = codeRankPreview.city;
                    break;
                case 3 || "3": temp = codeRankPreview.county;
                    break;
                case 4 || "4": temp = codeRankPreview.township;
                    break;
                case 5 || "5": temp = codeRankPreview.village;
                    break;
                default :
                    break;
            }

            let tempArr = temp.map(item => {
                if(item.zoningCode == selectedZoningCode){
                    item.resultType = data.type
                }
                return item;
            })

            let tempObj = {selectedZoningCode: tempArr}

            console.log(tempArr)

            placeData(tempObj, codeRankPreview);

            this.setState({
                civilCode: data.civilCode ? data.civilCode : "无",
                civilName: data.civilName ? data.civilName : "无",
                codeEqual: data.codeEqual ? "相同" : "不同",
                nameEqual: data.nameEqual ? "相同" : "不同",
                resultType: data.type
            })
        }
    }

    /**
     * 在每次保存录入的变更明细时，进行一次逻辑校验
     * @param params — 变更明细对象
     */
    async axiosLogicCheckBeforeSave(params) {
        params = JSON.stringify(params);
        let res = await getLogicCheckBeforeSave(params);
        if (res.rtnCode == "000000") {
            this.flushDetails();
        } else {
            openNotificationWithIcon("error", res.rtnMessage);
        }
    }

    /**
     * 获取草稿箱信息
     */
    async axiosDraftsOfDetails(params) {
        let res = await getDraftsOfDetails(params);
        let { basket, displayDetails } = this.state;
        let tempArr = [];
        if (res.rtnCode == "000000") {
            this.state.displayDetails = [];
            res.responseData.forEach(item => {
                item.disChangeType = changeTypeConversion(item.changeType)
                tempArr.push(item);
            });

            this.setState({
                displayDetails: tempArr
            })
            console.log('displayDetails======>', this.state.displayDetails);
            let list = basket.list = [],
                map = basket.map = {},
                originalZoningCode,
                targetZoningCode;

            // 收集环、链数据
            this.state.displayDetails.forEach(function (value) {
                if (value.ringFlagToggle == 1) {
                    list.push(value);
                    originalZoningCode = value.originalZoningCode;
                    if (map[originalZoningCode]) {
                        map[originalZoningCode] = {
                            id: map[originalZoningCode].id || value.sourceId,
                            zoningCode: originalZoningCode,
                            detail: value
                        };
                    } else {
                        map[originalZoningCode] = {
                            id: value.sourceId,
                            zoningCode: originalZoningCode,
                            detail: value
                        };
                    }
                    targetZoningCode = value.targetZoningCode;
                    if (map[targetZoningCode]) {
                        map[targetZoningCode] = {
                            id: map[targetZoningCode].id || value.targetId,
                            zoningCode: targetZoningCode,
                            detail: map[targetZoningCode].detail
                        }
                    } else {
                        map[targetZoningCode] = {
                            id: value.targetId,
                            zoningCode: targetZoningCode,
                            detail: value
                        }
                    }
                }
            });
        } else {
            openNotificationWithIcon("error", "获取草稿箱信息出错!");
        }
    }

    /**
     * 删除草稿箱信息
     * @param {*} params 
     */
    async axiosRemoveDraftsOfDetails(params) {
        let res = await getRemoveDraftsOfDetails(params);
        let { requestSeq } = this.state;
        if (res.rtnCode === "000000") {
            openNotificationWithIcon("success", "明细删除成功!");
            this.axiosDraftsOfDetails(requestSeq);
        } else {
            openNotificationWithIcon("error", "删除变更明细出错!");
        }
    }

    /**
     * 保存明细前校验
     */
    async axiosLogicCheckBeforeChange(params) {
        let res = await getLogicCheckBeforeChange(params);
        if (res.rtnCode != "000000") {
            openNotificationWithIcon("info", "该区划不可变更明细!");
            this.setState({
                changeType: "--请选择--",
                targetZoningCode: "",
                originalCode: "",
                targetZoningCodeArray: ['', '', '', '', '', ''],
                originalZoningCodeArray: ['', '', '', '', '', ''],
            })
        }
    }

    /**
     * 获取区划树数据
     * @param {string} rootCode    根区划     登录人区划
     * @param {string} excludeCode  排除区划   用户选择需要变更的原区划
     * @param {string} zoningCode  区划    用户选择迁移并入的现区划
     */
    async axiosZoningMergeSelectTree(params) {
        let res = getZoningMergeSelectTree(params);
        return res;
    }

    /**
     * 提交区划变更对照明细接口
     * @param  group 存放文件序号,变更组名称
     * @param  details 存放变更明细数据
     * @param  zoningCode 区划代码
     * @param  requestSeq 申请单序号
     */
    async axiosSaveDetails(params) {
        let res = await getSaveDetails(params);

        if (res.rtnCode === "999999") {
            openNotificationWithIcon("error", "变更失败，请联系管理员!");
        } else {
            openNotificationWithIcon("success", "变更明细提交成功!");
            let basket = {};
            //清理环状、链状数据
            basket.list = [];
            basket.map = {};

            this.setState({
                group: {},
                displayDetails: [],
                basket: basket,
                selectedZoningCode: "",
                subAssigningCode: "",
                originalZoningCode: "",
                originalZoningName: "",
                originalZoningCodeArray: ["", "", "", "", "", ""]
            })
            getDraftsOfDetails(this.state.requestSeq);

            hashHistory.push({
                pathname: "/about/pfpsmas/zcms/previewChangeDetails",
                state: {
                    systemId: sessionStorage.getItem("systemId")
                }
            })
        }
    }

    componentWillMount() {
        let postData = {};
        let { zoningCode } = this.state;
        postData.zoningCode = zoningCode;
        this.axiosInitAddDetails(postData);

        console.log(this.props.location.state.requestSeq);
    }

    render() {
        const navbar = [{
            name: "建立变更对照表",
            routerPath: "/about/pfpsmas/zcms/createChangeComparisonTable",
            imgPath: gray
        }, {
            name: "录入变更明细",
            routerPath: "/about/pfpsmas/zcms/inputChangeDetails",
            imgPath: blue
        }, {
            name: "变更明细预览",
            routerPath: "/about/pfpsmas/zcms/inputChangeDetails",
            imgPath: black
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
        }, {
            title: '备注',
            dataIndex: 'notes',
            key: 'notes',
            width: 150,
        }, {
            title: '操作',
            key: 'operation',
            width: 50,
            render: (text, record) => (
                <span>
                    <Button type="primary" size="small" onClick={this.handleDelete.bind(this, record)}>删除</Button>
                </span>
            ),
        }];

        const moreColumns = [{
            title: '并入区划代码',
            dataIndex: 'targetParentCode',
            key: 'targetParentCode',
            width: 150,
        }, {
            title: '原区划代码',
            dataIndex: 'originalSubCode',
            key: 'originalSubCode',
            width: 150,
        }, {
            title: '原区划名称',
            dataIndex: 'originalSubName',
            key: 'originalSubName',
            width: 150,
        }, {
            title: '迁移后区划名称',
            dataIndex: 'targetSubName',
            key: 'targetSubName',
            width: 150,
        }, {
            title: '迁移后区划代码',
            key: 'operation',
            width: 150,
            render: (text, record) => (
                <Input size="large" onChange={this.inputMoveCode.bind(this, record)} maxLength={this.state.selectedAssigningCode < 3 ? 2 : 3} style={{textAlign: "center"}}/>
            ),
        }];

        const displayDom = (data, color) => Object.keys(data).map(key => {
            return (
                <Col span={4}>
                    <FreeScrollBar>
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
                    onClick={this.handleAxiosSubordinateZoning.bind(this)}
                    >
                        <td data-zoningCode={item.zoningCode}
                            data-zoningName={item.divisionName}
                            data-assigningCode={item.assigningCode}>
                            {item.divisionName} {item.ownCode}
                            <Icon type="exclamation-circle-o" className={item.resultType == "4" ? "display-inline-block" : "display-none"} style={{color: "#f90", paddingLeft: 20}}/>                      
                        </td>
                    </tr>
                
            )
        })

        const loopInput = (data, assigningcode, changeType) => data.map((item, index) => {
            if (changeType == "11" && assigningcode == index) {
                if (index <= 2) {
                    return (
                        <input className="input-small-length input-font-color" type="text" maxLength="2" value={item} data-index={index} onChange={this.handleChangeValue.bind(this)} />
                    )
                } else {
                    return (
                        <input className="input-small-length input-font-color" type="text" maxLength="3" value={item} data-index={index} onChange={this.handleChangeValue.bind(this)} />
                    )
                }
            } else if (changeType == "21" && assigningcode == (index + 1)) {
                if (index <= 2) {
                    return (
                        <input className="input-small-length input-font-color" type="text" maxLength="2" value={item} data-index={index} onChange={this.handleChangeValue.bind(this)} />
                    )
                } else {
                    return (
                        <input className="input-small-length input-font-color" type="text" maxLength="3" value={item} data-index={index} onChange={this.handleChangeValue.bind(this)} />
                    )
                }
            } else {
                if (index <= 2) {
                    return (
                        <input className="input-small-length" type="text" maxLength="2" value={item} readOnly />
                    )
                } else {
                    return (
                        <input className="input-small-length" type="text" maxLength="3" value={item} readOnly />
                    )
                }
            }
        })

        const loopOption = data => data.map(item => {
            return (
                <Option value={item.value} disabled={item.disabled}>{item.text}</Option>
            )
        })

        const loopTree = data => data.map((item) => {
            if(this.state.ringFlagToggle){
                return <TreeNode title={item.divisionName} key={item.zoningCode} dataRef={item} isLeaf={true}/>;
            }else{
                if (item.children) {
                    console.log("children", item.children)
                    return <TreeNode title={item.divisionName} key={item.zoningCode} dataRef={item} isLeaf={true}>
                        {loopTree(item.children)}
                    </TreeNode>;
                }
                return <TreeNode title={item.divisionName} key={item.zoningCode} dataRef={item} />;
            }
        });

        const treeNodes = loopTree(this.state.treeData);

        const rowSelection = {

            onChange(selectedRowKeys, selectedRows) {
                console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            },

            onSelect(record, selected, selectedRows) {
                console.log(record, selected, selectedRows);
            },

            onSelectAll(selected, selectedRows, changeRows) {
                console.log(selected, selectedRows, changeRows);
            },
        };

        return (
            <div className="outer-box">

                <div className="inputchangedetails">
                <FreeScrollBar autohide="true">
                    <Navbar data={navbar}></Navbar>

                    <div className="container">
                        <div className="container-top">
                            <Row type="flex" justify="space-around">
                                {displayDom(this.state.codeRankPreview, this.state.activedColor)}
                            </Row>
                        </div>

                        <Hr />

                        <div className="container-top-2">
                            <div className="civil-content">
                                <span className="civil-span">民政区划代码:</span> <span className="civil-input">{this.state.civilCode}</span>
                                <span className="civil-span">民政区划名称:</span> <span className="civil-input">{this.state.civilName}</span>
                                <span className="civil-span">比对结果:</span>
                                <span className="civil-input civil-color">
                                    代码比对{this.state.codeEqual};
                                    名称比对{this.state.nameEqual}
                                </span>
                            </div>
                        </div>

                        <Hr />

                        <div className="container-center">
                            <Row className="margin-top-10">
                                {/* 调整说明 */}
                                <Col span={12}>
                                    <Row>
                                        <Col span={6}>
                                            <label className="label-font-16">调整说明
                                                {/* <span className="color-red-margin">*</span> */}
                                            </label>
                                        </Col>
                                        <Col span={18}>
                                            <input type="text" className="input-large-length" value={this.state.requestName}
                                                onChange={this.handleChangeInputValue.bind(this, "requestName")} />
                                        </Col>
                                    </Row>
                                </Col>

                                {/* 调整类型 */}
                                <Col span={12}>
                                    <Row>
                                        <Col span={6} style={{ marginTop: 7 }}>
                                            <Checkbox onChange={this.handleChecked.bind(this)} style={{ fontSize: 16 }}>环链变更</Checkbox>
                                        </Col>
                                        <Col span={18}>
                                            <Row>
                                                <Col span={6}>
                                                    <label className="label-font-16">调整类型<span className="color-red-margin">*</span></label>
                                                </Col>
                                                <Col span={18} className="text-align-left">
                                                    <Select size="large" placeholder="--请选择--" value={this.state.changeType}
                                                        onChange={this.handleChangeType.bind(this)}
                                                        style={{ width: "66%" }}>
                                                        {loopOption(this.state.changeTypeOption)}
                                                    </Select>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>

                            <Row className="margin-top-10">
                                {/* 原区划代码 */}
                                <Col span={12}>
                                    <Row>
                                        <Col span={6}>
                                            <label className="label-font-16">原区划代码</label>
                                        </Col>
                                        <Col span={18}>
                                            {loopInput(this.state.originalZoningCodeArray)}
                                        </Col>
                                    </Row>
                                </Col>

                                {/* 现区划代码 */}
                                <Col span={12}>
                                    <Row>
                                        <Col span={6}>
                                            <label className="label-font-16">现区划代码<span className="color-red-margin">*</span></label>
                                        </Col>
                                        <Col span={18}>
                                            {loopInput(this.state.targetZoningCodeArray, this.state.selectedAssigningCode, this.state.changeType)}
                                            <Tooltip placement="bottom" arrowPointAtCenter="true" overlayClassName="speech-bubble" mouseLeaveDelay="5" title="点击星星图标获取区划代码">
                                                <img src={star} alt="迁移,并入提示图标" className={this.state.iconToggle ? "speech-bubble icon-show" : "speech-bubble icon-hide"} onClick={this.showTree.bind(this)} />
                                            </Tooltip>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>

                            <Row className="margin-top-10">
                                {/* 原区划名称 */}
                                <Col span={12}>
                                    <Row>
                                        <Col span={6}>
                                            <label className="label-font-16">原区划名称</label>
                                        </Col>
                                        <Col span={18}>
                                            <input type="text" className="input-large-length" value={this.state.originalZoningName} readOnly />
                                        </Col>
                                    </Row>
                                </Col>

                                {/* 现区划名称 */}
                                <Col span={12}>
                                    <Row>
                                        <Col span={6}>
                                            <label className="label-font-16">现区划名称<span className="color-red-margin">*</span></label>
                                        </Col>
                                        <Col span={18}>
                                            <input type="text" className="input-large-length font-color-fff" value={this.state.targetZoningName}
                                                onChange={this.handleChangeInputValue.bind(this, "targetZoningName")} />
                                        </Col>
                                    </Row>
                                </Col>

                            </Row>

                            <Row className="margin-top-10">
                                {/* 备注 */}
                                <Col span={12}>
                                    <Row>
                                        <Col span={6}>
                                            <label className="label-font-16">备注
                                                {/* <span className="color-red-margin">*</span> */}
                                            </label>
                                        </Col>
                                        <Col span={18}>
                                            <input type="text" className="input-large-length" value={this.state.notes}
                                                onChange={this.handleChangeInputValue.bind(this, "notes")} />
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>

                            <Row className="margin-top-10">
                                {/* 功能按钮组 */}
                                <Col span={12} offset={6}>
                                    <Button type="primary" size="large" onClick={this.handleSaveDisplayDetails.bind(this)}>保存明细</Button>
                                    <Button type="primary" size="large" onClick={this.clean.bind(this)} style={{ marginLeft: 20 }}>重置</Button>
                                </Col>
                            </Row>
                        </div>

                        <Hr />

                        <div className="container-bottom">
                            <Table dataSource={this.state.displayDetails} columns={columns} pagination={{ pageSize: 5 }} />
                        </div>

                        <div className="container-footer">
                            <Button type="primary" size="large" className="margin-top-10" onClick={this.handleSubmitDetails.bind(this)}>预览</Button>
                        </div>
                    </div>
                    </FreeScrollBar>
                </div>

                {/* 区划树模态框 */}
                <Modal title="请选择目标区划" visible={this.state.visible}
                    onOk={this.handleOk.bind(this)} onCancel={this.handleCancel.bind(this)}
                >
                    <div>
                        {/* <Input style={{ marginBottom: 8 }} placeholder="Search" onChange={this.onSearchTreeChange.bind(this)} /> */}

                        <Tree onSelect={this.onSelectTreeNode.bind(this)} loadData={this.onLoadData.bind(this)}>
                            {treeNodes}
                        </Tree>
                    </div>
                </Modal>

                <Modal title="并入区划下要迁移的下级行政区划" visible={this.state.moreForMergeVisible}
                    onOk={this.handleMoveOk.bind(this)} onCancel={this.handleCancel.bind(this)}
                    okText="迁移" cancelText="关闭" maskClosable={false}
                    wrapClassName="move-table"
                >
                    <h6 style={{
                        color: "#f00",
                        textAlign: "center",
                        marginBottom: 10
                    }}>
                        请手工录入迁移后的区划代码</h6>
                    <Table rowSelection={rowSelection} columns={moreColumns} dataSource={this.state.moreForMerge} pagination={{ pageSize: 5 }} />

                </Modal>

            </div>
        )
    }

}
export default InputChangeDetails;