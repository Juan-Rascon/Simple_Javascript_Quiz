//SET DOM VARIABLES HERE
var startButton = document.querySelector("#start-button");
var timer = document.querySelector("#timer");
var quizQuestion = document.querySelector("#quiz-question");
var answerList = document.querySelector("#quiz-choices");
var mainBody = document.querySelector("main");
var responseDiv = document.querySelector("#result");
var cardTitle = document.querySelector("#card-title");
var viewHighScores = document.querySelector("#high_scores");

//DECLARE BOOTSTRAP Class Strings here
var BootStrapButton = "btn btn-primary my-2";
var BootStrapHighScoreButton = "btn btn-primary mx-2";
var BootStrapAnswerList = "d-inline-flex flex-column";
var BootStrapHighScore = "d-flex flex-row p-0";
var BootStrapResponse = "";
var BSCorrect = "col-sm-8 text-center align-middle font-weight-bold alert alert-success";
var BSWrong = "col-sm-8 text-center align-middle font-weight-bold alert alert-danger";
var BSDefault = "col-sm-8 my-sm-5";

//DECLARE HELPER VARIABLES HERE
var QuizScore;
var QuizTimer;
var Initials;
var CurrentQuestion=0;
var QuizStarted = false;
var Timercounter = 61;
var RanOutOfTime;


//Quiz Questions
var LoadQuiz = JSON.parse('[{"question":"How do you get the lenght of an Array?","choices":[{"choice":"Array.GetLength","answer":false},{"choice":"Array.length","answer":true},{"choice":"Array.count","answer":false},{"choice":"Array.size()","answer":false}]},{"question":"What is the HTML tag under which one can write the JavaScript code?","choices":[{"choice":"<javscript>","answer":false},{"choice":"<link>","answer":false},{"choice":"<head>","answer":false},{"choice":"<script>","answer":true}]},{"question":"Which of the following is the correct syntax to display “Bootcamp” in an alert box using JavaScript?","choices":[{"choice":"msg(“Bootcamp”);","answer":false},{"choice":"alert(“Bootcamp”);","answer":true},{"choice":"prompt(“Bootcamp”)","answer":false},{"choice":"alertbox(“Bootcamp”);","answer":false}]},{"question":"What is the syntax for creating a function in JavaScript named MyFunction?","choices":[{"choice":"function = MyFunction()","answer":false},{"choice":"function MyFunction()","answer":true},{"choice":"function := MyFunction()","answer":false},{"choice":"function : MyFunction()","answer":false}]},{"question":"How is the function, MyFunction,  called in Javascript","choices":[{"choice":"call function MyFunction();","answer":false},{"choice":"MyFunction();","answer":true},{"choice":"call MyFunction();","answer":false},{"choice":"function MyFunction();","answer":false}]},{"question":"An if condition is wrapped in what type of characters?","choices":[{"choice":"curly braces { }","answer":false},{"choice":"parentheses ( )","answer":true},{"choice":"brackets [ ]","answer":false},{"choice":"quotes","answer":false}]},{"question":"How do you declare a variable? ","choices":[{"choice":"dim Variable;","answer":false},{"choice":"var Variable;","answer":true},{"choice":"set Variable;","answer":false},{"choice":"call Variable;","answer":false}]},{"question":"How do you force a string number into an integer?","choices":[{"choice":"integer()","answer":false},{"choice":"parseInt()","answer":true},{"choice":"number.integer()","answer":false},{"choice":"this.int()","answer":false}]},{"question":"Arrays in JavaScript can be used to store ______.","choices":[{"choice":"numbers and strings","answer":false},{"choice":"other arrays","answer":false},{"choice":"booleans","answer":false},{"choice":"all of the above","answer":true}]},{"question":"String values must be enclosed within ____ when being assigned to variables","choices":[{"choice":"commas","answer":false},{"choice":"quotes","answer":true},{"choice":"parentheses","answer":false},{"choice":"curly brackets","answer":false}]}]');

//FUNCTION DECLARATIONS

//Timer functions
function displayTime(){
  if (Timercounter>=0){
    timer.textContent = Timercounter;
  }
  else {
    RanOutOfTime = true;
    EndGame("You ran out of time!");
  }
};

function start_timer(){
  QuizTimer = setInterval(function(){
    Timercounter --;
     displayTime();}, 1000);
};

function stop_timer(){
  clearTimeout(QuizTimer);
    timer.textContent = 0;
};

//Quiz START
function StartQuiz(){
  event.preventDefault();
  event.stopPropagation();

  //Set state variables
  Initials="";
  QuizScore = 0;
  RanOutOfTime = false;
  QuizStarted = true;

  start_timer();

  answerList.removeChild(startButton);
  answerList.setAttribute("class",BootStrapAnswerList);

  GetQuestion();
};

