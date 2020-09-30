import React from 'react'
import {Form, Select, Button, DatePicker, Input} from 'antd';
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
            labelCol: {span: 8},
            wrapperCol: {span: 15},
        };       
        
        return (
            <Form {...formItemLayout}>
                <SearchPanel colNum={3} rowNum={2}>
                    {[
                        [                            	
                            <FormItem label="放款日期">
                                {getFieldDecorator('distrDt', {
								    initialValue: [defaultSelectDate.startDate, defaultSelectDate.endDate]
								})(
                                    <RangePicker disabledDate={disabledDate}/>
                                )}
                            </FormItem>,                           
                            <Form.Item
						      label="放款金额（元）"						      
						    >
						      <Form.Item	
						        style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}
						      >
						        {
			                        getFieldDecorator('rateStart', {
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
			                        getFieldDecorator('rateEnd', {
			                            rules: [{required: true, message: '请输入正确的金额'}, {
	                                        validator: this.checkPassword
	                                    }]
			                        })
			                        
			                        (<Input placeholder="请填写金额"/>)
			                    }
						      </Form.Item>
						    </Form.Item>,
						    <FormItem label="融资单单号">
                                {getFieldDecorator('kimmyTransCode')(
                                    <Input style={{fontSize: 13}} placeholder="请输入融资单单号"/>
                                )}
                            </FormItem>,
                            <FormItem label="卖方名称">
                                {getFieldDecorator('enterpriseNumber')(
                                    <Input style={{fontSize: 13}} placeholder="请输入名称"/>
                                )}
                            </FormItem>                                                        
                        ],
                        [
                            <Button type="primary" key={1} onClick={this.handleSearch}>查 询</Button>,
                            <Button style={{marginLeft: 8}} onClick={this.handleReset.bind(this)} key={2}>重 置</Button>
                        ]
                    ]}
                </SearchPanel>
            </Form>
        );
    }
}
export default Form.create()(SearchForm);