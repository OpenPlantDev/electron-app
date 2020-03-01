import * as React from "react";
import { IFilter } from "../../common/models/IFilter";

interface IProps {
  filters: IFilter[];
  selectedFilter: IFilter;
  onChange: (filter: IFilter) => void;
}

// tslint:disable:trailing-comma
// tslint:disable-next-line:variable-name
export const FilterRadioGroup = (props: IProps) => {
    return (
      <div>
        {props.filters.map((filter) =>
          <div key={filter.key} className="radio">
            <label>
              <input type="radio" value={filter.key}
                            checked={props.selectedFilter.key === filter.key}
                            onChange={() => props.onChange(filter)} />
              {filter.title}
            </label>
          </div>
        )}
      </div>

    );
};
