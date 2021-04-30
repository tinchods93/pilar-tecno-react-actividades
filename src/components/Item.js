import { Component } from 'react';

class Item extends Component {
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
          <i className='fas fa-caret-right'></i>
        </div>
        <div className='col'>
          <this.ItemAttribute propertyKey={'puesto'} />
          <this.ItemAttribute propertyKey={'empresa'} />
          <this.ItemAttribute propertyKey={'ciudad'} />
          <this.ItemAttribute propertyKey={'pais'} />
        </div>
        <div className='col-3'>
          <i
            className='fas fa-trash-alt'
            onClick={() => this.props.removeItemHandler(this.props.id)}
            style={{
              cursor: 'pointer',
              fontSize: '1.5rem',
              marginTop: '10px',
              color: '#de5a5a',
            }}></i>
        </div>
      </li>
    );
  }
}

export default Item;
