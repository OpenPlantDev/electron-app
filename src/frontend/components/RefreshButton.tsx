import * as React from "react";

interface IProps {
  title: string;
  onClick: () => void;
}

// tslint:disable-next-line:variable-name
export const RefreshButton = (props: IProps) => {
  return (
    <div>
      <button onClick={props.onClick}>{props.title}</button>
    </div>
  );
};
