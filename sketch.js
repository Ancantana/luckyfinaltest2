let messageIndex = 0;
let messages = [
  "Hello",
  "My name is AVI. I am a digital assistant created by An.",
  "If it's alright with you, I'd like to ask you to do something for me.",
  "But first, let me explain why",
  "You will be given a number based on the area and duration you hold your mouse down for.",
  "Okay now, hold your mouse down for me. You are free to let go whenever you'd like.",
  "Thank you. You have been assigned a number ()"
];

let holdingMouse = false;
let startTime, endTime;
let assignedNumber;
let currentSize = 5;
let pinkHue = 330;

let video;
let snapshotCanvas;

function setup() {
  createCanvas(windowWidth, windowHeight);
  randomSeed(); // Set a random seed
  displayMessage();
}

function draw() {
  if (holdingMouse) {
    let pulseSpeed = calculatePulseSpeed();
    let targetSize = map(sin(frameCount * pulseSpeed), -1, 1, 5, 20);
    currentSize = lerp(currentSize, targetSize, 0.1);

    let circleColor = color('hsb(' + pinkHue + ', 100%, 100%)');

    background(255);
    fill(circleColor);
    noStroke();
    ellipse(mouseX, mouseY, currentSize, currentSize);
  }
}

function mousePressed() {
  holdingMouse = true;
  startTime = millis();
}

function mouseReleased() {
  holdingMouse = false;
  endTime = millis();
  calculateAssignedNumber();
  if (messageIndex < messages.length - 1) {
    messageIndex++;
    displayMessage();
  } else {
    // Display video and take a picture after the last message
    displayVideo();
  }
}

function calculateAssignedNumber() {
  let holdDuration = (endTime - startTime) / 1000;
  let area = sq(mouseX - width / 2) + sq(mouseY - height / 2);

  let noiseValue = noise(area * 0.01, holdDuration * 0.1);
  
  assignedNumber = floor(map(noiseValue, 0, 1, 1, 25)); // Adjusted the range to 1-25
  assignedNumber = constrain(assignedNumber, 1, 25);

  messages[6] = `Thank you. You have been assigned a number (${assignedNumber}).`;
}

function calculatePulseSpeed() {
  let holdDuration = (millis() - startTime) / 1000;
  let area = sq(mouseX - width / 2) + sq(mouseY - height / 2);

  // Map hold duration and area to pulse speed
  let pulseSpeed = map(area * holdDuration, 0, width * height * 10, 0.01, 0.1);
  pulseSpeed = constrain(pulseSpeed, 0.01, 0.1); // Ensure pulse speed is within the desired range

  return pulseSpeed;
}

function displayMessage() {
  background(255);
  fill(0);
  textSize(16);
  textAlign(CENTER, CENTER);
  
  let textY = height / 2;
  text(messages[messageIndex], width / 2, textY);
}

function displayVideo() {
  // Create a video element to display the camera stream
  video = createCapture(VIDEO);
  video.size(320, 240);
  video.hide(); // Hide the video element initially

  // Create a canvas to capture the frame from the video stream
  snapshotCanvas = createCanvas(320, 240);
  snapshotCanvas.position(width / 2 - 160, height / 2 - 120); // Center the canvas

  // Wait for a short time to ensure the camera is ready
  setTimeout(() => {
    // Draw the current frame from the video stream onto the canvas
    image(video, 0, 0, width, height);

    // Take a picture after a delay
    setTimeout(takePicture, 1000); // Adjust the time delay as needed
  }, 2000); // Adjust the time delay as needed
}

function takePicture() {
  // Draw the current frame from the video stream onto the canvas
  image(video, 0, 0, width, height);

  // Convert the canvas content to a data URL
  let dataURL = snapshotCanvas.canvas.toDataURL();

  // Create a link element to download the picture
  let link = document.createElement('a');
  link.href = dataURL;
  link.download = 'picture.png';

  // Trigger a click on the link to start the download
  link.click();

  // Remove the video and canvas elements
  video.remove();
  snapshotCanvas.remove();
}

