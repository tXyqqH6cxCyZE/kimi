import React from 'react'
import {Form, Button,DatePicker, Input} from 'antd';
import SearchPanel from 'utils/searchPanel/index'
import {disabledDate, defaultSelectDate} from 'utils/format'

const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;

class SearchForm extends React.Component {
    handleSearch = () => {
        this.props.getListData();
    }
    handleReset = () => {
        this.props.form.resetFields();
    }
    
    checkPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value <= form.getFieldValue('rateStart')) {
            callback('结束金额必须大于开始金额!');
        } else {
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
                        	
                            <FormItem label="结算日期"  key={1}>
                                {getFieldDecorator('distrDt', {
								    initialValue: [defaultSelectDate.startDate, defaultSelectDate.endDate]
								})(
                                    <RangePicker disabledDate={disabledDate}/>
                                )}
                            </FormItem>,
                            <FormItem label="买方/卖方名称：" key={2}>
                                {getFieldDecorator('enterpriseName')(
                                    <Input style={{fontSize: 13}} placeholder="请输入名称"/>
                                )}
                            </FormItem>,                            
                            <Form.Item
						      label="结算金额(元)"
						      key={3}
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
			                            rules: [{required: true, message: '请输入正确的金额'}, {
	                                        validator: this.checkPassword
	                                    }]
			                        })
			                        
			                        (<Input placeholder="请填写金额"/>)
			                    }
						      </Form.Item>
						    </Form.Item>,
						    <FormItem label="粮票单号：" key={4}>
                                {getFieldDecorator('kingmiId')(
                                    <Input style={{fontSize: 13}} placeholder="请输入粮票单号"/>
                                )}
                            </FormItem>,
                            <Form.Item
						      label="到期日"
						      key={5}
						    >
						      <Form.Item	
						        style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}
						      >
						        {
			                        getFieldDecorator('startDate', {
			                            rules:[{message: '请输入到期日'},{pattern: /^\d{1,12}(\.\d{1,2})?$/, message:'限制纯数字，小数点前最多12位，小数点后最多2位'}]
			                        })
			                        (<Input placeholder="请输入到期日"/>)
			                    }
						      </Form.Item>
						      <span style={{ display: 'inline-block', width: '24px', textAlign: 'center' }}>
						        -
						      </span>
						      <Form.Item
						        style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}
						      >
						        {
			                        getFieldDecorator('endDate', {
			                            rules: [{required: true, message: '请输入到期日'}, {
	                                        validator: this.checkPassword
	                                    }]
			                        })
			                        
			                        (<Input placeholder="请输入到期日"/>)
			                    }
						      </Form.Item>
						    </Form.Item>,
						    <Form.Item
						      label="粮票金额(元)"
						      key={5}
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
			                            rules: [{required: true, message: '请输入正确的金额'}, {
	                                        validator: this.checkPassword
	                                    }]
			                        })
			                        
			                        (<Input placeholder="请填写金额"/>)
			                    }
						      </Form.Item>
						    </Form.Item>				    
                        ],
                        [
                            <Button type="primary" key={6} onClick={this.handleSearch}>查 询</Button>,
                            <Button style={{marginLeft: 8}} onClick={this.handleReset.bind(this)} key={7}>重 置</Button>
                        ]
                    ]}
                </SearchPanel>
            </Form>
        );
    }
}
export default Form.create()(SearchForm);