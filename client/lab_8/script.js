function getRandomIntInclusive(min,max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() *(max - min +1)+1);
  }
  
  function injectHTML(list){
    console.log("fired injectHTML");
    const target = document.querySelector("restaurant_list");
    target.innerHTML = "";
    list.forEach((item) => {
      const str = "<li>${item.name}</li>"
      target.innerHTML += str
    });
  
  }
  
  
  function processRestaurantsList(list) {
    console.log('fired restaurants list');
    const range =[...Array(15).keys()];
    return newArray = range.map((item) => {
      const index = getRandomIntInclusive(0, list.length - 1);
      return list[index]
    })
  
  }
  
  function filterList(list,query){
    return list.filter((item) => {
    const lowerCaseName = item.name.toLowerCase();
    const lowerCaseQuery = query.toLoqwerCase();
    return lowerCaseName.includes(lowerCaseQuery);
    })
  }

  function initMap() {
    const carto = L.map('map').setView([38.98, -76.93], 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(carto);
    return carto;
  
  }
  
  function markerPlace(array, map) {
  
    console.log('array for markers', array)
  
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        layer.remove();
      }
    });
    
  
    array.forEach((item) => {
      console.log('markerPlace', item);
      const { coordinates } = item.geocoded_column_1
      L.marker([coordinates[1], coordinates[0]]).addTo(map);
  
    })
  
  }
  
  async function mainEvent() {
    const form = document.querySelector('.main_form'); // get your main form so you can do JS with it
    const filterButton = document.querySelector("#filter_button");
    const loadDataButton = document.querySelector("#data_load");
    const generateListButton = document.querySelector("#generate");
    const textFeild = document.querySelector("#resto")
  
    const loadAnimation = document.querySelector("#data_load_animation");
    loadAnimation.style.display ="none";
    generateListButton.classList.add("hidden");

    const carto = initMap();

    let storedList = []; 
    let currentList = [];
    
    loadDataButton.addEventListener("click", async(submitEvent) => {
      console.log("loading data");
      loadAnimation.style.display = "inline-block";
  
      const results = await fetch("https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json");
      
      storedList = await results.json();
      if (storedList.length >0) {
        generateListButton.classList.remove("hidden");
      }
      loadAnimation.style.display = "none";
      console.table(storedList);
    });
    
    filterButton.addEventListener("click", (event) => {
      console.log("clicked FilterButton");
      const formData = new FormData(mainForm);
      const formProps = Object.fromEntries(formData);
      
      console.log(formProps);
      const newList = filterList(currentList, formProps.resto);
  
      console.log(newList);
      injectHTML(newList);
    })
   
    generateListButton.addEventListener("click", (event) => {
      console.log("generate new list");
      currentList = processRestaurantsList(storedList);
      console.log(currentList);
      injectHTML(currentList);
  
    })
  
  
    textFeild.addEventListener("input", (event) => {
      console.log("input", event.target.value);
      const newList = filerList(currentList, event.target.value);
      console.log(newList);
      injectHTML(newlist);
    
    });
  }
  
  

  document.addEventListener('DOMContentLoaded', async () => mainEvent()); // the async keyword means we can make API requests
  