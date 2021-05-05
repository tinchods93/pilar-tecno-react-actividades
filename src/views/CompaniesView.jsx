import React, { Component } from 'react';
import FormComponent from '../components/FormComponent';
import { CompanyModel } from '../models/Models';
import {
  SaveCompany,
  GetCountriesNames,
  GetCitiesNames,
  GetCompaniesNames,
  RemoveCompany,
} from '../utils/localStorageFunctions';
import { capitalize } from '../utils/StringUtilities';

export class CompaniesView extends Component {
  constructor() {
    super();
    this.state = {
      companies: [],
      companyObject: CompanyModel,
      showForm: 'none',
    };
    this.SaveCompany = SaveCompany.bind(this);
  }

  spawnForm = () => {
    if (this.state.showForm !== 'none') {
      return (
        <FormComponent
          objectToShow={this.state.companyObject}
          title='New Company Form'
          selectButtonsIndexes={[1, 2]}
          attributesToIgnore={['jobs']}
          savingFunction={this.SaveCompany}
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
            New Company
          </button>
          {this.spawnForm()}
        </div>
        <ListComponent listTitle='Companies' />
      </>
    );
  }
}

export default class ListComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mostrarForm: 'none',
      companiesToShow: [],
      countryList: [],
      cityList: [],
      countrySelected: '',
      citySelected: '',
    };
    this.removeCompany = this.removeCompany.bind(this);
  }

  spawnItems() {
    return this.state.companiesToShow.length > 0 ? (
      this.state.companiesToShow.map((item, index) => {
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
                onClick={this.removeCompany}
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

  removeCompany(ev) {
    RemoveCompany(
      this.state.countrySelected,
      this.state.citySelected,
      ev.target.id
    );
    this.setState({
      citiesToShow: GetCitiesNames(this.state.countrySelected),
    });
  }

  componentDidMount() {
    this.prepareList();
  }

  selectHandler = (ev) => {
    console.log(ev.target.value);

    switch (ev.target.id) {
      case 'country':
        const newCountrySelected = ev.target.value;
        const cityList = GetCitiesNames(newCountrySelected);

        this.setState({
          cityList: cityList,
          countrySelected: newCountrySelected,
          citySelected: cityList[0],
          companiesToShow: GetCompaniesNames(newCountrySelected, cityList[0]),
        });
        break;
      case 'city':
        const newCitySelected = ev.target.value;
        const companiesList = GetCompaniesNames(
          this.state.countrySelected,
          newCitySelected
        );

        this.setState({
          citySelected: newCitySelected,
          companiesToShow: companiesList,
        });
        break;
      default:
        break;
    }
  };

  prepareList() {
    const countryList = GetCountriesNames();
    const cityList = GetCitiesNames(countryList[0]);
    console.log(countryList);

    this.setState({
      countryList: countryList,
      cityList: cityList,
      countrySelected: countryList[0],
      citySelected: cityList[0],
      companiesToShow: GetCompaniesNames(countryList[0], cityList[0]),
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
                <label htmlFor='select'>City</label>
                <select name='city' id='city' onChange={this.selectHandler}>
                  {this.state.cityList.map((city, index) => {
                    return (
                      <option value={city} key={index}>
                        {capitalize(city)}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className='selectComponents'></div>
            </div>
            {this.spawnItems()}
          </ul>
        </div>
      </>
    );
  }
}
