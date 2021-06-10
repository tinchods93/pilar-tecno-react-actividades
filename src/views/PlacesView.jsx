import React, { Component } from 'react';
import { PlaceModel } from '../models/Models';
import { DataBaseFunctions } from '../utils/apiFunctions';
import { ListComponent } from '../components/ListComponent';
import FormComponent from '../components/FormComponent';

export class PlacesView extends Component {
  constructor() {
    super();
    this.state = {
      placeObject: PlaceModel,
      placesList: [],
      countryList: [],
      countrySelected: '',
      showForm: 'none',
    };
    this.SavePlace = this.SavePlace.bind(this);
    this.removePlace = this.removePlace.bind(this);
    this.selectHandler = this.selectHandler.bind(this);
  }

  SavePlace = async (obj) => {
    const new_list = await DataBaseFunctions.SavePlace(obj);

    if (new_list !== undefined) {
      this.setState({ placesList: new_list });
    }
  };

  async removePlace(ev) {
    const new_list = await DataBaseFunctions.RemovePlace(ev.target.id);

    if (new_list !== undefined) {
      this.setState({ placesList: new_list });
    }
  }

  componentDidMount() {
    this.prepareList();
    console.log('DIDMOUNT');
  }

  selectHandler = async (ev) => {
    const newCountrySelected_id = ev.target.value;
    const placesList = await DataBaseFunctions.GetPlaces(newCountrySelected_id);
    console.log('EN VIEW', placesList);

    const countrySelectedObj = await DataBaseFunctions.GetCountryById(
      newCountrySelected_id
    );

    this.setState({
      placesList: placesList,
      countrySelected: countrySelectedObj,
    });

    const { countrySelected, placeObject } = this.state;

    if (countrySelected !== undefined) {
      placeObject.countrieId = countrySelected.id;
    }
    this.setState({ placeObject: placeObject });
  };

  async prepareList() {
    const countryList = await DataBaseFunctions.GetCountries();

    this.setState({
      countryList: countryList,
      countrySelected: countryList[0],
      placesList: await DataBaseFunctions.GetPlaces(countryList[0].id),
    });
  }

  spawnForm = () => {
    if (this.state.showForm !== 'none') {
      const { placeObject, countryList, countrySelected } = this.state;
      return (
        <FormComponent
          formObject={placeObject}
          title='New Place Form'
          objectAttributes={['name', 'countrie']}
          countrySelected={countrySelected}
          dataList={[countryList]}
          selectAttributes={['countrie']}
          savingFunction={this.SavePlace}
          selectHandler={this.selectHandler}
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
    const { countryList, placesList, countrySelected } = this.state;
    console.log(placesList);
    return (
      <>
        <div className='formContainer col'>
          <button className='btn btn-custom' onClick={() => this.showForm()}>
            New Place
          </button>
          {this.spawnForm()}
        </div>
        <ListComponent
          dataList={[countryList]}
          itemList={placesList}
          listTitle={'Places'}
          selected={[countrySelected.id]}
          onChangeFunction={this.selectHandler}
          selectTitle={['Country']}
          attribute={['country']}
          removeFunction={this.removePlace}
        />
      </>
    );
  }
}
