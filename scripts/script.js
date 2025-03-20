const videoElement = document.getElementById("video");
const resultDiv = document.getElementById("result");

navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
    .then(stream => {
        videoElement.srcObject = stream;
        videoElement.play();
        requestAnimationFrame(scanQRCode);
    })
    .catch(error => {
        console.error("Error accessing camera: ", error);
        resultDiv.textContent = "Error accessing camera.";
    });

function scanQRCode() {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, canvas.width, canvas.height);

    if (code) {
        resultDiv.textContent = `QR Code Data: ${code.data}`;
    } else {
        resultDiv.textContent = "Scanning...";
    }
    requestAnimationFrame(scanQRCode);
}

fetch('https://script.google.com/macros/s/AKfycbyKlri0aWArVbNC53AxV__dLqHBM-Ytt1wVS3NnBcHk/exec')
  .then(response => response.json())  // Convert the response to JSON
  .then(data => {
    console.log(data);  // Log the data from Google Sheets (for testing)
    // You can do something with this data, like displaying it on your webpage
  })
  .catch(error => console.error('Error:', error));  // Handle errors
