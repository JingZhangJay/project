import React from 'react';
import echarts from 'echarts';

import $ from "jquery";

import 'echarts/map/js/china';
import 'echarts/map/js/province/anhui';
import 'echarts/map/js/province/aomen';
import 'echarts/map/js/province/beijing';

import geoJson from 'echarts/map/js/china';
// import { provienceData, geoCoordMap } from "./data";

import { getBgmxRealTimeExcel, getBgmxRealTimeExcelSub } from "../../../../../Service/pfpsmas/zcms/server";

class GeoDemo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            formatterText:{},
        }
    }

    /**
     * 变更明细当月实时数据查询下级
     * @param {string} zoningCode 区划代码
     */
    async axiosBgmxRealTimeExcel(param){
        let res = await getBgmxRealTimeExcelSub(param);
        console.log(res);
    }

       /**
     * 变更明细当月实时数据
     * @param {string} zoningCode 区划代码
     */
    async axiosGetBgmxRealTimeExcel(param){
        let data = await getBgmxRealTimeExcel(param); 
        console.log('data ======>',data.responseData); 
        if(data.rtnCode == '000000'){
            let formatterText = "";
            let obj = data.responseData
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    if(key == "合计"){
                        formatterText = `<span style='color: #fff; font-size: 16px; padding: 5px 10px'>${key}&nbsp;:</span><span style='color: #fff; font-size: 16px; padding: 5px 10px'>${obj[key]}</span><br/>` + formatterText
                    }else{
                        formatterText += `<span style='color: #fff; font-size: 16px; padding: 5px 10px'>${key}&nbsp;:</span><span style='color: #fff; font-size: 16px; padding: 5px 10px'>${obj[key]}</span><br/>`
                    }
                }
            }

            this.setState({
                formatterText: formatterText
            })
        }
    }


    componentWillMount(){
        this.axiosBgmxRealTimeExcel({zoningCode: "000000000000000"})
    }

    componentDidMount() {
        this.initalECharts();
    }

    initalECharts() {

        var chinaGeoCoordMap = {
            '黑龙江': [127.9688, 45.368],
            '内蒙古': [110.3467, 41.4899],
            "吉林": [125.8154, 44.2584],
            '北京': [116.4551, 40.2539],
            "辽宁": [123.1238, 42.1216],
            "河北": [114.4995, 38.1006],
            "天津": [117.4219, 39.4189],
            "山西": [112.3352, 37.9413],
            "陕西": [109.1162, 34.2004],
            "甘肃": [103.5901, 36.3043],
            "宁夏": [106.3586, 38.1775],
            "青海": [101.4038, 36.8207],
            "新疆": [87.9236, 43.5883],
            "新疆兵团": [86.3733, 42.4532],
            "西藏": [91.11, 29.97],
            "四川": [103.9526, 30.7617],
            "重庆": [108.384366, 30.439702],
            "山东": [117.1582, 36.8701],
            "河南": [113.4668, 34.6234],
            "江苏": [118.8062, 31.9208],
            "安徽": [117.29, 32.0581],
            "湖北": [114.3896, 30.6628],
            "浙江": [119.5313, 29.8773],
            "福建": [119.4543, 25.9222],
            "江西": [116.0046, 28.6633],
            "湖南": [113.0823, 28.2568],
            "贵州": [106.6992, 26.7682],
            "云南": [102.9199, 25.4663],
            "广东": [113.12244, 23.009505],
            "广西": [108.479, 23.1152],
            "海南": [110.3893, 19.8516],
            '上海': [121.4648, 31.2891]
        };

        var chinaDatas = [
            [{
                name: '北京',
                value: 0,
                qhdm: '110000000000000'
            }],
            [{
                name: '黑龙江',
                value: 0,
                qhdm: '230000000000000'
            }],
            [{
                name: '内蒙古',
                value: 0,
                qhdm: '150000000000000'
            }],
            [{
                name: '吉林',
                value: 0,
                qhdm: '220000000000000'
            }],
            [{
                name: '辽宁',
                value: 0, 
                qhdm: '210000000000000'
            }],
            [{
                name: '河北',
                value: 0, 
                qhdm: '130000000000000'
            }],
            [{
                name: '天津',
                value: 0, 
                qhdm: '120000000000000'
            }],
            [{
                name: '山西',
                value: 0, 
                qhdm: '140000000000000'
            }],
            [{
                name: '陕西',
                value: 0, 
                qhdm: '610000000000000'
            }],
            [{
                name: '甘肃',
                value: 0, 
                qhdm: '600000000000000'
            }],
            [{
                name: '宁夏',
                value: 0, 
                qhdm: '640000000000000'
            }],
            [{
                name: '青海',
                value: 0, 
                qhdm: '630000000000000'
            }],
            [{
                name: '新疆',
                value: 0, 
                qhdm: '650000000000000'
            }],
            [{
                name: '新疆兵团',
                value: 0,
                qhdm: '660000000000000'
            }],
            [{
                name: '西藏',
                value: 0, 
                qhdm: '540000000000000' 
            }],
            [{
                name: '四川',
                value: 0, 
                qhdm: '510000000000000' 
            }],
            [{
                name: '重庆',
                value: 0, 
                qhdm: '500000000000000' 
            }],
            [{
                name: '山东',
                value: 0, 
                qhdm: '370000000000000' 
            }],
            [{
                name: '河南',
                value: 0, 
                qhdm: '410000000000000' 
            }],
            [{
                name: '江苏',
                value: 0, 
                qhdm: '320000000000000' 
            }],
            [{
                name: '安徽',
                value: 0, 
                qhdm: '340000000000000' 
            }],
            [{
                name: '湖北',
                value: 0, 
                qhdm: '420000000000000' 
            }],
            [{
                name: '浙江',
                value: 0, 
                qhdm: '330000000000000' 
            }],
            [{
                name: '福建',
                value: 0, 
                qhdm: '350000000000000' 
            }],
            [{
                name: '江西',
                value: 0, 
                qhdm: '360000000000000' 
            }],
            [{
                name: '湖南',
                value: 0, 
                qhdm: '430000000000000' 
            }],
            [{
                name: '贵州',
                value: 0, 
                qhdm: '520000000000000' 
            }],
            [{
                name: '广西',
                value: 0, 
                qhdm: '450000000000000' 
            }],
            [{
                name: '海南',
                value: 0, 
                qhdm: '460000000000000' 
            }],
            [{
                name: '上海',
                value: 0, 
                qhdm: '310000000000000' 
            }]
        ];

        var convertData = function (data) {
            var res = [];
            for (var i = 0; i < data.length; i++) {
                var dataItem = data[i];
                var fromCoord = chinaGeoCoordMap[dataItem[0].name];
                var toCoord = [116.4551, 40.2539];
                if (fromCoord && toCoord) {
                    res.push([{
                        coord: fromCoord,
                        value: dataItem[0].value,
                        qhdm: dataItem[0].qhdm,
                    }, {
                        coord: toCoord,
                    }]);
                }
            } 
            return res;
        };

        var series = [];

        [
            ['北京市', chinaDatas]
        ].forEach(function (item, i) { 
            series.push({
                type: 'effectScatter',
                coordinateSystem: 'geo',
                zlevel: 2,
                rippleEffect: { //涟漪特效
                    period: 4, //动画时间，值越小速度越快
                    brushType: 'stroke', //波纹绘制方式 stroke, fill
                    scale: 4 //波纹圆环最大限制，值越大波纹越大
                },
                label: {
                    normal: {
                        show: true,
                        position: 'right', //显示位置
                        offset: [5, 0], //偏移设置
                        formatter: function (params) { //圆环显示文字 
                            return params.data.name;
                        },
                        fontSize: 13
                    },
                    emphasis: {
                        show: true
                    }
                },
                symbol: 'circle',
                symbolSize: function (val) {
                    return 10 + val[2] * 10; //圆环大小
                },
                itemStyle: {
                    normal: {
                        show: false,
                        color: '#f00'
                    }
                },
                data: item[1].map(function (dataItem) {
                    return {
                        name: dataItem[0].name,
                        value: chinaGeoCoordMap[dataItem[0].name].concat([dataItem[0].value]),
                        qhdm:  dataItem[0].qhdm
                    };
                }),
            });
        });
 
        //  注册地图
        echarts.registerMap('zhongguo', geoJson);

        const myChart = echarts.init(document.getElementById('mainMap'));

        myChart.setOption({
            title: {
                text: '本\n月\n区\n划\n变\n更\n情\n况',
                textStyle: {
                    width: "20px",
                    height: '100%',
                    fontSize: 18,
                    color: '#fff',
                },
                textAlign: "auto",
                textVerticalAlign: "middle"
            },
            tooltip: { 
                trigger: 'item',
                backgroundColor: 'rgba(166, 200, 76, 0.82)',
                borderColor: '#FFFFCC',
                showDelay: 0,
                hideDelay: 0,
                enterable: true,
                transitionDuration: 0,
                extraCssText: 'z-index:100',
                formatter: (params) =>{ 
                    console.log('params',params)

                    let paramsData = {
                        zoningCode:params.data.qhdm
                    } 
                    this.axiosGetBgmxRealTimeExcel(paramsData)

                    let obj =  this.state.formatterText;

                    // let str = "";
                    // for (const key in obj) {
                    //     if (obj.hasOwnProperty(key)) {
                    //         if(key == "合计"){
                    //             str = `<span style='color: #fff; font-size: 16px; padding: 5px 10px'>${key}&nbsp;:</span><span style='color: #fff; font-size: 16px; padding: 5px 10px'>${obj[key]}</span><br/>` + str
                    //         }else{
                    //             str += `<span style='color: #fff; font-size: 16px; padding: 5px 10px'>${key}&nbsp;:</span><span style='color: #fff; font-size: 16px; padding: 5px 10px'>${obj[key]}</span><br/>`
                    //         }
                    //     }
                    // }
				    return obj;  
                } 
            },
            backgroundColor: "#013954",
            visualMap: { //图例值控制
                min: 0,
                max: 1,
                calculable: true,
                show: false,
                color: ['#f44336', '#fc9700', '#ffde00', '#ffde00', '#00eaff'],
                textStyle: {
                    color: '#fff'
                }
            },
            geo: {
                map: 'china',
                zoom: 1.2,
                label: {
                    emphasis: {
                        show: false
                    }
                },
                roam: true, //是否允许缩放
                itemStyle: {
                    normal: {
                        color: 'rgba(51, 69, 89, .5)', //地图背景色
                        borderColor: '#516a89', //省市边界线00fcff 516a89
                        borderWidth: 1
                    },
                    emphasis: {
                        color: 'rgba(37, 43, 61, .5)' //悬浮背景
                    }
                }
            },
            series: series
        })
 
    }
    render() {
        return (
            <div className="Geo">
                <div id="mainMap" style={{ width: '100%', height: '500px' }}></div>
            </div>
        );
    }
}

export default GeoDemo;
