import * as React from "react";
import {Item} from "../../common/models/Item";
import { ItemProperties } from "./ItemProperties";

interface IProps {
  component: Item | undefined;
}

// tslint:disable-next-line:variable-name
export const ItemDetails = (props: IProps) => {
  const comp = props.component;
  if (comp === undefined) {
    return <div></div>;
  }
  return (
    <div>
      <ul>Details: {comp.tag}
        <li>id: {comp.id}</li>
        <li>class: {comp.className}</li>
        <ItemProperties properties={comp.properties} />
      </ul>
    </div>
  );
};
