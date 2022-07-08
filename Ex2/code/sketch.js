var playStopButton;
var analyzer;
var rmsval;
var energyval;
var zcrVal;
var specspreadval;
var myRec;
var mySound;

function preload(){
    soundFormats("mp3","wav");
    mySound = loadSound("../assets/Kalte_Ohren_(_Remix_).mp3");
}

function setup() {
    myRec = new p5.SpeechRec('en-US', parseResult);
    myRec.continuous = true; // do continuous recognition
    myRec.interimResults = true; // allow partial recognition (faster, less accurate)
    myRec.start();
    
    createCanvas(700,700);
    background(180);
    
    playStopButton = createButton("play");
    playStopButton.position(200,20);
    playStopButton.mousePressed(playStopSound);
    
    if (typeof Meyda === "undefined"){
        console.log("Meyda not found");
    }else{
        analyzer = Meyda.createMeydaAnalyzer({
            "audioContext": getAudioContext(),
            "source": mySound,
            "bufferSize": 512,
            "featureExtractors": ["rms","zcr","energy","spectralSpread"],
            "callback": features => {
                // root mean square feature
                rmsval = features.rms*500;
                // energy feature
                energyval = features.energy*10;
                // zero crossing rate feature
                zcrVal = features.zcr;
                // spectral spread feature
                specspreadval = features.spectralSpread
            }
        });
    }
}

function draw() {
    background(180);
    parseResult();
    
    //green -> rms
    fill(0,255,0); 
    rect(50,80,rmsval,rmsval);
    
    //red -> energy
    fill(255,0,0);
    rect(50+rmsval,80,energyval,energyval);
    
    //blue -> zcr
    fill(0,0,255);
    rect(50+rmsval+energyval,80,zcrVal,zcrVal);
    
    //purple -> spectral spread
    fill(255,0,255);
    rect(50+rmsval+energyval+zcrVal,80,specspreadval,specspreadval);
}

function playStopSound(){
    if(mySound.isPlaying()){
        mySound.stop();
        analyzer.stop();
        playStopButton.html("play");
    }else{
        mySound.play();
        analyzer.start();
        playStopButton.html("stop");
    }
}

function parseResult() {
    if (myRec.resultValue) {
        const color = myRec.resultString.split(' ').pop().toUpperCase();
        if (color == "BLUE"){
            background(0,0,255);
        }
        if (color == "BLACK"){
            background(255,255,255);
        }
        if (color == "RED"){
            background(255,0,0);
        }
        if (color == "WHITE"){
            background(0,0,255);
        }
        if (color == "GREEN"){
            background(0,255,0);
        }        
        background(color);
        console.log(color);
  }
}