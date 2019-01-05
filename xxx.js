var presses = 0;
var data = {l:0};

var DoTheDo = (function()
{
  data.l = Math.round(Puck.light()*1000)/1000;
  NRF.setAdvertising({},{
  showName: false,
  discoverable: true,
  connectable: true,
  interval: 500,
  manufacturer: 0x0590, manufacturerData:JSON.stringify(data)});
})();




setWatch(function() {
  presses++;
  DoTheDo();
}, BTN, {edge:"rising", repeat:1, debounce:25});
