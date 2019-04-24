import React from 'react';
import ReactDom from 'react-dom';
import styles from './apilist.css'
import {hashHistory, Link} from "react-router";
import {List} from "../../../../Components/wpdmp/dmp/List/list1"
import {GetApi} from "../../../../Service/wpdmp/dmp/categories"
import {message} from 'antd';

function Group(apiGroup) {
    switch (apiGroup) {
        case 1:
            return "统计分析管理分系统"
        case 2:
            return "辅助决策管理分系统"
        case 3:
            return "生育和家庭管理分系统"
        case 4:
            return"流动人口服务管理分系统"
        case  5 :
            return"内部综合管理分系统"
        case 6 :
            return"监测分析管理分系统"
        case 7 :
            return"区划代码管理分系统"
        case 8 :
            return"托育系统"
        case 9 :
            return"全员人口数据管理平台"
        case 10 :
            return"人口变动信息校核与引导服务应用系统"
    }
}
function Status(apiStatus) {
    switch (apiStatus) {
        case 0 :
            return "编辑"
        case 1 :
            return"发布"
        case 2 :
            return"下线"
    }
}
class ApiList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            apiInput: '',
            pageNum: 1,
            list: [],
            pageSize: 5,
            totalUser: '',
            current: '',
            checked: false,
            selected: true
        }
    }

    // async componentWillMount(){
    //     let data=await GetApi();
    //     console.log(data);
    // }

    // componentDidMount() {
    //     if (!window.localStorage.getItem("state")) {
    //         alert("请登录哦~~")
    //         hashHistory.push('/login')
    //     }
    // }

    handleChange(e) {
        this.setState({apiInput: e.target.value, selected: true})
    }

    // newBuilt(e) {
    //     ModalBox.confirm({
    //         title: 'Demo',
    //         content: 'Hello world!',
    //         okText: '确认',
    //         cancelText: '取消',
    //         onOk: () => console.log('ok'),
    //         onCancel: () => console.log('cancel'),
    //         onClose: () => {
    //         }
    //     })
    // }
    //查询api
    findApi() {
        this.setState({list: [], totalUser: '', current: '',})
        this.find(this.state.apiInput, this.state.pageNum)
    }

    //api接口
    async find(api, page) {
        let api2 = api.replace(/(^\s*)|(\s*$)/g, "");
        if (api2) {
            // let {data:{data,totalUsers,currentPage}} = await GetApi(api2, page);
            let {data: {object, totalUsers, currentPage},status} = await GetApi(api2, page);
            console.log(status);
            if(status>=200){
                if (object.code == "000000") {
                    let list = this.state.list;
                    object.data.map((item, index) => {
                        item['isUse'] ? item['isUse'] = "是" : item['isUse'] = '否';
                        item.timeOut=item.timeOut+'天'
                        item.groupId=Group(item.groupId)
                        item.apiStatus=Status(item.apiStatus)
                    })
                    this.setState({list: list.concat(object.data), totalUser: totalUsers, current: currentPage})
                } else {
                    alert(object.msg)
                }
            }else {
                alert(status)
            }

        } else {
            alert('输入内容不能为空哦^_^')
        }

    }

    //修改api内容
    changeApi() {

    }

    //页面跳转
    changePage1(current) {
        this.setState({
            pageNum: current, selected: false
        }, this.findApi)
    }


    render() {
        return (
            <div className="apilist">
                <div className="main-container">
                    <div className="container">
                        <div className="main clearfix">
                            <div className="searchTitle clearfix">
                                <div className="apiName">
                                    <span>API名称</span>
                                </div>
                                <div className="search">
                                    <label htmlFor="api" className="apiLabel"></label>
                                    <input type="text" id="api" value={this.state.apiInput}
                                           onChange={this.handleChange.bind(this)}/>
                                </div>
                                <div className="searchBtn">
                                    <input type="button" value="查询" onClick={this.findApi.bind(this)}/>
                                </div>
                            </div>
                            <div className="content apiContent">
                                <div className="contentApi">
                                    <List list={this.state.list} totalUser={this.state.totalUser}
                                          current={this.state.current} handleChange={this.changePage1.bind(this)}
                                          selected={this.state.selected}/>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        );
    }
}



export default ApiList;