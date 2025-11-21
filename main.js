// select elements
let countSpan = document.querySelector(".count span");
let count = document.querySelector(".count");
let bullets = document.querySelector(".bullets");
let bulletsSpanContainer = document.querySelector(".bullets .spans-container");
let qArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submit = document.querySelector(".submit-btn");
let prevBtn = document.getElementById("prev-btn");
let nextBtn = document.getElementById("next-btn");
let resultsContainer = document.querySelector(".results");
let countdownElement = document.querySelector(".countdown");
let dropdown = document.querySelector(".dropdown");
let enBtn = document.getElementById("en-btn");
let arBtn = document.getElementById("ar-btn");
let catItem = document.querySelectorAll(".dropdown-menu .dropdown-item");
let yesSubmit = document.getElementById("yes");
let noSubmit = document.getElementById("no");

qArea.classList.add("question-box");
answersArea.classList.add("answers-box");
// عشان نستخدم dataset بدل كلاس
qArea.dataset.animating = "false";
answersArea.dataset.animating = "false";

// set options
let currentIndex = 0;
let allData = null;
let currentLang = null;
let chosenCat = null;
let countdownInterval = null;
let qObject = [];
let timePerQuestion = [];

// Mixing the order of answers for each question
function shuffleArray(array) {
  // if not array return empty array
  if (!Array.isArray(array)) return [];
  return [...array].sort(() => 0.5 - Math.random());
}

// get question from json
function getQuestions() {
  let myRequest = new XMLHttpRequest();
  myRequest.onreadystatechange = function () {
    if (this.readyState == 4 && this.status === 200) {
      allData = JSON.parse(this.responseText);
      // console.log(allData);
      // choose lang first
      if (!currentLang) {
        console.log("choose language first");
        return;
      }

      // choose only selected category
      qObject = allData[currentLang]?.[chosenCat];
      if (!Array.isArray(qObject) || !qObject.length) {
        console.error("No questions found for category:", chosenCat);
        return;
      }

      //pick 10 random questions
      qObject = shuffleArray(qObject).slice(0, 10);

      // create bullets & set question count
      createBullets(qObject.length);
      // add question data
      showQuestion(0);
      // start countdown
      countdown(45);
      // create animation after all elements loded
      revealQuizElements();
    }
  };

  myRequest.open("GET", "questions.json", true);
  myRequest.send();
}

// reveal eelements
function revealQuizElements() {
  [
    qArea,
    answersArea,
    bullets,
    submit,
    nextBtn,
    prevBtn,
    countdownElement,
    count,
  ].forEach((el, i) => {
    setTimeout(() => {
      // el.style.display = "block";
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    }, i * 200);
  });
}

// show category
function showCategory(category) {
  chosenCat = category.toLowerCase();

  // reset value
  currentIndex = 0;
  // reset
  qArea.innerHTML = "";
  answersArea.innerHTML = "";
  resultsContainer.innerHTML = "";
  bulletsSpanContainer.innerHTML = "";

  // hide dropdown
  dropdown.style.display = "none";

  // update category name
  document.querySelector(".category span").textContent = category;

  // get questions
  getQuestions();
}

// msg box
function showMsg(msg) {
  const box = document.getElementById("msgBox");
  const text = document.getElementById("msgText");

  text.textContent = msg;
  box.classList.add("show");

  document.getElementById("closeMsg").onclick = () => {
    box.classList.remove("show");
    setTimeout(() => {
      box.style.display = "none";
    }, 300);
  };
}

// category disabled/enable
catItem.forEach((btn) => {
  btn.onclick = () => {
    // disabled choose category
    if (!currentLang) {
      showMsg(`Please choose language first / اختار اللغة الاول`);
      return;
    }
    chosenCat = btn.textContent;
    showCategory(chosenCat);
  };
});

// language buttons
enBtn.onclick = () => {
  currentLang = "en";
  document.querySelector(".lang-btn").style.display = "none";
  document.querySelector(".category-container").style.display = "block";
  catItem.forEach((btn) => (btn.disabled = false));
};

arBtn.onclick = () => {
  currentLang = "ar";
  document.querySelector(".lang-btn").style.display = "none";
  document.querySelector(".category-container").style.display = "block";
  catItem.forEach((btn) => (btn.disabled = false));
};

