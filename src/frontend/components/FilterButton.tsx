import * as React from "react";
import { IFilter } from "../../common/models/IFilter";

interface IProps {
  filter: IFilter;
  isSelected: boolean;
  onClick: (filter: IFilter) => void;
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
export const FilterButton = (props: IProps) => {
  const buttonStyle = props.isSelected ? selectedStyle : unselectedStyle;
  return (<button style={buttonStyle} onClick={() => props.onClick(props.filter)}>{props.filter.title}</button>);
};
