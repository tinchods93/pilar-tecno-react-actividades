import { capitalize, normalize, normalizeObj } from './StringUtilities';
import { CountryModel } from '../models/Models';

const storageName = 'Data';

const SaveToStorage = (data) => {
  localStorage.setItem(storageName, JSON.stringify(data));
};

const GetAllData = () => {
  return JSON.parse(localStorage.getItem(storageName));
};

//Countries
export const SaveCountry = (countryToSave) => {
  try {
    //Esta funcion de Save es la unica diferente, dado que sin ella no pueden existir los demas datos

    //primero normalizamos el string recibido
    countryToSave = normalizeObj(countryToSave);

    //Primero obtenemos los nombres de los paises
    let countriesSaved = GetCountriesNames();

    //luego revisamos si el nombre ya existe, si es asi, no lo guardamos
    if (
      countriesSaved.includes(countryToSave.name) ||
      countryToSave.name === ('' || ' ')
    ) {
      alert(`The Country ${capitalize(countryToSave.name)} already exists`);
    } else {
      const countryName = countryToSave.name;
      //si no existe, revisamos si es que la base de datos (en la localstorage) existe, si no existe => la creamos
      if (Object.is(localStorage.getItem(storageName), null)) {
        //si no existe, creamos un objeto vacio
        const countryBody = {};
        //y armamos la base de nuestra localstorage
        countryBody[countryName] = { cities: {} };
        SaveToStorage({ ...countryBody });
      } else {
        //si ya existe, obteneoms una referencia a los datos
        let countries = JSON.parse(localStorage.getItem(storageName));
        //agregamos lo nuevo
        countries[countryName] = { cities: {} };
        //y lo guardamos
        SaveToStorage(countries);
      }
      alert(
        `The Country ${capitalize(countryName)} has been saved successfully`
      );
    }
  } catch (error) {}
};

export const GetCountriesNames = () => {
  let countries = JSON.parse(localStorage.getItem(storageName));

  if (Object.is(countries, null)) {
    return [-1];
  } else {
    //la primer Key son los paises
    countries = Object.keys(countries);
    return countries;
  }
};

export const GetCountryByName = (name) => {
  let countries = JSON.parse(localStorage.getItem(storageName));

  if (Object.is(countries, null)) {
    return ['No country, city and company loaded'];
  } else {
    //la primer Key son los paises
    return countries[name];
  }
};

export const GetCountriesObj = (searchCountry) => {
  const country = GetCountryByName(searchCountry);
  const country_name = Object.keys(country);

  const new_country = CountryModel;
  new_country.name = country_name;
  new_country.cities = country.cities;
  // console.log(new_country);
  return new_country;
};

export const RemoveCountry = (countryToRemove) => {
  countryToRemove = normalize(countryToRemove);
  let data = GetAllData();
  let countriesNames = GetCountriesNames();
  let newCountries = {};
  try {
    countriesNames.forEach((country) => {
      if (country !== countryToRemove) {
        newCountries[country] = data[country];
      }
    });
    // console.log(newCountries);
    data = newCountries;
    SaveToStorage(data);
    if (Object.keys(data).length <= 0) {
      localStorage.removeItem(storageName);
    }
  } catch (error) {}
};

//Cities
export const SaveCity = (cityToSave) => {
  try {
    let data = GetAllData();
    cityToSave = normalizeObj(cityToSave);
    const cities = GetCities(cityToSave.country);
    if (
      GetCitiesNames(cityToSave.country).includes(cityToSave.name) ||
      cityToSave.name === ('' || ' ')
    ) {
      alert(`The city ${capitalize(cityToSave.name)} already exists`);
    } else {
      cities[cityToSave.name] = cityToSave;
      data[cityToSave.country].cities = cities;
      console.log(data);
      SaveToStorage(data);
    }
  } catch (error) {}
};

//Claramente, devuelve solo los nombres de las cities
export const GetCitiesNames = (country) => {
  let data = GetAllData();
  if (country === (undefined || -1)) {
    return ['No country, city and company loaded/found'];
  }
  return Object.keys(data[country].cities);
};
//Esto devuelve el objeto Cities adentro de un country especifico
const GetCities = (country) => {
  let data = GetAllData();
  return data[country].cities;
};

export const RemoveCity = (country, cityName) => {
  cityName = normalize(cityName);
  let data = GetAllData();
  let citiesNames = GetCitiesNames(country);
  let newCities = {};
  try {
    citiesNames.forEach((city) => {
      if (city !== cityName) {
        newCities[city] = data[country].cities[city];
        console.log(data[country].cities[city]);
      }
    });
    data[country].cities = newCities;
    SaveToStorage(data);
  } catch (error) {}
  // console.log(data);
};

