// JavaScript source code


// Globals
var IsSleeping = false;
var interval;

NRF.setTxPower(-16);

function SetAdvertising() {
   // {0x2A19:[E.getBattery()]},{0x2a04:[String(Puck.light())]}
    NRF.setAdvertising({},
                       {interval: 5000, showName:false, manufacturer: 0x0590, manufacturerData:[E.getBattery(),Math.round(Puck.light()*100)]});
}
//[E.getBattery(),Math.round(Puck.light()*100)/100] 
// manufacturer: 0x0590
//["a","bbb","ccc"]                       

setWatch(function (e) {
    if (IsSleeping) {
        LED2.write(true); // Green = wake
      //NRF.wake();
        setTimeout(function () {
            //DoTheDo();
            LED2.write(false);
          IsSleeping = false;
        }, 200);
    }
    else {
        LED1.write(true); // Red = sleep
        //clearInterval(interval);
        setTimeout(function () {
            //NRF.setAdvertising({});
            //NRF.sleep();
            LED1.write(false);
          IsSleeping = true;
        }, 200);
    }
}, BTN, { edge: "rising", repeat: true, debounce: 50 });


(function DoTheDo() {
  interval = setInterval(function () {
      SetAdvertising();
  }, 10000);
})();
