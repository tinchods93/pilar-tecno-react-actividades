import '../css/App.css';
import ItemList from './ItemList';

function App() {
  return (
    <div className='container' style={{ marginTop: '20px' }}>
      <div className='row'>
        <ItemList />
      </div>
    </div>
  );
}

export default App;
