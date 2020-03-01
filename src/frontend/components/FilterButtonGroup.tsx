import * as React from "react";
import { IFilter } from "../../common/models/IFilter";
import { FilterButton } from "./FilterButton";

interface IProps {
  filters: IFilter[];
  selectedFilter: IFilter;
  onClick: (filter: IFilter) => void;
}

// tslint:disable:trailing-comma
// tslint:disable-next-line:variable-name
export const FilterButtonGroup = (props: IProps) => {
    return (
      <div>
          {props.filters.map((filter) =>
            <FilterButton key={filter.key}
                          filter={filter}
                          onClick={props.onClick}
                          isSelected={filter.key === props.selectedFilter.key} />
          )}
      </div>

    );

};
