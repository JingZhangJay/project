import React from 'react';
import { hashHistory, Link } from "react-router";
import qs from 'qs'

import './uploadApprovalFile.css'

import { Table, Button, Select, Upload, Icon, Popconfirm } from 'antd';
import { openNotificationWithIcon } from "../../../../asset/pfpsmas/zcms/js/common";
import { getUpload, getList, getDelete } from "../../../../Service/pfpsmas/zcms/server";

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

            pageSize: 5, // 每页条数
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

    /**
     * 批复文件上传
     */
    handleAxiosUpload() {
        let { fileName, formId, file } = this.state;
        let param = new FormData();
        param.append("name", fileName);
        param.append("file", file);
        console.log(param.get("file"));

        this.axiosUpload(param);
    }

    /**
     * 批复文件列表展示
     */
    handAxioslist() {
        let postData = {};
        let { pageSize, pageIndex } = this.state;
        postData.pageSize = pageSize;
        postData.pageIndex = pageIndex;
        this.axiosList(postData);
    }

    /**
     * 删除批复文件接口
     */
    hadnleAxiosDelete(text, record) {
        console.log(text, record);
        let postData = {};
        postData.id = text.id;
        this.axiosDelete(postData);
    }

    /**
     * 批复文件上传接口
     * @param {string} formId 上传文件id
     */
    async axiosUpload(params) {
        let res = await getUpload(params);
        // console.log('批复上传res--->', res)
        if (res.rtnCode == '000000') {
            openNotificationWithIcon("success", res.rtnMessage);
            this.handAxioslist();
        } else {
            openNotificationWithIcon("error", res.rtnMessage);
        }
    }

    /**
     * 批复文件列表展示已经上传的文档接口
     * @param {number} pageSize 每页条数
     * @param {number} pageIndex 当前页码
     * @param {string} start 创建时间起点
     * @param {string} end 创建时间终点
     */
    async axiosList(params) {
        let res = await getList(params);
        if(res.rtnCode == "000000"){
            this.setState({
                totalRecord: res.responseData.totalRecord,
                fileList: res.responseData.dataList
            })
        } else {
            openNotificationWithIcon("error", res.rtnMessage);
        }
    }

    /**
     * 批复文件删除接口
     * @param {string} id 文档id
     */
    async axiosDelete(params){
        let res = await getDelete(params);
        if (res.rtnCode == '000000') {
            openNotificationWithIcon("success", res.rtnMessage);
            this.handAxioslist();
        } else {
            openNotificationWithIcon("error", res.rtnMessage);
        }
    }

    // 初始页面 展示列表
    componentWillMount() {
        this.handAxioslist();
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
            },{
                title: '文件类型',
                dataIndex: 'suffix',
                key: 'suffix',
                width: "1"
            }, {
                title: '年份',
                dataIndex: 'year',
                key: 'year',
                width: "1"
            },{
                title: '上传时间',
                dataIndex: 'createDate',
                key: 'createDate',
                width: "1"
            },{
                title: '操作',
                key: 'operation',
                width: 1,
                render: (text, record) => (
                    <span>
                        <Popconfirm placement="top" title="确定要删除这个文件吗?" onConfirm={this.hadnleAxiosDelete.bind(this, record)}>
                            <Button type="primary" size="small">删除</Button>
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
                this._this.axiosList(postData)
                console.log('Current: ', current, this._this);
            },
        };

        return (
            <div className="UploadApprovalFile">
                <div className="upload-quhua">
                    <span>上传文件</span>
                    <input type="text" className='filename' value={this.state.fileName} />
                    <input type="file" className="upload-file" id="upload_file" name="file" onChange={this.update.bind(this)} />
                    <input type="button" className="button-up" value="浏览" />
                </div>
                {/* 功能按钮组 */}
                <div className="button-group  button-group-quhua">
                    <Button type="primary" size="large" onClick={this.handleAxiosUpload.bind(this)}>上传</Button>

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