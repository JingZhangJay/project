import React from 'react';
import ReactDom from 'react-dom';
import { hashHistory, Link } from 'react-router';

import { Form, Select, Input, Button, message } from 'antd';
import { getLoginData, getVerificationCode } from '../../../Service/sp/ua/server';

require('../../../asset/sp/ua/css/icon.css');
require('./login.css');

const createForm = Form.create;
const FormItem = Form.Item;
const Option = Select.Option;

function noop() {
    return false;
}

class Login extends React.Component {
    constructor(prop) {
        super(prop);
        this.state = {
            codeNum: '',
            loginType: 'userName'
        }

    }

    handleSelectChange(value) {
        console.log(`selected ${value}`);
        this.setState({
            loginType: value
        })
    }

    handleReset(e) {
        e.preventDefault();
        this.props.form.resetFields();
    }

    /**
     * 提交表单
     * @param {} event 
     */
    handleSubmit(event) {
        event.preventDefault();
        event.returnValue = false;
        let data = {};
        this.props.form.validateFields((errors, values) => {
            if (!!errors) {
                message.error('注册信息填写有误,请核对后填写完整!')
                return;
            }
            console.log('=========', values);
            this.axiosLoginData(values);
        })
    }

    /**
     * 登录
     */
    async axiosLoginData(params) {
        let data = await getLoginData(params)
        console.log('------------------登录success', data);
        if (data.status == 200) {
            message.success('登录成功');
            hashHistory.push('/home');
        } else {
            this.axiosVerificationCode();
            message.error(data.description)
        }
    }

    /**
     * 获取验证码
     */
    async axiosVerificationCode() {
        let codeNum = await getVerificationCode('loginCode');
        this.setState({ codeNum: codeNum });
    }

    componentWillMount() {
        this.axiosVerificationCode();
    }

    render() {
        const { getFieldProps, getFieldError, isFieldValidating } = this.props.form;

        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 15 }
        };

        const loginTypeProps = getFieldProps("loginType", {
            rules: [{ required: true, message: "请选择登录方式!" }],
            initialValue: 'userName'
        });

        const loginNameProps = getFieldProps("loginName", {
            rules: [{ required: true, message: "请填写账号!" }],
        });

        const custPwdProps = getFieldProps("custPwd", {
            rules: [{ required: true, message: "请填写密码!" }]
        });

        const loginCodeProps = getFieldProps("loginCode", {
            rules: [{ required: true, message: "请填写验证码!" }]
        });

        return (
            <div className="login">
                <div className="login-container">
                    <div className="login-logo"></div>

                    <div className="login-form">
                        <Form horizontal form={this.props.form}>
                            <FormItem
                                label="登录方式"
                                {...formItemLayout}
                            >
                                <Select size="large" {...loginTypeProps} placeholder="请选择登录方式">
                                    <Option value="userName">用户名</Option>
                                    <Option value="idNumber">身份证</Option>
                                    <Option value="telephone">手机号</Option>
                                    <Option value="email">邮箱</Option>
                                </Select>
                            </FormItem>

                            <FormItem {...formItemLayout} label="账号" hasFeedback>
                                <Input
                                    {...loginNameProps}
                                    placeholder="用户名/身份证/手机号/邮箱"
                                />
                            </FormItem>

                            <FormItem {...formItemLayout} label="密码" hasFeedback>
                                <Input
                                    {...custPwdProps}
                                    type="password"
                                    autoComplete="off"
                                    placeholder="请输入密码"
                                    onContextMenu={noop}
                                    onPaste={noop}
                                    onCopy={noop}
                                    onCut={noop}
                                />
                            </FormItem>

                            <FormItem {...formItemLayout} label="验证码" hasFeedback>
                                <Input
                                    {...loginCodeProps}
                                    type="text"
                                    autoComplete="off"
                                    maxLength="4"
                                    placeholder="请输入手机验证码"
                                    onContextMenu={noop}
                                    onPaste={noop}
                                    onCopy={noop}
                                    onCut={noop}
                                />
                                <span className="login-form-tel-span">{this.state.codeNum}</span>
                            </FormItem>

                            <FormItem wrapperCol={{ span: 16, offset: 5 }}>
                                <Button type="primary" style={{ marginTop: 0 }} onClick={this.handleSubmit.bind(this)}>登录</Button>
                                <Button type="ghost" onClick={this.handleReset.bind(this)} style={{ color: "#fff", marginLeft: 10 }}>重置</Button>
                                <Link to="/register" style={{ marginLeft: 10, color: '#fff' }}>没有账号？ 立即注册</Link>
                            </FormItem>

                        </Form>
                    </div>
                </div>
            </div>
        )
    }

}

Login = createForm()(Login);

export default Login;