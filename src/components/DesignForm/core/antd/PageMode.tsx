import { ActionType, ProColumns } from "@ant-design/pro-components";
import { ProTable } from "@ant-design/pro-components";
import { Button, Form, FormInstance, Modal, TablePaginationConfig } from "antd";
import { useRef, useState } from "react";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import localeData from "dayjs/plugin/localeData";
import _ from "lodash";
import Components from "./components";
import Store from "@/utils/store";

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
  const { list } = Store.getStateAll();
  const initialValues: any = {};
  list.forEach((item) => {
    if (_.get(item, "options.defaultValue")) {
      initialValues[item.name] = _.get(item, "options.defaultValue");
    }
  });

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    formRef.current
      ?.validateFields()
      .then((values) => {
        // let apiPromise = AddServer;
        // const params = {
        //   ...values,
        // };
        // if (type === "edit") {
        //   apiPromise = EditServer;
        //   params.id = dataSource.id
        // }
        waitTime(2000)
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
          initialValues={type === "edit" ? dataSource : initialValues}
          autoComplete="off"
        >
          {list.map((content, index) => (
            <Components
              key={content.id || index}
              className="pageMode-c"
              {...content}
            />
          ))}
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
  ];
  const { list } = Store.getStateAll();
  list.forEach((item) => {
    if (item.type === "Select") {
      const valueEnum: any = {};
      _.get(item, "options.options", []).forEach((item: any) => {
        valueEnum[item.value] = {
          text: item.label,
        };
      });
      columns.push({
        dataIndex: item.name,
        key: item.name,
        title: item.label,
        align: "center",
        valueType: "select",
        valueEnum,
      });
    } else if (item.type === "DatePicker") {
      columns.push({
        dataIndex: item.name,
        key: item.name,
        title: item.label,
        align: "center",
        valueType: "dateTime",
        hideInSearch: true,
      });
      columns.push({
        dataIndex: item.name,
        key: item.name,
        title: item.label,
        align: "center",
        valueType: "dateTimeRange",
        hideInTable: true,
        search: {
          transform: (value) => {
            return {
              [`${item.name}_beginDate`]: value[0],
              [`${item.name}_endDate`]: value[1],
            };
          },
        },
      });
    } else if (item.type === "TimePicker") {
      columns.push({
        dataIndex: item.name,
        key: item.name,
        title: item.label,
        align: "center",
        valueType: "time",
        hideInSearch: true,
      });
      columns.push({
        dataIndex: item.name,
        key: item.name,
        title: item.label,
        align: "center",
        valueType: "timeRange",
        hideInTable: true,
        search: {
          transform: (value) => {
            return {
              [`${item.name}_beginDate`]: value[0],
              [`${item.name}_endDate`]: value[1],
            };
          },
        },
      });
    } else {
      columns.push({
        dataIndex: item.name,
        key: item.name,
        title: item.label,
        align: "center",
      });
    }
  });

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
            await waitTime(2000);
            // 这里模拟接口请求，根据项目自行修改
            const result: any = {
              data: [],
              success: true,
              total: 12,
              message: "请求成功",
            };
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
