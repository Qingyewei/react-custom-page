import React, { useEffect, useState } from "react";
import styles from "./SvgIcon.module.less";

export default function SvgIcon(props: any) {
  const { name, color = "#333", className } = props;
  const [symbolId, setSymbolId] = useState("");
  useEffect(() => {
    setSymbolId(`#icon-${props.name}`);
  }, [name]);
  return (
    <svg aria-hidden="true" className={`${styles.svgIcon} ${className}`} onClick={props.onClick}>
      <use href={symbolId} fill={color} className="svg-icon-use"/>
    </svg>
  );
}