//Companies
export const SaveCompany = (companyToSave) => {
  try {
    let data = GetAllData();
    companyToSave = normalizeObj(companyToSave);
    const companies = GetCompanies(companyToSave.country, companyToSave.city);
    if (
      GetCompaniesNames(companyToSave.country, companyToSave.city).includes(
        companyToSave.name
      ) ||
      companyToSave.name === ('' || ' ')
    ) {
      alert(`The company ${capitalize(companyToSave.name)} already exists`);
    } else {
      companies[companyToSave.name] = companyToSave;
      data[companyToSave.country].cities[
        companyToSave.city
      ].companies = companies;
      console.log(data);
      SaveToStorage(data);
    }
  } catch (error) {}
};

export const RemoveCompany = (country, city, companyToRemove) => {
  city = normalize(city);
  companyToRemove = normalize(companyToRemove);
  let data = GetAllData();
  let companiesNames = GetCompaniesNames(country, city);
  let newCompanies = {};

  try {
    companiesNames.forEach((companyName) => {
      if (companyName !== companyToRemove) {
        newCompanies[companyName] =
          data[country].cities[city].companies[companyName];
        // console.log(data[country].cities[companyName]);
      }
    });
    data[country].cities[city].companies = newCompanies;

    SaveToStorage(data);
  } catch (error) {}
};

//Claramente, devuelve solo los nombres de las cities
export const GetCompaniesNames = (country, city) => {
  try {
    let data = GetAllData();
    if (country === (undefined || -1)) {
      return ['No country, city and company loaded/found'];
    }
    if (city === (undefined || -1)) {
      return ['No city and company loaded/found'];
    }
    return Object.keys(data[country].cities[city].companies);
  } catch (error) {
    return ['Empty'];
  }
};
//Esto devuelve el objeto Cities adentro de un country especifico
const GetCompanies = (country, city) => {
  let data = GetAllData();
  return data[country].cities[city].companies;
};

export const SaveJob = (jobToSave) => {
  try {
    let data = GetAllData();
    jobToSave = normalizeObj(jobToSave);
    const jobs = GetJobs(jobToSave.country, jobToSave.city, jobToSave.company);
    if (
      GetJobsNames(
        jobToSave.country,
        jobToSave.city,
        jobToSave.company
      ).includes(jobToSave.name) ||
      jobToSave === ('' || ' ')
    ) {
      alert(`The job ${capitalize(jobToSave.name)} already exists`);
    } else {
      jobs[jobToSave.name] = jobToSave;
      data[jobToSave.country].cities[jobToSave.city].companies[
        jobToSave.company
      ].jobs = jobs;
      console.log(data);
      SaveToStorage(data);
    }
  } catch (error) {}
};

export const RemoveJob = (country, city, company, jobToRemove) => {
  country = normalize(country);
  city = normalize(city);
  company = normalize(company);
  jobToRemove = normalize(jobToRemove);

  let data = GetAllData();
  let jobNames = GetJobsNames(country, city, company);
  let newJobs = {};

  try {
    jobNames.forEach((jobName) => {
      if (jobName !== jobToRemove) {
        newJobs[jobName] =
          data[country].cities[city].companies[company].jobs[jobName];
      }
    });
    data[country].cities[city].companies[company].jobs = newJobs;

    SaveToStorage(data);
  } catch (error) {}
};

export const GetJobsNames = (country, city, company) => {
  try {
    let data = GetAllData();

    if (country === (undefined || -1)) {
      return ['No country, city and company loaded'];
    }
    if (city === (undefined || -1)) return ['No city and company loaded'];
    if (company === (undefined || -1)) return ['No company loaded'];

    return Object.keys(data[country].cities[city].companies[company].jobs);
  } catch (error) {
    return ['Empty'];
  }
};

const GetJobs = (country, city, company) => {
  let data = GetAllData();
  return data[country].cities[city].companies[company].jobs;
};

export const DataBaseFunctions = {
  SaveCity: SaveCity,
  SaveCompany: SaveCompany,
  SaveCountry: SaveCountry,
  SaveJob: SaveJob,
  GetCountriesNames: GetCountriesNames,
  GetCitiesNames: GetCitiesNames,
  GetCompaniesNames: GetCompaniesNames,
  GetJobsNames: GetJobsNames,
  RemoveJob: RemoveJob,
  RemoveCity: RemoveCity,
  RemoveCompany: RemoveCompany,
  RemoveCountry: RemoveCountry,
};
