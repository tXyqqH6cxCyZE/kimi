import React from 'react'
import {Form,  Select, Button,DatePicker, Input} from 'antd';
import SearchPanel from 'utils/searchPanel/index'
import {disabledDate, defaultSelectDate} from 'utils/format'

const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const {Option} = Select

class SearchForm extends React.Component {
    handleSearch = () => {
    	const {setState, getListData} = this.props
    	setState({
    		pageNum: 1
    	}, () => {
    		getListData();
    	})
        
    }
    handleReset = () => {
        this.props.form.resetFields();
    }
    
    checkAmount = (rule, value, callback) => {   	
        const form = this.props.form;
        let reg = /^\d{1,12}(\.\d{1,2})?$/
        if (value && parseFloat(value, 10) <= parseFloat(form.getFieldValue('minAmount'), 10)) {
            callback('结束金额必须大于开始金额!');
        } else if (value && !reg.test(parseFloat(value, 10))) {
        	callback('限制纯数字，小数点前最多12位，小数点后最多2位!');       	
        }else {
            callback();
        }
    }
    render() {
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {span: 6},
            wrapperCol: {span: 15},
        };
        return (
            <Form {...formItemLayout}>
                <SearchPanel colNum={3} rowNum={2}>
                    {[
                        [    
                        	<FormItem label="粮票单号：" key={1}>
                                {getFieldDecorator('kingmiId')(
                                    <Input style={{fontSize: 13}} placeholder="请输入粮票单号"/>
                                )}
                            </FormItem>,
                            <FormItem label="粮票申请日期" key={2}>
                                {getFieldDecorator('distrDt', {
								    initialValue: [defaultSelectDate.startDate, defaultSelectDate.endDate]
								})(
                                    <RangePicker disabledDate={disabledDate}/>
                                )}
                            </FormItem>,
                            <FormItem label="买方/卖方名称：" key={3}>
                                {getFieldDecorator('enterpriseName')(
                                    <Input style={{fontSize: 13}} placeholder="请输入名称"/>
                                )}
                            </FormItem>,
                            <FormItem label="提交角色" key={4}>
                                {getFieldDecorator('submitRole')(
                                    <Select
                                        placeholder="请选择"                                       
                                    >
                                       <Option value = "1">供应商上传</Option>
                                       <Option value = "2">核心企业上传</Option>
                                    </Select>
                                )}
                            </FormItem>,
                            <Form.Item
						      label="粮票金额(元)"
						    >
						      <Form.Item	
						        style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}
						      >
						        {
			                        getFieldDecorator('minAmount', {
			                            rules:[{message: '请输入正确的金额'},{pattern: /^\d{1,12}(\.\d{1,2})?$/, message:'限制纯数字，小数点前最多12位，小数点后最多2位'}]
			                        })
			                        (<Input placeholder="请填写金额"/>)
			                    }
						      </Form.Item>
						      <span style={{ display: 'inline-block', width: '24px', textAlign: 'center' }}>
						        -
						      </span>
						      <Form.Item
						        style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}
						      >
						        {
			                        getFieldDecorator('maxAmount', {
			                            rules: [{
	                                        validator: this.checkAmount
	                                    }]
			                        })
			                        
			                        (<Input placeholder="请填写金额"/>)
			                    }
						      </Form.Item>
						    </Form.Item>
                            
                        ],
                        [
                            <Button type="primary" onClick={this.handleSearch} key={6}>查 询</Button>,
                            <Button style={{marginLeft: 8}} onClick={this.handleReset} key={7}>重 置</Button>
                        ]
                    ]}
                </SearchPanel>
            </Form>
        );
    }
}
export default Form.create()(SearchForm);
