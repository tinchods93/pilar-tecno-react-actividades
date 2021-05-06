import React, { Component } from 'react';
import FormComponent from '../components/FormComponent';
import { CompanyModel } from '../models/Models';
import { DataBaseFunctions } from '../utils/localStorageFunctions';
import { ListComponent } from '../components/ListComponent';

export class CompaniesView extends Component {
  constructor() {
    super();
    this.state = {
      companies: [],
      companyObject: CompanyModel,
      showForm: 'none',
    };
    this.SaveCompany = DataBaseFunctions.SaveCompany.bind(this);
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
        <div className='formContainer col'>
          <button className='btn btn-custom' onClick={() => this.showForm()}>
            New Company
          </button>
          {this.spawnForm()}
        </div>
        <LocalListComponent listTitle='Companies' />
      </>
    );
  }
}

export default class LocalListComponent extends Component {
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
    this.selectHandler = this.selectHandler.bind(this);
  }

  removeCompany(ev) {
    const { countrySelected, citySelected } = this.state;
    DataBaseFunctions.RemoveCompany(
      countrySelected,
      citySelected,
      ev.target.id
    );
    this.setState({
      companiesToShow: DataBaseFunctions.GetCompaniesNames(
        countrySelected,
        citySelected
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

        this.setState({
          cityList: cityList,
          countrySelected: newCountrySelected,
          citySelected: cityList[0],
          companiesToShow: DataBaseFunctions.GetCompaniesNames(
            newCountrySelected,
            cityList[0]
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
          companiesToShow: companiesList,
        });
        break;
      default:
        break;
    }
  };

  prepareList() {
    const countryList = DataBaseFunctions.GetCountriesNames();
    const cityList = DataBaseFunctions.GetCitiesNames(countryList[0]);

    this.setState({
      countryList: countryList,
      cityList: cityList,
      countrySelected: countryList[0],
      citySelected: cityList[0],
      companiesToShow: DataBaseFunctions.GetCompaniesNames(
        countryList[0],
        cityList[0]
      ),
    });
  }

  render() {
    const { countryList, cityList, companiesToShow } = this.state;
    const { listTitle } = this.props;
    return (
      <ListComponent
        dataList={[countryList, cityList]}
        itemList={companiesToShow}
        listTitle={listTitle}
        onChangeFunction={this.selectHandler}
        selectTitle={['Country', 'City']}
        attribute={['country', 'city']}
        removeFunction={this.removeCompany}
      />
    );
  }
}
