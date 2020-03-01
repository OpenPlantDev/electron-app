import * as React from "react";
import { IProperties } from "../../common/models/Properties";

interface IProps {
  properties: IProperties;
}

// tslint:disable:trailing-comma
// tslint:disable-next-line:variable-name
export const ItemProperties = (props: IProps) => {
  if (!props.properties) {
    return (<div></div>);
  } else {
    return (
        <div>
            {Object.keys(props.properties).map((key) =>
                <li key={key}>{key}: {props.properties[key].toString()}</li>
            )}
        </div>
    );
  }
};
