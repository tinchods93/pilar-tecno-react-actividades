import React, { Component } from 'react';
import FormComponent from '../components/FormComponent';
import { CountryModel } from '../models/Models';
import { DataBaseFunctions } from '../utils/localStorageFunctions';
import { ListComponent } from '../components/ListComponent';

export class CountriesView extends Component {
  constructor() {
    super();
    this.state = {
      countryListNames: [],
      countryObject: CountryModel,
      showForm: 'none',
    };
    this.SaveCountry = DataBaseFunctions.SaveCountry.bind(this);
  }

  componentDidMount() {
    this.prepareList();
  }

  prepareList() {
    const countryList = DataBaseFunctions.GetCountriesNames();
    console.log(countryList);
    this.setState({ countryListNames: countryList });
  }

  spawnForm = () => {
    const { countryObject, showForm } = this.state;
    if (showForm !== 'none') {
      return (
        <FormComponent
          objectToShow={countryObject}
          title='New Country Form'
          attributesToIgnore={['cities']}
          savingFunction={this.SaveCountry}
        />
      );
    }
  };

  showForm = () => {
    const { showForm } = this.state;
    showForm === 'none'
      ? this.setState({ showForm: 'block' })
      : this.setState({ showForm: 'none' });
  };

  render() {
    return (
      <>
        <div className='formContainer col'>
          <button className='btn btn-custom' onClick={() => this.showForm()}>
            New Country
          </button>
          {this.spawnForm()}
        </div>
        <LocalListComponent listTitle='Countries' />
      </>
    );
  }
}

export default class LocalListComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mostrarForm: 'none',
      countriesToShow: [],
    };
    this.removeCountry = this.removeCountry.bind(this);
  }

  removeCountry(ev) {
    DataBaseFunctions.RemoveCountry(ev.target.id);
    this.updateList();
  }

  componentDidMount() {
    this.updateList();
  }

  updateList() {
    this.setState({
      countriesToShow: DataBaseFunctions.GetCountriesNames(),
    });
  }

  render() {
    const { countriesToShow } = this.state;
    const { listTitle } = this.props;
    return (
      <ListComponent
        dataList={[]}
        itemList={countriesToShow}
        listTitle={listTitle}
        removeFunction={this.removeCountry}
      />
    );
  }
}
