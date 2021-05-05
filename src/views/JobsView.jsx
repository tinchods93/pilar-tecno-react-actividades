import React, { Component } from 'react';
import FormComponent from '../components/FormComponent';
import { JobModel } from '../models/Models';
import {
  SaveJob,
  GetCountriesNames,
  GetCitiesNames,
  GetCompaniesNames,
  RemoveJob,
  GetJobsNames,
} from '../utils/localStorageFunctions';
import { capitalize } from '../utils/StringUtilities';

export class JobsView extends Component {
  constructor() {
    super();
    this.state = {
      jobs: [],
      jobObject: JobModel,
      showForm: 'none',
    };
    this.SaveJob = SaveJob.bind(this);
  }

  spawnForm = () => {
    if (this.state.showForm !== 'none') {
      return (
        <FormComponent
          objectToShow={this.state.jobObject}
          selectButtonsIndexes={[1, 2, 3]}
          savingFunction={this.SaveJob}
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
        <div className='formContainer col'>
          <button className='btn btn-custom' onClick={() => this.showForm()}>
            New Job
          </button>
          {this.spawnForm()}
        </div>
        <ListComponent listTitle='Jobs' />
      </>
    );
  }
}

export default class ListComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mostrarForm: 'none',
      jobsToShow: [],
      countryList: [],
      cityList: [],
      companyList: [],
      countrySelected: '',
      citySelected: '',
      companySelected: '',
    };
    this.removeJob = this.removeJob.bind(this);
  }

  spawnItems() {
    return this.state.jobsToShow.length > 0 ? (
      this.state.jobsToShow.map((item, index) => {
        return (
          <li
            className='itemContainer row'
            style={{ marginTop: '10px', marginBottom: '2px' }}
            key={index}>
            <div className='marcadorLista'>
              <i className='fas fa-caret-right'></i>
            </div>
            <div className='itemData'>{capitalize(item)}</div>
            <div className='itemIcons'>
              <i
                className='fas fa-trash-alt'
                onClick={this.removeJob}
                id={item}></i>
            </div>
          </li>
        );
      })
    ) : (
      <li>No Data to Show</li>
    );
  }

  removeJob(ev) {
    RemoveJob(
      this.state.countrySelected,
      this.state.citySelected,
      this.state.companySelected,
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
        const companyList = GetCompaniesNames(newCountrySelected, cityList[0]);

        this.setState({
          cityList: cityList,
          companyList: companyList,
          countrySelected: newCountrySelected,
          citySelected: cityList[0],
          companySelected: companyList[0],
          jobsToShow: GetJobsNames(
            newCountrySelected,
            cityList[0],
            companyList[0]
          ),
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
          companyList: companiesList,
          companySelected: companiesList[0],
          jobsToShow: GetJobsNames(
            this.state.countrySelected,
            newCitySelected,
            companiesList[0]
          ),
        });
        break;
      case 'company':
        const newCompanySelected = ev.target.value;
        const newJobList = GetJobsNames(
          this.state.countrySelected,
          this.state.citySelected,
          newCompanySelected
        );
        this.setState({ jobsToShow: newJobList });
        break;
      default:
        break;
    }
  };

  prepareList() {
    const countryList = GetCountriesNames();
    const cityList = GetCitiesNames(countryList[0]);
    const companyList = GetCompaniesNames(countryList[0], cityList[0]);
    console.log(countryList);

    this.setState({
      countryList: countryList,
      cityList: cityList,
      companyList: companyList,
      countrySelected: countryList[0],
      citySelected: cityList[0],
      companySelected: companyList[0],
      jobsToShow: GetJobsNames(countryList[0], cityList[0], companyList[0]),
    });
  }

  render() {
    return (
      <>
        <div className='col listContainer'>
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
                <label htmlFor='select'>Company</label>
                <select
                  name='company'
                  id='company'
                  onChange={this.selectHandler}>
                  {this.state.companyList.map((company, index) => {
                    return (
                      <option value={company} key={index}>
                        {capitalize(company)}
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
