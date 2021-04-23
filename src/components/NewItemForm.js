import { Component } from 'react';

class NewItemForm extends Component {
  // console.log(this.props);
  constructor(props) {
    super(props);
    this.state = {
      puestoValue: '',
      empresaValue: '',
      ciudadValue: '',
      paisValue: '',
    };
  }

  submitHandler = () => {
    let validData =
      this.state.puestoValue !== '' &&
      this.state.empresaValue !== '' &&
      this.state.ciudadValue !== '' &&
      this.state.paisValue !== '';

    if (validData) {
      this.props.newItemHandler(
        this.state.puestoValue,
        this.state.empresaValue,
        this.state.ciudadValue,
        this.state.paisValue
      );
      this.props.showOrHideForm();
    } else {
      alert('Debe completar todos los campos');
    }
  };

  puestoInputHandler = (ev) => {
    ev.preventDefault();
    this.setState({
      puestoValue: ev.target.value,
    });
  };

  empresaInputHandler = (ev) => {
    ev.preventDefault();
    this.setState({
      empresaValue: ev.target.value,
    });
  };

  ciudadInputHandler = (ev) => {
    ev.preventDefault();
    this.setState({
      ciudadValue: ev.target.value,
    });
  };

  paisInputHandler = (ev) => {
    ev.preventDefault();
    this.setState({
      paisValue: ev.target.value,
    });
  };

  render() {
    const { puestoValue, empresaValue, ciudadValue, paisValue } = this.state;

    return (
      <form className='miForm' style={{ display: this.props.show }}>
        <div className='form-group row'>
          <label className='col-3 col-form-label'>Puesto</label>
          <div className='col-8'>
            <input
              id='puesto'
              name='puesto'
              placeholder='El nombre de este Puesto'
              type='text'
              value={puestoValue}
              className='form-control'
              required='required'
              onChange={this.puestoInputHandler}
            />
          </div>
        </div>
        <div className='form-group row'>
          <label className='col-3 col-form-label'>Empresa</label>
          <div className='col-8'>
            <input
              id='empresa'
              name='empresa'
              placeholder='El nombre de la Empresa'
              type='text'
              value={empresaValue}
              className='form-control'
              required='required'
              onChange={this.empresaInputHandler}
            />
          </div>
        </div>
        <div className='form-group row'>
          <label className='col-3 col-form-label'>Ciudad</label>
          <div className='col-8'>
            <input
              id='ciudad'
              name='ciudad'
              placeholder='Ciudad a la que pertenece'
              type='text'
              value={ciudadValue}
              className='form-control'
              required='required'
              onChange={this.ciudadInputHandler}
            />
          </div>
        </div>
        <div className='form-group row'>
          <label className='col-3 col-form-label'>Pais</label>
          <div className='col-8'>
            <input
              id='pais'
              name='pais'
              placeholder='Pais al que pertenece'
              type='text'
              value={paisValue}
              className='form-control'
              required='required'
              onChange={this.paisInputHandler}
            />
          </div>
        </div>
        <div className='form-group row'>
          <div className='offset-3 col-8'>
            <button
              type='button'
              className='btn btn-primary'
              onClick={() => this.submitHandler()}
              style={{ marginTop: '10px' }}>
              Submit
            </button>
          </div>
        </div>
      </form>
    );
  }
}

export default NewItemForm;
