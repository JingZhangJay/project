import React from 'react';

//  自定义滚动条
import FreeScrollBar from 'react-free-scrollbar';

import circle from '../../../../asset/pfpsmas/zcms/img/circle3.png'

// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
// 引入关系图
import 'echarts/lib/chart/graph';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';

import { Table, Button, Input, DatePicker, Row, Col } from 'antd';
import { Navbar, Hr } from "../../../../Components/index";

import { openNotificationWithIcon, changeTypeConversion } from "../../../../asset/pfpsmas/zcms/js/common";
import { getHistoryDate } from "../../../../Service/pfpsmas/zcms/server";

import './historicalTrace.css';

const MonthPicker = DatePicker.MonthPicker;

class HistoricalTrace extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            queryZoningCode: "230112010003000",
            date: "20000101",
            rawData: [],
            historyData: [], //  追溯结果展示
        };
    }

    handleChangeValue(e) {
        this.setState({
            queryZoningCode: e.target.value
        })
    }

    handleChangeValueTime(date, value) {
        let tempDate = value.replace(/\-/, "") + "01";
        this.setState({
            date: tempDate
        })

    }

    /**
     * 获取历史轨迹数据
     */
    handleAxiosHistoryDate() {
        let { queryZoningCode, date } = this.state;
        let postData = {};

        postData.zoningCode = queryZoningCode;
        postData.timeInterval = date;
        this.axiosHistoryDate(postData);
    }

    /**
     * 描绘历史轨迹
     */
    handleDrawCanvas(rawData) {
        var data = [];
        var links = [];
        var obj;
        var lableObj;
        var clac; //  点x坐标摆放位置
        var xClac; //  计算每个版本有多少个点
        var xClacArr = []; //  存放每个版本的点数
        var versionArr = []; //  版本号

        //  计算每个版本有多少个点,并存放到数组里
        for (var i = 0; i < rawData.length; i++) {
            xClac = 0;
            for (var key in rawData[i]) {
                ++xClac;
            }
            xClacArr.push(xClac);
        }

        //  配置数据 data
        for (var i = 0; i < rawData.length; i++) {
            clac = -(xClacArr[i] - 1) / 2;    //  居中展示
            // clac = 0;  //  左对齐
            for (var key in rawData[i]) {
                obj = {}; //  data,links 对象存放
                clac++;
                for (var k in rawData[i][key]) {
                    obj.x = clac * 300 + 100;
                    obj.y = (2 * i + 1) * 100;
                    obj.version = i;
                    obj.zoningName = rawData[i][key].zoningName;
                    obj.zoningCode = rawData[i][key].zoningCode;
                    obj.periodStart = rawData[i][key].periodStart;
                    obj.uniqueKey = rawData[i][key].uniqueKey;
                    obj.changeType = rawData[i][key].changeType;
                }
                data.push(obj);
            }
        }

        //  连线 links
        //  先获得data的版本数组
        data.forEach(item => {
            versionArr.unshift(item.version);
        })

        versionArr = Array.from(new Set(versionArr));
        versionArr = versionArr.reverse();

        //  从最早的区划往后推，只要uniqueKey匹配到了下一个版本的区划，便停止遍历 
        obj = {};
        lableObj = {
            // show: true
        };
        for (var k = data.length - 1; k >= 0; k--) {
            for (var j = k - 1; j >= 0; j--) {
                if (data[j].uniqueKey.indexOf(data[k].uniqueKey) != -1) {
                    if (k != j) {
                        obj.source = k;
                        obj.target = j;
                        lableObj.text = changeTypeConversion(data[j].changeType);
                        obj.label = lableObj;
                        links.push(obj);
                        obj = {};
                        lableObj = {
                            // show: true
                        };
                    }
                    break;
                }
            }
        }

        var myChart = echarts.init(document.getElementById('main'));

        var option = {
            title: {
                text: ''
            },
            tooltip: {},
            animationDurationUpdate: 1500,
            series: [{
                type: 'graph',
                layout: 'none',
                symbol: `image://${circle}`,
                // symbol: 'circle',
                symbolSize: 50,
                focusNodeAdjacency: true,
                yAxis: {
                    type: 'category',
                    data: ['100', '300', '500', '700'],
                    show: true,
                },
                tooltip: {
                    // position: [200, 20],
                    trigger: 'item', //是否节点触发  
                    padding: 5,
                    formatter: function (params, ticket, callback) {
                        if (params.dataType == 'node') {
                            return '<div><p>区划代码:' + params.data.zoningCode + '</p>' +
                                '<p>区划名称:' + params.data.zoningName + '</p>' +
                                '<p>变更时期:' + params.data.periodStart + '</p></div>'
                        }

                        if (params.dataType == 'edge') {
                            return params.data.label.text ? '<div><p>' + params.data.label.text + '</p></div>' : '变更';
                        }
                    }
                },
                markPoint: {
                    label: {
                        show: true,
                        position: ['50%', '50%'],
                        backgroundColor: '#000',
                    }
                },
                dataZoom: [{ // 这个dataZoom组件，默认控制x轴。
                    type: 'graph', // 这个 dataZoom 组件是 graph 型 dataZoom 组件
                    start: 10, // 左边在 10% 的位置。
                    end: 60 // 右边在 60% 的位置。
                }],
                edgeSymbol: ['circle', 'arrow'],
                edgeSymbolSize: [4, 10],
                edgeLabel: {
                    // normal: {
                    // 	textStyle: {
                    // 		fontSize: 20
                    // 	}
                    // }
                },
                data: data,
                links: links,

                lineStyle: {
                    normal: {
                        opacity: 0.9,
                        width: 2,
                    }
                }
            }]
        };

        myChart.setOption(option);

        myChart.on('click', (params) => {
            var currentIndex; //  点击当前节点的下标
            var originalIndex;  //  追溯到的原区划的节点下标
            var obj = {};
            var historyData = [];
            var maxV = Math.max.apply(null, versionArr);  //  追溯到的最早版本号，以此来判断是不是最后一层的点
            currentIndex = params.dataIndex;
            if (params.data.version == maxV) {
                obj.currentCode = data[currentIndex].zoningCode;
                obj.currentName = data[currentIndex].zoningName;
                obj.changeType = changeTypeConversion(data[currentIndex].changeType) || "变更";
                obj.periodStart = data[currentIndex].periodStart;
                historyData.push(obj);
                obj = {};
            }
            else {
                for (var i = 0; i < links.length; i++) {
                    for (var k in links[i]) {
                        if (k == 'target' && links[i][k] == params.dataIndex) {
                            originalIndex = links[i].source;
                            obj.currentCode = data[currentIndex].zoningCode;
                            obj.currentName = data[currentIndex].zoningName;
                            obj.changeType = changeTypeConversion(data[currentIndex].changeType) || "变更";
                            obj.periodStart = data[currentIndex].periodStart;
                            obj.originalCode = data[originalIndex].zoningCode;
                            obj.originalName = data[originalIndex].zoningName;
                            console.log(obj);
                            historyData.push(obj);
                            obj = {};
                        }
                    }
                }
            }

            this.setState({
                historyData: historyData
            })

            console.log(historyData, this.state.historyData);
        })
    }

    /**
     * 历史轨迹数据获取接口
     * @param {string} zoningCode 区划代码
     * @param {string} timeInterval 时间间隔(所选时间到最近一次发布)   6位数
     */
    async axiosHistoryDate(params) {
        let res = await getHistoryDate(params);
        if (res.rtnCode == "000000") {
            this.setState({
                rawData: res.responseData
            })

            this.handleDrawCanvas(res.responseData)
        } else {
            openNotificationWithIcon("error", "暂时没有历史数据可追溯!")
        }
    }

    render() {
        const columns = [{
            title: '原区划代码',
            dataIndex: 'originalCode',
            key: 'originalCode',
            width: 150
        }, {
            title: '原区划名称',
            dataIndex: 'originalName',
            key: 'originalName',
            width: 150
        }, {
            title: '变更类型',
            dataIndex: 'changeType',
            key: 'changeType',
            width: 150
        }, {
            title: '目标区划代码',
            dataIndex: 'currentCode',
            key: 'currentCode',
            width: 150
        }, {
            title: '目标区划名称',
            dataIndex: 'currentName',
            key: 'currentName',
            width: 150
        }, {
            title: '变更时间',
            dataIndex: 'periodStart',
            key: 'periodStart',
            width: 150
        }];

        return (
            <div className="outer-box">
                <div className="historicalTrace">
                    {/* <FreeScrollBar autohide="true"> */}
                        <div className="historicalTrace-container">
                            <div className="historicalTrace-container-top">
                                <Row>
                                    <Col span={4}>
                                        <Row>
                                            <Col span={8}><span className="info-span">区划代码</span></Col>
                                            <Col span={16}>
                                                <Input size="large" value={this.state.queryZoningCode}
                                                    onChange={this.handleChangeValue.bind(this)}></Input>
                                            </Col>
                                        </Row>
                                    </Col>

                                    <Col span={4} offset={1}>
                                        <Row>
                                            <Col span={8}><span className="info-span">时间选择</span></Col>
                                            <Col span={16}>
                                                <MonthPicker size="large" defaultValue="2000-01"
                                                    onChange={this.handleChangeValueTime.bind(this)} />
                                            </Col>
                                        </Row>
                                    </Col>

                                    <Col span={4} offset={1}>
                                        <Button type="primary" size="large" onClick={this.handleAxiosHistoryDate.bind(this)}>查询</Button>
                                    </Col>
                                </Row>
                            </div>

                            <div className="historicalTrace-container-center">
                                <div id="main" style={{ width: "100%", height: 400 }}></div>
                            </div>

                            <div className="historicalTrace-container-bottom">
                                <Table dataSource={this.state.historyData} columns={columns}></Table>
                            </div>
                        </div>

                    {/* </FreeScrollBar> */}
                </div>
            </div>
        )
    }
}

export default HistoricalTrace;