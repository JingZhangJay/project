import React from 'react';
import { hashHistory, Link } from "react-router";
import qs from 'qs'

import './uploadApprovalFile.css'

import { Table, Button, Select, Upload, Icon } from 'antd';
import { openNotificationWithIcon } from "../../../../asset/pfpsmas/zcms/js/common";
import { getUpload, getList } from "../../../../Service/pfpsmas/zcms/server";

class UploadApprovalFile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fileList: [],

            updateRequestToggle: false, //  添加申请单确认框显隐开关

            selectedRowKeys: [],  // 这里配置默认勾选列
            selectRows: {},
            selectedRows: {},

            zoningName: '', // 行政区划名称
            fileName: '', //   上传文件名称
            formId: '', //  ID
            file: "",// 上传文件

            pageSize: 1, // 每页条数
            pageIndex: 1, // 当前页码
            totalRecord: "", // 总数据量

            start: '', //   创建时间起点
            end: '', // 创建时间终点
        }
    }

    // 重置
    handleReset() {
        this.setState({
            fileName: '',
            file: ""
        })
    }

    update(e) {
        console.log(e, 111);
        this.setState({
            file: e.target.files[0],
            fileName: e.target.files[0].name
        });
    }

    handleDelete(text, record) {
        console.log(text, record);
    }

    /**
     * 批复文件上传接口
     * @param {string} formId 上传文件id
    */
    handleAxiosupload() {
        let postDataObj = {};
        let { fileName, formId, file } = this.state;
        postDataObj.fileName = fileName;
        postDataObj.formId = formId;

        console.log(postDataObj);

        let param = new FormData();
        param.append("name", fileName);
        param.append("file", file);
        console.log(param.get("file"));

        this.axiosupload(param);
    }

    async axiosupload(params) {
        let res = await getUpload(params);
        // console.log('批复上传res--->', res)
        if (res.rtnCode == '000000') {
            openNotificationWithIcon("success", res.rtnMessage);
            let getDataObj = {};
            let { pageSize, pageIndex } = this.state;
            getDataObj.pageSize = pageSize;
            getDataObj.pageIndex = pageIndex;
            this.axioslist(getDataObj);
        } else {
            openNotificationWithIcon("error", res.rtnMessage);
        }

    }

    
    async axioslist(params) {
        let res = await getList(params);
        // console.log('列表res--->', res)
        if(res.rtnCode == "000000"){
            this.setState({
                totalRecord: res.responseData.totalRecord,
                fileList: res.responseData.dataList
            })
        } 
    }

    // 初始页面 展示列表
    componentWillMount() {
        let getDataObj = {};
        let { pageSize, pageIndex } = this.state;
        getDataObj.pageSize = pageSize;
        getDataObj.pageIndex = pageIndex;
        this.axioslist(getDataObj);
    }
    
    render() {
        const columns = [
            {
                title: '区划代码',
                dataIndex: 'zoningCode',
                key: 'zoningCode',
                width: "1"
            }, {
                title: '区划名称',
                dataIndex: 'zoningName',
                key: 'zoningName',
                width: "1"
            }, {
                title: '文件名',
                dataIndex: 'fileName',
                key: 'fileName',
                width: "1"
            },
            {
                title: '年份',
                dataIndex: 'year',
                key: 'year',
                width: "1"
            },
            {
                title: '上传时间',
                dataIndex: 'createDate',
                key: 'createDate',
                width: "1"
            }, {
                title: '操作',
                key: 'operation',
                width: 1,
                render: (text, record) => (
                    <span>
                        <Button type="primary" size="small" onClick={this.handleDelete.bind(this, record)}>删除</Button>
                    </span>
                ),
            }];
        
        const pagination = {
            _this: this,
            total: this.state.totalRecord,
            pageSize: this.state.pageSize,
            onChange(current) {
                let getDataObj = {};
                getDataObj.pageSize = this._this.state.pageSize;
                getDataObj.pageIndex = current;
                this._this.axioslist(getDataObj)
                console.log('Current: ', current, this._this);
            },
        };

        return (
            <div className="UploadApprovalFile">
                <div className="upload-quhua">
                    <span>上传文件</span>
                    <input type="text" className='filename' onChange={this.onChange.bind(this)} value={this.state.fileName} />
                    <input type="file" className="upload-file" id="upload_file" name="file" onChange={this.update.bind(this)} />
                    <input type="button" className="button-up" value="浏览" />
                </div>
                {/* 功能按钮组 */}
                <div className="button-group  button-group-quhua">
                    <Button type="primary" size="large" onClick={this.handleAxiosupload.bind(this)}>上传</Button>

                    <Button type="primary" size="large" className="margin-left-20" onClick={this.handleReset.bind(this)}>重置</Button>
                </div>

                <div style={{ marginTop: 60 }}>
                    <Table columns={columns} dataSource={this.state.fileList} pagination={pagination} />
                </div>
            </div>
        )
    }
}
export default UploadApprovalFile;