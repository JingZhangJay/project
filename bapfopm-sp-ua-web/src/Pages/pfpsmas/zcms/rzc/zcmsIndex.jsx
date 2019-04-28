import React from 'react';

//  自定义滚动条
import FreeScrollBar from 'react-free-scrollbar';

import "./zcmsIndex.css";

// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
// 引入关系图
import 'echarts/lib/chart/pie';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/title';

import { Table, Button, Input, Select, Row, Col } from 'antd';
import { Hr, Pie, Bar } from "../../../../Components/index";

// import { openNotificationWithIcon } from "../../../../asset/pfpsmas/zcms/js/common";
import { getBgmxRealTimeExcel, getBgmxRealTimeExcelSub } from "../../../../Service/pfpsmas/zcms/server";
import { openNotificationWithIcon } from '../../../../asset/pfpsmas/zcms/js/common';

const data = [
    { value: 2, name: "JavaScript" },
    { value: 1, name: "Java" },
    { value: 1, name: "HTML/CSS" }
]

const Option = Select.Option;

class ZcmsIndex extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            zoningCode: sessionStorage.getItem("zoningCode"),   //  登录人区划
            selectedZoningCode: "", //  查看的下级区划

            data: [],   //  源数据
            selectData: [], //  下级区划数据

            parentPieData: [],  //  父级饼图数据
            childPieData: [],   //  子级饼图数据

            parentBarData: [],  //  父级柱状图数据
            childBarData: [],   //  子级柱状图数据
        };
    }

    handleChangeValue(value) {
        this.setState({
            selectedZoningCode: value
        }, () => {
            this.handleAxiosBgmxRealTimeExcel("child");
        })
    }

    /**
     * 变更明细当月实时数据
     * @param {string} type 本级区划 || 下级区划    parent || child
     */
    handleAxiosBgmxRealTimeExcel(type) {
        let { zoningCode, selectedZoningCode } = this.state;
        let postData = {};
        if (type == "parent") {
            postData.zoningCode = zoningCode;
        } else if (type == "child") {
            postData.zoningCode = selectedZoningCode;
        }
        this.axiosBgmxRealTimeExcel(postData, type);
    }

    /**
     * 变更明细当月实时数据
     * @param {string} zoningCode 区划代码
     * @param {string} type 本级区划 || 下级区划    parent || child
     */
    async axiosBgmxRealTimeExcel(param, type) {
        let res = await getBgmxRealTimeExcel(param);
        let obj;
        let temp = [];  //  处理后饼图数据
        
        let barTemp = [];   //  处理的柱状图元数据
        let barData = [];    //  处理后的柱状图数据
        if (res.rtnCode == "000000") {
            let data = res.responseData;

            //  处理饼图数据与柱状图元数据
            for (let key in data) {
                obj = {};
                obj.name = key;
                obj.value = data[key];
                if(obj.value == 0){
                    obj.label = {show: false};
                    obj.labelLine = {show: false};
                }
                barTemp.push(obj);
                key != "合计" && temp.push(obj);
            }

            //  处理柱状图数据
            barTemp.forEach(item => {
                let temp = [];
                temp.push(item.name, item.value);
                item.name == "合计" ? barData.unshift(temp) :
                    barData.push(temp);
            });

            //  根据父级 || 子级 分别处理数据
            if (type == "parent") {
                this.setState({
                    parentPieData: temp,
                    parentBarData: barData
                })
            } else if (type == "child") {
                this.setState({
                    childPieData: temp,
                    childBarData: barData
                })
            }
        } else {
            openNotificationWithIcon("error", res.rtnMessage);
        }
    }

    /**
     * 变更明细当月实时数据查询下级
     * @param {string} zoningCode 区划代码
     */
    async axiosBgmxRealTimeExcelSub(param) {
        let res = await getBgmxRealTimeExcelSub(param);
        if (res.rtnCode == "000000") {
            this.setState({
                selectData: res.responseData
            })
        }
        console.log(this.state.selectData)
    }

    componentWillMount() {
        let { zoningCode } = this.state;
        let postData = {};
        postData.zoningCode = zoningCode;

        this.handleAxiosBgmxRealTimeExcel("parent");
        this.axiosBgmxRealTimeExcelSub(postData);

    }

    render() {
        let { selectData } = this.state;

        const loopOption = data => data.map(item => {
            return (
                <Option value={item.zoningCode}>{item.divisionName}</Option>
            )
        })

        return (
            <div className="outer-box">
                <div className="zcmsIndex">
                    <FreeScrollBar autohide="true">
                        <div style={{color: "#fff", fontSize: "16px", textAlign: "center"}}>本月实时变更情况</div>
                        <div className="zcmsIndex-container-top margin-top-10">
                            <Row>
                                <Col span={12}>
                                    <Pie data={this.state.parentPieData} />
                                </Col>

                                <Col span={12}>
                                    <Bar data={this.state.parentBarData} />
                                </Col>
                            </Row>
                        </div>

                        <Hr />

                        <div className="zcmsIndex-container-bottom">
                            <Row>
                                <Col span={4}>
                                    <Select placeholder="--查看下级区划变更情况--" style={{ width: "100%", textAlign: "center" }}
                                        onChange={this.handleChangeValue.bind(this)}>
                                        {loopOption(this.state.selectData)}
                                    </Select>
                                </Col>
                            </Row>

                            <Row>
                                {
                                    this.state.childPieData.length != 0 &&
                                    <Col span={12}>
                                        <Pie data={this.state.childPieData} />
                                    </Col>
                                }

                                {
                                    this.state.childBarData.length != 0 &&
                                    <Col span={12}>
                                        <Bar data={this.state.childBarData} />
                                    </Col>
                                }
                            </Row>
                        </div>
                    </FreeScrollBar>
                </div>
            </div>
        )
    }
}

export default ZcmsIndex;