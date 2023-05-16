import { Button, Form, Input, Select, Space } from "antd";
import React, { useState } from "react";
import Stroe from "@/utils/store";
import APIParamsCom from "./APIParamsCom";
const { Option } = Select;

export default function AntdAdvancedConfig() {
  const { page } = Stroe.getStateAll();
  const onValuesChange = (changedValues: any, allValues: any) => {
    Stroe.dispatch({ payload: allValues, type: "page" });
  };
  return (
    <Form
      name="basic"
      layout="vertical"
      initialValues={page}
      autoComplete="off"
      onValuesChange={onValuesChange}
    >
      <Form.Item name="showType" label="页面展示类型">
        <Select placeholder="请选择页面展示类型" allowClear>
          <Option value="page">页面</Option>
          <Option value="model">弹窗</Option>
          <Option value="tab">新标签页</Option>
        </Select>
      </Form.Item>
      <Form.Item name="type" label="页面类型">
        <Select placeholder="请选择页面类型" allowClear>
          <Option value="detail">详情</Option>
          <Option value="curd">CRUD表单</Option>
        </Select>
      </Form.Item>
      <Form.Item label="请求接口">
        <Space.Compact style={{ width: "100%" }}>
          <Form.Item name="api_type" noStyle>
            <Select
              placeholder="请选择请求接口方式"
              allowClear
              style={{ width: "50%" }}
            >
              <Option value="POST">POST</Option>
              <Option value="GET">GET</Option>
            </Select>
          </Form.Item>
          <Form.Item name="api_url" noStyle>
            <Input />
          </Form.Item>
          <Button type="primary">运行</Button>
        </Space.Compact>
      </Form.Item>
      <APIParamsCom />
    </Form>
  );
}
