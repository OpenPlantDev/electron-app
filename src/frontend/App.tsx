import * as React from "react";
import './App.css';
import {ipcRenderer, Event} from "electron";
// import { RefreshButton } from "./components/RefreshButton";
import {Item} from "../common/models/Item";
import {IFilter} from "../common/models/IFilter";
import {ItemsView} from "./components/ItemsView";
import {FilterButtonGroup} from "./components/FilterButtonGroup";
// import {FilterRadioGroup} from "./components/FilterRadioGroup";
import {IQueryOptions} from "../backend/services/queryOptions";

// tslint:disable-next-line:no-empty-interface - Just until we add some state
interface IState {
  components: Item[];
  isLoading: boolean;
  error: Error | undefined;
  selectedItem: Item | undefined;
  filter: IFilter;
}

interface IProps {
  title: string;
}

declare global {
  interface Window {
    require: NodeRequire;
  }
}

export class App extends React.Component <IProps, IState> {

  private _selectedItemId: string = "";
  private _filters = [
    {key: "all", title: "All Items", queryString: ""},
    {key: "valves", title: "Valves", queryString: "className='valve'"},
    {key: "pumps", title: "Pumps", queryString: "className='pump'"},
    {key: "tanks", title: "Tanks", queryString: "className='tank'"},
    {key: "equipment", title: "Equipment", queryString: "className='pump' or className='tank'"},
  ];

  public readonly state:IState = { components: [], isLoading: true, error: undefined,
    selectedItem: undefined, filter: this._filters[0] };

  private _findItemById = (components: Item[], compId: string): Item | undefined => {
    return components.find((comp) => comp.id === compId);
  }

  public getFilter = (key: string): IFilter => {
    const filter = this._filters.find((f) => f.key === key);
    if (filter) {
      return filter;
    }
    return this._filters[0];
  }

  public clearFilter = async () => {
    const filter = this.getFilter("all");
    this.setState({filter});
    this.requestData(filter);
  }

  public filterOnValves = async () => {
    const filter = this.getFilter("valves");
    this.setState({filter});
    this.requestData(filter);
  }

  public filterOnEquipment = async () => {
    const filter = this.getFilter("equipment");
    this.setState({filter});
    this.requestData(filter);
  }

  public onFilterChanged = async (filter: IFilter) => {
    this.setState({filter});
    this.requestData(filter);
  }

  public onItemViewItemClick = (comp: Item) => {
    this._selectedItemId = comp.id;
    this.setState({selectedItem: comp});
  }

  public render() {
    if (this.state.isLoading) {
      return <h3>Loading...</h3>;
    }
    if (this.state.error) {
      return <h3>Error: {this.state.error.message}</h3>;
    }
    // console.log(this.state.components);
    return (
     <div>
      <FilterButtonGroup filters={this._filters}
                        selectedFilter={this.state.filter}
                        onClick={this.onFilterChanged} />
      {/* <FilterRadioGroup filters={this._filters}
                        selectedFilter={this.state.filter}
                        onChange={this.onFilterChanged} /> */}
      <ItemsView title={this.state.filter.title}
                      components={this.state.components}
                      selectedItem={this.state.selectedItem}
                      onItemClick={this.onItemViewItemClick} />
     </div>
    );
  }

  private requestData(filter: IFilter) {

    const queryOptions: IQueryOptions = {
      filter: filter.queryString,
      orderBy: undefined,
      limit: 0,
    };
    ipcRenderer.send("refresh-request", queryOptions);
  }

  public async componentDidMount() {
    console.log("In componentDidMount");

    // initial fetch of data
    this.requestData(this.state.filter);

    ipcRenderer.on("data-updated", (event: Event, data: Item[]) => {
      console.log(data);
      // check to see if the currently selected component is in the new list
      const comp = this._findItemById(data, this._selectedItemId);
      if (!comp) {
        this._selectedItemId = "";
      }
      this.setState({
        components: data, isLoading: false, error: undefined,
        selectedItem: comp,
      });
    });
  }
}
