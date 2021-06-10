/* eslint-disable eqeqeq */
import { capitalize } from './StringUtilities';
import axios from 'axios';

//GET FUNcTIONS
export const GetCountries = async () => {
  const countriesDB = await axios
    .get('https://api-fake-pilar-tecno.herokuapp.com/countries')
    .then(async (response) => {
      return response.data;
    })
    .catch((err) => console.error(err));

  return countriesDB;
};

export const GetCountryById = async (countryId) => {
  const country = await axios
    .get(`https://api-fake-pilar-tecno.herokuapp.com/countries/${countryId}`)
    .then(async (response) => {
      return response.data;
    })
    .catch((err) => console.error(err));
  return country;
};

export const GetPlaces = async (countryId) => {
  const placesDB = await axios
    .get('https://api-fake-pilar-tecno.herokuapp.com/places?_expand=countrie')
    .then(async (response) => {
      return response.data;
    })
    .catch((err) => console.error(err));
  const placesByCountry = placesDB.filter(
    (place) => place.countrieId == countryId
  );

  if (placesByCountry.length <= 0) {
    placesByCountry.push('No places to load');
  }
  console.log(placesByCountry);
  return placesByCountry;
};

export const GetPlaceById = async (placeId) => {
  const place = await axios
    .get(
      `https://api-fake-pilar-tecno.herokuapp.com/places/${placeId}?_expand=countrie`
    )
    .then(async (response) => {
      return response.data;
    })
    .catch((err) => console.error(err));
  return place;
};

export const GetOrganizations = async (placeId) => {
  const organizationsDB = await axios
    .get('https://api-fake-pilar-tecno.herokuapp.com/organizations')
    .then(async (resp) => {
      return await resp.data;
    })
    .catch((err) => console.log(err));

  const organizationsByPlace = organizationsDB.filter(
    (organization) => organization.placeId == placeId
  );

  if (organizationsByPlace.length <= 0) {
    organizationsByPlace.push('No places to load');
  }

  return organizationsByPlace;
};

export const GetOrganizationsById = async (organizationId) => {
  const organization = await axios
    .get(
      `https://api-fake-pilar-tecno.herokuapp.com/organizations/${organizationId}`
    )
    .then(async (response) => {
      return response.data;
    })
    .catch((err) => console.error(err));
  return organization;
};

export const GetJobs = async (organizationId) => {
  try {
    const jobsDB = await axios
      .get('https://api-fake-pilar-tecno.herokuapp.com/jobs')
      .then(async (resp) => {
        return await resp.data;
      })
      .catch((err) => console.log(err));

    const jobsByOrganization = jobsDB.filter(
      (job) => job.organizationId == organizationId
    );

    if (jobsByOrganization.length <= 0) {
      jobsByOrganization.push('No places to load');
    }
    return jobsByOrganization;
  } catch (error) {
    return ['Empty'];
  }
};

const GetJobById = async (jobId) => {
  const job = await axios
    .get(`https://api-fake-pilar-tecno.herokuapp.com/jobs/${jobId}`)
    .then(async (response) => {
      return response.data;
    })
    .catch((err) => console.error(err));
  return job;
};
//SAVE FUNCTIONS
export const SaveCountry = async (obj) => {
  let canSave = true;
  try {
    let keys = Object.keys(obj);
    for (let index = 0; index < keys.length; index++) {
      if (obj[keys[index]] === (undefined || '')) {
        canSave = false;
        break;
      }
    }
    if (canSave) {
      const countriesDB = await GetCountries();

      //Generamos una variable que verifique la existencia del pais que queremos guardar
      const findCountry = countriesDB.find(
        (country) => country.name === obj.name
      );

      if (findCountry !== undefined) {
        alert(`The Country ${capitalize(obj.name)} already exists`);
      } else {
        //Si no existe lo guardamos
        const headers = {
          'Content-Type': 'application/json',
        };

        await axios
          .post('https://api-fake-pilar-tecno.herokuapp.com/countries', obj, {
            headers: headers,
          })
          .then((response) => console.log(response))
          .catch((err) => console.error(err));
        alert(
          `The Country ${capitalize(obj.name)} has been saved successfully`
        );
        const data = await GetCountries();
        return data;
      }
    } else {
      alert('All fields must be completed');
    }
  } catch (error) {
    console.log(error);
  }
};

export const SavePlace = async (obj) => {
  console.log('SAVEEE');
  let canSave = true;
  try {
    console.log(obj);
    let keys = Object.keys(obj);
    for (let index = 0; index < keys.length; index++) {
      if (obj[keys[index]] === (undefined || '')) {
        canSave = false;
        break;
      }
    }

    if (canSave) {
      const places = await GetPlaces(obj.countrieId);

      const findPlace = places.find((place) => place.name === obj.name);

      if (findPlace !== undefined) {
        alert(`The Place ${capitalize(obj.name)} already exists`);
      } else {
        const placeToSave = {
          name: obj.name,
          countrieId: obj.countrieId,
        };

        const headers = {
          'Content-Type': 'application/json',
        };
        console.log(placeToSave);
        await axios
          .post(
            'https://api-fake-pilar-tecno.herokuapp.com/places',
            placeToSave,
            { headers: headers }
          )
          .then((response) => console.log(response))
          .catch((err) => console.error(err));
        alert(
          `The Place ${capitalize(
            placeToSave.name
          )} has been saved successfully`
        );

        const data = await GetPlaces(placeToSave.countrieId);
        return data;
      }
    }
  } catch (error) {
    console.log(error);
  }
};

