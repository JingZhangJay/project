import React from "react";
import ReactDom from "react-dom";
import { Card, Col, Row, Modal, Input, Form, message } from "antd";
import { hashHistory, Link } from "react-router";
import { getSystemList, getUpdatePassword, doLogOut, getCustInfo } from "../../../Service/sp/ua/server";

require("./home.css");

const createForm = Form.create;
const FormItem = Form.Item;
function noop() {
    return false;
}

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false, //  修改密码对话框显隐状态
            systemData: [] //  系统展示数据存放数组
        };
    }

    /**
     * 用户登录门户之后查看平台下所有的系统
     */
    async axiosSystemList() {
        let data = await getSystemList();
        if (data.status == 200) {
            message.success(data.description);
            this.setState({ systemData: data.dataObject });
        } else {
            message.error(data.description);
        }
        console.log("查询系统", this.state.systemData);
    }

    /**
     * 将区划信息放入sessionStorage里面
     */
    async axiosCustInfo() {
        let data = await getCustInfo();
        if (data.rtnCode == "000000") {
            sessionStorage.setItem('levelCode', data.responseData.levelCode);
            sessionStorage.setItem('zoningCode', data.responseData.zoningCode);
            sessionStorage.setItem('zoningName', data.responseData.zoningName);
            sessionStorage.setItem('fullName', data.responseData.fullName);
            sessionStorage.setItem('assigningCode', data.responseData.assigningCode);
        }
        return false;
    }

    /**
     * 修改用户密码
     */
    async axiosUpdatePassword(val) {
        let data = await getUpdatePassword(val);
        if (data.status == 200) {
            this.setState({
                visible: false
            });
            message.success(data.description);
        } else {
            message.error(data.description);
        }
    }

    /**
     * 系统登出
     */
    async axiosLogOut() {
        let data = await doLogOut();
        if (data.status == 400) {
            message.error(data.description);
            return;
        } else {
            message.success(data.description);
            hashHistory.push('/login');
        }
        console.log(data);
    }

    logOut() {
        this.axiosLogOut()
    }

    /**
     *  显示对话框
     */
    showModal() {
        this.setState({
            visible: true
        })
    }

    /**
      *  隐藏对话框
      */
    hideModal() {
        this.setState({
            visible: false,
            infoVisible: false
        });
    }

    /**
     *  用户密码修改提交
     */
    handleSubmit() {
        this.props.form.validateFields((errors, values) => {
            if (!!errors) {
                message.error("两次输入的密码不一致,请重新输入!");
                return;
            }
            const params = this.props.form.getFieldsValue();
            this.axiosUpdatePassword(params);
        });
    }

    /**
     * 用户密码验证
     */
    checkPass(rule, value, callback) {
        const { validateFields } = this.props.form;
        if (value) {
            validateFields(["rePassword"], { force: true });
        }
        callback();
    }

    /**
     * 密码重复验证
     */
    checkPass2(rule, value, callback) {
        const { getFieldValue } = this.props.form;
        if (value && value !== getFieldValue("newPassword")) {
            callback("两次输入密码不一致！");
        } else {
            callback();
        }
    }

    componentWillMount() {
        this.axiosSystemList();
        this.axiosCustInfo();
    }

    render() {
        const { getFieldProps, getFieldError, isFieldValidating } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 },
        };

        const oldPasswordPwdProps = getFieldProps("oldPassword", {
            rules: [
                { required: true, whitespace: true, message: "请填写原密码!" },
            ]
        });

        const newPasswordPwdProps = getFieldProps("newPassword", {
            rules: [
                { required: true, whitespace: true, message: "请填写新密码!" },
                { validator: this.checkPass.bind(this) }
            ]
        });

        const rePasswdProps = getFieldProps("rePassword", {
            rules: [
                { required: true, whitespace: true, message: "请再次输入密码!" },
                { validator: this.checkPass2.bind(this) }
            ]
        });

        let systemDom;
        if (this.state.systemData.length > 0) {
            systemDom = this.state.systemData.map(el => {
                if(el.systemId == 8){
                    return (
                        <Col span="4">
                            <Card bordered={true} style={{ backgroundColor: 'transparent', borderColor: "#4cb8e9" }}>
                                <p>
                                    <img className="system-logo" src={el.systemId < 11 ? require(`../../../asset/sp/ua/img/portal/${el.systemId}.png`) : require(`../../../asset/sp/ua/img/portal/1.png`)} alt="" /></p>
                                <p className='system-name'>
                                    <Link className="system-a" to={{ pathname: "/about/pfpsmas/zcms/zcmsIndex", state: { systemId: el.systemId } }}>{el.systemName}
                                    </Link>
                                </p>
                            </Card>
                        </Col>
                    )
                }else{
                    return (
                        <Col span="4">
                            <Card bordered={true} style={{ backgroundColor: 'transparent', borderColor: "#4cb8e9" }}>
                                <p>
                                    <img className="system-logo" src={el.systemId < 11 ? require(`../../../asset/sp/ua/img/portal/${el.systemId}.png`) : require(`../../../asset/sp/ua/img/portal/1.png`)} alt="" /></p>
                                <p className='system-name'>
                                    <Link className="system-a" to={{ pathname: "/about", state: { systemId: el.systemId } }}>{el.systemName}
                                    </Link>
                                </p>
                            </Card>
                        </Col>
                    );
                }  
            })
        }

        if (
            this.state.systemData !== undefined ||
            this.state.systemData.length !== 0
        ) {
            return (
                <div className="home-container">

                    <div className="home-header">
                        <div className="home-user">
                            <span className="home-span" onClick={this.showModal.bind(this)}>修改密码</span>
                            <span style={{ margin: '0 10px 0 10px', color: '#4cb8e9', fontSize: 14 }}>\</span>
                            <span className="home-span" onClick={this.showModal.bind(this)}>
                                <Link to={{ pathname: '/about', state: { systemId: '11' } }}>用户信息</Link>
                            </span>
                            <span style={{ margin: '0 40px 0 10px', color: '#4cb8e9', fontSize: 14 }}>\</span>
                            <i className="home-span logout" onClick={this.logOut.bind(this)}></i>
                        </div>
                    </div>

                    <div className="home-content">
                        <div className="home-content-logo">
                            <div className="home-content-logo-text"></div>
                        </div>
                        <div className="home-content-left"></div>
                        <div className="home-content-center"></div>
                        <div className="home-content-right"></div>

                        <div className="home-content-footer">
                            <Row className="systemlist">
                                {systemDom}
                            </Row>
                        </div>
                    </div>

                    {/* 修改密码 */}
                    <div style={{ background: "transparent", padding: "30px" }}>
                        <Modal
                            className="changePsw"
                            title="修改密码"
                            visible={this.state.visible}
                            onOk={this.handleSubmit.bind(this)}
                            onCancel={this.hideModal.bind(this)}
                        >
                            <Form horizontal form={this.props.form}>
                                <FormItem {...formItemLayout} label="旧密码">
                                    <Input
                                        {...oldPasswordPwdProps}
                                        type="password"
                                        autoComplete="off"
                                        placeholder="请输入旧密码"
                                    />
                                </FormItem>

                                <FormItem {...formItemLayout} label="新密码" hasFeedback>
                                    <Input
                                        {...newPasswordPwdProps}
                                        type="password"
                                        autoComplete="off"
                                        placeholder="请输入新密码"
                                        onContextMenu={noop}
                                        onPaste={noop}
                                        onCopy={noop}
                                        onCut={noop}
                                    />
                                </FormItem>

                                <FormItem {...formItemLayout} label="确认密码" hasFeedback>
                                    <Input
                                        {...rePasswdProps}
                                        type="password"
                                        autoComplete="off"
                                        placeholder="两次输入密码保持一致"
                                        onContextMenu={noop}
                                        onPaste={noop}
                                        onCopy={noop}
                                        onCut={noop}
                                    />
                                </FormItem>
                            </Form>
                        </Modal>
                    </div>
                </div>
            );
        }
    }
}

Home = createForm()(Home);
export default Home;
