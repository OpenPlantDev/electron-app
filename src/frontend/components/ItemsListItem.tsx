import * as React from "react";
import { Item } from "../../common/models/Item";

interface IProps {
  component: Item;
  onClick: (component: Item) => void;
  isSelected: boolean | undefined;
}

const selectedStyle = {
  color: "blue",
  fontWeight: "bold",
};

const unselectedStyle = {
  color: "black",
};

// tslint:disable:trailing-comma
// tslint:disable-next-line:variable-name
export const ItemsListItem = (props: IProps) => {
  const style = props.isSelected ? selectedStyle : unselectedStyle;
  return (
    <li style={style}
        onClick={() => props.onClick(props.component)}>{props.component.tag}</li>
  );

};
