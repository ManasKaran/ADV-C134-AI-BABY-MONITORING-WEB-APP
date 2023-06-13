model_status = "";
objects = [];

function setup() {
    canvas = createCanvas(650, 500);
    canvas.center();
    video = createCapture(VIDEO);
    video.hide();
    object_detector = ml5.objectDetector("cocossd", modelLoaded);


}

function modelLoaded() {
    console.log("Model is Loaded");
    model_status = "true";
}

function gotresults(error, results) {
    if (error) {
        console.error(error);
    } else {
        console.log(results);
        objects = results;
    }
}

function preload() {
    song = loadSound("alarm.mp3");
}

function draw() {
    image(video, 0, 0, 650, 500);
    sound_status = song.isPlaying();
    if (model_status != "") {
        object_detector.detect(video, gotresults);
        document.getElementById("status").innerHTML = "Status: Detecting Objects";
        for (i = 0; i < objects.length; i++) {
            noFill();
            rect(objects[i].x, objects[i].y, objects[i].width, objects[i].height);
            stroke("red");
            strokeWeight(4);
            fill("white");
            label = objects[i].label + " " + (objects[i].confidence * 100).toFixed(2) + " " + "%";
            text(label, objects[i].x, objects[i].y - 10);
            textSize(25);
            if (objects[i].label == "person") {
                document.getElementById("person").innerHTML = "Baby is found";
                song.stop();

            } else {
                if (sound_status == false) {
                    song.play();
                    document.getElementById("person").innerHTML = "Baby is not found";
                    console.log("First Condition is working");
                }

            }
        }
        if (objects.length == 0) {
            if (sound_status == false) {
                // song.stop();
                song.play();
                document.getElementById("person").innerHTML = "Baby is not found";
                console.log("Second Condition is working");

            }
        }
    }
}