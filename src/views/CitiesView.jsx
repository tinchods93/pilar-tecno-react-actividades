import React, { Component } from 'react';
import FormComponent from '../components/FormComponent';
import { CityModel } from '../models/Models';
import {
  GetCountriesNames,
  SaveCity,
  GetCitiesNames,
  RemoveCity,
} from '../utils/localStorageFunctions';
import { capitalize } from '../utils/StringUtilities';

export class CitiesView extends Component {
  constructor() {
    super();
    this.state = {
      cities: [],
      cityObject: CityModel,
      showForm: 'none',
    };
    this.SaveCity = SaveCity.bind(this);
  }

  spawnForm = () => {
    if (this.state.showForm !== 'none') {
      return (
        <FormComponent
          objectToShow={this.state.cityObject}
          title='New City Form'
          selectButtonsIndexes={[1]}
          attributesToIgnore={['companies']}
          dataListForSelectButtons={[GetCountriesNames()]}
          savingFunction={this.SaveCity}
        />
      );
    }
  };

  showForm = () => {
    this.state.showForm === 'none'
      ? this.setState({ showForm: 'block' })
      : this.setState({ showForm: 'none' });
  };

  render() {
    return (
      <>
        <div className='formContainer col-4'>
          <button className='btn btn-custom' onClick={() => this.showForm()}>
            New City
          </button>
          {this.spawnForm()}
        </div>
        <ListComponent listTitle='Cities' />
      </>
    );
  }
}

export default class ListComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mostrarForm: 'none',
      citiesToShow: [],
      countryList: [],
      countrySelected: '',
    };
    this.removeCity = this.removeCity.bind(this);
  }

  spawnItems() {
    return this.state.citiesToShow.length > 0 ? (
      this.state.citiesToShow.map((item, index) => {
        return (
          <li
            className='itemContainer row'
            style={{ marginTop: '10px', marginBottom: '2px' }}
            key={index}>
            <div className='col-1'>
              <i className='fas fa-caret-right'></i>
            </div>
            <div className='col'>{capitalize(item)}</div>
            <div className='col-3'>
              <i
                className='fas fa-trash-alt'
                onClick={this.removeCity}
                id={item}
                style={{
                  cursor: 'pointer',
                  fontSize: '1.5rem',
                  marginTop: '10px',
                  color: '#de5a5a',
                }}></i>
            </div>
          </li>
        );
      })
    ) : (
      <li>No Data to Show</li>
    );
  }

  removeCity(ev) {
    // console.log(this.state.countrySelected);
    // console.log(ev.target.id);
    RemoveCity(this.state.countrySelected, ev.target.id);
    this.setState({
      citiesToShow: GetCitiesNames(this.state.countrySelected),
    });
  }

  componentDidMount() {
    this.prepareList();
  }

  selectHandler = (ev) => {
    this.setState({
      countrySelected: ev.target.value,
      citiesToShow: GetCitiesNames(ev.target.value),
    });
  };

  prepareList() {
    const countryList = GetCountriesNames();
    console.log(countryList);

    this.setState({
      countryList: countryList,
      countrySelected: countryList[0],
      citiesToShow: GetCitiesNames(countryList[0]),
    });
  }

  render() {
    return (
      <>
        <div className='listContainer'>
          <ul>
            <div className='extra-data'>
              <h3>List of {this.props.listTitle}</h3>
              <div className='selectComponents'>
                <label htmlFor='select'>Country</label>
                <select
                  name='country'
                  id='country'
                  onChange={this.selectHandler}>
                  {this.state.countryList.map((country, index) => {
                    return (
                      <option value={country} key={index}>
                        {capitalize(country)}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
            {this.spawnItems()}
          </ul>
        </div>
      </>
    );
  }
}
