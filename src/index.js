import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const refEl = {
  searchInput: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refEl.searchInput.addEventListener('input', debounce(onCountriesFetch, DEBOUNCE_DELAY));

function onCountriesFetch(evt) {
  const inputText = evt.target.value.trim();
  //   console.log(inputText);
  if (inputText.length === 0) {
    refEl.countryList.innerHTML = '';
    return;
  } else {
    fetchCountries(inputText)
      .then(addCountry)
      .catch(() => {
        refEl.countryList.innerHTML = '';
        Notiflix.Notify.failure('Oops, there is no country with that name');
      });
  }
}

function addCountry(countries) {
  //   console.log(countries);
  if (countries.length > 10) {
    refEl.countryList.innerHTML = '';
    return Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
  }
  if (countries.length === 1) {
    addCartCountry(countries);
  } else {
    addListCountries(countries);
  }
}

function addCartCountry(countries) {
  countries.map(({ name, capital, population, flags, languages }) => {
    const markup = `<h1><img src="${flags.svg}" alt="Flag of ${
      name.official
    }" class="infoCartImage"> ${name.official}</h1>
        <ul>
        <li>Capital: ${capital}</li>
        <li>Population: ${population}</li>
        <li>Languages: ${Object.values(languages)}</li>
        </ul>`;
    refEl.countryInfo.innerHTML = markup;
    refEl.countryList.innerHTML = '';
  });
}

function addListCountries(countries) {
  const markupTwoPlus = countries
    .map(({ name, flags }) => {
      return `<li class="countryListItem"><img src="${flags.svg}" alt="Flag of ${name.official}" class="countryListImage"> ${name.official}</li>`;
    })
    .join('');
  refEl.countryInfo.innerHTML = '';
  refEl.countryList.innerHTML = markupTwoPlus;
}
