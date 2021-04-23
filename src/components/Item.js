import { Component } from 'react';

class Item extends Component {
  // constructor(props) {
  //   super(props);
  //   this.id = this.props.id;
  //   this.puesto = this.props.puesto;
  //   this.empresa = this.props.empresa;
  //   this.ciudad = this.props.ciudad;
  //   this.pais = this.props.pais;
  // }

  capitalize = (word) => {
    let first_letter = String(word)[0];
    first_letter = first_letter.toUpperCase();
    let new_word_1 = first_letter + String(word).substring(1);

    return new_word_1;
  };

  ItemAttribute = ({ propertyKey }) => {
    return (
      <div className='itemAttribute'>
        <span>
          <b>{this.capitalize(propertyKey)}</b>:
        </span>
        <p style={{ display: 'inline' }}> {this.props[propertyKey]}</p>
      </div>
    );
  };

  render() {
    return (
      <li
        className='itemContainer row'
        style={{ marginTop: '10px', marginBottom: '2px' }}>
        <div className='col-1'>
          <i class='fas fa-caret-right'></i>
        </div>
        <div className='col'>
          <this.ItemAttribute propertyKey={'puesto'} />
          <this.ItemAttribute propertyKey={'empresa'} />
          <this.ItemAttribute propertyKey={'ciudad'} />
          <this.ItemAttribute propertyKey={'pais'} />
        </div>
        <div className='col-3'>
          <i
            class='fas fa-trash-alt'
            onClick={() => this.props.removeItemHandler(this.props.id)}
            style={{
              cursor: 'pointer',
              fontSize: '1.5rem',
              marginTop: '10px',
              color: '#de5a5a',
            }}></i>
          {/* <button
            className='btn btn-danger'
            onClick={() => this.props.removeItemHandler(this.props.id)}
            style={{ width: '1.5rem', height: '1.5rem', padding: '1px' }}>
            X
          </button> */}
        </div>
      </li>
    );
  }
}

export default Item;
