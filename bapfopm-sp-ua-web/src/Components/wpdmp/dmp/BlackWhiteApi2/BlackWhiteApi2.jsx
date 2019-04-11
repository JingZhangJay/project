import React from 'react';
import ReactDom from 'react-dom';
import { Table, Button } from 'antd';
import {getApiServer} from '../../../../Service/wpdmp/dmp/categories'
const columns = [{
    title: 'Api名称',
    dataIndex: 'apiName',
}, {
    title: '地址',
    dataIndex: 'apiPath',
}, {
    title: '状态',
    dataIndex: 'apiStatus',
},{
    title: '类型',
    dataIndex: 'apiType',
},{
    title: '服务源',
    dataIndex: 'serviceSource',
}, {
    title: '有效期',
    dataIndex: 'timeOut',
}, {
    title: '状态',
    dataIndex: 'apiStatus',
},{
    title: '类型',
    dataIndex: 'apiType',
}];

const BlackWhiteApi2 = React.createClass({
    getInitialState() {
        return {
            selectedRowKeys: [],  // 这里配置默认勾选列
            loading: false,
            selectRows:{},
            // selectRow:'',
            selectedRows:[],
            selectApi:{},
            pageNum1:1,
            list:[],
            current:1,
            totalApi:''
        };
    },
    async componentDidMount(){
        // let {data:{data:{list,pageNum,total},code,msg}}=await GetAllBlackList()
        let {data:{code,data,msg}}=await getApiServer(this.props.apiId)
        console.log(code,data,msg);
        let arrData=[]
        arrData.splice(0,0,data)
        if(code=='000000'){
            this.setState({list:arrData})
        }else{
            alert(msg)
        }
    },

    render() {

        return (
            <div>
                <Table  columns={columns} dataSource={this.state.list}  />
            </div>
        );
    },
    // componentWillReceiveProps(nextProps){
    //     console.log(nextProps.selected);
    //     if(nextProps.selected){
    //         this.setState({selectedRowKeys: []})
    //     }}
});



export {BlackWhiteApi2};