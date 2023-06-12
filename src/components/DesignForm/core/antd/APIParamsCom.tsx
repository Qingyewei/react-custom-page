import React, { useContext, useEffect, useRef, useState } from "react";
import { InputRef, Modal, Tabs, Tooltip } from "antd";
import { Button, Form, Input, Popconfirm, Table } from "antd";
import type { FormInstance } from "antd/es/form";
import "./APIParamsCom.less";
import { CloseCircleOutlined, EditOutlined } from "@ant-design/icons";
import AceEditorPage from "./AceEditorPage";
import Store from "@/utils/store";
const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface Item {
  key: string;
  name: string;
  age: string;
  address: string;
}

interface EditableRowProps {
  index: number;
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: keyof Item;
  record: Item;
  handleSave: (record: Item) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const form = useContext(EditableContext)!;

  useEffect(() => {
    if (editing) {
      inputRef.current!.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();

      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.error("Save failed:", errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap ant-table-cell-ellipsis"
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

type EditableTableProps = Parameters<typeof Table<any>>[0];

interface DataType {
  key: React.Key;
  name: string;
  value: string;
}

type ColumnTypes = Exclude<EditableTableProps["columns"], undefined>;

interface TableParamsProps {
  value?: DataType[];
  onChange?: (value: DataType[]) => void;
}

const TableParams: React.FC<TableParamsProps> = ({ value = [], onChange }) => {
  const [dataSource, setDataSource] = useState<DataType[]>(value);

  const [count, setCount] = useState(value.length + 1);

  const handleDelete = (key: React.Key) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
    onChange?.(newData);
  };

  const defaultColumns: (ColumnTypes[number] & {
    editable?: boolean;
    dataIndex: string;
  })[] = [
    {
      title: "参数名",
      dataIndex: "name",
      align: "center",
      editable: true,
      width: "40%",
      ellipsis: true,
    },
    {
      title: "参数值",
      dataIndex: "value",
      align: "center",
      editable: true,
      width: "40%",
      ellipsis: true,
    },
    {
      title: "操作",
      dataIndex: "operation",
      render: (_, record: { key: React.Key }) =>
        dataSource.length >= 1 ? (
          <Button type="text" onClick={() => handleDelete(record.key)}>
            <CloseCircleOutlined />
          </Button>
        ) : null,
    },
  ];

  const handleAdd = () => {
    const newData: DataType = {
      key: count,
      name: "ssss" + count,
      value: `Edward King ${count}`,
    };
    setDataSource([...dataSource, newData]);
    setCount(count + 1);
    onChange?.([...dataSource, newData]);
  };

  const handleSave = (row: DataType) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDataSource(newData);
    onChange?.(newData);
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: DataType) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  return (
    <>
      <Table
        components={components}
        rowClassName={() => "editable-row"}
        bordered
        dataSource={dataSource}
        columns={columns as ColumnTypes}
        pagination={false}
      />
      <Button onClick={handleAdd} type="primary" style={{ marginBottom: 16 }}>
        添加一行
      </Button>
    </>
  );
};

interface APIParamsComProps {
  value?: { headers: any; paramsOrPayload: any };
  onChange?: (value: { headers: any; paramsOrPayload: any }) => void;
}

const tabList = {
  POST: ["Header", "Data"],
  GET: ["Header", "Params"],
};

const APIParamsCom: React.FC<APIParamsComProps> = ({
  value = {
    headers: {},
    paramsOrPayload: {},
  },
  onChange,
}) => {
  const { page: config } = Store.getStateAll();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeKey, setActiveKey] = useState("Header");
  const modelRef = useRef<FormInstance>(null);
  const [dataSource, setDataSource] = useState(value);

  useEffect(() => {
    onChange?.(dataSource);
  }, [dataSource]);

  const conversionDataFormat = () => {
    const newList: DataType[] = [];
    const data =
      activeKey === "Header" ? dataSource.headers : dataSource.paramsOrPayload;
    Object.keys(data).forEach((item, index) => {
      newList.push({
        key: `${index}`,
        name: item,
        value: data[item],
      });
    });
    return newList;
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    const key = activeKey === "Header" ? "headers" : "paramsOrPayload";
    const newData: any = { ...dataSource };
    const tableData = modelRef.current?.getFieldsValue();
    tableData.data &&
      tableData.data?.forEach((element: DataType) => {
        newData[key][element.name] = element.value;
      });

    setDataSource(newData);
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onTabsChange = (activeKey: string) => {
    setActiveKey(activeKey);
  };

  return (
    <>
      <Tabs
        defaultActiveKey="Header"
        onChange={onTabsChange}
        tabBarExtraContent={{
          right: (
            <Button type="text" onClick={showModal}>
              <EditOutlined />
            </Button>
          ),
        }}
        items={tabList[config.method].map((item) => {
          return {
            label: item,
            key: item,
            children: (
              <AceEditorPage
                key={item}
                name={item}
                mode="json"
                defaultValue={JSON.stringify(
                  item === "Header"
                    ? dataSource.headers
                    : dataSource.paramsOrPayload
                )}
              />
            ),
          };
        })}
      />
      <Modal
        title={`编辑${activeKey === "Header" ? "Header" : "Params"}参数信息`}
        open={isModalOpen}
        onOk={handleOk}
        destroyOnClose={true}
        onCancel={handleCancel}
      >
        <Form ref={modelRef} initialValues={{ data: conversionDataFormat() }}>
          <Form.Item name="data">
            <TableParams />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default APIParamsCom;
