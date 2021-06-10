import { capitalize } from '../utils/StringUtilities';
export const ItemComponent = ({ itemList, removeFunction }) => {
  return itemList.length > 0 ? (
    itemList.map((item, index) => {
      return (
        <li
          className='itemContainer row'
          style={{ marginTop: '10px', marginBottom: '2px' }}
          key={index}>
          <i className='fas fa-caret-right itemIcons'></i>
          {capitalize(item.name || item.position)}
          <i
            className='fas fa-trash-alt trash-icon'
            onClick={removeFunction}
            id={item.id}></i>
        </li>
      );
    })
  ) : (
    <li
      className='itemContainer row'
      style={{ marginTop: '10px', marginBottom: '2px' }}>
      <i className='fas fa-caret-right'></i>No Data to Show
    </li>
  );
};
