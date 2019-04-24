import React from 'react'
import { Menu, Breadcrumb, Icon, Badge } from 'antd';
import { Router, Route, IndexRedirect, IndexRoute, Link, hashHistory } from 'react-router'

// sp-ua
import UserInfo from "../../../../Pages/sp/ua/UserInfo/userInfo";
import Busin from "../../../../Pages/sp/ua/Business/business";
import Manage from "../../../../Pages/sp/ua/Manage/manage";
import Approval from "../../../../Pages/sp/ua/Approval/approval";
import EditUserInfo from "../../../../Pages/sp/ua/EditUserInfo/editUserInfo";
import CreateAuth from "../../../../Pages/sp/ua/CreateAuth/createAuth";
import Bread from '../BreadCrumb/breadCrumb'

import Test from "../../../../Pages/common/Test/test"
import Test2 from "../../../../Pages/common/Test2/test2"

//  wpdmp-dmp
import ApiList from '../../../../Pages/wpdmp/dmp/ApiList/apilist'
import ApiDetail from "../../../../Pages/wpdmp/dmp/ApiDetail/apiDetail";
import BlackWhiteList from "../../../../Pages/wpdmp/dmp/BlackWhiteList/blackWhiteList";
import ApiDetailChange from "../../../../Components/wpdmp/dmp/ApiDetailChange/apiDetailChange";
import {BlackWhiteDetail} from "../../../../Pages/wpdmp/dmp/BlackWhiteDetail/blackWhiteDetail";
import ApplyApiCheck from "../../../../Pages/wpdmp/dmp/ApplyApiCheck/applyApiCheck";
import {ApplyApiList} from "../../../../Pages/wpdmp/dmp/ApplyApiList/applyApiList";
import {ApplyApi} from "../../../../Pages/wpdmp/dmp/ApplyApi/applyApi";
import {ReviewApi} from "../../../../Pages/wpdmp/dmp/ReviewApi/reviewApi";

//  pfpsmas-zcms
import ZcmsIndex from "../../../../Pages/pfpsmas/zcms/rzc/zcmsIndex";
import CreateChangeComparisonTable from "../../../../Pages/pfpsmas/zcms/rzc/createChangeComparisonTable";
import InputChangeDetails from "../../../../Pages/pfpsmas/zcms/rzc/inputChangeDetails";
import PreviewChangeDetails from "../../../../Pages/pfpsmas/zcms/rzc/previewChangeDetails";
import Download from "../../../../Pages/pfpsmas/zcms/rzc/download";
import TimedTask from "../../../../Pages/pfpsmas/zcms/rzc/timedTask";
import PreviewFormalZoningCode from "../../../../Pages/pfpsmas/zcms/rzc/previewFormalZoningCode";
import ProvincialVersionControl from "../../../../Pages/pfpsmas/zcms/rzc/provincialVersionControl";
import ConditionQuery from "../../../../Pages/pfpsmas/zcms/rzc/conditionQuery";
import UploadApprovalFile from "../../../../Pages/pfpsmas/zcms/rzc/uploadApprovalFile";
import ApprovalDocumentManage from "../../../../Pages/pfpsmas/zcms/rzc/approvalDocumentManage";
import ImportCivilzoningCode from "../../../../Pages/pfpsmas/zcms/rzc/importCivilzoningCode";
import PreviewCivilzoningCode from "../../../../Pages/pfpsmas/zcms/rzc/previewCivilzoningCode";
import HistoricalTrace from "../../../../Pages/pfpsmas/zcms/rzc/historicalTrace";
import PreviewChangeReport from "../../../../Pages/pfpsmas/zcms/rzc/previewChangeReport";
import CivilComparisonReport from "../../../../Pages/pfpsmas/zcms/rzc/civilComparisonReport";


require('./template.css')

export const Template = (props) => (

    <div className="ant-layout-main template-bg">
        <div className="ant-layout-header">
            <div>
                <Badge count={99}>
                    {/* <a href="#" className="head-example"> */}
                        <Icon type="mail" style={{fontSize: "40px", color: '#fff', margin: '10px'}}/>
                    {/* </a> */}
                </Badge>
                <Badge count={200}>
                    {/* <a href="#" className="head-example"> */}
                        <Icon type="book" style={{fontSize: "40px", color: '#fff', margin: '10px'}}/>
                    {/* </a> */}
                </Badge>
            </div>
        </div>

        <div className="ant-layout-breadcrumb">
            <Bread systemId={props.systemId}/>
        </div>

        <div className="ant-layout-container">
            <div className="ant-layout-content template-content">
                <div>
                    <Router history={hashHistory}>
                        <Route path='/about' exact component={UserInfo} />
                        <Route path='/about/sp/ua/approval' component={Approval} />
                        <Route path='/about/sp/ua/manage' component={Manage} />
                        <Route path='/about/sp/ua/business' component={Busin} />
                        <Route path='/about/sp/ua/editUserInfo' component={EditUserInfo} />
                        <Route path='/about/sp/ua/createAuth' component={CreateAuth} />

                        <Route path='/about/test' component={Test} />
                        <Route path='/about/test2' component={Test2} />

                        <Route path='/about/pfpsmas/zcms/zcmsIndex' component={ZcmsIndex} />
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
                        <Route path='/about/pfpsmas/zcms/previewChangeReport' component={PreviewChangeReport} />
                        <Route path='/about/pfpsmas/zcms/civilComparisonReport' component={CivilComparisonReport} />
                        
                        <Route path='/about/wpdmp/dmp/apilist' component={ApiList}/>
                        <Route path='/about/wpdmp/dmp/apilist/apiDetail' component={ApiDetail}/>
                        <Route path='/about/wpdmp/dmp/apilist/apiDetailChange' component={ApiDetailChange}/>
                        <Route path='/about/wpdmp/dmp/apilist/blackList' component={BlackWhiteList}/>
                        <Route path='/about/wpdmp/dmp/apilist/blackList/blackDetail' component={BlackWhiteDetail}/>
                        <Route path='/about/wpdmp/dmp/applyCHeck' component={ApplyApiCheck}/>
                        <Route path='/about/wpdmp/dmp/applyCHeck/apiList' component={ApplyApiList}/>
                        <Route path='/about/wpdmp/dmp/applyCHeck/apiList/applyApi' component={ApplyApi}/>
                        <Route path='/about/wpdmp/dmp/reviewApi' component={ReviewApi}/>
                        

                    </Router>
                </div>
            </div>
        </div>

        {/* <div className="ant-layout-footer">
            </div> */}
    </div>
)


export default Template;