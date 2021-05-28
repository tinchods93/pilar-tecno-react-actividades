import { capitalize } from '../utils/StringUtilities';
export const SelectComponent = ({
  onChangeFunction,
  selected,
  dataList,
  title,
  attribute,
}) => {
  const data = () => {
    let a = [];
    dataList.forEach((element, index) => {
      a.push(
        <option value={element.id} key={index}>
          {capitalize(element.name)}
        </option>
      );
    });
    return a;
  };

  return (
    <>
      <label htmlFor='select'>{title}</label>
      <select
        name={attribute}
        id={attribute}
        className='form-select'
        onChange={onChangeFunction}
        value={selected}>
        {data()}
      </select>
    </>
  );
};
