import React, { useEffect, useState } from "react";
import { Button, Drawer, Layout, Tabs } from "antd";
import styles from "./AntdDesignForm.module.less";
import ComponentGroup from "./ComponentGroup";
import {
  CloseOutlined,
  PushpinOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import useDrwaer from "./useDrwaer";
import { element } from "../../config";
import AntdWidget from "./AntdWidget";
import AntdAdvancedConfig from "./AntdAdvancedConfig";
import Store from "@/utils/store";
import WidgetConfig from "./WidgetConfig";

const { Header, Sider, Content } = Layout;

export default function AntdDesignForm() {
  const { drawOption, openDrawer, handleClose, handleFix, antdDrawRef } =
    useDrwaer();

  const [list1, setList1] = useState(["Item 1", "Item 2", "Item 3"]);
  const [list2, setList2] = useState<any[]>([]);

  const handleDrop = (id: any) => {
    const item = list1.find((item) => item === id);
    setList1(list1.filter((item) => item !== id));
    setList2([...list2, item]);
  };

  const getConfigPage = (type: string) => {
    switch (type) {
      case "字段属性":
        return <WidgetConfig />;
      case "页面属性":
        return "页面属性";
      case "高级":
        return (
          <AntdAdvancedConfig />
        );
    }
  };

  return (
    <Layout className={styles.layout}>
      <Header className={styles.header}>Header</Header>
      <Layout>
        <Sider width={drawOption.drawerWidth ? "48px" : "348px"}>
          <div className="left-sider-btn">
            <UnorderedListOutlined onClick={openDrawer} />
          </div>
          <Drawer
            title="Basic Drawer"
            placement="left"
            closable={false}
            mask={false}
            onClose={handleClose}
            open={drawOption.isOpen}
            getContainer={false}
            className="left-sider-drawer"
            width={300}
            extra={
              <>
                <Button type="text" onClick={handleFix}>
                  <PushpinOutlined />
                </Button>
                <Button type="text" onClick={handleClose}>
                  <CloseOutlined />
                </Button>
              </>
            }
          >
            <div ref={antdDrawRef} className="drawer-content">
              <ComponentGroup title="基础组件" type="basicComponents" list={element.basicComponents} />
            </div>
          </Drawer>
        </Sider>
        <Content>
          <AntdWidget />
        </Content>
        <Sider width={300}>
          <Tabs
            defaultActiveKey="1"
            centered
            className="right-sider-tabs"
            style={{ width: "100%" }}
            items={["字段属性", "页面属性", "高级"].map((item, i) => {
              const id = String(i + 1);
              return {
                label: item,
                key: id,
                children: (
                  <Content className="right-sider-content">
                    {getConfigPage(item)}
                  </Content>
                ),
              };
            })}
          />
        </Sider>
      </Layout>
    </Layout>
  );
}
