import React, { Component } from 'react';
import Item from './Item';
import NewItemForm from './NewItemForm';

class ItemList extends Component {
  constructor() {
    super();
    this.state = {
      mostrarForm: 'none',
      itemList: [],
    };
    this.newItem = this.newItem.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.newItemBtnHandler = this.newItemBtnHandler.bind(this);
  }

  newItem = (_puesto, _empresa, _ciudad, _pais) => {
    let new_list = this.state.itemList;

    new_list.push({
      puesto: _puesto,
      empresa: _empresa,
      ciudad: _ciudad,
      pais: _pais,
    });
    this.setState({
      itemList: new_list,
    });
  };

  removeItem = (id) => {
    let new_list = [...this.state.itemList];

    new_list.splice(id, 1);
    this.setState({ itemList: new_list });
  };

  spawnForm = () => {
    if (this.state.mostrarForm !== 'none') {
      return (
        <NewItemForm
          newItemHandler={this.newItem}
          showOrHideForm={this.newItemBtnHandler}
        />
      );
    }
  };

  spawnList = () => {
    if (this.state.itemList.length > 0) {
      return this.state.itemList.map((item, index) => {
        return (
          <Item
            key={index}
            id={index}
            puesto={item.puesto}
            empresa={item.empresa}
            ciudad={item.ciudad}
            pais={item.pais}
            removeItemHandler={this.removeItem}
          />
        );
      });
    }
    return (
      <li
        className='itemContainer row'
        style={{ marginTop: '10px', marginBottom: '2px' }}>
        <div className='col-1'>
          <i className='fas fa-caret-right'></i>
        </div>
        No hay ningun item cargado
      </li>
    );
  };

  newItemBtnHandler = () => {
    this.state.mostrarForm === 'none'
      ? this.setState({ mostrarForm: 'block' })
      : this.setState({ mostrarForm: 'none' });
  };

  render() {
    return (
      <>
        <div className='formContainer col-4'>
          <button
            className='btn btn-custom'
            onClick={() => this.newItemBtnHandler()}>
            Nuevo Item
          </button>
          {this.spawnForm()}
        </div>
        <div className='col listContainer'>
          <ul>
            <h3>Listado</h3>
            {this.spawnList()}
          </ul>
        </div>
      </>
    );
  }
}

export default ItemList;
