import React from 'react';
import { hashHistory, Link } from "react-router";
import qs from 'qs'

import './importCivilzoningCode.css';

//  自定义滚动条
import FreeScrollBar from "react-free-scrollbar";

import { Table, Button, Select, Upload, Icon, Popconfirm } from 'antd';
import { openNotificationWithIcon } from "../../../../asset/pfpsmas/zcms/js/common";
import { getSelectCivilAffairZip, getZipFlie, getDeleteCAZCodeByzipXh, getImportDate } from "../../../../Service/pfpsmas/zcms/server";

class ImportCivilzoningCode extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fileList: [],

            updateRequestToggle: false, //  添加申请单确认框显隐开关

            zoningName: '',   //  行政区划名称
            fileName: '',   //上传文件名称
            formId: '', // ID
            file: "",   //  上传文件

            loading: false, //  加载状态

            pageSize: 5,    //  每页条数
            pageIndex: 1,   //  当前页码
            totalRecord: "",    //  数据总量
        }
    }

    onSelectChange(selectedRowKeys, selectedRows) {
        // console.log(selectedRowKeys, selectedRows);
    }

    update(e) {
        console.log(e.target.files[0])
        this.setState({
            file: e.target.files[0],
            fileName: e.target.files[0].name,
        });
    }

    onChange(e) {
        this.setState({
            file: e.target.files[0] || "",
            fileName: e.target.files[0].name || "",
        });
    }

    // 重置
    handleReset() {
        this.setState({
            fileName: "",
            file: ""
        })
    }

    /**
     * 文件上传接口
     * @param {string} formId 上传文件id
     */
    handleAxioszipFlie() {
        let { fileName, file } = this.state;
        let param = new FormData();
        param.append("name", fileName);
        param.append("file", file);

        console.log(param)

        this.axiosZipFlie(param);
    }

    /**
     * 删除民政区划文件
     */
    handleAxiosDeleteCAZCodeByzipXh(text, record) {
        console.log(text, record);
        let postData = {};
        postData.zipXh = text.zipXh;
        if (text.status == "10" || text.status == "21") {
            this.axiosDeleteCAZCodeByzipXh(postData);
        } else {
            openNotificationWithIcon("warning", "该文件不能被删除!")
        }
    }

    /**
     * 文件导入接口
     * @param {number} zipXh  文件序号
     * @param {string} filePath  文件路径
     */
    handleAxiosImportDate(text, record) {
        let postData = {};
        postData.zipXh = text.zipXh;
        postData.filePath = text.filePath;
        this.setState({
            loading: true
        })
        this.axiosImportDate(postData);
    }

    /**
     * 文件上传接口
     * @param {string} formId 上传文件id
     */
    async axiosZipFlie(params) {
        let res = await getZipFlie(params);
        if (res.rtnCode == '000000') {
            openNotificationWithIcon("success", res.rtnMessage);
            let postData = {};
            let { pageSize, pageIndex } = this.state;
            postData.pageSize = pageSize;
            postData.pageIndex = pageIndex;
            this.axiosSelectCivilAffairZip(postData);
        } else {
            openNotificationWithIcon("error", res.rtnMessage);
        }
    }

    /**
     * 导入民政区划 上传文件查询接口
     * @param pageSize — 每页显示条数
     * @param pageIndex — 当前页码
     */
    async axiosSelectCivilAffairZip(params) {
        let res = await getSelectCivilAffairZip(params);
        if (res.rtnCode == "000000") {
            this.setState({
                fileList: res.responseData.dataList,
                totalRecord: res.responseData.totalRecord
            })
        } else {
            openNotificationWithIcon("error", res.rtnMessage);
        }
    }

    /**
     * 删除民政区划文件
     * @param {number} zipXh 文件序号
     */
    async axiosDeleteCAZCodeByzipXh(param) {
        let res = await getDeleteCAZCodeByzipXh(param);
        if (res.rtnCode == "000000") {
            openNotificationWithIcon("success", res.rtnMessage);
            let postData = {};
            let { pageSize, pageIndex } = this.state;
            postData.pageSize = pageSize;
            postData.pageIndex = pageIndex;
            this.axiosSelectCivilAffairZip(postData);
        } else {
            openNotificationWithIcon("error", res.rtnMessage);
        }
    }

    /**
     * 文件导入接口
     * @param {number} zipXh  文件序号
     * @param {string} filePath  文件路径
     */
    async axiosImportDate(param) {
        let res = await getImportDate(param);
        if (res.rtnCode == "000000") {
            openNotificationWithIcon("success", resrtnMessage);
        } else {
            openNotificationWithIcon("error", res.rtnMessage);
        }
        this.setState({
            loading: false
        })
    }

    // 初始页面 展示列表
    componentWillMount() {
        let postData = {};
        let { pageSize, pageIndex } = this.state;
        postData.pageSize = pageSize;
        postData.pageIndex = pageIndex;

        this.axiosSelectCivilAffairZip(postData);
    }

    render() {
        const columns = [
            {
                title: '文件名',
                dataIndex: 'fileName',
                key: 'fileName',
                width: "1"
            }, {
                title: '文件状态',
                dataIndex: 'comment',
                key: 'comment',
                width: "1"
            }, {
                title: '备注',
                dataIndex: 'comment',
                key: 'comment',
                width: "1"
            }, {
                title: '上传时间',
                dataIndex: 'enterTime',
                key: 'enterTime',
                width: "1"
            }, {
                title: '操作',
                key: 'operation',
                width: 1,
                render: (text, record) => (
                    <span>
                        <Popconfirm placement="top" title="确定要删除这个文件吗?" onConfirm={this.handleAxiosDeleteCAZCodeByzipXh.bind(this, record)}>
                            <Button type="primary" size="small" disabled={(record.status != "10")}>删除</Button>
                        </Popconfirm>
                        <span className="ant-divider"></span>
                        <Popconfirm placement="top" title="确定要导入这个文件吗?" onConfirm={this.handleAxiosImportDate.bind(this, record)}>
                            <Button type="primary" size="small" disabled={(record.status != "10")}>导入</Button>
                        </Popconfirm>
                    </span>
                ),
            }];

        const pagination = {
            _this: this,
            total: this.state.totalRecord,
            pageSize: this.state.pageSize,
            onChange(current) {
                let postData = {};
                postData.pageSize = this._this.state.pageSize;
                postData.pageIndex = current;
                this._this.axiosSelectCivilAffairZip(postData)
                console.log('Current: ', current, this._this);
            },
        };

        return (
            <div className="outer-box">
                <div className="ImportCivilzoningCode inner-box">
                    <FreeScrollBar autohide="true">
                        <div className="upload-quhua">
                            <span>上传文件</span>
                            <input type="text" className='filename' onChange={this.onChange.bind(this)} value={this.state.fileName} />
                            <input type="file" className="upload-file" id="upload_file" name="file" onChange={this.update.bind(this)} />
                            <input type="button" className="button-up" value="浏览" />
                        </div>

                        {/* 功能按钮组 */}
                        <div className="button-group  button-group-quhua">
                            <Button type="primary" size="large" onClick={this.handleAxioszipFlie.bind(this)}>上传</Button>

                            <Button type="primary" size="large" className="margin-left-20" onClick={this.handleReset.bind(this)}>重置</Button>
                        </div>

                        <div className="container-box" style={{ marginTop: 50 }}>
                            <div className="container-title">
                                <span>导入结果展示</span>
                            </div>

                            <div className="container-centent">
                                <Table columns={columns} dataSource={this.state.fileList} pagination={pagination} />
                            </div>
                        </div>
                    </FreeScrollBar>
                </div>
            </div>
        )
    }
}
export default ImportCivilzoningCode;