import React, { Component } from 'react';
import FormComponent from '../components/FormComponent';
import { CountryModel } from '../models/Models';
import {
  SaveCountry,
  GetCountriesNames,
  RemoveCountry,
} from '../utils/localStorageFunctions';
import { capitalize } from '../utils/StringUtilities';

export class CountriesView extends Component {
  constructor() {
    super();
    this.state = {
      countryListNames: [],
      countryObject: CountryModel,
      showForm: 'none',
    };
    this.SaveCountry = SaveCountry.bind(this);
  }

  componentDidMount() {
    this.prepareList();
  }

  prepareList() {
    const countryList = GetCountriesNames();
    console.log(countryList);
    this.setState({ countryListNames: countryList });
  }

  spawnForm = () => {
    if (this.state.showForm !== 'none') {
      return (
        <FormComponent
          objectToShow={this.state.countryObject}
          title='New Country Form'
          attributesToIgnore={['cities']}
          savingFunction={this.SaveCountry}
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
            New Country
          </button>
          {this.spawnForm()}
        </div>
        <ListComponent listTitle='Countries' />
      </>
    );
  }
}

export default class ListComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mostrarForm: 'none',
      countriesToShow: [],
    };
    this.removeCountry = this.removeCountry.bind(this);
  }

  spawnItems() {
    return this.state.countriesToShow.length > 0 ? (
      this.state.countriesToShow.map((item, index) => {
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
                onClick={this.removeCountry}
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

  removeCountry(ev) {
    // console.log(this.state.countrySelected);
    // console.log(ev.target.id);
    RemoveCountry(ev.target.id);
    this.updateList();
  }

  componentDidMount() {
    this.updateList();
  }

  updateList() {
    this.setState({
      countriesToShow: GetCountriesNames(),
    });
  }

  render() {
    return (
      <>
        <div className='listContainer'>
          <ul>
            <div className='extra-data'>
              <h3>List of {this.props.listTitle}</h3>
            </div>
            {this.spawnItems()}
          </ul>
        </div>
      </>
    );
  }
}
