import React from "react";
import { Form, Input, Button, Select, Modal, Upload, Icon } from "antd";
const { Option } = Select;
const FormItem = Form.Item;

const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 15 },
};

function BillModal(props) {
  const {
    visibled,
    handleCancel,
    handleOk,
    handleChange,
    handleRemove,
    customRequest,
    beforeUpload,
  } = props;
  const { getFieldDecorator, validateFields } = props.form;
  const uploadProps = {
    beforeUpload,
    customRequest,
    accept: ".png,.jpeg,.jpg",
  };
  return (
    <Modal
      destroyOnClose
      title="添加票据"
      visible={visibled}
      okText="提交"
      cancelText="取消"
      maskClosable={false}
      onCancel={handleCancel}
      onOk={(e) => {
        e.preventDefault();
        handleOk(validateFields);
      }}
    >
      <Form {...formItemLayout}>
        <FormItem label="业务类型">
          {getFieldDecorator("businessType", {
            rules: [{ required: true, message: "请填写业务类型" }],
            initialValue: 0,
          })(
            <Select>
              <Option value={0}>应收账款</Option>
              <Option value={1}>应付账款</Option>
            </Select>
          )}
        </FormItem>
        <FormItem label="购买方">
          {getFieldDecorator("buyer", {
            rules: [
              {
                required: true,
                message: "请填写购买方",
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="销售方">
          {getFieldDecorator("seller", {
            rules: [
              {
                required: true,
                message: "请填写销售方",
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="发票附件">
          {getFieldDecorator("fileId", {
            rules: [
              {
                required: true,
                message: "请填写发票附件",
              },
              {
                validator: (rule, value, callback) => {
                  if (value) {
                    if (!value.fileList.length) {
                      callback("请填写发票附件");
                    }
                    if (value.file.status === "error") {
                      callback("请重新上传发票附件");
                    }
                  }
                  callback();
                },
              },
            ],
          })(
            <Upload
              {...uploadProps}
              onChange={handleChange}
              onRemove={handleRemove}
            >
              <Button>
                <Icon type="upload" /> Click to Upload
              </Button>
            </Upload>
          )}
        </FormItem>
        <p className="mly-tip">*只能上传PNG、JPG、JPEG格式，且文件 小于5M</p>
      </Form>
    </Modal>
  );
}

export default Form.create()(BillModal);
