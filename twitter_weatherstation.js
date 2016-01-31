/*
* Setup
*/
var interval_time = 30 * (60*1000); // measuring and tweet interval time 30 miniutes
var melevation = 15; // elevation of your Weather Station 15m

// global arrys
var temperature_arry =[];
var pressure_arry = [];
// push dummy data
for(n = 0; n < 60; n++){
  temperature_arry.push(-20);   //tempreture_min 
  pressure_arry.push(920);      //puresshure_min
}

var twitter = require('twitter');
var client = new twitter(require('./config.js'));


// global variable
var mdate;

/*
* include modules
*/
require('date-utils');
//var raspi = require ("raspi-io");   //if use Raspberry-Pi then uncommentout this line  


//2.  create instance johnny-five Arduino board.
var five = require("johnny-five");
var board = new five.Board({
//  io: new raspi()                 //if use Raspberry-Pi then uncommentout this line
});

board.on("ready", function() {
  // measuring start here
    var multi = new five.Multi({
        controller: "MPL3115A2",elevation: melevation,
    });
    get_data();
    setInterval(function(){
        get_data();
    },interval_time);
    
    // measuring and emit data
    function get_data(){
        mdate = new Date().toFormat('YYYY,MM,DD,HH24,MI');
        console.log(mdate);
        multi.once("change", function(data) {
            var temperature = Math.round(data.temperature.celsius*10) / 10;
            var pressure =  Math.round(data.barometer.pressure*100) / 10;
            
            // display
            console.log("Temperature:", temperature,'°C')
            console.log("  pressure :", pressure,'hPa');
            console.log("--------------------------------------");
            
            // emit data to server
            client.post('statuses/update', {status: temperature+' °C  /  '+pressure+' hPa'},  function(error, tweet, response){
                 if(error) throw error;
            });          
            // logging  
            temperature_arry.shift();
            temperature_arry.push(temperature);
            pressure_arry.shift();
            pressure_arry.push(pressure);            
        });
    }
 
 
   /*
  * REPL
  * You can specify command to use from node REPL. Nice for debugging.
  */
  this.repl.inject({

  });
});
