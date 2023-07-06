import Store from "@/utils/store";
import _ from "lodash";
import { isString } from "lodash";

// 首个字母大写
function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getAntdComonpentName(list: any[]) {
  const names = list.map((item) => {
    let name = capitalizeFirstLetter(item.type);
    if (name === "Input.Password" || name === "Input.TextArea") {
      name = "Input";
    }
    return name;
  });
  return names;
}

function getFormPropsStr(props: any) {
  const { name, label, options, id, type } = props;
  const formProps = {
    name: name ? name : id,
    label,
    rules: options.rules,
    valuePropName: options.valuePropName,
  };
  let formPropsStr = "";
  for (const f of Object.entries(formProps)) {
    if (f[1]) {
      if (f[0] === "rules") {
        formPropsStr += `${f[0]}={[${JSON.stringify(f[1])}]} `;
      } else {
        formPropsStr += `${f[0]}=${JSON.stringify(f[1])} `;
      }
    }
  }
  return formPropsStr;
}

function getComponentPropsStr(props: any) {
  const { options, type } = props;
  const componentProps = {
    ...options,
  };

  let componentPropsStr = "";
  const exclusionAttrs = [
    "valuePropName",
    "rules",
    "defaultValue",
    "remoteFunc",
    "remoteOptions",
  ];
  if (type === "Radio") {
    exclusionAttrs.push("options");
  }
  if (type === "TimePicker") {
    exclusionAttrs.push("isRangePicker",'placeholder');
  }
  for (const f of Object.entries(componentProps)) {
    if (f[1] && !exclusionAttrs.includes(f[0])) {
      if (!isString(f[1])) {
        componentPropsStr += `${f[0]}={${JSON.stringify(f[1])}}`;
      } else {
        componentPropsStr += `${f[0]}=${JSON.stringify(f[1])} `;
      }
    }
  }

  return componentPropsStr;
}

function getAntdComponentStr(props: any) {
  const { type } = props;
  const componentName = capitalizeFirstLetter(type);
  const formPropsStr = getFormPropsStr(props);
  const componentPropsStr = getComponentPropsStr(props);
  if (componentName === "Radio") {
    const strs = _.get(props, "options.options", []).map(
      (item: any, index: any) => {
        return (
          item &&
          `<Radio key="${index}" value="${item.value}">
          ${item.label}
        </Radio>`
        );
      }
    );
    return `<Form.Item
      ${formPropsStr}
    >
    <Radio.Group ${componentPropsStr}>
      ${strs.join("")}
    </Radio.Group>
    </Form.Item>`;
  } else if (componentName === "Checkbox") {
    return `<Form.Item
      ${formPropsStr}
    >
    <Checkbox.Group ${componentPropsStr} />
    </Form.Item>`;
  } else if (
    componentName === "TimePicker" &&
    _.get(props, "options.isRangePicker", false)
  ) {
    console.log("TimePicker时",formPropsStr,props)
    return `<Form.Item
      ${formPropsStr}
    >
      <${componentName}.RangePicker ${componentPropsStr}/>
    </Form.Item>`;
  } else {
    return `<Form.Item
      ${formPropsStr}
    >
      <${componentName} ${componentPropsStr}/>
    </Form.Item>`;
  }
}

function buildCode() {
  const { list } = Store.getStateAll();
  const componentNames = getAntdComonpentName(list);
  let listStr = "";
  list.forEach((item) => {
    listStr += getAntdComponentStr(item);
  });

  return `import { Button, Form, Space, ${componentNames.join(
    ", "
  )} } from 'antd';
  import React from 'react';
  
  const Index: React.FC = () => {
    const [form] = Form.useForm();
  
    const onFinish = (values: any) => {
      console.log(values);
    };
  
    const onReset = () => {
      form.resetFields();
    };
  
    return (
      <Form
          name="templateForm"
          form={form}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          onFinish={onFinish}
          autoComplete="off"
        >
          ${listStr}
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
  
  export default Index;`;
}

export default buildCode;

// Store.subscribe(() => {
//   buildCode();
// });
