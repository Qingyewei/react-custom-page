import { RuleObject, Rule } from "antd/es/form";

export interface WidgetForm {
  list: any[];
  config: {
    size: string;
    hideRequiredAsterisk: boolean;
    labelWidth: number;
    labelPosition: string;
  };
  page: {
    showType: "page" | "model" | "tab";
    type: "detail" | "form" | 'page';
    method: "POST" | "GET";
    url: string;
    api_options: {
      headers: {
        Account?: string;
        "Content-Type": string;
      };
      paramsOrPayload: any;
    };
  };
  dataSource?: any;
  widgetFormCurrentSelect?: any;
  widgetFormCurrentSelectIndex?: any;
}

export const widgetForm: WidgetForm = {
  list: [],
  config: {
    size: "small",
    hideRequiredAsterisk: false,
    labelWidth: 100,
    labelPosition: "right",
  },
  page: {
    showType: "page",
    type: "page",
    method: "POST",
    // api_url: location.href,
    url:"",
    // url: "https://times-crmtest.timesgroup.cn:38080/api/Appt/GetApptListInfos",
    // url: "https://times-crmtest.timesgroup.cn:28080/CRMAPIBeta/api/Delivery/GetDeliveryCacheInfo",
    api_options: {
      headers: {
        // Account: "beibei",
        "Content-Type": "application/json;charset=UTF-8",
      },
      paramsOrPayload: {
        // StepId: 524496,
        // TaskId: 69000,
        pageIndex: 1,
        pageSize: 10,
      },
    },
  },
};
export interface WidgetFormItem extends basicComponents {
  [x: string]: any;
  key?: string;
}

export const rules: Rule = {
  len: undefined,
  max: undefined,
  message: "请输入",
  min: undefined,
  required: false,
};

interface basicComponentsOptions {
  width: string | number;
  defaultValue: string;
  placeholder: string;
  maxlength: null | string;
  prefix: string;
  suffix: string;
  prepend: string;
  append: string;
  disabled: boolean;
  clearable: boolean;
  readonly: boolean;
  rules: RuleObject;
}
export interface basicComponents {
  label: string;
  type: "Input" | "Radio" | "Checkbox" | "Select";
  name: string;
  options: basicComponentsOptions;
}

