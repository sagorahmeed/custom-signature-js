var canvas = document.getElementById('signature-pad');
var colorPicker = document.getElementById('colorPicker'); // Define colorPicker variable here
var brushSizeInput = document.getElementById('brushSize');
var angleInput = document.getElementById('angle');

// Adjust canvas coordinate space taking into account pixel ratio,
// to make it look crisp on mobile devices.
// This also causes canvas to be cleared.
function resizeCanvas() {
    // When zoomed out to less than 100%, for some very strange reason,
    // some browsers report devicePixelRatio as less than 1
    // and only part of the canvas is cleared then.
    var ratio = Math.max(window.devicePixelRatio || 1, 1);
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;
    canvas.getContext("2d").scale(ratio, ratio);
}

window.onresize = resizeCanvas;
resizeCanvas();

var signaturePad = new SignaturePad(canvas, {
    backgroundColor: 'rgba(0, 0, 0, 0)' // Transparent background
});

// Function to change the color of the canvas
function changeCanvasColor(color) {
    // Get the signature data as an image URL
    var signatureDataURL = signaturePad.toDataURL();

    // Clear the canvas
    signaturePad.clear();

    // Create a new Image object
    var img = new Image();

    // Set the source of the image to the signature data URL
    img.src = signatureDataURL;

    // When the image loads, draw it on the canvas with the new color
    img.onload = function () {
        // Draw the image on the canvas
        canvas.getContext('2d').drawImage(img, 0, 0);

        // Set the pen color of the signature pad to the new color
        signaturePad.penColor = color;

        // Redraw the signature with the new color
        signaturePad.fromDataURL(signatureDataURL);
    };
}

// Color picker input
colorPicker.addEventListener('input', function () {
    var color = this.value;
    changeCanvasColor(color);
});

// Color buttons
var colorButtons = document.querySelectorAll('.color-btn');
colorButtons.forEach(function (button) {
    button.addEventListener('click', function () {
        var color = button.style.backgroundColor;
        changeCanvasColor(color);
    });
});

// Brush size input
brushSizeInput.addEventListener('input', function () {
    var size = parseInt(this.value, 10);
    signaturePad.minWidth = size;
    signaturePad.maxWidth = size;
});

// Angle input
angleInput.addEventListener('input', function () {
    var angle = parseInt(this.value, 10);
    // Rotate canvas by the angle (in radians)
    var radians = angle * Math.PI / 180;
    canvas.style.transform = 'rotate(' + angle + 'deg)';
});

document.getElementById('save-png').addEventListener('click', function () {
    if (signaturePad.isEmpty()) {
        return alert("Please provide a signature first.");
    }

    var data = signaturePad.toDataURL('image/png');
    download(data, 'signature.png');
});

document.getElementById('clear').addEventListener('click', function () {
    signaturePad.clear();
});

// function download(dataURL, filename) {
//     var link = document.createElement('a');
//     link.href = dataURL;
//     link.download = filename;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
// }

function download(dataURL, filename) {
    var link = document.createElement('a');
    link.href = dataURL;
    link.download = filename;
    document.body.appendChild(link);

    // Create a temporary canvas to draw the rotated signature
    var tempCanvas = document.createElement('canvas');
    var tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;

    // Rotate the temporary canvas to the angle specified by the angle input
    var angle = parseInt(angleInput.value, 10);
    var radians = angle * Math.PI / 180;
    tempCtx.translate(canvas.width / 2, canvas.height / 2);
    tempCtx.rotate(radians);
    tempCtx.translate(-canvas.width / 2, -canvas.height / 2);

    // Draw the signature onto the rotated temporary canvas
    tempCtx.drawImage(signaturePad.canvas, 0, 0);

    // Convert the rotated temporary canvas to a data URL
    var rotatedDataURL = tempCanvas.toDataURL();

    // Set the download link href to the rotated data URL
    link.href = rotatedDataURL;

    // Trigger the download
    link.click();
    document.body.removeChild(link);
}
// Reset button
document.getElementById('reset').addEventListener('click', function (event) {
    console.log('event',event)
    resetCanvasSettings();
});

// Function to reset canvas settings
function resetCanvasSettings() {
    // Reset color to default (black)
    var defaultColor = '#000000';
    signaturePad.penColor = defaultColor;
    colorPicker.value = defaultColor;

    // Reset brush size to default (5)
    var defaultBrushSize = 5;
    signaturePad.minWidth = defaultBrushSize;
    signaturePad.maxWidth = defaultBrushSize;
    brushSizeInput.value = defaultBrushSize;

    // Reset angle to default (0)
    var defaultAngle = 0;
    angleInput.value = defaultAngle;
    canvas.style.transform = 'rotate(' + defaultAngle + 'deg)';
    
    // Clear the rotation on the canvas
    var ctx = canvas.getContext('2d');
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    // Clear the signature pad
    signaturePad.clear();
    
}
