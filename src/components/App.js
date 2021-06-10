import '../css/App.css';
import { JobsView } from '../views/JobsView';
import { OrganizationView } from '../views/OrganizationView';
import { PlacesView } from '../views/PlacesView';
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
              <Route
                path='/organizations'
                exact
                component={OrganizationView}></Route>
              <Route path='/places' exact component={PlacesView}></Route>
              <Route path='/countries' exact component={CountriesView}></Route>
            </Switch>
          </Router>
        </div>
      </div>
    </>
  );
}

export default App;
