const ColorAPIUtil = {
  newColorCodeAJAX: function() {
    return $.ajax({
      method: 'GET',
      url: 'http://thecolorapi.com/id?hex=0047AB&rgb=0,71,171&hsl=215,100%,34%&cmyk=100,58,0,33&format=html'
    });
  }
}

export default ColorAPIUtil;