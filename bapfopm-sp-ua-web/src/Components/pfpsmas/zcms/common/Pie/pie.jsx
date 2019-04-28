import React from 'react';

//  自定义滚动条

// 引入 ECharts 主模块

// import echarts from 'echarts';

import echarts from 'echarts/lib/echarts';
// 引入关系图
import 'echarts/lib/chart/pie';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';

class Pie extends React.Component {

    constructor(props) {
        super(props);
        this.setPieOption = this.setPieOption.bind(this)
        this.initPieChart = this.initPieChart.bind(this)
    }

    initPieChart() {
        const { data } = this.props;
        let myChart = echarts.init(this.refs.pieChart);
        let options = this.setPieOption(data);
        myChart.setOption(options);
    }

    setPieOption(data) {
        return {
            title:{
            //   text:"你好",
              left:"center"
            },
            legend: {
                orient: "vertical",
                textStyle: {
                    color: 'fff'
                },
                align: 'left',
                left: 10,
                top: 10
            },
            backgroundColor: "rgba(0,0,0,0.1)",
            tooltip: {
                trigger: 'item', //是否节点触发  
                padding: 5,
                formatter: function (params, ticket, callback) {
                    console.log(params);
                    return '<div><p>变更类型: ' + params.data.name + '</p>' +
                                '<p>变更数量: ' + params.data.value + '</p></div>'
                }
            },
            series : [
                {
                    name: '',
                    type: 'pie',
                    data: data,
                    label: {
                        normal: {
                            formatter: "{b} : {c} \n {d}%",
                        }
                    },
                    labelLine: {
                    },
                    // minAngle: 30,
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    },
                    color:['#2EC7C9','#EBFF30','#5AB1EF','#FE8463']
                    // roseType: "radius"
                }
            ]
        }
    }

    componentDidMount() {
        this.initPieChart()
    }

    componentDidUpdate() {
        this.initPieChart()
    }

    render() {
        return (
            <div className="pie-react">
                <div ref="pieChart" style={{width: "100%", minHeight: 250}}></div>
            </div>
        )
    }
}

export default Pie;