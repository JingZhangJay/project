import React from 'react';
import { hashHistory, Link } from "react-router";

import blue from "../../../../asset/pfpsmas/zcms/img/blue.png";
import black from "../../../../asset/pfpsmas/zcms/img/black.png"
import gray from "../../../../asset/pfpsmas/zcms/img/gray.png"

import "./timedTask"

import {Navbar, Hr } from "../../../../Components/index";
import { Table, Button, Modal, DatePicker } from 'antd';

import {getSettingTheCronExpression} from "../../../../Service/pfpsmas/zcms/server";
import {openNotificationWithIcon} from "../../../../asset/pfpsmas/zcms/js/common";

class TimedTask extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isDisabled: true,   //  定时发布按钮是否禁用

            zoningName: sessionStorage.getItem("zoningName"),   //  行政区划名称
            levelCode: sessionStorage.getItem("levelCode"), //  级次代码

            //  定时发布任务参数
            day: "",
            hour: "",
            minute: "",
            second: "",
        }
    }

    handleAxiosSettingTheCronExpression(){
        let {day, hour, minute, second} = this.state;
        let postData = {};
        postData.day = day;
        postData.hour = hour;
        postData.minute = minute;
        postData.second = second;

        this.axiosSettingTheCronExpression(postData);
    }

    /**
     * 设置定时任务
     * @param {String} day  天
     * @param {String} hour 时
     * @param {String} minute   分
     * @param {String} second   秒
     */
    async axiosSettingTheCronExpression(params){
        let res = await getSettingTheCronExpression(params);
        console.log(res);
        if(res.rtnCode == "000000"){
            openNotificationWithIcon("success", res.rtnMessage);
        }
    }

    //控制时间选择器
    selectDate(value, dateString) {
        if (dateString) {
            this.setState({ isDisabled: false })
        } else {
            this.setState({ isDisabled: true })
        }

        let day,hour,minute,second;
        let dateArr = dateString.split(" ");
        let time = dateArr[1].split(":");

        day = dateArr[0];
        hour = time[0];
        minute = time[1];
        second = time[2];

        this.setState({
            day: day,
            hour: hour,
            minute: minute,
            second: second
        })
    }

    render() {
        //表格中数据
        const changeControl = [{
            a: "20180327 09:00:00",
            b: "30",
            c: "分",
            d: "成功结束",
            e: "20180327 17:30:00",
            f: "20180327 16:00:00",
            g: "20180327 19:33:24"
        },
        {
            a: "20180425 09:00:00",
            b: "30",
            c: "分",
            d: "成功结束",
            e: "20180425 17:30:00",
            f: "20180425 16:00:00",
            g: "20180425 16:14:01"
        },
        {
            a: "20180526 09:00:00",
            b: "30",
            c: "分",
            d: "成功结束",
            e: "20180526 17:30:00",
            f: "20180526 16:00:00",
            g: "20180526 18:25:42"
        }]

        const columns = [{
            title: '启动时间',
            dataIndex: 'a',
            key: 'a',
        }, {
            title: '启动频度',
            dataIndex: 'b',
            key: 'b',
        }, {
            title: '时间单位',
            dataIndex: 'c',
            key: 'c',
        }, {
            title: '处理状态',
            dataIndex: 'd',
            key: 'd',
        }, {
            title: '上次执行时间',
            dataIndex: 'e',
            key: 'e',
        }, {
            title: '下次执行时间',
            dataIndex: 'f',
            key: 'f',
        }, {
            title: '终止时间',
            dataIndex: 'g',
            key: 'g',
        }];

        const navbar = [{
            name: "定时发布区划",
            routerPath: "/about/pfpsmas/zcms/timedTask",
            imgPath: blue
        }]

        return (
            <div className="a">
                <Navbar data={navbar}></Navbar>

                {/* 功能按钮组 */}
                <div className="container-box margin-top-15">

                    <span className='time-title'>选择自动发布时间: </span>

                    <DatePicker 
                        size="large" 
                        showTime="true"
                        format="dd HH:mm:ss" 
                        onChange={this.selectDate.bind(this)} />

                    <Button className='fabu-btn' type="primary" size="large" disabled={this.state.isDisabled} onClick={this.handleAxiosSettingTheCronExpression.bind(this)}>定时发布</Button>
                </div>

                {/* 定时任务展示列表 */}
                <div className="container-box margin-top-15">
                    <div className="container-title">
                        <span>定时任务展示列表</span>
                    </div>

                    <div className="container-centent">
                        <Table columns={columns} dataSource={changeControl} />
                    </div>
                </div>
            </div>
        )
    }
}

export default TimedTask;