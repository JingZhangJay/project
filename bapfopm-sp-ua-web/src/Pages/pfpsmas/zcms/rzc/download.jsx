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

import { formatDateToStr } from "../../../../asset/pfpsmas/zcms/js/common";
import {
  getQueryReleaseFormalCode,
  getDownloadFormalRelease
} from "../../../../Service/pfpsmas/zcms/server";

class Download extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      zoningName: sessionStorage.getItem("zoningName"), //  行政区划名称
      levelCode: sessionStorage.getItem("levelCode"), //  级次代码

      dispalyRelease: [], //  发布区划展示存放位置

      startValue: null, //  时间选择器起始时间
      endValue: null, //  时间选择器结束时间
      endOpen: false, //  结束日期时间选择器显隐

      exportDate: "", //  导入时间起
      deadline: "", //  导入时间止
      pageNum: 1, //  当前页码
      pageSize: 5 //  每页显示条数
    };
  }

  handleAxiosQueryReleaseFormalCode() {
    let { exportDate, deadline, pageNum, pageSize } = this.state;
    let postData = {};
    postData.exportDate = exportDate;
    postData.deadline = deadline;
    postData.pageSize = pageSize;
    postData.pageNum = pageNum;

    this.axiosQueryReleaseFormalCode(postData);
  }

  confirm(record) {
    let filePath = record.filePath;
    console.log(filePath);
    getDownloadFormalRelease(filePath);
  }

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

  initPage() {
    let { exportDate, deadline, pageNum, pageSize } = this.state;
    let postData = {};
    postData.exportDate = exportDate;
    postData.deadline = deadline;
    postData.pageSize = pageSize;
    postData.pageNum = pageNum;
    this.axiosQueryReleaseFormalCode(postData);
  }

  componentWillMount() {
    this.initPage();
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
            title="确定下载该文件?"
            onConfirm={this.confirm.bind(this, record)}
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

    const data = [];

    return (
      <div className="outer-box">
        <div className="download inner-box">
          <FreeScrollBar autohide="true">
            <Navbar data={navbar} />

            {/* 时间选择器 */}
            <div className="button-group container-box" style={{ marginTop: "15px" }}>
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

            {/* 功能按钮组 */}
            {/* <div className="button-group">
                    <Button type="primary" size="large" onClick={this.handleAxiosQueryReleaseFormalCode.bind(this)}>查询</Button>

                    <Button type="primary" size="large" onClick={this.handleReset.bind(this)} style={{marginLeft: 30}}>重置</Button>
                </div> */}

            {/* 区划文件展示列表 */}
            <div className="container-box margin-top-15">
              <div className="container-title">
                <span>查询信息</span>
              </div>

              <div className="container-centent">
                <Table
                  columns={columns}
                  dataSource={this.state.dispalyRelease}
                  pagination={{ pageSize: this.state.pageSize }}
                />
              </div>
            </div>
          </FreeScrollBar>
        </div>
      </div>
    );
  }
}

export default Download;
