import React, { Component } from 'react';
import FormComponent from '../components/FormComponent';
import { CountryModel } from '../models/Models';
import { DataBaseFunctions } from '../utils/apiFunctions';
import { ListComponent } from '../components/ListComponent';

export class CountriesView extends Component {
  constructor() {
    super();
    this.state = {
      countryList: [],
      countryObject: CountryModel,
      showForm: 'none',
    };
    this.SaveCountry = this.SaveCountry.bind(this);
    this.removeCountry = this.removeCountry.bind(this);
  }

  componentDidMount() {
    this.prepareList();
  }

  SaveCountry = async (obj) => {
    const new_list = await DataBaseFunctions.SaveCountry(obj);
    if (new_list !== undefined) {
      this.setState({ countryList: new_list });
    }
  };

  async removeCountry(ev) {
    const new_list = await DataBaseFunctions.RemoveCountry(ev.target.id);
    if (new_list !== undefined) {
      this.setState({ countryList: new_list });
    }
  }

  async prepareList() {
    const countryList = await DataBaseFunctions.GetCountries();

    this.setState({ countryList: countryList });
  }

  spawnForm = () => {
    if (this.state.showForm !== 'none') {
      const { countryObject } = this.state;
      return (
        <FormComponent
          formObject={countryObject}
          title='New Country Form'
          objectAttributes={['name']}
          dataList={[]}
          selectAttributes={[]}
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
    const { countryList } = this.state;
    return (
      <>
        <div className='formContainer col'>
          <button className='btn btn-custom' onClick={() => this.showForm()}>
            New Country
          </button>
          {this.spawnForm()}
        </div>
        <ListComponent
          dataList={[]}
          itemList={countryList}
          listTitle={'Countries'}
          removeFunction={this.removeCountry}
        />
      </>
    );
  }
}
