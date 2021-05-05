import { Component } from 'react';
import { capitalize } from '../utils/StringUtilities';
import {
  GetCountriesNames,
  GetCitiesNames,
  GetCompaniesNames,
} from '../utils/localStorageFunctions';

export default class FormComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      objectAttributes: [],
      dataListForSelectButtons: [
        {
          nothing: 'Nothing here',
        },
      ],
      objectToShow: this.props.objectToShow || {
        nothingHere: 'No object loaded',
      },
      selectButtons: this.props.selectButtonsIndexes || [-1],
      attributesToIgnore: this.props.attributesToIgnore || ['#####'],
    };
    this.saveParentDataObj = this.saveParentDataObj.bind(this);
  }

  componentDidMount() {
    this.prepareComponent();
  }
  prepareComponent = () => {
    console.log('prepareComponent');
    const keysFromObject = Object.keys(this.state.objectToShow);
    this.initiateSelectedButtons();
    this.setState({ objectAttributes: keysFromObject });
  };

  initiateSelectedButtons = () => {
    const obj = this.state.objectToShow;
    const attributes = Object.keys(obj);
    console.log(attributes);
    const dataListForSelectButtons = [];

    attributes.forEach((attribute, index) => {
      //Cada atributo tendrá un indice y ese indice, corresponderá a los indices dentro de la variable selectButtons en el estado
      if (this.state.selectButtons.includes(index)) {
        switch (attribute) {
          case 'country':
            //Una vez reconocimos el attributo al que accedimos, obtenemos la lsita que le corresponde y seteamos
            //el valor inicial al primer valor de la lista obtenida, ya sea Country,City o company o incluso Jobs, si se quisiera
            const countries = GetCountriesNames();
            dataListForSelectButtons.push(countries);
            obj.country = countries[0];
            break;
          case 'city':
            const cities = GetCitiesNames(obj.country);
            dataListForSelectButtons.push(cities);
            obj.city = cities[0];
            break;
          case 'company':
            const companies = GetCompaniesNames(obj.country, obj.city);
            dataListForSelectButtons.push(companies);
            obj.company = companies[0];
            break;
          default:
            break;
        }
      }
    });
    console.log(dataListForSelectButtons);
    this.setState({
      dataListForSelectButtons: dataListForSelectButtons,
      objectToShow: obj,
    });
  };

  inputHandler = (ev) => {
    const dataModel = this.state.objectToShow;
    dataModel[ev.target.name] = ev.target.value;
    this.setState({ objectToShow: dataModel });
  };

  submitHandler = () => {
    const dataModel = this.state.objectToShow;
    // console.log(this.state.objectToShow);
    const canSubmit = () => {
      let keys = Object.keys(this.state.objectToShow);
      let submit = true;
      keys.forEach((key) => {
        if (typeof this.state.objectToShow[key] == 'string') {
          if (this.state.objectToShow[key] === '') {
            submit = false;
          }
        }
      });
      return submit;
    };
    // console.log(dataModel);
    canSubmit()
      ? this.props.savingFunction(dataModel)
      : alert('All fields must be completed');
  };

  saveParentDataObj = (attribute, value) => {
    const obj = this.state.objectToShow;
    obj[attribute] = value;
    this.setState({ objectToShow: obj });
  };

  render() {
    return (
      <form className='miForm'>
        <div className='formTitle'>
          <h4>{this.props.title}</h4>
        </div>
        <div className='form-group row'>
          <div className='col'>
            {this.state.objectAttributes.map((attribute, index) => {
              if (this.state.attributesToIgnore.includes(attribute) === false) {
                return this.state.selectButtons.includes(index) ? (
                  <FormGroupSelect
                    key={index}
                    attribute={attribute}
                    onChangeFunc={this.inputHandler}
                    dataList={this.state.dataListForSelectButtons}
                    dataListIndex={index - 1}
                    saveParentDataObj={this.saveParentDataObj}
                    getParentDataObj={this.state.objectToShow}
                  />
                ) : (
                  <FormGroup
                    key={index}
                    attribute={attribute}
                    inputHandler={this.inputHandler}
                  />
                );
              }
            })}
            <button
              type='button'
              className='btn btn-primary'
              onClick={() => this.submitHandler()}>
              Submit
            </button>
          </div>
        </div>
      </form>
    );
  }
}

const FormGroup = ({ attribute, inputHandler }) => {
  return (
    <div className='form-group row'>
      <label className='col-4 col-form-label'>{capitalize(attribute)}</label>
      <div className='col-8'>
        <input
          id={attribute}
          name={attribute}
          type='text'
          className='form-control'
          required='required'
          onChange={inputHandler}
        />
      </div>
    </div>
  );
};

class FormGroupSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentSelected: '',
      update: '',
      dataList: this.props.dataList || [],
    };
  }

  updateList = (ev) => {
    this.props.onChangeFunc(ev);
    this.selectLocalHandler(ev);
    this.setState({ update: ev.target.name });
  };

  selectLocalHandler(ev) {
    const changedAttribute = ev.target.name;
    console.log('SELECTLOCALHANDLER');
    const dataList = this.state.dataList;
    switch (changedAttribute) {
      case 'country':
        //Una vez reconocimos el attributo al que accedimos, obtenemos la lsita que le corresponde y seteamos
        //el valor inicial al primer valor de la lista obtenida, ya sea Country,City o company o incluso Jobs, si se quisiera

        const newCountrySelected = ev.target.value;
        const cityList = GetCitiesNames(newCountrySelected);
        const companyList = GetCompaniesNames(newCountrySelected, cityList[0]);

        this.props.saveParentDataObj(changedAttribute, ev.target.value);
        this.props.saveParentDataObj('city', cityList[0]);
        this.props.saveParentDataObj('company', companyList[0]);

        dataList[1] = cityList;
        dataList[2] = companyList;
        this.setState({
          dataList: dataList,
          currentSelected: newCountrySelected,
        });
        break;
      case 'city':
        const newCitySelected = ev.target.value;
        this.props.saveParentDataObj(changedAttribute, ev.target.value);
        const companyieList = GetCompaniesNames(
          this.props.getParentDataObj.country,
          newCitySelected
        );
        dataList[2] = companyieList;
        this.setState({
          dataList: dataList,
          currentSelected: newCitySelected,
        });
        break;
      case 'company':
        const newCompanySelected = ev.target.value;
        this.props.saveParentDataObj(changedAttribute, ev.target.value);
        this.setState({
          currentSelected: newCompanySelected,
        });
        break;
      default:
        break;
    }

    console.log(ev.target.value);
  }

  componentDidUpdate() {}

  render() {
    return (
      <div className='form-group row'>
        <label htmlFor='select' className='col-4 col-form-label'>
          {capitalize(this.props.attribute)}
        </label>
        <div className='col'>
          <select
            id={this.props.attribute}
            name={this.props.attribute}
            className='form-select'
            onChange={this.updateList}>
            {this.state.dataList[this.props.dataListIndex].map(
              (element, index) => {
                return (
                  <option value={element} key={index}>
                    {capitalize(element)}
                  </option>
                );
              }
            )}
          </select>
        </div>
      </div>
    );
  }
}