//create bullets
function createBullets(num) {
  countSpan.textContent = num;
  bulletsSpanContainer.innerHTML = "";

  // create spans
  for (let i = 0; i < num; i++) {
    // create bullet
    let span = document.createElement("span");
    span.textContent = i + 1;
    // check if its first span
    if (i === 0) span.className = "on";

    // apppend bullets to main bullet container
    bulletsSpanContainer.appendChild(span);
  }
}
function handleBullets() {
  let bulletsSpan = document.querySelectorAll(".bullets .spans-container span");
  bulletsSpan.forEach((span, index) => {
    if (index === currentIndex) {
      span.classList.add("on");
    } else {
      span.classList.remove("on");
    }
  });
}

// show question
function showQuestion(index) {
  // save current index
  currentIndex = index;
  // stop prev timer& clear ui
  clearInterval(countdownInterval);
  qArea.innerHTML = "";
  answersArea.innerHTML = "";

  let q = qObject[index];
  if (!q) return;

  // mixing answers
  let answers = shuffleArray([q.answer_1, q.answer_2, q.answer_3, q.answer_4]);
  // title the question
  // create h2 q title
  let qTitle = document.createElement("h2");
  // append text to heading
  qTitle.textContent = q.title;
  // append h2 to quiz area
  qArea.appendChild(qTitle);

  //  answers
  answers.forEach((ans, i) => {
    // create main answer div
    let div = document.createElement("div");
    div.className = "answer";

    // create radio input
    let radioInput = document.createElement("input");
    // add type & name & id & data-attribute
    radioInput.type = "radio";
    radioInput.name = "question";
    radioInput.id = `answer_${index}_${i}`;
    radioInput.dataset.answer = ans;

    // checked
    if (q.selectedAnswer === ans) radioInput.checked = true;

    // create label
    let label = document.createElement("label");
    // add for attribute
    label.htmlFor = radioInput.id;
    // create label text
    label.textContent = ans;

    // add input &  label
    div.appendChild(radioInput);
    div.appendChild(label);
    // append all divs to answer area
    answersArea.appendChild(div);
  });

  handleBullets();
  countdown(45, index);
  // if timer negatve or  zero disabled answer
  if (timePerQuestion[index] != null && timePerQuestion[index] <= 0) {
    lockAnswers();
  }
}
// save selection
answersArea.addEventListener("change", (e) => {
  if (e.target && e.target.name === "question") {
    // save current question
    qObject[currentIndex].selectedAnswer = e.target.dataset.answer;
  }
});

// count duration
function countdown(duration, index) {
  clearInterval(countdownInterval);

  // index must be integer
  if (typeof index !== "number") {
    index = currentIndex;
  }

  // if first time question being submitted recorded the time
  if (timePerQuestion[index] == null) {
    timePerQuestion[index] = duration;
  }

  let timeLeft = timePerQuestion[index];

  const updateDisplay = () => {
    countdownElement.textContent = `${timeLeft} s`;

    // closer end timer
    if (timeLeft <= 10) {
      countdownElement.style.color = "red";
      countdownElement.style.fontWeight = "bold";
      countdownElement.style.fontSize = "25px";
    } else {
      countdownElement.style.color = "black";
      countdownElement.style.fontWeight = "bold";
    }
  };
  updateDisplay();

  countdownInterval = setInterval(() => {
    if (timeLeft <= 0) {
      clearInterval(countdownInterval);
      timePerQuestion[index] = 0;
      countdownElement.textContent = `0 s`;
      countdownElement.style.color = "red";
      lockAnswers();
      return;
    }

    // save change even leave question and back
    timeLeft--;
    timePerQuestion[index] = timeLeft;
    updateDisplay();
  }, 1000);
}

// click on submit
submit.onclick = () => {
  // confirm box
  document.getElementById("confirmBox").style.display = "flex";
};

