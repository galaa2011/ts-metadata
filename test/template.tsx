/* tslint:disable */
/**
 * @class ZText
 */

import { Component, Design, InputType, Props, Foo } from "@sina/design-decorator";
import * as React from "react";

import styles from "./styles.css";
const pkg = require("../package.json");

@InputType({
  type: 'abc'
})
class Test {
  @Design({
    inputType: "text",
    label: "测试",
  })
  test!: string;
}

@InputType({
  type: "textstyle",
})
class TextStyle implements React.CSSProperties {
  @Design({
    inputType: "text",
    label: "字号",
    name: "fontSize",
    validate: {
      require: true,
    },
  })
  public fontSize?: number;
  @Design({
    inputType: "text",
    label: "加粗",
    name: "fontWeight",
    validate: {
      require: true,
    },
  })
  @Foo({
    inputType: "text",
    label: "微软雅黑",
  })
  public fontWeight?: number;
  @Design({
    inputType: "text",
    label: "颜色",
    name: "color",
    validate: {
      require: true,
    },
  })
  public color?: string;
  @Design({
    inputType: "text",
    label: "字体",
    name: "fontFamily",
    validate: {
      require: true,
    },
  })
  public fontFamily?: string;
  @Design({
    inputType: "text",
    label: "字体风格",
    name: "fontStyle",
    validate: {
      require: true,
    },
  })
  public fontStyle?: string;
  @Design({
    inputType: "text",
    label: "字间距",
    name: "letterSpacing",
    validate: {
      require: true,
    },
  })
  public letterSpacing?: number;
  @Design({
    inputType: "text",
    label: "行间距",
    name: "lineHeight",
    validate: {
      require: true,
    },
  })
  public lineHeight?: number;
  @Design({
    inputType: "text",
    label: "对齐方式",
    name: "textAlign",
    validate: {
      require: true,
    },
  })
  public textAlign?: "center" | "left" | "right";
  @Design({
    inputType: "text",
    label: "下划线",
    name: "underline",
    validate: {
      require: true,
    },
  })
  public underline?: string;
  @Design({
    inputType: "text",
    label: "下划线",
    name: "verticalAlign",
    validate: {
      require: true,
    },
  })
  public verticalAlign?: string;
  @Design({
    inputType: "text",
    label: "文本排布模式",
    name: "writingMode",
    validate: {
      require: true,
    },
  })
  public writingMode?: "revert" | "unset" | "horizontal-tb" | "vertical-lr" | "vertical-rl";
}

@Props()
export class IProps {
  @Design({
    inputType: "text",
    label: "文本值",
    name: "text",
    validate: {
      require: true,
    },
  })
  public text!: string;

  @Design({
    inputType: "textstyle",
    label: "样式",
    name: "textstyle",
  })
  public textStyle!: TextStyle;
}

function Text(props: IProps) {
  const preFontFamily = { fontFamily: props.textStyle ? props.textStyle.fontFamily : "" };
  return (
    <div className={styles.test} style={props.textStyle}>
      <pre style={preFontFamily}>{props.text}</pre>
    </div>
  );
}
@Component({
  name: "z-text",
  version: pkg.version,
})
export default class ZText extends React.Component<Props> {
  public render() {
    return (
      <Text {...this.props}></Text>
    );
  }
}
