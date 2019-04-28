import React from 'react';

import { Navbar, Hr, GeoDemo } from "../../../../Components/index";
import { Form, Input, Row, Col, Button, DatePicker, Cascader, Select, Table, Modal, Card, Icon } from 'antd';

import FreeScrollBar from 'react-free-scrollbar';

import "./previewChangeReport.css";

export default class PreviewChangeReport extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            iframeSrc: "",
            zoningCode: sessionStorage.getItem("zoningCode"),

            visible: 'map'
        };
    }

    changeVisible(type) {
        this.setState({
            visible: type
        })
    }

    handleGoBack() {
        window.history.back(-1); 
        console.log(window.location);
        console.log(document.getElementById('iframe').contentWindow.location)
    }

    componentWillMount() {
        let { zoningCode } = this.state;
        let src = `http://10.1.92.19:9099/ureport/preview?_u=file:countZoning.ureport.xml&zoningCode=${zoningCode}`
        this.setState({
            iframeSrc: src
        })
    }

    componentDidMount() {
        // console.log(document.getElementById('iframe').contentDocument);

        // console.log(document.getElementById('iframe').contentWindow.document.getElementById('_ureport_table'));
    }

    render() {
        return (
            <div className="previewChangeReport">
                <div className="previewChangeReport-container">
                    <FreeScrollBar
                        className="example"
                        autohide={true}
                        fixed={true}
                        start={'right'}
                        onScrollbarScrollTimeout={100}>

                        <div className="previewChangeReport-container-top margin-top-10">
                            <Row>
                                <Col span={12}>
                                    <span onClick={this.changeVisible.bind(this, "map")}>地图</span>
                                </Col>
                                <Col span={12}>
                                    <span onClick={this.changeVisible.bind(this, "report")}>报表</span>
                                </Col>
                            </Row>
                        </div>

                        <div className="previewChangeReport-container-bottom">
                            {
                                this.state.visible == "map" ? <GeoDemo></GeoDemo> : 
                                <div className="previewChangeReport-container-content">
                                    <iframe id="iframe" name='iframe'
                                        src={this.state.iframeSrc}
                                        frameborder="0"
                                        style="filter:chroma(color=#ff0000)"
                                        // scrolling="no" 
                                        width="100%"
                                        height="500px"
                                        frameborder="0"
                                        allowTransparency="true">
                                    </iframe>

                                    <Button size="large" onClick={this.handleGoBack.bind(this)} className="previewChangeReport-container-button">返回</Button>
                                </div>  
                            }
                        </div>
                    </FreeScrollBar>
                </div>
            </div>
        )
    }
}