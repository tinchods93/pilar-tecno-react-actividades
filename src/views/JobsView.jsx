import React, { Component } from 'react';
import FormComponent from '../components/FormComponent';
import { JobModel } from '../models/Models';
import { DataBaseFunctions } from '../utils/apiFunctions';
import { ListComponent } from '../components/ListComponent';

export class JobsView extends Component {
  constructor() {
    super();
    this.state = {
      jobList: [],
      jobObject: JobModel,
      countryList: [],
      placeList: [],
      organizationList: [],
      countrySelected: '',
      placeSelected: '',
      organizationSelected: '',
      showForm: 'none',
    };

    this.removeJob = this.removeJob.bind(this);
    this.selectHandler = this.selectHandler.bind(this);
  }

  SaveJob = async (obj) => {
    const new_list = await DataBaseFunctions.SaveJob(obj);

    if (new_list !== undefined) {
      this.setState({ jobList: new_list });
    }
  };

  componentDidMount() {
    this.prepareList();
  }

  async prepareList() {
    const countryList = await DataBaseFunctions.GetCountries();
    const placeList = await DataBaseFunctions.GetPlaces(countryList[0].id);
    const organizationList = await DataBaseFunctions.GetOrganizations(
      placeList[0].id
    );
    const jobList = await DataBaseFunctions.GetJobs(organizationList[0].id);

    this.setState({
      countryList: countryList,
      placeList: placeList,
      organizationList: organizationList,
      countrySelected: countryList[0],
      placeSelected: placeList[0],
      organizationSelected: organizationList[0],
      jobList: jobList,
    });
  }

  async removeJob(ev) {
    const new_list = await DataBaseFunctions.RemoveJob(ev.target.id);

    if (new_list !== undefined) {
      this.setState({ jobList: new_list });
    }
  }

  selectHandler = async (ev) => {
    let organizationList = [];
    let newJobList = [];

    switch (ev.target.id) {
      case 'countrie':
        const newCountrySelected_id = ev.target.value;
        const placeList = await DataBaseFunctions.GetPlaces(
          newCountrySelected_id
        );
        organizationList = await DataBaseFunctions.GetOrganizations(
          placeList[0].id
        );

        newJobList = await DataBaseFunctions.GetJobs(organizationList[0].id);
        this.setState({
          placeList: placeList,
          organizationList: organizationList,
          countrySelected: await DataBaseFunctions.GetCountryById(
            newCountrySelected_id
          ),
          placeSelected: placeList[0],
          organizationSelected: organizationList[0],
          jobList: newJobList,
        });
        break;
      case 'place':
        let newPlaceSelected = ev.target.value;
        organizationList = await DataBaseFunctions.GetOrganizations(
          newPlaceSelected
        );
        newPlaceSelected = await DataBaseFunctions.GetPlaceById(
          newPlaceSelected
        );
        this.setState({
          placeSelected: newPlaceSelected,
          organizationList: organizationList,
          organizationSelected: organizationList[0],
          jobList: await DataBaseFunctions.GetJobs(organizationList[0].id),
        });
        break;
      case 'organization':
        let newOrganizationSelected = ev.target.value;

        newJobList = await DataBaseFunctions.GetJobs(newOrganizationSelected);
        newOrganizationSelected = await DataBaseFunctions.GetOrganizationsById(
          newOrganizationSelected
        );

        this.setState({
          organizationSelected: newOrganizationSelected,
          jobList: newJobList,
        });
        break;
      default:
        break;
    }
    const dataModel = this.state.jobObject;
    const { countrySelected, placeSelected, organizationSelected } = this.state;

    if (countrySelected !== undefined) {
      dataModel.countrieId = countrySelected.id;
    }
    if (placeSelected !== undefined) {
      dataModel.placeId = placeSelected.id;
    }
    if (organizationSelected !== undefined) {
      dataModel.organizationId = organizationSelected.id;
    }

    this.setState({ jobObject: dataModel });
  };

  showForm = () => {
    this.state.showForm === 'none'
      ? this.setState({ showForm: 'block' })
      : this.setState({ showForm: 'none' });
  };

  spawnForm = () => {
    const {
      jobObject,
      countryList,
      placeList,
      organizationList,
      countrySelected,
      placeSelected,
      organizationSelected,
    } = this.state;
    if (this.state.showForm !== 'none') {
      return (
        <FormComponent
          formObject={jobObject}
          title='New Job Form'
          objectAttributes={[
            'position',
            'description',
            'countrie',
            'place',
            'organization',
          ]}
          countrySelected={countrySelected}
          placeSelected={placeSelected}
          organizationSelected={organizationSelected}
          dataList={[countryList, placeList, organizationList]}
          selectAttributes={['countrie', 'place', 'organization']}
          savingFunction={this.SaveJob}
          selectHandler={this.selectHandler}
        />
      );
    }
  };

  render() {
    const {
      countryList,
      placeList,
      organizationList,
      jobList: jobs,
      countrySelected,
      placeSelected,
      organizationSelected,
    } = this.state;
    return (
      <>
        <div className='formContainer col'>
          <button className='btn btn-custom' onClick={() => this.showForm()}>
            New Job
          </button>
          {this.spawnForm()}
        </div>
        <ListComponent
          dataList={[countryList, placeList, organizationList]}
          itemList={jobs}
          selected={[
            countrySelected.id,
            placeSelected.id,
            organizationSelected.id,
          ]}
          listTitle={'jobs'}
          onChangeFunction={this.selectHandler}
          selectTitle={['Countrie', 'Place', 'Organization']}
          attribute={['countrie', 'place', 'organization']}
          removeFunction={this.removeJob}
        />
      </>
    );
  }
}
