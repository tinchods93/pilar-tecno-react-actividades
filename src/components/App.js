import '../css/App.css';
import { JobsView } from '../views/JobsView';
import { CompaniesView } from '../views/CompaniesView';
import { CitiesView } from '../views/CitiesView';
import { CountriesView } from '../views/CountriesView';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import NavBar from './NavBar';

function App() {
  return (
    <>
      <NavBar />
      <div className='container' style={{ marginTop: '20px' }}>
        <div className='row'>
          <Router>
            <Switch>
              <Route path='/' exact component={JobsView}></Route>
              <Route path='/companies' exact component={CompaniesView}></Route>
              <Route path='/cities' exact component={CitiesView}></Route>
              <Route path='/countries' exact component={CountriesView}></Route>
            </Switch>
          </Router>
        </div>
      </div>
    </>
  );
}

export default App;
