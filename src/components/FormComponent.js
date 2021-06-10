import { Component } from 'react';
import { capitalize } from '../utils/StringUtilities';
import { SelectComponent } from './SelectComponent';

export default class FormComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formObject: this.props.formObject,
      dataList: this.props.dataList || [],
      objectAttributes: this.props.objectAttributes || [],
      selectAttributes: this.props.selectAttributes || [],
      countrySelected: this.props.countrySelected,
      placeSelected: this.props.placeSelected,
      organizationSelected: this.props.organizationSelected,
      selectHandler: this.props.selectHandler,
    };
    this.inputHandler = this.inputHandler.bind(this);
  }

  inputHandler = (ev) => {
    const dataModel = this.state.formObject;
    dataModel[ev.target.name] = ev.target.value;
    this.setState({ formObject: dataModel });
  };

  submitHandler = () => {
    const dataModel = this.state.formObject;

    console.log(dataModel);
    this.props.savingFunction(dataModel);
  };

  componentDidUpdate() {
    this.updateData();
  }
  componentDidMount() {
    this.updateData();
  }

  updateData = () => {
    const { formObject, countrySelected, placeSelected, organizationSelected } =
      this.state;

    if (
      countrySelected !== this.props.countrySelected ||
      formObject.countrieId === ''
    ) {
      formObject.countrieId = this.props.countrySelected.id;
      this.setState({
        formObject: formObject,
        countrySelected: this.props.countrySelected,
      });
    }
    if (
      placeSelected !== this.props.placeSelected ||
      formObject.placeId === ''
    ) {
      formObject.placeId = this.props.placeSelected.id;
      this.setState({
        formObject: formObject,
        placeSelected: this.props.placeSelected,
      });
    }
    if (
      organizationSelected !== this.props.organizationSelected ||
      formObject.organizationId === ''
    ) {
      formObject.organizationId = this.props.organizationSelected.id;
      this.setState({
        formObject: formObject,
        organizationSelected: this.props.organizationSelected,
      });
    }
    if (this.state.dataList !== this.props.dataList) {
      this.setState({ dataList: this.props.dataList });
    }
  };

  selectButtons = () => {
    let selectComp = [];

    const { dataList, selectHandler, selectAttributes } = this.state;

    const selected = [
      this.state.countrySelected,
      this.state.placeSelected,
      this.state.organizationSelected,
    ];
    if (dataList.length > 0) {
      for (let index = 0; index < dataList.length; index++) {
        selectComp.push(
          <SelectComponent
            onChangeFunction={selectHandler}
            dataList={dataList[index]}
            selected={selected[index].id}
            key={index}
            title={selectAttributes[index]}
            attribute={selectAttributes[index]}
          />
        );
      }
    }
    return selectComp;
  };

  formGroups = () => {
    let formGroups = [];
    const { selectAttributes } = this.props;

    this.state.objectAttributes.forEach((attribute, index) => {
      if (!selectAttributes.includes(attribute)) {
        formGroups.push(
          <FormGroup
            key={index}
            attribute={attribute}
            inputHandler={this.inputHandler}
          />
        );
      }
    });
    return formGroups;
  };

  render() {
    return (
      <form className='miForm'>
        <div className='formTitle'>
          <h4>{this.props.title}</h4>
        </div>
        <div className='form-group row'>
          <div className='col'>
            {this.formGroups()}
            {this.selectButtons()}

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