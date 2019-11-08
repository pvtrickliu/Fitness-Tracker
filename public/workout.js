async function init() {
  const allWorkouts = await API.getAllWorkouts();
  const lastWorkout = allWorkouts[allWorkouts.length - 1]
  //const lastWorkout = await API.getLastWorkout();
  console.log(lastWorkout, allWorkouts);

  document
    .querySelector("a[href='/exercise?']")
    .setAttribute("href", `/exercise?id=${lastWorkout._id}`);


  allWorkouts.map(workout => {
    var tr = document.createElement("tr");
    var td1 = document.createElement("td")
    td1.innerText = formatDate(workout.day)
    var td2 = document.createElement("td")
    td2.innerText = workout.totalDuration
    var td3 = document.createElement("td")
    td3.innerText = workout.exercises.length

    var td4 = document.createElement("td")
    var button = document.createElement("button");
    button.value = workout._id;
    button.onclick = changeWorkout
    button.innerText = "MODIFY"
    button.classList.add("btn")
    button.classList.add("btn-default")
    
    var td5 = document.createElement("td")
    var buttonSELECT = document.createElement("button");
    buttonSELECT.value = JSON.stringify(workout)
    buttonSELECT.innerText = "SELECT"
    buttonSELECT.onclick = selectWorkout
    buttonSELECT.classList.add("btn")
    buttonSELECT.classList.add("btn-default")
    td5.appendChild(buttonSELECT)

    td4.appendChild(button)
    tr.appendChild(td1)
    tr.appendChild(td2)
    tr.appendChild(td3)
    tr.appendChild(td4)
    tr.appendChild(td5)
    var parent = document.getElementById("prev-workout-table")
    parent.appendChild(tr)
  })

  renderWorkoutSummary(WorkoutSummary(
    lastWorkout.day,
    lastWorkout.totalDuration,
    lastWorkout.exercises.length,
    lastWorkout.exercises
  ));
}

function selectWorkout() {
  var data = JSON.parse(this.value);
  console.log(data)

  document
    .querySelector("#modify")
    .setAttribute("href", `/exercise?id=${data._id}`);

  renderWorkoutSummary(WorkoutSummary(
    data.day,
    data.totalDuration,
    data.exercises.length,
    data.exercises
  ))
}

function changeWorkout() {
  console.log(this.value)
  location.href = "/exercise?id=" + this.value
}

function WorkoutSummary(day, dur, length) {
  this.date = formatDate(day);
  this.totalDuration = dur;
  this.numExercises = length;
}

function tallyExercises(exercises) {
  return exercises.reduce((acc, curr) => {
    if (curr.type === "resistance") {
      acc.totalWeight = (acc.totalWeight || 0) + curr.weight;
      acc.totalSets = (acc.totalSets || 0) + curr.sets;
      acc.totalReps = (acc.totalReps || 0) + curr.reps;
    } else if (curr.type === "cardio") {
      acc.totalDistance = (acc.totalDistance || 0) + curr.distance;
    }

    return acc;
  }, {});
}

function formatDate(date) {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  };

  return new Date(date).toLocaleDateString(options);
}

function renderWorkoutSummary(summary) {
  const container = document.querySelector(".workout-stats");
  container.innerHTML = ""

  const workoutKeyMap = {
    date: "Date",
    totalDuration: "Total Workout Duration",
    numExercises: "Exercises Performed",
    totalWeight: "Total Weight Lifted",
    totalSets: "Total Sets Performed",
    totalReps: "Total Reps Performed",
    totalDistance: "Total Distance Covered"
  };

  Object.keys(summary).forEach(key => {
    const p = document.createElement("p");
    const strong = document.createElement("strong");

    strong.textContent = workoutKeyMap[key];
    const textNode = document.createTextNode(`: ${summary[key]}`);

    p.appendChild(strong);
    p.appendChild(textNode);

    container.appendChild(p);
  });
}

function WorkoutSummary(day, dur, len, exer) {
  return {
    date: formatDate(day),
    totalDuration: dur,
    numExercises: len,
    ...tallyExercises(exer)
  };
}

init();