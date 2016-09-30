var local_list;
			
var tasksList = [];
var currentTaskIndex = 0;

var sound = new Audio('http://soundbible.com/mp3/Electronic_Chime-KevanGC-495939803.mp3');
var soundLoaded = false;
var canNotify = false;

var timerCompleted = false;
var timerCount = 1500;
var timerValue = 0;
var appTimer;

// init task
function initTask() {
	
	if (document.getElementById('task-name').value != '') {
		
		document.getElementById('task-name').readOnly = true;
		document.getElementById('task').className = 'ready';
		document.getElementById('timer').className = 'show';
		
		tasksList.push({
			name: document.getElementById('task-name').value,
			pomo: 0,
			interrupt: {
				num: 0,
				time: 0
			},
			total: 0
		});
		
		startTimer();
		
	}
	
}

// start timer
function startTimer() {
	
	timerCompleted = false;
	timerValue = timerCount;
	
	document.getElementById('counter').className = 'counting';
	document.getElementById('btn-clear').className = 'hide';
	document.getElementById('tgl-timer').innerHTML = '&#x025AA;';
	
	appTimer = setInterval(function() { countDown(timerValue) }, 1000);
	
}

// stop timer
function stopTimer() {
	
	if (soundLoaded) sound.play();
	
	if (timerCompleted) {
		
		document.getElementById('pomodoros').innerHTML += '<span class="pomo"></span>';
		
		tasksList[currentTaskIndex].pomo ++;
		
		if (canNotify) sendNotification('DING! ***', 'One pachino is gone!');
		else alert('DING! *** One pachino is gone!');
		
	}
	else {
		
		document.getElementById('pomodoros').innerHTML += '<span class="pomo interrupt"></span>';
		
		tasksList[currentTaskIndex].interrupt.num ++;
		tasksList[currentTaskIndex].interrupt.time += (timerCount - timerValue);
	
	}
	
	tasksList[currentTaskIndex].total = (tasksList[currentTaskIndex].pomo * timerCount) + tasksList[currentTaskIndex].interrupt.time;
	
	timerValue = 0;
	
	document.title = 'pachino';
	document.getElementById('counter').className = '';
	document.getElementById('counter').innerHTML = '25:00';
	document.getElementById('pomodoros').className = 'show';
	document.getElementById('tgl-timer').innerHTML = '&#x025B8;';
	
	clearInterval(appTimer);
	
}

// toggle timer
function tglTimer() {
	
	if (timerValue > 0) stopTimer();
	else startTimer();
	
}

// countdown
function countDown(value) {
	
	timerValue = value;
	timerValue --;
	
	if (timerValue > 0) {
		
		var min = Math.floor(timerValue / 60);
		var sec = timerValue - min * 60;
		
		document.title = 'pachino [ ' + min + ':' + sec + ' ]';
		document.getElementById('counter').innerHTML = min + ':' + sec;
		
	}
	else {
		
		timerCompleted = true;
		
		stopTimer();
		
	}
	
}

// task done
function taskDone() {
	
	if (timerValue > 0) stopTimer();
	
	document.getElementById('task-name').readOnly = false;
	document.getElementById('task-name').value = '';
	
	document.getElementById('task').className = '';
	document.getElementById('timer').className = '';
	
	document.getElementById('pomodoros').className = '';
	document.getElementById('pomodoros').innerHTML = '';
	
	document.getElementById('btn-clear').className = 'btn';
	
	currentTaskIndex++;
	
	updateTasksList();
		
};

// update tasks list
function updateTasksList() {
	
	document.getElementById('tasks-list').innerHTML = '';
	
	for (i = 0; i < tasksList.length; i++) {
		
		var m = Math.floor(tasksList[i].total / 60);
		var s = tasksList[i].total - m * 60;
		
		document.getElementById('tasks-list').innerHTML += '<li><span class="num"><span class="pomo"></span> '+ tasksList[i].pomo +'</span><span class="num"><span class="pomo interrupt"></span> '+ tasksList[i].interrupt.num +'</span><span class="time">'+ m +':'+ s +'</span><span class="name">'+ tasksList[i].name +'</span></li>';
		
	}
	
	document.getElementById('tasks').className = 'show';
	
	window.localStorage.setItem('pachino', JSON.stringify(tasksList));
	
	console.log('Tasks list:', tasksList);
	
}

// clear tasks
function clearTasks() {
	
	document.getElementById('tasks').className = '';
	document.getElementById('tasks-list').innerHTML = '';
	
	tasksList = [];
	currentTaskIndex = 0;
	
	window.localStorage.removeItem('pachino');
	
}

// send notification
function sendNotification(title, text) {
	
	var n = new Notification(title, { body: text });
	
}

// check notification
Notification.requestPermission().then(function(result) {

	if (result === 'granted') canNotify = true;

});

// audio loaded
sound.addEventListener('canplaythrough', function() { 
	
	soundLoaded = true;
	
}, false);

// check local list
local_list = window.localStorage.getItem('pachino');

if (local_list) {
	
	tasksList = JSON.parse(local_list);
	
	currentTaskIndex = tasksList.length;
	
	updateTasksList();
	
}

// EVENTS

document.getElementById('btn-init').addEventListener('click', function() {
	
	initTask();
	
});

document.getElementById('task-name').addEventListener('keypress', function(e) {
	
	var key = e.which || e.keyCode;
	
	if (!document.getElementById('task-name').readOnly && (key === 13)) initTask();
	
});

document.getElementById('btn-done').addEventListener('click', function() {
	
	taskDone();
	
});

document.getElementById('tgl-timer').addEventListener('click', function() {
	
	tglTimer();
	
});

document.getElementById('btn-clear').addEventListener('click', function() {
	
	clearTasks();
	
});