export const basicComponents = [
  {
    label: "单行文本",
    type: "Input",
    options: {
      width: "100%",
      defaultValue: "",
      placeholder: "请输入",
      maxlength: null,
      prefix: "",
      suffix: "",
      prepend: "",
      append: "",
      disabled: false,
      clearable: false,
      readonly: false,
      rules,
    },
  },
  {
    label: "密码框",
    type: "Input.Password",
    options: {
      width: "100%",
      defaultValue: "",
      placeholder: "请输入",
      maxlength: null,
      prefix: "",
      suffix: "",
      prepend: "",
      append: "",
      visibilityToggle: true,
      disabled: false,
      clearable: false,
      readonly: false,
      rules,
    },
  },
  {
    label: "多行文本",
    type: "Input.TextArea",
    options: {
      width: "100%",
      defaultValue: "",
      placeholder: "请输入",
      maxlength: null,
      // rows: 4,
      autosize: false,
      showWordLimit: false,
      disabled: false,
      clearable: false,
      readonly: false,
      rules,
    },
  },
  {
    label: "计数器",
    type: "InputNumber",
    options: {
      width: "",
      defaultValue: 0,
      min: 0,
      max: 100,
      step: 1,
      disabled: false,
      rules,
    },
  },
  {
    label: "单选框组",
    type: "Radio",
    options: {
      defaultValue: "Option 1",
      width: "",
      remote: false,
      showLabel: false,
      remoteFunc:
        "https://raw.githubusercontent.com/fuchengwei/vue-form-create/master/mock/mock.json",
      options: [
        {
          value: "Option 1",
          label: "Option 1",
        },
        {
          value: "Option 2",
          label: "Option 2",
        },
        {
          value: "Option 3",
          label: "Option 3",
        },
      ],
      remoteOptions: [],
      disabled: false,
      rules,
    },
  },
  {
    label: "多选框组",
    type: "Checkbox",
    options: {
      defaultValue: [],
      width: "",
      remote: false,
      remoteFunc:
        "https://raw.githubusercontent.com/fuchengwei/vue-form-create/master/mock/mock.json",
      options: [
        {
          label: "Option 1",
          value: "Option 1",
        },
        {
          label: "Option 2",
          value: "Option 2",
        },
        {
          label: "Option 3",
          value: "Option 3",
        },
      ],
      remoteOptions: [],
      disabled: false,
      rules,
    },
  },
  {
    label: "时间选择器",
    type: "TimePicker",
    options: {
      defaultValue: "",
      width: "",
      placeholder: "请选择时间",
      format: "HH:mm:ss",
      valueFormat: "HH:mm:ss",
      disabled: false,
      rules: {
        type: "object" as const,
        required: false,
        message: "请选择时间",
      },
    },
  },
  {
    label: "日期选择器",
    type: "DatePicker",
    options: {
      defaultValue: "",
      width: "",
      placeholder: "请选择日期",
      format: "YYYY-MM-DD",
      disabled: false,
      rules: {
        type: "object" as const,
        required: false,
        message: "请选择日期",
      },
    },
  },
  // {
  //   label: "评分",
  //   type: "rate",
  //   options: {
  //     defaultValue: 0,
  //     max: 5,
  //     allowHalf: false,
  //     disabled: false,
  //     rules,
  //   },
  // },
  {
    label: "下拉选择框",
    type: "Select",
    options: {
      defaultValue: "",
      width: "200px",
      mode: "",
      placeholder: "请选择",
      remote: false,
      options: [
        {
          label: "Option 1",
          value: "Option 1",
        },
        {
          label: "Option 2",
          value: "Option 2",
        },
        {
          label: "Option 3",
          value: "Option 3",
        },
      ],
      remoteOptions: [],
      remoteFunc:
        "https://raw.githubusercontent.com/fuchengwei/vue-form-create/master/mock/mock.json",
      rules,
    },
  },
  {
    label: "开关",
    type: "Switch",
    valuePropName: "checked",
    options: {
      defaultValue: false,
      disabled: false,
      rules,
    },
  },
  {
    label: "滑块",
    type: "Slider",
    options: {
      defaultValue: 0,
      width: "",
      min: 0,
      max: 100,
      step: 1,
      disabled: false,
      range: false,
      rules: {
        type: "number",
        required: false,
        message: "请选择",
      },
    },
  },
  {
    label: "文字",
    type: "Text",
    options: {
      defaultValue: "This is a text",
    },
  },
];

export const findBasicComponents = (type: string) => {
  return basicComponents.find((item) => item.type === type);
};

export const advanceComponents = [
  {
    label: "图片",
    type: "img-upload",
    options: {
      defaultValue: [],
      name: "file",
      action: "http://example.com/upload",
      method: "post",
      listType: "text",
      accept: "image/*",
      limit: 3,
      multiple: false,
      disabled: false,
      rules,
    },
  },
  {
    label: "富文本编辑器",
    type: "richtext-editor",
    options: {
      defaultValue: "",
      width: "",
      disabled: false,
    },
  },
  {
    label: "级联选择器",
    type: "cascader",
    options: {
      defaultValue: [],
      width: "200px",
      placeholder: "",
      disabled: false,
      clearable: false,
      filterable: false,
      remote: true,
      remoteOptions: [],
      props: {
        label: "label",
        value: "value",
        children: "children",
      },
      remoteFunc:
        "https://raw.githubusercontent.com/fuchengwei/vue-form-create/master/mock/mock.json",
      rules,
    },
  },
];

export const layoutComponents = [
  {
    label: "栅格布局",
    type: "grid",
    columns: [
      {
        span: 12,
        list: [],
      },
      {
        span: 12,
        list: [],
      },
    ],
    options: {
      gutter: 0,
      justify: "start",
      align: "top",
    },
  },
];

export const dataDisplayComponents = [
  {
    label: "表格",
    type: "Table",
    widgetProperties: {
      dataSource: [
        {
          key: "1",
          name: "胡彦斌",
          age: 32,
          address: "西湖区湖底公园1号",
        },
        {
          key: "2",
          name: "胡彦祖",
          age: 42,
          address: "西湖区湖底公园1号",
        },
      ],
      columns: [
        {
          title: "姓名",
          dataIndex: "name",
          key: "name",
        },
        {
          title: "年龄",
          dataIndex: "age",
          key: "age",
        },
        {
          title: "住址",
          dataIndex: "address",
          key: "address",
        },
      ],
    },
  },
];