export const SaveOrganization = async (obj) => {
  let canSave = true;
  try {
    let keys = Object.keys(obj);
    for (let index = 0; index < keys.length; index++) {
      if (obj[keys[index]] === (undefined || '')) {
        canSave = false;
        break;
      }
    }

    if (canSave) {
      let organizations = await GetOrganizations(obj.placeId);

      organizations = organizations.filter(
        (organization) => organization.placeId == obj.placeId
      );

      const findPlace = organizations.find(
        (organization) => organization.name === obj.name
      );

      if (findPlace !== undefined) {
        alert(`The Organization ${capitalize(obj.name)} already exists`);
      } else {
        const organizationToSave = {
          name: obj.name,
          placeId: obj.placeId,
        };

        const headers = {
          'Content-Type': 'application/json',
        };
        await axios
          .post(
            'https://api-fake-pilar-tecno.herokuapp.com/organizations',
            organizationToSave,
            { headers: headers }
          )
          .then((response) => console.log(response))
          .catch((err) => console.error(err));
        alert(
          `The Organization ${capitalize(
            organizationToSave.name
          )} has been saved successfully`
        );
        const data = await GetOrganizations(organizationToSave.placeId);
        return data;
      }
    } else {
      alert('All fields must be completed');
    }
  } catch (error) {
    console.log(error);
  }
};

export const SaveJob = async (obj) => {
  console.log(obj);
  let canSave = true;
  try {
    let keys = Object.keys(obj);
    for (let index = 0; index < keys.length; index++) {
      if (obj[keys[index]] === undefined) {
        canSave = false;
        break;
      }
    }

    if (canSave) {
      let jobs = await GetJobs(obj.organizationId);
      jobs = jobs.filter((job) => job.organizationId == obj.organizationId);

      const findJob = jobs.find((job) => job.position === obj.position);

      if (findJob !== undefined) {
        alert(`The Organization ${capitalize(obj.position)} already exists`);
      } else {
        const jobToSave = {
          position: obj.position,
          description: obj.description,
          organizationId: obj.organizationId,
        };

        const headers = {
          'Content-Type': 'application/json',
        };
        console.log(jobToSave);
        await axios
          .post('https://api-fake-pilar-tecno.herokuapp.com/jobs', jobToSave, {
            headers: headers,
          })
          .then((response) => console.log(response))
          .catch((err) => console.error(err));
        alert(
          `The Position ${capitalize(
            jobToSave.position
          )} has been saved successfully`
        );
        const data = await GetJobs(jobToSave.organizationId);
        return data;
      }
    } else {
      alert('All fields must be completed');
    }
  } catch (error) {
    console.log(error);
  }
};

//REMOVE FUNCTIONS
export const RemoveCountry = async (countryId) => {
  try {
    await axios
      .delete(
        `https://api-fake-pilar-tecno.herokuapp.com/countries/${countryId}`
      )
      .then(async (resp) => console.log(await resp.data))
      .catch((err) => {
        console.log(err);
      });
    const data = await GetCountries();
    return data;
  } catch (error) {}
};

export const RemovePlace = async (placeId) => {
  try {
    const place = await GetPlaceById(placeId);
    await axios
      .delete(`https://api-fake-pilar-tecno.herokuapp.com/places/${placeId}`)
      .then(async (resp) => console.log(await resp.data))
      .catch((err) => {
        console.log(err);
      });
    const data = await GetPlaces(place.countrieId);
    return data;
  } catch (error) {}
};

export const RemoveOrganization = async (organizationId) => {
  try {
    const organization = await GetOrganizationsById(organizationId);
    await axios
      .delete(
        `https://api-fake-pilar-tecno.herokuapp.com/organizations/${organizationId}`
      )
      .then(async (resp) => console.log(await resp.data))
      .catch((err) => {
        console.log(err);
      });

    const data = await GetOrganizations(organization.placeId);

    return data;
  } catch (error) {}
};

export const RemoveJob = async (jobId) => {
  try {
    const job = await GetJobById(jobId);
    await axios
      .delete(`https://api-fake-pilar-tecno.herokuapp.com/jobs/${jobId}`)
      .then(async (resp) => console.log(await resp.data))
      .catch((err) => {
        console.log(err);
      });
    const data = await GetJobs(job.organizationId);
    return data;
  } catch (error) {}
};

export const DataBaseFunctions = {
  SavePlace: SavePlace,
  SaveOrganization: SaveOrganization,
  SaveCountry: SaveCountry,
  SaveJob: SaveJob,
  GetCountries: GetCountries,
  GetCountryById: GetCountryById,
  GetPlaces: GetPlaces,
  GetPlaceById: GetPlaceById,
  GetOrganizations: GetOrganizations,
  GetOrganizationsById: GetOrganizationsById,
  GetJobs: GetJobs,
  RemoveJob: RemoveJob,
  RemovePlace: RemovePlace,
  RemoveOrganization: RemoveOrganization,
  RemoveCountry: RemoveCountry,
};
