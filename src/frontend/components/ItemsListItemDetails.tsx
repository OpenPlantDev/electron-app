import * as React from "react";
import {Item} from "../../common/models/Item";

interface IProps {
  component: Item;
}

// tslint:disable-next-line:variable-name
export const ItemsListItemDetails = (props: IProps) => {
  const comp = props.component;
  return (
    <div>
      <ul>
        <li>id: {comp.id}</li>
        <li>class: {comp.className}</li>
      </ul>
    </div>
  );
};
