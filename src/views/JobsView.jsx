import React, { Component } from 'react';
import FormComponent from '../components/FormComponent';
import { JobModel } from '../models/Models';
import { DataBaseFunctions } from '../utils/localStorageFunctions';
import { ListComponent } from '../components/ListComponent';

export class JobsView extends Component {
  constructor() {
    super();
    this.state = {
      jobs: [],
      jobObject: JobModel,
      showForm: 'none',
    };
    this.SaveJob = DataBaseFunctions.SaveJob.bind(this);
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
        <LocalListComponent listTitle='Jobs' />
      </>
    );
  }
}

export default class LocalListComponent extends Component {
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
    this.selectHandler = this.selectHandler.bind(this);
  }

  removeJob(ev) {
    const { countrySelected, citySelected, companySelected } = this.state;
    DataBaseFunctions.RemoveJob(
      countrySelected,
      citySelected,
      companySelected,
      ev.target.id
    );
    this.setState({
      jobsToShow: DataBaseFunctions.GetJobsNames(
        countrySelected,
        citySelected,
        companySelected
      ),
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
        const cityList = DataBaseFunctions.GetCitiesNames(newCountrySelected);
        const companyList = DataBaseFunctions.GetCompaniesNames(
          newCountrySelected,
          cityList[0]
        );

        this.setState({
          cityList: cityList,
          companyList: companyList,
          countrySelected: newCountrySelected,
          citySelected: cityList[0],
          companySelected: companyList[0],
          jobsToShow: DataBaseFunctions.GetJobsNames(
            newCountrySelected,
            cityList[0],
            companyList[0]
          ),
        });
        break;
      case 'city':
        const newCitySelected = ev.target.value;
        const companiesList = DataBaseFunctions.GetCompaniesNames(
          this.state.countrySelected,
          newCitySelected
        );

        this.setState({
          citySelected: newCitySelected,
          companyList: companiesList,
          companySelected: companiesList[0],
          jobsToShow: DataBaseFunctions.GetJobsNames(
            this.state.countrySelected,
            newCitySelected,
            companiesList[0]
          ),
        });
        break;
      case 'company':
        const newCompanySelected = ev.target.value;
        const newJobList = DataBaseFunctions.GetJobsNames(
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
    const countryList = DataBaseFunctions.GetCountriesNames();
    const cityList = DataBaseFunctions.GetCitiesNames(countryList[0]);
    const companyList = DataBaseFunctions.GetCompaniesNames(
      countryList[0],
      cityList[0]
    );

    this.setState({
      countryList: countryList,
      cityList: cityList,
      companyList: companyList,
      countrySelected: countryList[0],
      citySelected: cityList[0],
      companySelected: companyList[0],
      jobsToShow: DataBaseFunctions.GetJobsNames(
        countryList[0],
        cityList[0],
        companyList[0]
      ),
    });
  }

  render() {
    const { countryList, cityList, companyList, jobsToShow } = this.state;
    const { listTitle } = this.props;
    return (
      <ListComponent
        dataList={[countryList, cityList, companyList]}
        itemList={jobsToShow}
        listTitle={listTitle}
        onChangeFunction={this.selectHandler}
        selectTitle={['Country', 'City', 'Company']}
        attribute={['country', 'city', 'company']}
        removeFunction={this.removeJob}
      />
    );
  }
}
