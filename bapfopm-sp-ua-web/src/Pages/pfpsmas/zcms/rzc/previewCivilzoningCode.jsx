import React from 'react';
import { hashHistory, Link } from "react-router";
import qs from 'qs'

import './previewCivilzoningCode.css';

import blue from "../../../../asset/pfpsmas/zcms/img/blue.png";
import black from "../../../../asset/pfpsmas/zcms/img/black.png";
import gray from "../../../../asset/pfpsmas/zcms/img/gray.png";

//  自定义滚动条
import FreeScrollBar from 'react-free-scrollbar';

import { Table, Button, Select, Upload, Icon, Popconfirm, Row, Col } from 'antd';
import { Navbar, Hr } from "../../../../Components/index";

import { clearData, placeData, changeTypeConversion, getAssigningCode, getSubZoning, getSuperiorZoningCode, openNotificationWithIcon } from "../../../../asset/pfpsmas/zcms/js/common";
import { getSelectCAZ } from "../../../../Service/pfpsmas/zcms/server";

class PreviewCivilzoningCode extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            //  省,市,县,乡,村,组   各级区划预览数据存放
            codeRankPreview: {
                "province": [],
                "city": [],
                "county": [],
                "township": [],
                "village": []
            },

            //  各级选中区划,颜色样式状态标志
            activedColor: {
                "province": "",
                "city": "",
                "county": "",
                "township": "",
                "village": ""
            },
        }
    }

    /**
     * 民政区划数据查询接口
     * @param {string} superiorZoningCode 民政区划代码
     */
    handleAxiosSelectCAZ(e) {
        let postData = {};
        let colorRank = {};
        var { codeRankPreview, activedColor } = this.state;

        //  直辖市特殊处理
        //  直接写入
        var obj = {};
        var obj1 = {};
        var temp = {2: []}

        obj.affairName = "市辖区 01";
        obj.assigningCode = "2";
        obj1.affairName = "县 02";
        obj1.assigningCode = "2";

        if (e) {
            let selectedAssigningCode = e.target.dataset.assigningcode;
            let selectedZoningCode = e.target.dataset.zoningcode;
            switch (selectedZoningCode) {
                case "110000000000000":
                    obj.affairCode = "110100000000000";
                    temp[2].push(obj);
                    placeData(temp, codeRankPreview);
                    this.setState({
                        codeRankPreview: codeRankPreview
                    })
                    break;
                case "120000000000000":
                    obj.affairCode = "120100000000000";
                    temp[2].push(obj);
                    placeData(temp, codeRankPreview);
                    console.log(temp, codeRankPreview)
                    break;
                case "310000000000000":
                    obj.affairCode = "310100000000000";
                    temp[2].push(obj);
                    placeData(temp, codeRankPreview);
                    console.log(temp, codeRankPreview)
                    break;
                case "500000000000000":
                    obj.affairCode = "500100000000000";
                    obj1.affairCode = "500200000000000";
                    temp[2].push(obj, obj1);
                    placeData(temp, codeRankPreview);
                    break;
                default:
                    postData.superiorZoningCode = selectedZoningCode;
                    this.axiosSelectCAZ(postData);
            }

            colorRank[selectedAssigningCode] = selectedZoningCode;
            placeData(colorRank, activedColor);

            clearData(selectedAssigningCode, codeRankPreview);
        } else {
            postData.superiorZoningCode = "000000000000000";
            this.axiosSelectCAZ(postData);
        }
    }

    /**
     * 民政区划数据查询接口
     * @param {string} superiorZoningCode 民政区划代码
     */
    async axiosSelectCAZ(params) {
        let { codeRankPreview } = this.state;
        let res = await getSelectCAZ(params);
        if (res.rtnCode == "000000") {
            let data = res.responseData;
            console.log(data)
            placeData(data, codeRankPreview);
            this.setState({
                codeRankPreview: codeRankPreview
            })
            console.log(codeRankPreview);
        } else {
            openNotificationWithIcon("error", res.rtnMessage);
        }
    }

    componentWillMount() {
        this.handleAxiosSelectCAZ();
    }

    render() {
        const navbar = [{
            name: "民政数据收集",
            routerPath: "/about/pfpsmas/zcms/importCivilzoningCode",
            imgPath: gray
        }, {
            name: "民政数据预览",
            routerPath: "/about/pfpsmas/zcms/previewCivilzoningCode",
            imgPath: blue
        }, {
            name: "比对报表展示",
            routerPath: "/about/pfpsmas/zcms/civilComparisonReport",
            imgPath: black
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
                <tr className={`zoningcode-tr ${(item.sfbh && item.sfbh == "1") ? "background-color-red" : null} ${color == item.affairCode ? "zoningCode-actived" : null}`}
                    data-zoningCode={item.affairCode}
                    data-zoningName={item.affairName}
                    data-assigningCode={item.assigningCode}
                    onClick={this.handleAxiosSelectCAZ.bind(this)}
                >
                    <td data-zoningCode={item.affairCode}
                        data-zoningName={item.affairName}
                        data-assigningCode={item.assigningCode}>
                        {item.affairName}
                    </td>
                </tr>
            )
        })

        return (
            <div className="outer-box">
                <div className="previewCivilzoningCode">
                    <FreeScrollBar autohide="true">
                        <Navbar data={navbar}></Navbar>

                        <div className="preview-container">
                            <div className="preview-container-top">
                                <Row type="flex" justify="space-around">
                                    {displayDom(this.state.codeRankPreview, this.state.activedColor)}
                                </Row>
                            </div>

                            <Hr />
                        </div>
                    </FreeScrollBar>
                </div>
            </div>
        )
    }
}

export default PreviewCivilzoningCode;