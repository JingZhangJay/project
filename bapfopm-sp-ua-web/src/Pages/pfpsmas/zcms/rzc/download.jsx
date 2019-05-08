import React from "react";
import { hashHistory, Link } from "react-router";

import blue from "../../../../asset/pfpsmas/zcms/img/blue.png";
import black from "../../../../asset/pfpsmas/zcms/img/black.png";
import gray from "../../../../asset/pfpsmas/zcms/img/gray.png";

import "./download.css";

//  自定义滚动条
import FreeScrollBar from "react-free-scrollbar";

import { Table, Button, Modal, DatePicker, Row, Col, Popconfirm } from "antd";
import { Navbar, Hr } from "../../../../Components/index";

import { formatDateToStr, openNotificationWithIcon } from "../../../../asset/pfpsmas/zcms/js/common";
import {
  getQueryReleaseFormalCode,
  getDownloadFormalRelease,
  getFindVersionRecord,
  getRecordVersion
} from "../../../../Service/pfpsmas/zcms/server";

class Download extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      zoningCode: sessionStorage.getItem("zoningCode"),  //  行政区划代码
      zoningName: sessionStorage.getItem("zoningName"), //  行政区划名称
      levelCode: sessionStorage.getItem("levelCode"), //  级次代码

      dispalyRelease: [], //  发布区划展示存放位置

      startValue: null, //  时间选择器起始时间
      endValue: null, //  时间选择器结束时间
      endOpen: false, //  结束日期时间选择器显隐

      exportDate: "", //  导入时间起
      deadline: "", //  导入时间止
      pageNum: 1, //  当前页码
      pageSize: 5, //  每页显示条数

      displayVersion: [],
      displayToggle: true
    };
  }

  /**
   * 查看区划发布信息 || 按照时间查询
   */
  handleAxiosQueryReleaseFormalCode() {
    let { exportDate, deadline, pageNum, pageSize } = this.state;
    let postData = {};
    postData.exportDate = exportDate;
    postData.deadline = deadline;
    postData.pageSize = pageSize;
    postData.pageNum = pageNum;

    this.axiosQueryReleaseFormalCode(postData);
  }

  /**
   * 区划文件下载确认替换版本
   */
  confirm(record) {
    let {zoningCode, displayVersion} = this.state;
    let postData = {};
    let filePath = record.filePath;
    postData.dmxzqh = zoningCode;
    postData.scbbrq = displayVersion[0].bbfbrq;
    postData.bbfbrq = record.exportDate.split(" ")[0];
    console.log(record);

    this.axiosRecordVersion(postData);
    getDownloadFormalRelease(filePath);
  }

  /**
   * 
   */
  cancel(record){
    let filePath = record.filePath;
    getDownloadFormalRelease(filePath);

  }

  /**
   * 重置
   */
  handleReset() {
    this.setState(
      {
        startValue: null, //  时间选择器起始时间
        endValue: null, //  时间选择器结束时间
        endOpen: false, //  结束日期时间选择器显隐

        exportDate: "", //  导入时间起
        deadline: "", //  导入时间止
        pageNum: 1, //  当前页码
        pageSize: 5 //  每页显示条数
      },
      () => {
        this.initPage();
      }
    );
  }

  /**
   * 区划文件展示显隐
   */
  handleDisplayShowOrHide() {
    let { displayToggle } = this.state;
    this.setState({
      displayToggle: !displayToggle
    })
  }

  /**
   * 页面初始化
   */
  initPage() {
    let { exportDate, deadline, pageNum, pageSize } = this.state;
    let postData = {};
    postData.exportDate = exportDate;
    postData.deadline = deadline;
    postData.pageSize = pageSize;
    postData.pageNum = pageNum;
    this.axiosQueryReleaseFormalCode(postData);
  }

  //以下都是时间选择器方法
  disabledStartDate(startValue) {
    if (!startValue || !this.state.endValue) {
      return false;
    }
    return startValue.getTime() >= this.state.endValue.getTime();
  }
  disabledEndDate(endValue) {
    if (!endValue || !this.state.startValue) {
      return false;
    }
    return endValue.getTime() <= this.state.startValue.getTime();
  }

  onChange(field, value) {
    this.setState({
      [field]: value
    });
  }

  onStartChange(value) {
    this.onChange("startValue", value);
    let exportDate;

    if (value) {
      exportDate = formatDateToStr(value);
    }

    this.setState({
      exportDate: exportDate
    });
  }

  onEndChange(value) {
    this.onChange("endValue", value);
    let deadline;

    if (value) {
      deadline = formatDateToStr(value);
    }

    this.setState({
      deadline: deadline
    });
  }

  handleStartToggle({ open }) {
    if (!open) {
      this.setState({ endOpen: true });
    }
  }

  handleEndToggle({ open }) {
    this.setState({ endOpen: open });
  }

  /**
   * 查看区划发布信息 || 按照时间查询
   * @param {string} exportDate 导入时间起
   * @param {string} deadline 导入时间止
   * @param {number} pageNum 当前页码
   * @param {number} pageSize 每页显示条数
   */
  async axiosQueryReleaseFormalCode(params) {
    let res = await getQueryReleaseFormalCode(params);
    if (res.rtnCode == "000000") {
      this.setState({
        dispalyRelease: res.responseData.dataList
      });
    }
  }

  /**
   * 查询版本记录
   * @param {string} zoningCode 区划代码
   */
  async axiosFindVersionRecord(params) {
    let { zoningCode } = this.state;
    let res = await getFindVersionRecord(params);
    console.log(res);
    if (res.rtnCode == "000000") {
      let data = res.responseData;
      this.setState({
        displayVersion: data,
      }, () => {
        console.log("========>", this.state.displayVersion[0])
      })
    } else {
      openNotificationWithIcon("error", res.rtnMessage);
    }
  }

  /**
   * 提交版本记录
   * @param {string} dmxzqh 行政区划代码
   * @param {string} bbfbrq 版本发布日期
   * @param {string} scbbrq 上次发布日期
   * 
   */
  async axiosRecordVersion(params) {
    let res = await getRecordVersion(params);
    console.log(res);
    if (res.rtnCode == "000000") {
      let { zoningCode } = this.state;
      let postData = {};
      postData.zoningCode = zoningCode;
      openNotificationWithIcon("success", res.rtnMessage);
      this.axiosFindVersionRecord(postData);
    } else {
      openNotificationWithIcon("error", res.rtnMessage);
    }
  }

  componentWillMount() {
    let { zoningCode } = this.state;
    let postData = {};
    postData.zoningCode = zoningCode;
    this.axiosFindVersionRecord(postData);
    this.initPage();
  }

  render() {
    const columns = [
      {
        title: "文件名称",
        dataIndex: "fileName",
        key: "fileName",
        width: 150
      },
      {
        title: "文件大小(KB)",
        dataIndex: "fileSize",
        key: "fileSize",
        width: 100
      },
      {
        title: "发布日期",
        dataIndex: "exportDate",
        key: "exportDate",
        width: 100
      },
      {
        title: "操作",
        key: "operation",
        width: 50,
        render: (text, record) => (
          <Popconfirm
            title="是否记录当前下载区划版本为使用版本?"
            onConfirm={this.confirm.bind(this, record)}
            onCancel={this.cancel.bind(this, record)}
            okText="记录"
            cancelText="不记录"
          >
            <Button type="primary" size="small">
              下载
            </Button>
          </Popconfirm>
        )
      }
    ];

    const navbar = [
      {
        name: "区划下载",
        routerPath: "/about/pfpsmas/zcms/download",
        imgPath: blue
      },
      {
        name: "省级版本记录",
        routerPath: "/about/pfpsmas/zcms/provincialVersionControl",
        imgPath: black
      }
    ];

    const versionDom = this.state.displayVersion.length == 1 ?
      <Row>
        <Col span={8}>
          <Row>
            <Col span={6} offset={2}>
              <span className="font-color-fff font-size-16">上次使用版本: </span>
            </Col>
            <Col span={7} offset={1}>
              <span className="font-color-fff font-size-16">
                {this.state.displayVersion[0].scbbrq}
              </span>
            </Col>
          </Row>
        </Col>

        <Col span={8}>
          <Row>
            <Col span={6} offset={2}>
              <span className="font-color-fff font-size-16">当前使用版本: </span>
            </Col>
            <Col span={7} offset={1}>
              <span className="font-color-fff font-size-16">
                {this.state.displayVersion[0].bbfbrq}
              </span>
            </Col>
          </Row>
        </Col>
      </Row> : "";

    return (
      <div className="outer-box">
        <div className="download inner-box">
          <FreeScrollBar autohide="true">
            <Navbar data={navbar} />

            <div className="container">
              <div className="container-box  margin-top-15">
                <div className="container-title">
                  <span>区划版本使用情况</span>
                </div>

                <div className="container-content">
                  {versionDom}
                </div>
              </div>

              {/* 时间选择器 */}
              <div
                className="container-box margin-top-15"
              >
                <Row>
                  <Col span={7} offset={1}>
                    <span className="time-title">起始时间: </span>
                    <DatePicker
                      disabledDate={this.disabledStartDate.bind(this)}
                      value={this.state.startValue}
                      defaultValue={this.state.startValue}
                      placeholder="开始日期"
                      onChange={this.onStartChange.bind(this)}
                      toggleOpen={this.handleStartToggle.bind(this)}
                      size="large"
                    />
                  </Col>
                  <Col span={7}>
                    <span className="time-title">终止时间: </span>
                    <DatePicker
                      disabledDate={this.disabledEndDate.bind(this)}
                      value={this.state.endValue}
                      defaultValue={this.state.endValue}
                      placeholder="结束日期"
                      onChange={this.onEndChange.bind(this)}
                      open={this.state.endOpen}
                      toggleOpen={this.handleEndToggle.bind(this)}
                      size="large"
                    />
                  </Col>

                  <Col span={2}>
                    <Button
                      type="primary"
                      size="large"
                      onClick={this.handleAxiosQueryReleaseFormalCode.bind(this)}
                    >
                      查询
                  </Button>
                  </Col>

                  <Col span={2}>
                    <Button
                      type="primary"
                      size="large"
                      onClick={this.handleReset.bind(this)}
                    >
                      重置
                  </Button>
                  </Col>
                </Row>
              </div>

              {/* 区划文件展示列表 */}
              <div className="container-box margin-top-15">
                <div className="container-title" onClick={this.handleDisplayShowOrHide.bind(this)}>
                  <span>查询信息</span>
                  <p className={`downAndUp ${this.state.displayToggle ? 'rotate' : ''}`} onClick={this.handleDisplayShowOrHide.bind(this)}></p>
                </div>

                <div className={`container-content ${this.state.displayToggle ? 'content-hide' : ''}`}>
                  <Table
                    columns={columns}
                    dataSource={this.state.dispalyRelease}
                    pagination={{ pageSize: this.state.pageSize }}
                  />
                </div>
              </div>

            </div>
          </FreeScrollBar>
        </div>
      </div>
    );
  }
}

export default Download;
