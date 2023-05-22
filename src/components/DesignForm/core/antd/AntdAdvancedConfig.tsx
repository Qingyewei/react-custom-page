import { Button, Drawer, Form, Input, Select, Space } from "antd";
import React, { useRef, useState } from "react";
import Stroe from "@/utils/store";
import APIParamsCom from "./APIParamsCom";
import Request from "@/utils/request";
import type { FormInstance } from "antd/es/form";
import ViewJson from "./ViewJson";
const { Option } = Select;

const AdvancedService = {
  getDatasource: (data: any) => {
    return Request(data);
  },
};

export default function AntdAdvancedConfig() {
  const { page } = Stroe.getStateAll();
  const advancedFormRef = useRef<FormInstance>(null);
  const [dataSource, setDataSource] = useState<{
    loading: boolean;
    data: any;
    isDrawerStatus: boolean;
  }>({
    loading: false,
    data: null,
    isDrawerStatus: false,
  });
  const onValuesChange = (changedValues: any, allValues: any) => {
    Stroe.dispatch({ payload: allValues, type: "page" });
  };
  const getDatasource = () => {
    setDataSource((state) => ({ ...state, loading: true }));
    // eslint-disable-next-line no-unsafe-optional-chaining
    const { method, url, api_options } = advancedFormRef.current?.getFieldsValue();
    AdvancedService.getDatasource({
      url,
      method,
      ...api_options,
      data: api_options.paramsOrPayload,
    }).then((res) => {
      setDataSource((state) => ({ ...state,data:res, loading: false }));
      Stroe.dispatch({ payload: res, type: "dataSource" });
    });
  };

  return (
    <Form
      name="basic"
      layout="vertical"
      initialValues={page}
      ref={advancedFormRef}
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
          <Form.Item name="method" noStyle>
            <Select
              placeholder="请选择请求接口方式"
              allowClear
              style={{ width: "50%" }}
            >
              <Option value="POST">POST</Option>
              <Option value="GET">GET</Option>
            </Select>
          </Form.Item>
          <Form.Item name="url" noStyle>
            <Input />
          </Form.Item>
          <Button type="primary" onClick={getDatasource}>
            运行
          </Button>
        </Space.Compact>
        <Form.Item name="api_options">
          <APIParamsCom />
        </Form.Item>
        <Button
          type="primary"
          loading={dataSource.loading}
          disabled={dataSource.data === null}
          onClick={() => setDataSource((state) => ({ ...state, isDrawerStatus: true }))}
        >
          {dataSource.data !== null ?"查看数据源":'请先运行'}
        </Button>
        <Drawer
          title="Drawer with extra actions"
          placement="right"
          width={500}
          onClose={() => setDataSource((state) => ({ ...state, isDrawerStatus: false }))}
          open={dataSource.isDrawerStatus}
          extra={
            <Space>
              <Button onClick={() => setDataSource((state) => ({ ...state, isDrawerStatus: false }))}>Cancel</Button>
              <Button type="primary" onClick={() => setDataSource((state) => ({ ...state, isDrawerStatus: false }))}>
                OK
              </Button>
            </Space>
          }
        >
          <ViewJson value={dataSource.data} />
        </Drawer>
      </Form.Item>
    </Form>
  );
}
