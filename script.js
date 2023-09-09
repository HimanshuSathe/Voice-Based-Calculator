
function getHistory(){
	return document.getElementById("history-value").innerText;
}

function printHistory(num){
	document.getElementById("history-value").innerText=num;
}

function getOutput(){
	return document.getElementById("output-value").innerText;
}

function printOutput(num){
	if(num==""){
		document.getElementById("output-value").innerText=num;
	}
	else{
		document.getElementById("output-value").innerText=getFormattedNumber(num);
	}	
}

function getFormattedNumber(num){
	if(num=="-"){
		return "";
	}
	var n = Number(num);
	var value = n.toLocaleString("en");
	return value;
}


// to remove commas
function reverseNumberFormat(num){  //remove commas
	return Number(num.replace(/,/g,''));  // to remove all , with empty g for global (sed)
}


//if any button with classname operator is clicked
var operator = document.getElementsByClassName("operator");  //C CE % + * - / =
for(var i =0;i<operator.length;i++){
	operator[i].addEventListener('click',function(){

		if(this.id=="clear"){
			printHistory("");   // clear all
			printOutput("");
		}

		else if(this.id=="backspace"){
			var output=reverseNumberFormat(getOutput()).toString();   // first read from output area convert it to string then pass it to comma remove function
			if(output){//if output has a value
				output= output.substr(0,output.length-1); //deleting last character
				printOutput(output);
			}
		}

		else{
			var output=getOutput();    //if didn't pass second operand then just get number and operator from history 
			var history=getHistory();  //and remove operator form it
			if(output==""&&history!=""){
				if(isNaN(history[history.length-1])){   //since operator is appended so it will not be number true
					history= history.substr(0,history.length-1);
				}
			}

			if(output!="" || history!=""){   // if any is not empty block will execute 
				output= output==""?output:reverseNumberFormat(output);
				history=history+output;   //since already  remove operator above if second number is empty
				if(this.id=="="){   //if click = then 
					var result=eval(history);  
					printOutput(result);  //simply first number will be printed
					printHistory("");  //and history will be set to empty
				}
				else{
					history=history+this.id;  //if not equal then chnage or update history's operator ex 89+ then press * then 89*
					printHistory(history);  // history will be changed and second number still required
					printOutput("");
				}
			}
		}
		
	});
}


// if any number is pressed 0-9
var number = document.getElementsByClassName("number");  
for(var i =0;i<number.length;i++){
	number[i].addEventListener('click',function(){  // on each click
		var output=reverseNumberFormat(getOutput());  //remove commas   first read form output field
		if(output!=NaN){ //if output is a string not number
			output=output+this.id;  //append current number 
			printOutput(output);  //show on screen
		}
	});
}

//manual work over 




//voice based using web speech api
var microphone = document.getElementById('microphone');
microphone.onclick=function(){  //if microphone is clicked 
	microphone.classList.add("record");  //small animation is added to just show that currently mic is working (not necessary to add just for user experience)
// created a object of speech recognition interface    having multiple properties and methods
                                     //std api         for chrome and safari                 for mozila                  for Microsoft edge
	var recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)();
	recognition.lang = 'en-US';  //property of speech recognition use to set US english 
	recognition.start();    //method   used to start taking input form user via voice
	operations = {
		         "plus":"+",
				 "minus":"-",
				 "multiply":"*",
				 "multiply by":"*",
				 "into":"*",
				 "divide":"/",
				 "divide by":"/",
				 "divided":"/",
				 "reminder":"%"
				}
	

	
	recognition.onresult = function(event){  // it will trigger when user stops to say command
		//event contain array of speechRecognitionResult in this case we one  and in each of it
		// contain list of SpeechRecognitionAlternative having lots of string with first one as most accurate 
		// Hello then hello ello lo etc..
		// form it we are taking first one most accurate one 
		// transcript is property of SpeechRecognitionAlternative 
		var input = event.results[0][0].transcript;  
		for(property in operations){
			input= input.replace(property, operations[property]);
		}

		document.getElementById("output-value").innerText = input;  // write on screen 
		setTimeout(function(){
			evaluate(input);
		},2000);   // after some delay when user stops we wiill evalute the inpput and print the result 
		microphone.classList.remove("record");
	}
	
}



function evaluate(input){
	try{
		var result = eval(input);  // takes string as input and returns ans 
		document.getElementById("output-value").innerText = result;
	}
	catch(e){
		console.log(e);
		document.getElementById("output-value").innerText = "";
	}
}