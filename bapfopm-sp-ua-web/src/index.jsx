import {} from "../scss/GlobalCSS"
import React from "react";
import ReactDOM from "react-dom";
import { Router, Route, IndexRedirect, IndexRoute, Link, hashHistory } from 'react-router'
import { relative } from "path";

import 'antd/dist/antd.css';
import './asset/pfpsmas/zcms/css/common.css';

//  common
import Login from "./Pages/common/Login/login";
import Register from "./Pages/common/Register/register";
import Home from "./Pages/common/Home/home";
import About from "./Pages/common/About/about";
import Test from "./Pages/common/Test/test";

import Test2 from './Pages/common/Test2/test2'


//  wpdmp-dmp
import ApiList from "./Pages/wpdmp/dmp/ApiList/apilist";
import ApiDetail from "./Pages/wpdmp/dmp/ApiDetail/apiDetail";
import ApiDetailChange from "./Components/wpdmp/dmp/ApiDetailChange/apiDetailChange";
import BlackWhiteList from "./Pages/wpdmp/dmp/BlackWhiteList/blackWhiteList";
import {BlackWhiteDetail} from "./Pages/wpdmp/dmp/BlackWhiteDetail/blackWhiteDetail";
import ApplyApiCheck from "./Pages/wpdmp/dmp/ApplyApiCheck/applyApiCheck";
import {ApplyApiList} from "./Pages/wpdmp/dmp/ApplyApiList/applyApiList";
import {ApplyApi} from "./Pages/wpdmp/dmp/ApplyApi/applyApi";
import {ReviewApi} from "./Pages/wpdmp/dmp/ReviewApi/reviewApi";

//  sp-ua
import Approval from "./Pages/sp/ua/Approval/approval";
import Manage from "./Pages/sp/ua/Manage/manage";
import Busin from "./Pages/sp/ua/Business/business";
import EditUserInfo from "./Pages/sp/ua/EditUserInfo/editUserInfo";
import CreateAuth from "./Pages/sp/ua/CreateAuth/createAuth";

//  pfpsmas-zcms
import CreateChangeComparisonTable from "./Pages/pfpsmas/zcms/rzc/createChangeComparisonTable";
import InputChangeDetails from "./Pages/pfpsmas/zcms/rzc/inputChangeDetails";
import PreviewChangeDetails from "./Pages/pfpsmas/zcms/rzc/previewChangeDetails";
import Download from "./Pages/pfpsmas/zcms/rzc/download";
import TimedTask from "./Pages/pfpsmas/zcms/rzc/timedTask";
import PreviewFormalZoningCode from "./Pages/pfpsmas/zcms/rzc/previewFormalZoningCode";
import ProvincialVersionControl from "./Pages/pfpsmas/zcms/rzc/provincialVersionControl";
import ConditionQuery from "./Pages/pfpsmas/zcms/rzc/conditionQuery";
//批复文件上传 管理
import UploadApprovalFile from "./Pages/pfpsmas/zcms/rzc/uploadApprovalFile";
import ApprovalDocumentManage from "./Pages/pfpsmas/zcms/rzc/approvalDocumentManage";
// 民政区划管理
import ImportCivilzoningCode from "./Pages/pfpsmas/zcms/rzc/importCivilzoningCode";
import PreviewCivilzoningCode from "./Pages/pfpsmas/zcms/rzc/previewCivilzoningCode";
import HistoricalTrace from "./Pages/pfpsmas/zcms/rzc/historicalTrace";


//  引入axios
//  并做全局配置
import axios from "axios";
// axios.defaults.baseURL = `http://localhost:9999`;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

class App extends React.Component{
    render() {
        return (
            <div style={{width:"100%",height:"100%"}}>
                <div className="main" style={{width:"100%",height:"100%"}}>{this.props.children}</div>
            </div>
        )
    }
}

ReactDOM.render(
    <Router history={hashHistory}>
        <Route path="/" component={App}>

            {/*<Route path="inbox" component={PageInbox}>*/}
                {/*<Route path="messages/:id" component={PageInboxMessage} />*/}
            {/*</Route> *!/*/}

            <Route path='/login' component={Login}/>
            <Route path='/register' component={Register}/>

            <Route path='/home' component={Home}/>
            <Route path='/about' component={About}>
                <Route path='/about/sp/ua/approval' component={Approval} />
                <Route path='/about/sp/ua/manage' component={Manage} />
                <Route path='/about/sp/ua/business' component={Busin} />
                <Route path='/about/sp/ua/editUserInfo' component={EditUserInfo} />
                <Route path='/about/sp/ua/createAuth' component={CreateAuth} />

                <Route path='/about/test' component={Test} />
                <Route path='/about/test2' component={Test2} />

                <Route path='/about/pfpsmas/zcms/createChangeComparisonTable' component={CreateChangeComparisonTable} />
                <Route path='/about/pfpsmas/zcms/inputChangeDetails' component={InputChangeDetails} />
                <Route path='/about/pfpsmas/zcms/previewChangeDetails' component={PreviewChangeDetails} />
                <Route path='/about/pfpsmas/zcms/download' component={Download} />
                <Route path='/about/pfpsmas/zcms/timedTask' component={TimedTask} />
                <Route path='/about/pfpsmas/zcms/previewFormalZoningCode' component={PreviewFormalZoningCode} />
                <Route path='/about/pfpsmas/zcms/provincialVersionControl' component={ProvincialVersionControl} />
                <Route path='/about/pfpsmas/zcms/conditionQuery' component={ConditionQuery} />
                <Route path='/about/pfpsmas/zcms/uploadApprovalFile' component={UploadApprovalFile} />
                <Route path='/about/pfpsmas/zcms/approvalDocumentManage' component={ApprovalDocumentManage} />
                <Route path='/about/pfpsmas/zcms/importCivilzoningCode' component={ImportCivilzoningCode} />
                <Route path='/about/pfpsmas/zcms/previewCivilzoningCode' component={PreviewCivilzoningCode} />
                <Route path='/about/pfpsmas/zcms/historicalTrace' component={HistoricalTrace} />
                
                
                <Route path='/about/wpdmp/dmp/apilist' component={ApiList}>
                    <Route path='/about/wpdmp/dmp/apilist/apiDetail' component={ApiDetail}/>
                    <Route path='/about/wpdmp/dmp/apilist/apiDetailChange' component={ApiDetailChange}/>
                    <Route path='/about/wpdmp/dmp/apilist/blackList' component={BlackWhiteList}/>
                    <Route path='/about/wpdmp/dmp/apilist/blackList/blackDetail' component={BlackWhiteDetail}/>
                </Route>
                <Route path='/about/wpdmp/dmp/applyCHeck' component={ApplyApiCheck}>
                    <Route path='/about/wpdmp/dmp/applyCHeck/apiList' component={ApplyApiList}/>
                    <Route path='/about/wpdmp/dmp/applyCHeck/apiList/applyApi' component={ApplyApi}/>
                </Route>
                <Route path='/about/wpdmp/dmp/reviewApi' component={ReviewApi}/>

            </Route>

            <Router path='/test' component={Test}/>
            
            <IndexRedirect to='/login'/>
        </Route>
    </Router>,
    document.getElementById("app")
)