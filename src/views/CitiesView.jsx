import React, { Component } from 'react';
import FormComponent from '../components/FormComponent';
import { CityModel } from '../models/Models';
import { DataBaseFunctions } from '../utils/localStorageFunctions';
import { ListComponent } from '../components/ListComponent';

export class CitiesView extends Component {
  constructor() {
    super();
    this.state = {
      cityObject: CityModel,
      showForm: 'none',
    };
    this.SaveCity = DataBaseFunctions.SaveCity.bind(this);
  }

  spawnForm = () => {
    const { showForm, cityObject } = this.state;
    if (showForm !== 'none') {
      return (
        <FormComponent
          objectToShow={cityObject}
          title='New City Form'
          selectButtonsIndexes={[1]}
          attributesToIgnore={['companies']}
          dataListForSelectButtons={[DataBaseFunctions.GetCountriesNames()]}
          savingFunction={this.SaveCity}
          updateFunction={this.updateList}
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
            New City
          </button>
          {this.spawnForm()}
        </div>
        <LocalList listTitle='Cities' />
      </>
    );
  }
}

export default class LocalList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mostrarForm: 'none',
      citiesToShow: [],
      countryList: [],
      countrySelected: '',
    };
    this.removeCity = this.removeCity.bind(this);
    this.selectHandler = this.selectHandler.bind(this);
  }

  removeCity(ev) {
    const { countrySelected } = this.state;
    DataBaseFunctions.RemoveCity(countrySelected, ev.target.id);
    this.setState({
      citiesToShow: DataBaseFunctions.GetCitiesNames(countrySelected),
    });
  }

  componentDidMount() {
    this.prepareList();
  }

  selectHandler = (ev) => {
    this.setState({
      countrySelected: ev.target.value,
      citiesToShow: DataBaseFunctions.GetCitiesNames(ev.target.value),
    });
  };

  prepareList() {
    const countryList = DataBaseFunctions.GetCountriesNames();

    this.setState({
      countryList: countryList,
      countrySelected: countryList[0],
      citiesToShow: DataBaseFunctions.GetCitiesNames(countryList[0]),
    });
  }

  render() {
    const { countryList, citiesToShow } = this.state;
    const { listTitle } = this.props;
    return (
      <ListComponent
        dataList={[countryList]}
        itemList={citiesToShow}
        listTitle={listTitle}
        onChangeFunction={this.selectHandler}
        selectTitle={['Country']}
        attribute={['country']}
        removeFunction={this.removeCity}
      />
    );
  }
}
