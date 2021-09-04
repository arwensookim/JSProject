const colorPicker = document.querySelector('.selected');

colorPicker.addEventListener('click', function() {
  const reqOBj = {
    method: 'GET',
    headers: {
      'Content-type': 'application/json',
    },
    'mode': 'no-cors'
  };

  // const url = 'https://www.thecolorapi.com/id?format=html&hex=7DB355'
  // const url = 'www.thecolorapi.com/id?format=html&hex=7DB355'
  const url = 'https://www.thecolorapi.com/id?format=html&hex=281BAD';
  // const url = 'http://thecolorapi.com/scheme?hex=0047AB&rgb=0,71,171&hsl=215,100%,34%&cmyk=100,58,0,33&format=html&mode=analogic&count=6'
  fetch(url)
    .then(function(res) {
      // return console.log(res);
      return res.json();
    })
    .then(function(data) {
      console.log(data)
    })
    // .then(function(jsonRes) {
      // console.log('get response :: ', jsonRes);
    // })
    // .catch(function(error) {
      // console.log(error);
    // });
  });

// const pickedColor = document.querySelector('.selected');