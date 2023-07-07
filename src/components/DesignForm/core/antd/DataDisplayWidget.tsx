import React, { memo } from "react";
import { WidgetForm } from "../../config/element";
import { connect } from "@/utils/store";

function DataDisplayWidget(props:any) {
  return <div></div>;
}

export default connect((state: WidgetForm) => ({
  widgetFormCurrentSelect: state.widgetFormCurrentSelect,
  page: state.page,
  list: state.list,
}))(memo(DataDisplayWidget));
