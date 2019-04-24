import React from "react";

//  自定义滚动条

// 引入 ECharts 主模块
import echarts from "echarts/lib/echarts";
// 引入关系图
import "echarts/lib/chart/bar";
// 引入提示框和标题组件
import "echarts/lib/component/tooltip";
import "echarts/lib/component/legend";
import "echarts/lib/component/title";

class Bar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dispalyData: []
    };
    this.setPieOption = this.setPieOption.bind(this);
    this.initPieChart = this.initPieChart.bind(this);
  }

  initPieChart() {
    const { data } = this.props;

    let myChart = echarts.init(this.refs.pieChart);
    let options = this.setPieOption(data);
    myChart.setOption(options);
  }

  setPieOption(data) {
    return {
      title: {
        left: "center"
      },
      backgroundColor: "rgba(0,0,0,0.1)",
      xAxis: {
        type: "category",
        splitLine: {
          show: true,
          lineStyle: {
            color: '#387392'
          }
        },
        axisLabel: {
          show: true,
          textStyle: {
            color: "#fff"
          }
        },
        axisLine: {
          lineStyle: {
            color: "#387392",
          }
        },
      },
      yAxis: {
        type: "value",
        splitLine: {  //决定是否显示坐标中网格
          show: true,
          lineStyle: {
            color: '#387392'
          }
        },
        axisLabel: {
          show: true,
          textStyle: {
            color: "#fff"
          },
        },
        axisLine: {
          lineStyle: {
            color: "#387392",
          }
        },
      },
      axisLine: {
        lineStyle: {
          color: "#387392"
        }
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true
      },
      label: {
        color: "#fff"
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      series: [
        {
          data: data,
          type: "bar",
          itemStyle: {
            normal: {
              color: '#EBFF46'
            }
          },
        }
      ]
    };
  }

  componentDidMount() {
    this.initPieChart();
  }

  componentDidUpdate() {
    this.initPieChart();
  }

  render() {
    return (
      <div className="pie-react">
        <div ref="pieChart" style={{ width: "100%", minHeight: 250 }} />
      </div>
    );
  }
}

export default Bar;