function GetQuestion(){
  ClearContent();
  if(CurrentQuestion+1>Object.keys(LoadQuiz).length || !QuizStarted || RanOutOfTime){
    EndGame("You answered all the questions!");
  }
  else {
    quizQuestion.textContent= LoadQuiz[CurrentQuestion]['question']
  
  for (var j = 0; j< LoadQuiz[CurrentQuestion]['choices'].length; j++){

    var answerButton = document.createElement("button");
    var response = LoadQuiz[CurrentQuestion]['choices'][j]['answer'];

    answerButton.textContent= LoadQuiz[CurrentQuestion]['choices'][j]['choice'];
    answerButton.setAttribute ('data-choice',response);
    answerButton.setAttribute("class",BootStrapButton);
    answerList.appendChild(answerButton);
    }
  }
};


function GetAnswer(event){

  event.preventDefault();

  if(event.target.matches("button")){
    CurrentQuestion++;
    
    if (event.target.getAttribute("data-choice") === "true"){
      result.setAttribute("class", BSCorrect);
      result.textContent="CORRECT ANSWER!";
      setTimeout(GetQuestion,500);
      QuizScore ++;
    } 
    else if (event.target.getAttribute("data-choice") === "false"){
      result.setAttribute("class",BSWrong);
      result.textContent="WRONG ANSWER!";
      setTimeout(GetQuestion,500);
      Timercounter -= 10;
    }
    else if (event.target.getAttribute("data-choice") === "submit"){
        initials = event.target.previousSibling.lastChild.value
        SubmitHighScore();
    }
    else if (event.target.getAttribute("data-choice") === "GoBack"){
      location.reload();

    }
    else if (event.target.getAttribute("data-choice") === "Clear"){
      localStorage.removeItem("highscore");
      HighScores();
    }
  }     
};

function SubmitHighScore(){
  if (localStorage.getItem("highscore") === null){
    var AllHighscores = [];
    var userScore = {"user": initials,"score": QuizScore};
    AllHighscores.push(userScore);
    localStorage.setItem("highscore",JSON.stringify(AllHighscores));
  }
  else {
    var AllHighscores = JSON.parse(localStorage.getItem("highscore"));
    var userScore = {"user": initials,"score": QuizScore};
    AllHighscores.push(userScore);
  }

  localStorage.setItem("highscore",JSON.stringify(AllHighscores));
  HighScores();
};


function HighScores(){
  if (QuizStarted){
    EndGame("You didn't complete the quiz...");
  }
  QuizStarted = false;
  cardTitle.textContent="High Scores"
  quizQuestion.textContent="";

  var HighScores = JSON.parse(localStorage.getItem("highscore"));

  if (HighScores !== null){

    HighScores.sort((a,b) => {return b.score-a.score});

    for (var i = 0; i<HighScores.length; i++){
      var p = document.createElement("p");
      p.textContent= HighScores[i].user +": " + HighScores[i].score;
      p.setAttribute("class","card-text mx-2 text-left alert alert-success")
      quizQuestion.appendChild(p);
    }
  }
  else {

    quizQuestion.setAttribute("class","card-text mx-2 alert alert-danger");
    quizQuestion.innerHTML= "No High Scores";

  }

  answerList.innerHTML="";
  result.setAttribute("class",BSDefault);
  result.innerHTML="";
  var backButton = document.createElement("button");
  var clearScores = document.createElement("button");
  backButton.textContent= "Back";
  backButton.setAttribute ('data-choice',"GoBack");
  backButton.setAttribute("class",BootStrapHighScoreButton);
  clearScores.textContent= "Clear Scores";
  clearScores.setAttribute ('data-choice',"Clear");
  clearScores.setAttribute("class",BootStrapHighScoreButton);
  
  answerList.setAttribute("class", BootStrapHighScore);
  answerList.appendChild(backButton);
  answerList.appendChild(clearScores);
};


function EndGame(message){
  stop_timer();
  QuizStarted = false;
  cardTitle.textContent=message;
  quizQuestion.innerHTML="Your final score is: " + QuizScore;
  answerList.innerHTML="";
  CreateForm();
  result.setAttribute("class",BSDefault);
  result.innerHTML="";
  return;
};


function ClearContent(){
  answerList.innerHTML="";
  result.setAttribute("class",BSDefault);
  result.innerHTML="";
};


function CreateForm(){
  var HSform = document.createElement("form");
  var HSdiv = document.createElement("div");
  var HSlabel = document.createElement('label');
  var HSInput = document.createElement('input');
  var HSbutton = document.createElement('button');

  HSdiv.setAttribute("class","form-group");
  HSlabel.setAttribute("for","initials");
  HSlabel.textContent = "Enter Initials:";
  HSInput.setAttribute("type","text");
  HSInput.setAttribute("class","form-control");
  HSInput.setAttribute("placeholder","Enter Initials");
  HSbutton.setAttribute("type","submit");
  HSbutton.setAttribute("class","btn btn-primary");
  HSbutton.setAttribute("data-choice", "submit");
  HSbutton.textContent="Submit";

  HSform.appendChild(HSdiv);
  HSdiv.appendChild(HSlabel);
  HSdiv.appendChild(HSInput);
  HSform.appendChild(HSbutton);

  answerList.appendChild(HSform);
}



//Event listeners 
startButton.addEventListener("click", StartQuiz);
answerList.addEventListener("click", GetAnswer);
viewHighScores.addEventListener("click", HighScores);
