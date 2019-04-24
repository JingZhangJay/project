import React from 'react';

import { Navbar, Hr, GeoDemo } from "../../../../Components/index";
import { Form, Input, Row, Col, Button, DatePicker, Cascader, Select, Table, Modal, Card, Icon } from 'antd';

import FreeScrollBar from 'react-free-scrollbar';

import "./civilComparisonReport.css";

export default class CivilComparisonReport extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            iframeSrc: "",
            zoningCode: sessionStorage.getItem("zoningCode"),

            visible: 'report'
        };
    }

    changeVisible(type){
        this.setState({
            visible: type
        })
    }

    componentWillMount(){
        let {zoningCode} = this.state;
        let src = `http://10.1.92.19:9099/ureport/preview?_u=file:mzxz.ureport.xml&zoningCode=${zoningCode}`
        this.setState({
            iframeSrc: src
        })
    }

    componentDidMount(){
        // console.log(document.getElementById('iframe').contentDocument);

        // console.log(document.getElementById('iframe').contentWindow.document.getElementById('_ureport_table'));
    }

    render() {
        return (
            <div className="civilComparisonReport">
                <div className="civilComparisonReport-container">
                    <FreeScrollBar
                        className="example"
                        autohide={true}
                        fixed={true}
                        start={'right'}
                        onScrollbarScrollTimeout={100}>

                        <div className="civilComparisonReport-container-top">
                            <Row>
                                <Col span={12}>
                                    <span onClick={this.changeVisible.bind(this, "map")}>地图</span>
                                </Col>
                                <Col span={12}>
                                    <span onClick={this.changeVisible.bind(this, "report")}>报表</span>
                                </Col>
                            </Row>
                        </div>

                        <div className="civilComparisonReport-container-bottom">

                            {
                                this.state.visible == "map" ? <GeoDemo></GeoDemo> : <iframe id="iframe" name='iframe' 
                                    src={this.state.iframeSrc}
                                    frameborder="0" 
                                    style="filter:chroma(color=#ff0000)"
                                    // scrolling="no" 
                                    width="100%" 
                                    height="500px" 
                                    frameborder="0" 
                                    allowTransparency="true">
                                </iframe>
                            }   
                        </div>
                    </FreeScrollBar>    
                </div>
            </div>
        )
    }
}