import React from 'react';
import './ItemsTable.css';
import { Item } from '../../common/models/Item';
import { ItemProperties } from './ItemProperties';

export interface IProps {
  components: Item[];
}

// tslint:disable-next-line:variable-name
export const ItemsTable = (props: IProps) => {
  console.log('In ItemsTable');
  console.log(props.components);
  return (
    <table className="componentsTable">
      <thead>
        <tr>
          <th>Id</th>
          <th>Class</th>
          <th>Tag</th>
          <th>Description</th>
          <th>Addition Properties</th>
        </tr>
      </thead>
      <tbody>
        {props.components.map((comp) => {
          return (
            <tr key={comp.id}>
              <td>{comp.id}</td>
              <td>{comp.className}</td>
              <td>{comp.tag}</td>
              <td>{comp.description}</td>
              <td><ItemProperties properties={comp.properties} /></td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
