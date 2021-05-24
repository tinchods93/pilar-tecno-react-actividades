import { SelectComponent } from './SelectComponent';
import { ItemComponent } from './ItemComponent';

export const ListComponent = ({
  dataList,
  itemList,
  listTitle,
  onChangeFunction,
  selectTitle,
  attribute,
  removeFunction,
}) => {
  const selectButtons = () => {
    let selectComp = [];

    if (dataList.length > 0) {
      for (let index = 0; index < dataList.length; index++) {
        selectComp.push(
          <SelectComponent
            onChangeFunction={onChangeFunction}
            dataList={dataList[index]}
            key={index}
            title={selectTitle[index]}
            attribute={attribute[index]}
          />
        );
      }
    }
    return selectComp;
  };

  const spawnSelectButtons = () => {
    if (dataList.length > 0) {
      return <div className='selectComponents'>{selectButtons()}</div>;
    }
  };
  return (
    <>
      <div className='listContainer col'>
        <ul>
          <div className='extra-data'>
            <h3>List of {listTitle}</h3>
            {spawnSelectButtons()}
          </div>
          <ItemComponent itemList={itemList} removeFunction={removeFunction} />
        </ul>
      </div>
    </>
  );
};
