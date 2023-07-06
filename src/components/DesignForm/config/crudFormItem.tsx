import _ from "lodash";
import RadioOptions from "../core/antd/components/RadioOptions";
import { basicComponents } from "./element";

export interface CrudFormItem {
  id?: string;
  name: string | string[];
  label: string;
  type: string;
  dependenciesName?: string | string[];
  options?: {
    placeholder?: string;
    defaultValue?: string;
    options?:
      | {
          label: string;
          value: string;
        }[]
      | ((formData: any) => {
          label: string;
          value: string;
        }[]);
    mode?: string | ((formData: any) => string);
    allowClear?: boolean;
  };
  valuePropName?: string;
  isHidden?: string;
  render?: (props: any) => any;
}

const crudFormItem: CrudFormItem[] = [
  {
    name: "name",
    label: "字段名",
    type: "input",
    options: {
      placeholder: "请输入字段名",
    },
  },
  {
    name: ["options", "placeholder"],
    label: "占位文本",
    isHidden: "{{ formData.type === 'TimePicker'}}",
    type: "input",
    options: {
      placeholder: "请输入占位文本",
    },
  },
  {
    name: ["options", "defaultValue"],
    label: "默认值",
    type: "input",
    isHidden: "{{ formData.type !== 'input'}}",
    options: {
      placeholder: "请输入默认值",
    },
  },
  {
    name: ["options", "defaultValue"],
    label: "默认值-TimePicker",
    type: "TimePicker",
    isHidden: "{{ formData.type !== 'TimePicker' }}",
    options: {
      placeholder: "请选择默认时间",
    },
  },
  {
    name: ["options", "defaultValue"],
    label: "默认值-DatePicker",
    type: "DatePicker",
    isHidden: "{{ formData.type !== 'DatePicker'}}",
    options: {
      placeholder: "请选择默认日期",
    },
  },
  {
    name: ["options", "isRangePicker"],
    label: "是否为范围选择器",
    isHidden:
      "{{ formData.type !== 'TimePicker' && formData.type !== 'DatePicker'}}",
    options: {
      placeholder: "请选择默认时间范围",
    },
    type: "switch",
    valuePropName: "checked",
  },
  {
    name: ["options", "defaultValue"],
    label: "默认值-Radio",
    type: "Select",
    isHidden: "{{ formData.type !== 'Radio'}}",
    options: {
      placeholder: "请选择默认值",
      options: (formData) => _.get(formData, "options.options", []),
    },
  },
  {
    name: ["options", "defaultValue"],
    label: "默认值-Checkbox",
    type: "Select",
    isHidden: "{{ formData.type !== 'Checkbox'",
    options: {
      placeholder: "请选择默认值",
      mode: "multiple",
      allowClear: true,
      options: (formData) => _.get(formData, "options.options", []),
    },
  },
  {
    name: ["options", "rules", "required"],
    label: "是否为必填项",
    type: "switch",
    valuePropName: "checked",
  },
  {
    name: ["options", "rules", "required"],
    label: "是否隐藏-hidden",
    isHidden: "{{ 1 === 0 ? true : false}}",
    type: "switch",
    valuePropName: "checked",
  },
  {
    name: ["options", "options"],
    label: "选项设置",
    type: "Radio",
    isHidden: "{{formData.type !== 'Radio'}}",
    options: {
      options: _.get(
        _.find(
          basicComponents,
          (item: basicComponents) => item.type == "Radio"
        ),
        "options.options"
      ),
    },
    render: (props: any) => {
      return <RadioOptions {...props} />;
    },
  },
  {
    name: ["options", "options"],
    label: "选项设置",
    type: "CheckboxOptions",
    isHidden: "{{formData.type !== 'Checkbox'}}",
    options: {
      options: _.get(
        _.find(
          basicComponents,
          (item: basicComponents) => item.type == "Checkbox"
        ),
        "options.options"
      ),
    },
  },
  {
    name: ["options", "defaultValue"],
    label: "默认值-Select",
    type: "Select",
    isHidden: "{{ formData.type !== 'Select'}}",
    dependenciesName: ["options", "options"],
    options: {
      placeholder: "请选择默认值",
      mode: (formData) => _.get(formData, "options.mode", ""),
      options: _.get(
        _.find(
          basicComponents,
          (item: basicComponents) => item.type == "Select"
        ),
        "options.options"
      ),
    },
  },
  {
    name: ["options", "mode"],
    label: "模式",
    type: "Select",
    isHidden: "{{ formData.type !== 'Select'}}",
    options: {
      placeholder: "请选择默认值",
      options: [
        {
          label: "单选",
          value: "",
        },
        {
          label: "多选",
          value: "multiple",
        },
        {
          label: "标签",
          value: "tags",
        },
      ],
    },
  },
  {
    name: ["options", "options"],
    label: "选项设置",
    type: "SelectOptions",
    isHidden: "{{formData.type !== 'Select'}}",
    options: {
      mode: (formData) => _.get(formData, "options.mode", ""),
      options: _.get(
        _.find(
          basicComponents,
          (item: basicComponents) => item.type == "Select"
        ),
        "options.options"
      ),
    },
  },
  {
    name: ["options", "defaultValue"],
    label: "默认值-switch",
    isHidden:
      "{{ formData.type !== 'switch'}}",
    options: {
      placeholder: "请选择默认状态",
    },
    type: "switch",
    valuePropName: "checked",
  },
  {
    name: ["options", "defaultValue"],
    label: "默认值-Slider",
    isHidden:
      "{{ formData.type !== 'Slider'}}",
    options: {
      placeholder: "请输入",
    },
    type: "InputNumber",
  },
  {
    name: ["options", "defaultValue"],
    label: "默认值-Text",
    isHidden:
      "{{ formData.type !== 'Text'}}",
    options: {
      placeholder: "请输入",
    },
    type: "Input.TextArea",
  },
];

// type AddcrudFormItemId<T extends any[]> = {
//   [K in keyof T]: T[K] & { id?: string; valuePropName?: string };
// };
// type crudFormItemId = AddcrudFormItemId<typeof crudFormItem>;

export default crudFormItem;
