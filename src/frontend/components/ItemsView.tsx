import * as React from "react";
import {Item} from "../../common/models/Item";
// import {ItemsList} from "./ItemsList";
// import { ItemDetails } from "./ItemDetails";
import { ItemsTable } from "./ItemsTable";

interface IProps {
  title: string;
  components: Item[];
  selectedItem: Item | undefined;
  onItemClick: (comp: Item) => void;
}

// tslint:disable-next-line:variable-name
export const ItemsView = (props: IProps) => {

  return (
    <div>
      <ItemsTable components={props.components} />
      {/* <ItemsList title={props.title}
                      components={props.components}
                      selectedItem={props.selectedItem}
                      onItemClick={props.onItemClick} />
      <ItemDetails component={props.selectedItem} /> */}
    </div>
  );

};
