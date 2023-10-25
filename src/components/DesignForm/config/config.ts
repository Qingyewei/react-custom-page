export const advancedConfig = [
  {
    label: "页面展示类型",
    type: "select",
    options: {
      defaultValue: "",
      width: "200px",
      multiple: false,
      placeholder: "",
      remote: false,
      showLabel: false,
      filterable: false,
      clearable: false,
      disabled: false,
      options: [
        {
          label: "页面",
          value: "page",
        },
        {
          label: "弹窗",
          value: "model",
        },
        {
          label: "新标签页",
          value: "tab",
        },
      ],
    },
  },
  {
    label: "页面类型",
    type: "select",
    options: {
      defaultValue: "",
      width: "200px",
      multiple: false,
      placeholder: "",
      remote: false,
      showLabel: false,
      filterable: false,
      clearable: false,
      disabled: false,
      options: [
        {
          label: "详情内容",
          value: "detail",
        },
        {
          label: "CRUD表单",
          value: "form",
        },
      ],
    },
  },
];

export const conifgAll = [
    {
        name:'字段属性',
        data:[],
    },
    {
        name:'表单属性',
        data:[],
    },
    {
        name:'高级',
        data:advancedConfig,
    },
]
