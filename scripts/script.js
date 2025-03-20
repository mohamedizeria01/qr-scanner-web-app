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
