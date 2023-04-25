const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#ulTodo-list");
//todoList은 리스트에 생기는 투두 들
const locationNameTag = document.querySelector("#location-name-tag");
console.log(locationNameTag);

const getSavedTodoList = JSON.parse(localStorage.getItem("saved-items"));
//locastorage.getitem이면 아직 string타입임. Object로 바꿔야됨

const createTodo = function (storagedData) {
  let typedTodoInput = todoInput.value;

  if (storagedData) {
    typedTodoInput = storagedData.contents;
  }

  const newLi = document.createElement("li");
  const newSpan = document.createElement("span");
  const newBtn = document.createElement("button");
  newBtn.addEventListener("click", () => {
    newLi.classList.toggle("complete");
    saveItemsFn();
  });

  // addEventListener는 뭔가(클릭같은거)를 하면 실행되게 하는 기능. 토글; 클릭하면 컴플리트, 한번 더 클릭하면 체크가 해제되는 기능임
  // complete는 todo-container처럼 class라고 정의는 안했지만 elements 에서 보면 Li class임. 고로 css에서 스타일 정의할때 . 으로 시작해서 정의 가능

  newLi.addEventListener("dblclick", () => {
    newLi.remove();
    saveItemsFn();
  });

  if (storagedData?.complete) {
    newLi.classList.add("complete");
  }

  newSpan.textContent = typedTodoInput;
  newLi.appendChild(newBtn);
  newLi.appendChild(newSpan);
  todoList.appendChild(newLi);
  todoInput.value = "";
  saveItemsFn();
};

const keyCodeCheck = function () {
  // 인풋박스에 넣은게 밑으로 내려가게 하기, 인풋박스에서 글자를 넣는 행위를 이 펑션과 연결함(onkeydown사용)
  if (window.event.keyCode === 13 && todoInput.value.trim() !== "") {
    createTodo();
  }
};

const deleteAll = function () {
  const liList = document.querySelectorAll("li");
  for (let i = 0; i < liList.length; i++) {
    liList[i].remove();
  }
  saveItemsFn();
};

const saveItemsFn = function () {
  //저장되어야 할것은 li리스트에 취소선 넣은것까지 넣어야함
  const saveItems = [];
  for (let i = 0; i < todoList.children.length; i++) {
    const todoObj = {
      contents: todoList.children[i].querySelector("span").textContent,
      complete: todoList.children[i].classList.contains("complete"),
      // complete 항목이 들어가있으면 (체크가 되어있으면), true가 반환되고 그렇지 않으면 false가 반환됨
    };
    saveItems.push(todoObj);
  }
  saveItems.length === 0
    ? localStorage.removeItem("saved-items")
    : localStorage.setItem("saved-items", JSON.stringify(saveItems));
};

if (getSavedTodoList) {
  for (let i = 0; i < getSavedTodoList.length; i++) {
    createTodo(getSavedTodoList[i]);
  }
}

const weatherDataActive = function ({ location, weather }) {
  const weatherMainLint = [
    "Clear",
    "Cloud",
    "Drizzle",
    "Snow",
    "Rain",
    "Thunderstorm",
  ];
  weather = weatherMainList.includes(weather) ? weather : "fog";
  console.log(weather);
  locationNameTag.textContent = location;
  document.body.style.backgroundImage = `url('./images/${weather}.jpg')`;
};

const weatherSearch = function ({ latitude, longitude }) {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=1c22dc4f3f81b51874497bdecded5702`
  )
    .then((res) => {
      return res.json();
    })
    .then((json) => {
      console.log(json.name, json.weather[0].main);
      const weatherData = {
        location: json.name,
        weather: json.weather[0].main,
      };

      weatherDataActive(weatherData);
    })
    .catch((err) => {
      console.log(err);
    });
};

const accessToGeo = function ({ coords }) {
  const { latitude, longitude } = coords;
  const positionObj = {
    latitude,
    longitude,
  };
  //GetCurrentPosition은 메쏘드라는 콜벡함수에서, Position을 매개변수로 뭔가를 받아왔음(무슨 이름이어도 상관없음)

  weatherSearch(positionObj);
};

const askForLocation = function () {
  navigator.geolocation.getCurrentPosition(accessToGeo);
};
askForLocation();
