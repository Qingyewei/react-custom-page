import { connect } from "@/utils/store";
import { Button, Drawer, Form, Modal, Space } from "antd";
import { memo, useState } from "react";
import { WidgetForm } from "../../config/element";
import Components from "./components";

function PreviewMode({ page, list }: Pick<WidgetForm, "page" | "list">) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewForm] = Form.useForm();

  const showModal = () => {
    setIsOpen(true);
  };

  const handleOk = () => {
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  const onFinish = (values: any) => {
    console.log(values);
  };

  const onReset = () => {
    viewForm.resetFields();
  };

  const getViewFormRender = () => {
    return (
      <Form
        name="viewForm"
        form={viewForm}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        onFinish={onFinish}
        autoComplete="off"
      >
        {list.map((content, index) => (
          <Components
            key={content.id || index}
            className="viewForm-c"
            {...content}
          />
        ))}
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Space wrap>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
            <Button htmlType="button" onClick={onReset}>
              重置
            </Button>
          </Space>
        </Form.Item>
      </Form>
    );
  };

  const getViewModelPage = () => {
    return (
      <Modal
        title="Basic Modal"
        open={isOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
    );
  };

  const getViewDrawPage = () => {
    return (
      <Drawer
        title="Basic Drawer"
        placement="bottom"
        height="100%"
        closable={false}
        onClose={handleCancel}
        open={isOpen}
        key="bottom"
        extra={
          <Space>
            <Button type="primary" onClick={handleCancel}>
              关闭
            </Button>
          </Space>
        }
      >
        {getViewFormRender()}
      </Drawer>
    );
  };

  const getViewPage = () => {
    switch (page.showType) {
      case "model":
        return getViewModelPage();
      case "page":
        return getViewDrawPage();
      default:
        break;
    }
  };
  return (
    <>
      <Button type="primary" onClick={showModal}>
        预览
      </Button>
      {getViewPage()}
    </>
  );
}

export default connect((state: WidgetForm) => ({
  page: state.page,
  list: state.list,
}))(memo(PreviewMode));