// calc result
function calculateResults() {
  // get right answer
  let right = qObject.filter(
    (q) =>
      q.selectedAnswer?.trim().toLowerCase() ===
      q.right_answer.trim().toLowerCase()
  ).length;

  let total = qObject.length;
  let wrong = total - right;
  let skipped = qObject.filter((q) => !q.selectedAnswer).length;
  let percent = Math.round((right / total) * 100);

  // hide
  qArea.remove();
  answersArea.remove();
  submit.remove();
  nextBtn.remove();
  prevBtn.remove();
  bullets.remove();

  // show canvas
  const canvas = document.getElementById("resultChart");
  canvas.style.display = "block";

  // chart
  new Chart(document.getElementById("resultChart"), {
    type: "doughnut",
    data: {
      labels: ["Correct", "Wrong", "skipped"],
      datasets: [
        {
          data: [right, wrong, skipped],
          backgroundColor: ["#4caf50", "#f44336", "#777"],
        },
      ],
    },
    options: { responsive: true },
  });

  // show result
  resultsContainer.innerHTML = ` 
  <div id="summaryBox">
    <p>Correct: ${right}</p>
    <p>Wrong: ${wrong}</p>
    <p>Skipped: ${skipped}</p>
    <p>${percent}%</p>
  </div>
`;

  // create show answers button only once
  if (!document.getElementById("showAnswerBtn")) {
    const showBtn = document.createElement("button");
    showBtn.id = "showAnswerBtn";
    showBtn.textContent = "Show answers";

    // attach handler
    showBtn.onclick = showAllAnswers;

    // append after results content
    resultsContainer.appendChild(showBtn);

    // showBtn.remove();
  }
}

// locked answer
function lockAnswers() {
  let answers = document.getElementsByName("question");
  Array.from(answers).forEach((input) => {
    input.disabled = true;
    input.parentElement.classList.add("locked");
  });
}

// yes or no submiting
yesSubmit.onclick = () => {
  document.getElementById("confirmBox").style.display = "none";
  clearInterval(countdownInterval);
  calculateResults();
};
noSubmit.onclick = () => {
  document.getElementById("confirmBox").style.display = "none";
};

// show all answers
function showAllAnswers() {
  // resultsContainer.innerHTML = "";
  const wrapper = document.createElement("div");
  wrapper.className = "answers-review";
  const existingWrapper = document.querySelector(".answers-review");
  if (existingWrapper) existingWrapper.remove();

  qObject.forEach((q, index) => {
    const userAnswer = q.selectedAnswer
      ? q.selectedAnswer.trim()
      : "Not Answered";
    const correct = q.right_answer.trim();
    const isCorrect =
      userAnswer && userAnswer.toLowerCase() === correct.toLowerCase();

    let color = userAnswer === "Not Answered" ? "gray" : isCorrect ? "green" : "red";

    const div = document.createElement("div");
    div.className = "review-item";
    div.innerHTML = `
<div class="show-answers">
    <h3>${index + 1}. ${q.title} </h3>
        <p>Your Answer: <span style="color:${color}">${userAnswer}</span></p>
      <p>Correct Answer: <span style="color:green">${correct}</span></p>
</div>
      <hr>
    `;
    wrapper.appendChild(div);
  });
  // append review & add restart button
  resultsContainer.appendChild(wrapper);
}

//animation
function animateQuestion(direction, newIndex) {
  // Block any animation if one is running
  if (qArea.dataset.animating === "true") return;

  qArea.dataset.animating = "true";
  answersArea.dataset.animating = "true";

  // Remove all old classes
  const classes = [
    "slide-in-left",
    "slide-in-right",
    "slide-out-left",
    "slide-out-right",
  ];
  qArea.classList.remove(...classes);
  answersArea.classList.remove(...classes);

  const outClass = direction === "next" ? "slide-out-left" : "slide-out-right";
  const inClass = direction === "next" ? "slide-in-right" : "slide-in-left";

  // Add Exit class
  qArea.classList.add(outClass);
  answersArea.classList.add(outClass);

  // We use requestAnimationFrame + setTimeout instead of animationend (safer method)
  setTimeout(() => {
    currentIndex = newIndex;
    showQuestion(currentIndex);

    // We remove the exit class and add the login class
    qArea.classList.remove(outClass);
    answersArea.classList.remove(outClass);
    qArea.classList.add(inClass);
    answersArea.classList.add(inClass);

    // After the entrance is complete → we clean
    setTimeout(() => {
      qArea.classList.remove(inClass);
      answersArea.classList.remove(inClass);
      qArea.dataset.animating = "false";
      answersArea.dataset.animating = "false";
    }, 620);
  }, 620);
}

nextBtn.onclick = () => {
  if (currentIndex < qObject.length - 1) {
    animateQuestion("next", currentIndex + 1);
  }
};

prevBtn.onclick = () => {
  if (currentIndex > 0) {
    animateQuestion("prev", currentIndex - 1);
  }
};
