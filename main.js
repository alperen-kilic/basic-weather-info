window.addEventListener('load', ()=> {
   let long;
   let lat;
   //Get your API key from https://darksky.net/dev
   const apiKey = "YOUR API KEY";
   let date = new Date(0);
   let description = document.querySelector('.temperature-description');
   let degree = document.querySelector('.temperature-degree');
   let timezone = document.querySelector('.location-timezone');
   let tempSection = document.querySelector('.degree-section');
   let datetime = document.querySelector('.location-datetime');
   const tempSpan = document.querySelector('.temperature span');

   if(navigator.geolocation){
       navigator.geolocation.getCurrentPosition(position => {
          long = position.coords.longitude;
          lat = position.coords.latitude;

          const proxy = 'https://cors-anywhere.herokuapp.com/';
          const api = `${proxy}https://api.darksky.net/forecast/${apiKey}/${lat},${long}`;

          fetch(api).then(response=> {
              return response.json();
          }).then(data => {
                   console.log(data);
                   const {temperature, summary, icon, time} = data.currently;
                   degree.textContent = temperature;
                   description.textContent = summary;
                   timezone.textContent = data.timezone;
                   date.setUTCSeconds(time);
                   date = date.toLocaleTimeString();
                   date = date.replace(/:\d+ /, ' ');
                   datetime.textContent = date;
                   let celsius = Math.floor((temperature - 32) * (5 / 9));
                   setIcons(icon, document.querySelector('.icon'));
                   tempSection.addEventListener('click', () => {
                       $('.degree-section').animate({'opacity': 0}, 1000, function () {
                           if(tempSpan.textContent === "°F") {
                               tempSpan.textContent = "°C";
                               degree.textContent = celsius;
                           } else {
                               tempSpan.textContent = "°F";
                               degree.textContent = temperature;
                           }
                       }).animate({'opacity': 1}, 1000);

                   })
          });
       }, function(error) {
           if (error.code == error.PERMISSION_DENIED)
               tempSpan.textContent = "Please give permission to use your location";
       });

   }

   else{
       timezone.textContent = "Please allow to use your location.";
   }

   function setIcons(icon, iconID){
       const skycons = new Skycons({color: "white"});
       const currentIcon = icon.replace(/-/g, "_").toUpperCase();
       skycons.play();
       return skycons.set(iconID, Skycons[currentIcon]);
   }
});