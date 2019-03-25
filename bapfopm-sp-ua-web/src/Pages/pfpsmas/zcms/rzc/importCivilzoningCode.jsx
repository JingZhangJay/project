import React from 'react';
import { hashHistory, Link } from "react-router";
import qs from 'qs'

import './importCivilzoningCode.css'

import { Table, Button, Select, Upload, Icon } from 'antd';
import { openNotificationWithIcon } from "../../../../asset/pfpsmas/zcms/js/common";
import { getselectCivilAffairZip, getZipFlie } from "../../../../Service/pfpsmas/zcms/server";

class ImportCivilzoningCode extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fileList: [],

            updateRequestToggle: false, //  添加申请单确认框显隐开关

            selectedRowKeys: [],  // 这里配置默认勾选列
            selectRows: {},
            selectedRows: {},

            zoningName: '',   //  行政区划名称
            fileValue: '',//上传文件名称
            formId: '', // ID
            pageSize: '',//每页条数
            pageIndex: '',//当前页码
            start: '',//创建时间起点
            end: '',//创建时间终点
        }
    }
    // 初始页面 展示列表
    componentWillMount() {
        let getDataObj = {};
        let { pageSize, pageIndex } = this.state;
        getDataObj.pageSize = 5;
        getDataObj.pageIndex = 1;

        this.axioslist(getDataObj);
    }
    async axioslist(params) {
        let res = await getselectCivilAffairZip(params);
        // console.log('列表res--->', res)
        this.setState({
            fileList: res.responseData.dataList
        })
    }

    onSelectChange(selectedRowKeys, selectedRows) {
        // console.log(selectedRowKeys, selectedRows);
    }

    update(e) {
        this.setState({ fileValue: e.target.files[0].name });
    }

    onChange(e) {
        e.target.value = this.state.fileValue
    }

    /**
     * 文件上传接口
     * @param {string} formId 上传文件id
  */
    handleAxioszipFlie() {
        let postDataObj = {};
        let { fileValue, formId } = this.state;
        postDataObj.fileValue = fileValue;
        postDataObj.formId = formId;

        this.axiosupload(postDataObj);
    }

    async axiosupload(params) {
        let res = await getZipFlie(params);
        // console.log('上传res--->', res)
        if (res.rtnCode == '000000') {
            openNotificationWithIcon("success", res.rtnMessage);
            this.setState({
                fileList: res.responseData.dataIndex
            })
        } else {
            openNotificationWithIcon("error", res.rtnMessage);
        }

    }
    // 重置
    handleReset() {
        this.setState({ fileValue: '' })
    }
    //导入
    handleImport() {

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
            },
            {
                title: '上传时间',
                dataIndex: 'enterTime',
                key: 'enterTime',
                width: "1"
            }
        ];

        const requestRowSelection = {
            type: 'radio',
            selectedRowKeys: this.state.selectedRowKeys,
            onChange: this.onSelectChange.bind(this),
        }
     

        return (
            <div className="ImportCivilzoningCode">
               
                <div className="upload-quhua">
                    <span>上传文件</span>
                    <input type="text" className='filename' onChange={this.onChange.bind(this)} value={this.state.fileValue} />
                    <input type="file" className="upload-file" id="upload_file" name="file" onChange={this.update.bind(this)} />
                    <input type="button" className="button-up" value="浏览" />
                </div>
                
                {/* 功能按钮组 */}
                <div className="button-group  button-group-quhua">
                    <Button type="primary" size="large" onClick={this.handleAxioszipFlie.bind(this)}>上传</Button>

                    <Button type="primary" size="large" className="margin-left-20" onClick={this.handleReset.bind(this)}>重置</Button>
                </div>

                <div style={{ marginTop: 60 }}>
                    <div className="table-title">
                        <span>导入结果展示</span>
                        <Button type="primary" size="small" style={{padding: "0 15px"}} className="t-delete">删除</Button>
                    </div>
                    <Table columns={columns} dataSource={this.state.fileList} rowSelection={requestRowSelection} />
                </div>
                <div style={{ marginTop: 20 }} className="b-import">
                    <Button type="primary" size="large" onClick={this.handleImport.bind(this)} >导入</Button>
                </div>
            </div>
        )
    }
}
export default ImportCivilzoningCode;