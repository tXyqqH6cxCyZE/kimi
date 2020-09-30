import React from 'react'
import {Form,  Select, Button,DatePicker, Input} from 'antd';
import SearchPanel from 'utils/searchPanel/index'
import {connect} from 'react-redux'
import {ENTERPRISE_STATUS} from 'store/actionTypes'
import {format, getSelectOption, disabledDate, defaultSelectDate} from 'utils/format'

const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;

class SearchForm extends React.Component {
    handleSearch = () => {
        this.props.getListData();
    }
    handleReset = () => {
        this.props.form.resetFields();
    }    
    render() {
        const {getFieldDecorator} = this.props.form;
        const {statusList} = this.props;
        const formItemLayout = {
            labelCol: {span: 5},
            wrapperCol: {span: 15},
        };
        
	    let channelCd = getSelectOption(statusList)
        return (
            <Form onSubmit={this.handleSearch}>
                <SearchPanel colNum={3} rowNum={2}>
                    {[
                        [                           
                            <FormItem label="入网日期" {...formItemLayout} key={1}>
                                {getFieldDecorator('distrDt', {
								    initialValue: [defaultSelectDate.startDate, defaultSelectDate.endDate]
								})(
                                    <RangePicker disabledDate={disabledDate}/>
                                )}
                            </FormItem>,
                            <FormItem label="机构编号：" {...formItemLayout} key={2}>
                                {getFieldDecorator('enterpriseId')(
                                    <Input style={{fontSize: 13}} placeholder="请输入机构编号"/>
                                )}
                            </FormItem>,
                            <FormItem label="机构名称：" {...formItemLayout} key={3}>
                                {getFieldDecorator('name')(
                                    <Input style={{fontSize: 13}} placeholder="请输入机构名称"/>
                                )}
                            </FormItem>,
                            <FormItem label="营业执照号" {...formItemLayout} key={4}>
                                {getFieldDecorator('registerMark')(
                                    <Input style={{fontSize: 13}} placeholder="请输入营业执照号"/>
                                )}
                            </FormItem>,
                            <FormItem label="状态" {...formItemLayout} key={5}>
                                {getFieldDecorator('status')(
                                    <Select
                                        placeholder="请选择"
                                        allowClear                                      
                                    >
                                    {channelCd}
                                    </Select>
                                )}
                            </FormItem>
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

const mapStateToProps = (state) => {
	return {
		statusList: format(state.reducer.get('list').toJS(), ENTERPRISE_STATUS)
	}	
};

export default connect(mapStateToProps, null)(Form.create()(SearchForm));