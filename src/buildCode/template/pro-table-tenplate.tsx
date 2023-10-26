
import { ActionType, ProColumns } from "@ant-design/pro-components";
import { ProTable } from "@ant-design/pro-components";
import {
  Button,
  Form,
  FormInstance,
  Input,
  Modal,
  Select,
  TablePaginationConfig,
} from "antd";
import { useRef, useState } from "react";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import localeData from "dayjs/plugin/localeData";
import _ from "lodash";
import { warehouseAdd, warehouseEdit, warehouseQueryPage } from "@/api";

dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.locale("en");
dayjs.locale("vi");
export const waitTimePromise = async (time = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

export const waitTime = async (time = 100) => {
  await waitTimePromise(time);
};

const AddAndEditBtn = ({ dataSource, type = "add", tableRef }: any) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const formRef = useRef<FormInstance>(null);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    formRef.current
      ?.validateFields()
      .then((values) => {
        let apiPromise = warehouseAdd;
        const params = {
          ...values,
        };
        if (type === "edit") {
          apiPromise = warehouseEdit;
          params.warehouse_id = dataSource.warehouse_id
        }
        apiPromise(params)
          .then((res) => {
            setIsModalOpen(false);
            tableRef.current?.reload();
          })
          .catch((err) => {
            console.error(err);
          });
      })
      .catch((errorInfo) => {
        console.error(errorInfo);
      });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Button type={type === "add" ? "primary" : "link"} onClick={showModal}>
        {type === "add" ? "新增" : "编辑"}
      </Button>
      <Modal
        title={type === "add" ? "新增" : "编辑"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        destroyOnClose
      >
        <Form
          name="basic"
          ref={formRef}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={type === "edit" ? dataSource : {}}
          autoComplete="off"
        >
          <Form.Item
            label="仓库名称"
            name="warehouse_name"
            rules={[{ required: true, message: "请输入仓库名称!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="仓库类型"
            name="warehouse_type"
            rules={[{ required: true, message: "请输入仓库类型!" }]}
          >
            <Select
              options={[
                { value: 1, label: "单层" },
                { value: 2, label: "多层" },
              ]}
            />
          </Form.Item>
          <Form.Item
            label="描述信息"
            name="descr"
            rules={[{ required: true, message: "请选择描述信息!" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default () => {
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<any>[] = [
    {
      title: "序号",
      dataIndex: "index",
      valueType: "index",
      width: 80,
      align: "center",
    },
    {
      dataIndex: "warehouse_name",
      key: "warehouse_name",
      title: "仓库名称",
      align: "center",
      width: 190,
    },
    {
      dataIndex: "warehouse_type",
      key: "warehouse_type",
      title: "仓库类型",
      align: "center",
      valueType: "select",
      valueEnum: {
        '1': {
          text: "单层",
        },
        '2': {
          text: "多层",
        },
      },
    },
    {
      dataIndex: "descr",
      key: "descr",
      title: "描述信息",
      hideInSearch: true,
      align: "center",
    },
    {
      dataIndex: "create_name",
      key: "create_name",
      title: "创建人",
      align: "center",
      hideInSearch: true,
    },
    {
      dataIndex: "create_time",
      key: "create_time",
      title: "创建时间",
      align: "center",
      hideInSearch: true,
      valueType: "dateTime",
    },
    {
      title: "操作",
      valueType: "option",
      key: "option",
      fixed: "right",
      width: 100,
      align: "center",
      render: (text, record, rowKey, action) => [
        <AddAndEditBtn
          key="2"
          type="edit"
          dataSource={record}
          tableRef={actionRef}
        />,
      ],
    },
  ];

  const [dataSource, setDataSource] = useState<any[]>([]);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  return (
    <>
      <ProTable
        columns={columns}
        actionRef={actionRef}
        cardBordered
        dataSource={dataSource}
        scroll={{ x: "100%" }}
        request={async (params = {}, sort, filter) => {
          try {
            const result: any = await warehouseQueryPage({
              current: params.current,
              pageSize: params.pageSize,
              ...params,
            });
            const data = _.get(result, "data");

            setDataSource(data);
            setPagination({
              ...pagination,
              total: _.get(result, "count"),
            });
            return Promise.resolve({
              data,
              success: true,
              total: _.get(result, "count"),
            });
          } catch (err) {
            console.error(err);
            return Promise.resolve({
              data: [],
              success: false,
              total: 0,
            });
          }
        }}
        rowKey="warehouse_id"
        search={{
          labelWidth: "auto",
        }}
        options={{
          setting: {
            listsHeight: 400,
          },
        }}
        pagination={{
          ...pagination,
          onChange: (current, pageSize) => {
            setPagination({
              ...pagination,
              current,
              pageSize,
            });
            if (pagination.pageSize !== pageSize) {
              setDataSource([]);
            }
          },
        }}
        dateFormatter="string"
        headerTitle=""
        toolBarRender={() => [
          <AddAndEditBtn key="add" type="add" tableRef={actionRef} />,
        ]}
      />
    </>
  );
};
