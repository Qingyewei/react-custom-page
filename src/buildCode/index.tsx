import Store from "@/utils/store";

// 首个字母大写
function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getAntdComonpentName(list: any[]) {
  const names = list.map((item) => {
    return capitalizeFirstLetter(item.type);
  });
  return names;
}

{
  /* <Form.Item
      name={name}
      label={label}
      rules={[options.rules]}
      valuePropName={valuePropName}
    >
      {children}
    </Form.Item> */
}

function getAntdComponentStr(props: any) {
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
      if(f[0] === 'rules'){
        formPropsStr += `${f[0]}={[${JSON.stringify(f[1])}]} `;
      }else{
        formPropsStr += `${f[0]}=${JSON.stringify(f[1])} `;
      }
    }
  }

  const componentProps = {
    ...options
  }

  let componentPropsStr = '';
  for (const f of Object.entries(componentProps)) {
    if (f[1] && !['valuePropName','rules'].includes(f[0] )) {
      componentPropsStr += `${f[0]}=${JSON.stringify(f[1])} `;
    }
  }
  const componentName = capitalizeFirstLetter(type)
      return `<Form.Item
      ${formPropsStr}
    >
      <${componentName} ${componentPropsStr}/>
    </Form.Item>`
}

function buildCode() {
  const { list } = Store.getStateAll();
  const componentNames = getAntdComonpentName(list);
  let listStr = ''
  list.forEach((item) => {
    listStr += getAntdComponentStr(item);
  });

  return `import { Button, Form, Space, ${componentNames.join(', ')} } from 'antd';
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
  
  export default Index;`
}

export default buildCode;

// Store.subscribe(() => {
//   buildCode();
// });
