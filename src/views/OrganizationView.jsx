/* eslint-disable eqeqeq */
import React, { Component } from 'react';
import FormComponent from '../components/FormComponent';
import { OrganizationModel } from '../models/Models';
import { DataBaseFunctions } from '../utils/apiFunctions';
import { ListComponent } from '../components/ListComponent';

export class OrganizationView extends Component {
  constructor() {
    super();
    this.state = {
      organizationList: [],
      countryList: [],
      placeList: [],
      countrySelected: '',
      placeSelected: '',
      organizationObject: OrganizationModel,
      showForm: 'none',
    };
    this.SaveOrganization = this.SaveOrganization.bind(this);
    this.selectHandler = this.selectHandler.bind(this);
    this.removeOrganization = this.removeOrganization.bind(this);
  }

  SaveOrganization = async (obj) => {
    const new_list = await DataBaseFunctions.SaveOrganization(obj);

    if (new_list !== undefined) {
      this.setState({ organizationList: new_list });
    }
  };

  spawnForm = () => {
    if (this.state.showForm !== 'none') {
      const {
        organizationObject,
        countryList,
        placeList,
        countrySelected,
        placeSelected,
      } = this.state;
      return (
        <FormComponent
          formObject={organizationObject}
          title='New Company Form'
          objectAttributes={['name', 'place', 'countrie']}
          countrySelected={countrySelected}
          placeSelected={placeSelected}
          dataList={[countryList, placeList]}
          selectAttributes={['countrie', 'place']}
          savingFunction={this.SaveOrganization}
          selectHandler={this.selectHandler}
        />
      );
    }
  };

  showForm = () => {
    this.state.showForm === 'none'
      ? this.setState({ showForm: 'block' })
      : this.setState({ showForm: 'none' });
  };

  async removeOrganization(ev) {
    const new_list = await DataBaseFunctions.RemoveOrganization(ev.target.id);

    if (new_list !== undefined) {
      this.setState({ organizationList: new_list });
    }
  }

  componentDidMount() {
    this.prepareList();
  }

  selectHandler = async (ev) => {
    switch (ev.target.id) {
      case 'countrie':
        const newCountrySelected_id = ev.target.value;
        const placeList = await DataBaseFunctions.GetPlaces(
          newCountrySelected_id
        );
        const countrySelected = await DataBaseFunctions.GetCountryById(
          newCountrySelected_id
        );

        this.setState({
          placeList: placeList,
          countrySelected: countrySelected,
          placeSelected: placeList[0],
          organizationList: await DataBaseFunctions.GetOrganizations(
            placeList[0].id
          ),
        });

        break;
      case 'place':
        const newPlaceSelected_id = ev.target.value;
        const organizationList = await DataBaseFunctions.GetOrganizations(
          newPlaceSelected_id
        );

        this.setState({
          placeSelected: await DataBaseFunctions.GetPlaceById(
            newPlaceSelected_id
          ),
          organizationList: organizationList,
        });
        break;
      default:
        break;
    }
    const dataModel = this.state.organizationObject;
    const { countrySelected, placeSelected } = this.state;

    if (countrySelected !== undefined) {
      dataModel.countrieId = countrySelected.id;
    }
    if (placeSelected !== undefined) {
      dataModel.placeId = placeSelected.id;
    }

    this.setState({ organizationObject: dataModel });
  };

  async prepareList() {
    const countryList = await DataBaseFunctions.GetCountries();

    const placeList = await DataBaseFunctions.GetPlaces(countryList[0].id);

    this.setState({
      countryList: countryList,
      placeList: placeList,
      countrySelected: countryList[0],
      placeSelected: placeList[0],
      organizationList: await DataBaseFunctions.GetOrganizations(
        placeList[0].id
      ),
    });
  }

  render() {
    const {
      countryList,
      placeList,
      organizationList,
      countrySelected,
      placeSelected,
    } = this.state;
    return (
      <>
        <div className='formContainer col'>
          <button className='btn btn-custom' onClick={() => this.showForm()}>
            New Organization
          </button>
          {this.spawnForm()}
        </div>
        <ListComponent
          dataList={[countryList, placeList]}
          itemList={organizationList}
          listTitle={'Organizations'}
          selected={[countrySelected.id, placeSelected.id]}
          onChangeFunction={this.selectHandler}
          selectTitle={['Countrie', 'Place']}
          attribute={['countrie', 'place']}
          removeFunction={this.removeOrganization}
        />
      </>
    );
  }
}
