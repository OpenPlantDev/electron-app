import * as React from "react";
import {Item} from "../../common/models/Item";
import {ItemsListItem} from "./ItemsListItem";

interface IProps {
  title: string;
  components: Item[];
  selectedItem: Item | undefined;
  onItemClick: (component: Item) => void;
}

// tslint:disable:trailing-comma
// tslint:disable-next-line:variable-name
export const ItemsList = (props: IProps) => {
  return (
      <div>
      <ul>{props.title}</ul>
          {props.components.map((comp) =>
            <ItemsListItem key={comp.id} component={comp}
              isSelected={props.selectedItem && (comp.id === props.selectedItem.id)}
              onClick={props.onItemClick} />
        )}
      </div>
  );
};
