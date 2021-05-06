import { capitalize } from '../utils/StringUtilities';
export const SelectComponent = ({
  onChangeFunction,
  dataList,
  title,
  attribute,
}) => {
  return (
    <>
      <label htmlFor='select'>{title}</label>
      <select
        name={attribute}
        id={attribute}
        className='form-select'
        onChange={onChangeFunction}>
        {dataList.map((element, index) => {
          return (
            <option value={element} key={index}>
              {capitalize(element)}
            </option>
          );
        })}
      </select>
    </>
  );
};
