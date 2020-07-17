'use strict';
import nameTemplate from './templates.hbs';
import countryTemplate from './countryTemplate.hbs';
import { alert } from '@pnotify/core';


const debounce = require('lodash/debounce');
const refs = {
  countriesFound: document.querySelector('.countriesFound'),
  nameCountries: document.querySelector('.nameCountries'),
};

function getInput(event) {
  const nameCountry = event.target.value;
  refs.countriesFound.innerHTML = '';
  fetch(`https://restcountries.eu/rest/v2/name/${nameCountry}`)
    .then(response => {
      return response.json();
    })
    .then(array => {
      if (array.length === 1) {
        const oneCountry = array.map(items => countryTemplate(items)).join('');
        refs.countriesFound.innerHTML = oneCountry;
        return;
      }
      if (array.length > 1 && array.length <= 15) {
        const listCountries = array.map(name => nameTemplate(name)).join('');
        refs.countriesFound.innerHTML = listCountries;
        return;
      }
      if (array.length > 15) {
        alert({
          title: 'Дуже багато країн',
          text: 'Дуже багато країн. Спробуй ще раз...',

          delay: 2000,
        });
      }
    })
    .catch(error => {
      alert({
        title: 'Error',
        text: 'Мабудь щось пішло не так. Спробуй ще раз...',
        delay: 2000,
      });
      return;
    });
}
refs.nameCountries.addEventListener('input', debounce(getInput, 500));
