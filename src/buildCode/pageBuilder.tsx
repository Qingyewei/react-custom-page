import _ from "lodash";
import Store from "@/utils/store";
import { getAntdComonpentName, getAntdComponentStr } from "./utils";
import { ProColumns } from "@ant-design/pro-components";

export default () => {
  const { list } = Store.getStateAll();
  const componentNames = getAntdComonpentName(list);
  let listStr = "";
  const initialValues: any = {};
  const columns: string[] = [
    `{title: "序号", dataIndex: "index", valueType: "index", width: 80, align: "center",}`,
  ];
  list.forEach((item) => {
    listStr += getAntdComponentStr(item);
    if (_.get(item, "options.defaultValue")) {
      initialValues[item.name] = _.get(item, "options.defaultValue");
    }
    console.log("Setting", item);
    if (item.type === "Select") {
      const valueEnum: any = [];
      _.get(item, "options.options", []).forEach((item: any) => {
        valueEnum.push(`'${item.value}':{
          text: "${item.label}",
        }`);
      });
      columns.push(
        `{dataIndex: "${item.name}", key: "${item.name}", title: "${
          item.label
        }", align: "center", valueType: "select",valueEnum: {
          ${valueEnum.join(",")}
        },}`
      );
    } else if (item.type === "DatePicker") {
      columns.push(
        `{dataIndex: "${item.name}", key: "${item.name}", title: "${item.label}", align: "center", valueType: "dateTime",}`
      );
      columns.push(
        `{dataIndex: "${item.name}", key: "${item.name}", title: "${item.label}", align: "center", valueType: "dateTimeRange", hideInTable: true, search: {
          transform: (value) => {
            return {
              ${item.name}_beginDate: value[0],
              ${item.name}_endDate: value[1],
            };
          },
        },}`
      );
    }else if(item.type === 'TimePicker'){
      columns.push(
        `{dataIndex: "${item.name}", key: "${item.name}", title: "${item.label}", align: "center", valueType: "time",}`
      );
      columns.push(
        `{dataIndex: "${item.name}", key: "${item.name}", title: "${item.label}", align: "center", valueType: "timeRange", hideInTable: true, search: {
          transform: (value) => {
            return {
              ${item.name}_beginDate: value[0],
              ${item.name}_endDate: value[1],
            };
          },
        },}`
      );
    } else {
      columns.push(
        `{dataIndex: "${item.name}", key: "${item.name}", title: "${item.label}", align: "center",}`
      );
    }
  });
  columns.push(`{
    title: "操作",
    valueType: "option",
    key: "option",
    fixed: "right",
    width: 100,
    align: "center",
    render: (text, record, rowKey, action) => [
      <AddAndEditBtn
        key="1"
        type="edit"
        dataSource={record}
        tableRef={actionRef}
      />,
    ],
  }`);
  return `
    import { ActionType, ProColumns } from "@ant-design/pro-components";
    import { ProTable } from "@ant-design/pro-components";
    import {
      Button,
      Form,
      FormInstance,
      Modal,
      TablePaginationConfig,
      ${componentNames.join(", ")}
    } from "antd";
    import { useRef, useState } from "react";
    import dayjs from "dayjs";
    import weekday from "dayjs/plugin/weekday";
    import localeData from "dayjs/plugin/localeData";
    import _ from "lodash";
    
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
            // let apiPromise = AddServer;
            // const params = {
            //   ...values,
            // };
            // if (type === "edit") {
            //   apiPromise = EditServer;
            //   params.id = dataSource.id
            // }
            waitTime(2000).then((res) => {
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
              initialValues={type === "edit" ? dataSource : ${
                Reflect.ownKeys(initialValues).length !== 0 &&
                JSON.stringify(initialValues)
              }}
              autoComplete="off"
            >
            ${listStr}
            </Form>
          </Modal>
        </>
      );
    };
    
    export default () => {
      const actionRef = useRef<ActionType>();
      const columns: ProColumns<any>[] = [
        ${columns.join(",")}
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
                await waitTime(2000);
                // 这里模拟接口请求，根据项目自行修改
                const result: any = {
                    data:{},
                    success:true,
                    total:12,
                    message:"请求成功"
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
    `;
};
