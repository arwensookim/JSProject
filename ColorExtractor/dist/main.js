// const { apply } = require("core-js/fn/reflect");

const colorPicker = document.querySelector('.selected');

colorPicker.addEventListener('click', function() {
  const reqOBj = {
    method: 'GET',
    headers: {
      'Content-type': 'application/json',
    },
    'mode': 'no-cors'
  };

  const url = 'https://www.thecolorapi.com/scheme?hex=0047AB';

  fetch(url)
    .then(function(res) {
      return res.json();
    })
    .then(function(data) {
      console.log(data)
    })
    // .then(function(jsonRes) {
    //   console.log('get response :: ', jsonRes);
    // })
    // .catch(function(error) {
    //   console.log(error);
    // });
  });

  // document.addEventListener('DOMContentLoaded', function() {
  //   let trigger = new ScrollTrigger();
  // });