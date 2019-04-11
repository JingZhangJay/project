import React from 'react';
import ReactDom from 'react-dom';
import {hashHistory,Link} from "react-router";
import {Table, Button,message,Modal,Select } from 'antd';
import {DeleteExternal,SetEnable} from '../../../../Service/wpdmp/dmp/categories';
const confirm = Modal.confirm;
const Option = Select.Option;


const columns = [{
    title: '编码',
    dataIndex: 'externaId',
}, {
    title: '名称',
    dataIndex: 'externaName',
}, {
    title: '所属子系统',
    dataIndex: 'systemId',
},{
    title: '平台地址',
    dataIndex: 'gwPath',
}, {
    title: '省级接口地址',
    dataIndex: 'externaPath',
},{
    title: '创建时间',
    dataIndex: 'createTime',
}, {
    title: '启用状态',
    dataIndex: 'isUse',
}];


const ProvinceList = React.createClass({
    getInitialState() {
        return {
            selectedRowKeys: [],  // 这里配置默认勾选列
            loading: false,
            loading1: false,
            loading2: false,
            selectRows:{},
            selectRow:'',
            selectedRows:[],
            selectApi:{},
            apiIds:[],
            totalApiIds:{},
            visible:false,
            visible1:false,
            newList:''
        };
    },
     //新建
    start() {
        this.setState({ loading: true });
        // 模拟 ajax 请求，完成后清空
        if(this.state.selectedRowKeys.length<=1){
            hashHistory.push({pathname:'/about/wpdmp/dmp/apilist/apiDetailChange',query:this.state.selectRow,state:sessionStorage.getItem("systemId")})
        }else{
            message.warning('只能选一项修改哦~~')
        }
        setTimeout(() => {
            this.setState({
                selectedRowKeys: [],
                loading: false,
            });
        }, 1000);
    },

    onSelectChange(selectedRowKeys,selectedRows) {
        let arr = Array.from(new Set(selectedRowKeys))
        let apiIds=selectedRows.map((item,index)=>{
            return item.externaId
        })
        this.setState({ selectedRowKeys:arr,selectedRows:selectedRows,apiIds:apiIds});
    },
    onSelect(record, selected, selectedRows) {
        this.setState({selectRow:record})
        // console.log(record, selected, selectedRows);
    },
    newStart(){
        hashHistory.push({pathname:'/about/wpdmp/dmp/apilist/apiDetail',state:sessionStorage.getItem("systemId")})
    },
    black(){
        hashHistory.push({pathname:'/about/wpdmp/dmp/apilist/blackList',state:sessionStorage.getItem("systemId")})
    },
    //删除api
    delete(){
        this.setState({visible:true,loading1: true})
    },
    handleOk() {
        let apiIds=this.state.apiIds;
        let totalApiIds=this.state.totalApiIds;
        let cur=this.props.current;
        totalApiIds[cur]=apiIds;
        var deleteIDs=[];
        for(var key in totalApiIds){
            deleteIDs=deleteIDs.concat(totalApiIds[key])
        }
        this.delApi(deleteIDs+"");
        // this.setState({ loading1: true });
        setTimeout(() => {
            this.setState({ loading1: false, visible: false });
            this.props.handleChange(this.props.current)
            this.setState({selectedRowKeys:[]})
        }, 1000);
    },
    handleCancel() {
        this.setState({ visible: false });
    },
    async delApi(apiIds){
        let {data:{code,msg}}=await DeleteExternal(apiIds);
        if(code=='000000'){
            message.success('删除成功!')
        }else {
            message.error(msg)
        }
    },
    //启停api
    startStop(){
        this.setState({visible1:true})
    },
    handleOk1() {
        let apiIds=this.state.apiIds;
        let totalApiIds=this.state.totalApiIds;
        let cur=this.props.current;
        totalApiIds[cur]=apiIds;
        var deleteIDs=[];
        for(var key in totalApiIds){
            deleteIDs=deleteIDs.concat(totalApiIds[key])
        }
        console.log(deleteIDs + "");
        this.startApi(deleteIDs+"");
        this.setState({ loading2: true });
        setTimeout(() => {
            this.setState({ loading2: false, visible1: false });
            this.props.handleChange(this.props.current)
            this.setState({selectedRowKeys:[]})
        }, 1000);
    },
    handleCancel1() {
        this.setState({ visible1: false });
    },
    async startApi(apiIds){
        let {data:{code,msg}}=await SetEnable(apiIds)
        if(code=='000000'){
            message.success('启停成功!')
        }else {
            message.error(msg)
        }

    },
    //翻页
    changePage(current){
        this.props.handleChange(current.current);
        let selectedRowKeys=this.state.selectedRowKeys;//[0,1,2]
        let selectRows=this.state.selectRows;//{1:[0,1,2]}
        let cur=this.props.current;//1
        let apiIds=this.state.apiIds;
        let totalApiIds=this.state.totalApiIds;
        selectRows[cur]=this.state.selectedRowKeys;
        totalApiIds[cur]=apiIds;
        console.log(totalApiIds);
        for(var key in selectRows){
            if((current.current+"")==key){
                this.setState({selectedRowKeys:selectRows[key]})
                //console.log("true",selectRows);
                return
            }else {
                this.setState({selectedRowKeys:[]})
                selectRows[cur]=this.state.selectedRowKeys;
                // console.log("false"+this.state.selectedRowKeys,selectRows);
            }
        }

    },


    render() {
        const { loading,loading1,loading2, selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onSelect:this.onSelect,
            type:'checkbox',
            onChange: this.onSelectChange,
        };
        const hasSelected = selectedRowKeys.length > 0;


        return (
            <div>
                <div style={{ marginBottom: 16,width:"37%"}}>
                    <Button type='primary' onClick={this.newStart}>新建</Button>
                    <Button type="primary" onClick={this.start}
                            disabled={!hasSelected} loading={loading} style={{ marginLeft: 15 }}
                    >修改</Button>
                    <Button type="primary" disabled={!hasSelected}  style={{ marginLeft: 15 }} onClick={this.delete}
                    >删除</Button>
                    <Button type="primary" disabled={!hasSelected} loading={loading2} style={{ marginLeft: 15 }} onClick={this.startStop}
                    >启停</Button>
                </div>
                <Modal ref="modal"
                       visible={this.state.visible}
                       title="提醒" onOk={this.handleOk} onCancel={this.handleCancel}
                       footer={[
                           <Button key="back" type="ghost" size="large" onClick={this.handleCancel}>返 回</Button>,
                           <Button key="submit" type="primary" size="large"  onClick={this.handleOk}>
                               提 交
                           </Button>,
                       ]}
                >
                    <p>您确认要删除这些接口吗?</p>
                </Modal>
                <Modal ref="modal1"
                       visible={this.state.visible1}
                       title="提醒" onOk={this.handleOk1} onCancel={this.handleCancel1}
                       footer={[
                           <Button key="back" type="ghost" size="large" onClick={this.handleCancel1}>返 回</Button>,
                           <Button key="submit" type="primary" size="large" loading={this.state.loading2} onClick={this.handleOk1}>
                               提 交
                           </Button>,
                       ]}
                >
                    <p>您确认要启停这些接口吗?</p>
                </Modal>
                <div style={{margin:"0 auto"}}>
                    <Table rowSelection={rowSelection} columns={columns} dataSource={this.props.list} pagination={{pageSize:'5',
                        current:this.props.current,
                        total:this.props.totalUser,}}  onChange={this.changePage.bind(this)} />
                </div>
            </div>
        );
    },
    componentWillReceiveProps(nextProps){
        // console.log(nextProps.selected);//true
        if(nextProps.selected){
            this.setState({selectedRowKeys: []})
        }
    }
});

export {ProvinceList} ;