import React from 'react';
import ReactDom from 'react-dom';
import {Router, Route, Link, hashHistory} from 'react-router';
import {Breadcrumb, Button} from 'antd';


class Bread extends React.Component {
    constructor(props){
        super(props);
        this.state={
            systemId1:this.props.systemId
        }
    }

    handleback(){
        hashHistory.push({pathname:'/home'})
    }

    componentDidMount() {

    }

    Router(){
        hashHistory.push({pathname:'/about',state:this.state.systemId1})
    }

    render() {
        return (
            <div style={{position: "relative"}}>
                <Breadcrumb>
                    <Breadcrumb.Item>
                    {
                        this.state.systemId1 == "8" ? <Link to='/about/pfpsmas/zcms/zcmsIndex' state={this.state.systemId1} >首页</Link> : <Link to='/about' state={this.state.systemId1} >首页</Link>
                    }
                        
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>当前位置</Breadcrumb.Item>
                </Breadcrumb>

                <Button type="primary" style={{
                    position: "absolute", right: 30, top: 3
                }} onClick={this.handleback.bind(this)}>登出系统</Button>
            </div>
        );
    }
}

export default Bread;