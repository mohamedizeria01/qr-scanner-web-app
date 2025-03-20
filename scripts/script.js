// Get HTML elements
const videoElement = document.getElementById("video");
const resultDiv = document.getElementById("result");

// Get the URL of your Google Apps Script Web App
const appsScriptURL = 'https://script.google.com/macros/s/AKfycbyKlri0aWArVbNC53AxV__dLqHBM-Ytt1wVS3NnBcHk/exec'; // Replace with your actual URL

// Access the camera and start scanning
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

// Function to scan QR codes continuously
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
        sendQRCodeDataToGoogleSheets(code.data);  // Call the function to send data to Google Sheets
    } else {
        resultDiv.textContent = "Scanning...";
    }
    requestAnimationFrame(scanQRCode);
}

// Function to send scanned QR code data to Google Sheets (via Google Apps Script)
function sendQRCodeDataToGoogleSheets(qrData) {
    const data = {
        name: 'John Doe', // Replace with actual data if available, like the user's name
        phone: '1234567890', // Replace with actual phone number
        email: 'johndoe@example.com', // Replace with actual email
        qrCodeLink: 'https://drive.google.com/file/d/1exampleQRCodeLink.png', // Example QR code link, replace with actual
        status: 'Scanned'
    };

    // POST request to Google Apps Script (sending data to Google Sheet)
    fetch(appsScriptURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data), // Send the data as JSON
    })
        .then(response => response.text())
        .then(responseData => {
            console.log('Data successfully added to Google Sheet:', responseData);
        })
        .catch(error => {
            console.error('Error sending data to Google Sheets:', error);
        });
}
