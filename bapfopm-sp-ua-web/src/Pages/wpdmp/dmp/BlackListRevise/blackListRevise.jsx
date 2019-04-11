import React from 'react';
import ReactDom from 'react-dom';
import { Form, Input, Select, Checkbox ,Row,Button,Col,message ,Modal} from 'antd';
import {BlackWhiteApi2} from "../../../../Components/wpdmp/dmp/BlackWhiteApi2/BlackWhiteApi2";
import {ReviseBlackList} from "../../../../Service/wpdmp/dmp/categories"
import {hashHistory} from "react-router";
const FormItem = Form.Item;
const Option = Select.Option;
const confirm = Modal.confirm;

let BlackListRevise=React.createClass({
    getInitialState(){
        return{

        }
    },
    // apiId: 138
    // ip: "ty5"
    // wbDesc: "ty5"
    // wbName: "ty5"
    // wbType: 2

    // apiId: "118"
    // createDate: "2019-02-28"
    // deleted: "false"
    // ip: "tyty"
    // isUse: "是"
    // wbDesc: "tyty"
    // wbId: "48"
    // wbName: "tyty"
    // wbType: "白名单"

//     黑白名单的修改：
// /gw/wbList/updateWb
// 参数：数字 wbId, 字符串wbName, 字符串wbDesc, 数字wbType
componentDidMount() {
        let item=this.props.location.query
        item.wbType=="黑名单"?item.wbType='1':item.wbType='2';
        this.props.form.setFieldsValue(item)
    },


    handleSubmit(){
        var res= this.props.form.getFieldsValue()
        console.log('res',res);
            //wbId,wbName,wbDesc,wbType,ip
            this.reviseWBApi(parseFloat(this.props.location.query.wbId),res.wbName,res.wbDesc,parseFloat(res.wbType),res.ip);


    },
    async reviseWBApi(wbId,wbName,wbDesc,wbType,ip){
        if(wbName&&ip&&wbDesc&&wbType){
            let {data:{code,msg}} =await ReviseBlackList(wbId,wbName,wbDesc,wbType,ip);
            if (code == "000000") {
                message.success('恭喜你,数据保存成功!');
                hashHistory.push({pathname:'/about/wpdmp/dmp/apilist/blackList',state:sessionStorage.getItem("systemId")})
            } else {
                message.error(msg);
            }
        }else{
            message.warning('还有没填的选项哦~')
        }
    },

    returnBack(){
        confirm({
            title: '您确定要离开吗?',
            content: '这些内容还没有保存呦~',
            onOk() {
                console.log('确定');
                hashHistory.push({pathname:'/about/wpdmp/dmp/apilist/blackList',state:sessionStorage.getItem("systemId")})
            },
            onCancel() {},
        });

    },
    render() {
        const apiId=parseFloat(this.props.location.query.apiId)
        const { getFieldProps, getFieldError, isFieldValidating } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 8},
            wrapperCol: { span:16 },
        }
        const nameProps = getFieldProps('wbName', {
            validate:[{
                rules: [
                    { max:20, message: '用户名至多为20 个字哦~~' },
                ],
                trigger: 'onChange'
            },{
                rules: [
                    { required: true,message:'嘿,你好像忘写什么了~~' },
                ],
                trigger: 'onBlur'
            }]

        });
        const path=getFieldProps('ip', {
            validate:[{
                rules: [
                    { required: true,message:'嘿,你好像忘写什么了~~' },
                ],
                trigger: 'onBlur'
            }]
        });
        const description=getFieldProps('wbDesc',{
            validate:[{
                rules: [
                    { max:200, message: '描述至多为200 个字哦~~' },
                ],
                trigger: 'onChange'
            },{
                rules: [
                    { required: true,message:'嘿,你好像忘写什么了~~' },
                ],
                trigger: 'onBlur'
            }]
        })
        const typeProps=getFieldProps('wbType', {
            rules: [
                { required: true, message: '请选择您的方法' },
            ],
        });
        return (
            <div className="main-container">
                <div className="container">
                    <div className="main clearfix">
                        <div className="outer-container">
                            <div className="inner-container">
                                <div className="content scroll-content clearfix">
                                    <Form inline className='clearfix' style={{width:"90%",paddingTop:'20px',margin:"0 auto"}}>
                                        <div style={{width:'90%',marginLeft:"10%"}}>
                                            <Row justify='start' type="flex" style={{marginBottom:18}}>

                                                <FormItem
                                                    id="name"
                                                    label="黑白名单名称"
                                                    {...formItemLayout}
                                                    style={{width:'38%',height:34}}
                                                >
                                                    <Input id="name" {...nameProps} placeholder="Please enter..." />
                                                </FormItem>

                                                <FormItem
                                                    id="timeout"
                                                    label="黑白名单地址"
                                                    span={12}
                                                    {...formItemLayout}
                                                    style={{width:'38%',height:34}}
                                                >
                                                    <Input id="timeout" {...path} placeholder="Please enter..." />
                                                </FormItem>

                                            </Row>

                                            <Row justify='start' type="flex" style={{marginBottom:18}}>
                                                <FormItem
                                                    id="description"
                                                    label="黑白名单描述"
                                                    labelCol={{ span:4 }}
                                                    wrapperCol={{ span: 20 }}
                                                    style={{width:'76%'}}
                                                >
                                                    <Input type="textarea" {...description} id="description" rows="3" />
                                                </FormItem>
                                            </Row>

                                            <Row justify='start' type="flex" style={{marginBottom:18}}>
                                                <FormItem
                                                    id="type"
                                                    label="黑白名单类型"
                                                    {...formItemLayout}
                                                    style={{width:'38%',height:34}}
                                                >
                                                    <Select {...typeProps} id="type" size="large"   placeholder='请选择api类型呦~'>
                                                        <Option value="1">黑</Option>
                                                        <Option value="2">白</Option>
                                                    </Select>
                                                </FormItem>
                                            </Row>

                                            <Row >
                                                <div style={{width:'80%'}}>
                                                    <BlackWhiteApi2 apiId={apiId}/>
                                                </div>

                                            </Row>

                                            <Row justify='start' type="flex" style={{marginBottom:18}}>
                                                <FormItem
                                                    wrapperCol={{ span:24 }}
                                                    style={{width:'76%',height:34}}
                                                >
                                                    <Button type="primary" onClick={this.handleSubmit}  style={{marginRight:"30px"}} >保存</Button>
                                                    <Button type="primary" onClick={this.returnBack} style={{marginRight:"30px"}}>返回</Button>

                                                </FormItem>
                                            </Row>
                                        </div>
                                    </Form>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        );
    }
})

BlackListRevise=Form.create()(BlackListRevise)

export {BlackListRevise} ;