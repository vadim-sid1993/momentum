console.log('1. Часы и календарь +15\n2. Приветствие +10\n3. Смена фонового изображения +20\n4. Виджет погоды +15\n5. Виджет цитата дня +10\n6. Аудиоплеер +15');

const time = document.querySelector('.time');
const date2 = document.querySelector('.date');
const greeting = document.querySelector('.greeting');
const name = document.querySelector('.name');
const body = document.querySelector('body');
const slideNext = document.querySelector('.slide-next');
const slidePrev = document.querySelector('.slide-prev');
let x = '';
let rand;
// погода
const weatherIcon = document.querySelector('.weather-icon');
const weatherError = document.querySelector('.weather-error');
const temperature = document.querySelector('.temperature');
const weatherDescription = document.querySelector('.weather-description');
const city = document.querySelector('.city');
const wind = document.querySelector('.wind');
const humidity = document.querySelector('.humidity');
// цитаты
const changeQuote = document.querySelector('.change-quote');
const quote = document.querySelector('.quote');
const author = document.querySelector('.author');
// плеер
const prevBtn = document.querySelector('.play-prev');
const audioBtn = document.querySelector('.play');
const nextBtn = document.querySelector('.play-next');
const playListContainer = document.querySelector('.play-list');
let isPlay = false;
let playNum = 0;
import playList from './playList.js';

// ВРЕМЯ

function showTime() {
    const date = new Date();
    const currentTime = date.toLocaleTimeString();
    time.textContent = `${currentTime}`;
    showDate();
    getTimeOfDay();
    setTimeout(showTime, 1000);
  }
  showTime();
  getRandomNum();

//   ДАТА

function showDate() {
    const date = new Date();
    const options = {month: 'long', day: 'numeric'};
    const currentDate = date.toLocaleDateString('ru-RU', options);
    const day = date.getDay();
    const arrDay = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
    let day2 = arrDay[day];
    let content = day2 + ', ' + currentDate;
    date2.textContent = `${content}`;
};

// ПРИВЕТСТВИЕ

function getTimeOfDay() {
    const date = new Date();
    const hours = date.getHours();
    if (hours >= 0 && hours < 6) {
        x = 'night';
    } else if (hours >= 6 && hours < 12) {
        x = 'morning';
    } else if (hours >= 12 && hours < 18) {
        x = 'afternoon';
    } else {
        x = 'evening';
    }
   
};

greeting.textContent = `Good ${x}`;

function setLocalStorage() {
    localStorage.setItem('name', name.value);
  };


window.addEventListener('beforeunload', setLocalStorage)

function getLocalStorage() {
    if(localStorage.getItem('name')) {
      name.value = localStorage.getItem('name');
    }
  };


window.addEventListener('load', getLocalStorage)

// СЛАЙДЕР

function getRandomNum() {
    rand = Math.floor(1 + Math.random() * 20);
    return rand;
};

function setBg() {  
    let bgNum = rand;
    if (bgNum.toString(10).length === 1) {
        bgNum = '0' + rand;
    };
    const img = new Image();
    img.src = `https://github.com/vadim-sid1993/stage1-tasks/blob/assets/images/${x}/${bgNum}.jpg?raw=true`;
    img.onload = () => {      
      body.style.backgroundImage = `url(${img.src})`;
    }
  }

setBg();

function getSlideNext() {
    if (rand === 20) {
        rand = 1;
    } else {
        rand += 1;
    }
    setBg();
}
function getSlidePrev() {
    if (rand === 1) {
        rand = 20;
    } else {
        rand -=1;
    }
    setBg();
}
slideNext.addEventListener('click', getSlideNext);
slidePrev.addEventListener('click', getSlidePrev);

// ПОГОДА

async function getWeather() {  
  // В ссылке ниже нужно вместо 1f43443301fcb6e1ff57b7f71882a725 вставить свой API key. И удали этот комментарий))))))
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&lang=en&appid=1f43443301fcb6e1ff57b7f71882a725&units=metric`;
    const res = await fetch(url);
    const data = await res.json(); 
    if (res.status === 200) {
      weatherIcon.classList.add(`owf-${data.weather[0].id}`);
      temperature.textContent = `${Math.round(data.main.temp)}°C`;
      weatherDescription.textContent = data.weather[0].description;
      wind.textContent = `Wind speed: ${Math.round(data.wind.speed)} m/s`;
      humidity.textContent = `Humidity: ${data.main.humidity}%`;
    } else if (res.status === 404) {
      weatherError.textContent = `Error! city not found for "${city.value}"`;
      temperature.textContent = '';
      weatherDescription.textContent = '';
      wind.textContent = '';
      humidity.textContent = '';
    } else if (res.status === 400) {
      weatherError.textContent = `Error! Nothing to geocode!`;
      temperature.textContent = '';
      weatherDescription.textContent = '';
      wind.textContent = '';
      humidity.textContent = '';
     }
}
getWeather();

city.addEventListener('change', getWeather);

function setLocalStorage1() {
    localStorage.setItem('city', city.value);
  };
window.addEventListener('beforeunload', setLocalStorage1);

function getLocalStorage1() {
    if(localStorage.getItem('city')) {
      city.value = localStorage.getItem('city');
      getWeather();
    }
  };
window.addEventListener('load', getLocalStorage1);

// ЦИТАТА ДНЯ

async function getQuotes() {
  const quotes = 'assets/quotes/data.json';
  const res = await fetch(quotes);
  const data = await res.json();
  let random = Math.floor(1 + Math.random() * 20);
  let randomQuoteNum = data[random];
  quote.textContent = randomQuoteNum.text;
  author.textContent = randomQuoteNum.author;
};
changeQuote.addEventListener('click', getQuotes);
getQuotes();

// ПЛЕЕР
const audio = new Audio();

playList.forEach(el => {
  const li = document.createElement('li');
  li.classList.add('play-item');
  li.textContent = el.title;
  playListContainer.append(li);
});

function playAudio() {
  if (!isPlay) {
    audio.src = playList[playNum].src;
    audio.currentTime = 0;
    audio.play();
    isPlay = true;
    toggleBtn()
  } else {
    audio.pause();
    isPlay = false;
    toggleBtn()
  }
  makeActiveAudio();
};

function toggleBtn() {
  // audioBtn.classList.toggle('pause');
  if (!isPlay) {
    audioBtn.classList.remove('pause');
} else {
    audioBtn.classList.add('pause');
};
};

function playNext() {
  if (playNum === 3) {
    playNum = 0;
  } else {
    playNum += 1;
  };
  isPlay = false;
  playAudio();
};

function playPrev() {
  if (playNum === 0) {
    playNum = 3;
  } else {
    playNum -= 1;
  };
  isPlay = false;
  playAudio();
};

function makeActiveAudio() {
  const playListItems = document.querySelectorAll('.play-item');
  playListItems.forEach(item => item.classList.remove('item-active'));
  playListItems[playNum].classList.add('item-active');
}

audioBtn.addEventListener('click', playAudio);
nextBtn.addEventListener('click', playNext);
prevBtn.addEventListener('click', playPrev);
audio.addEventListener('ended', playNext);


