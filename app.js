// document.addEventListener("DOMContentLoaded", function() {
//     const canvas = document.getElementById("canvas");
//     const ctx = canvas.getContext("2d");
//     const colorPicker = document.getElementById("colorPicker");
//     const brushSize = document.getElementById("brushSize");
//     const angleInput = document.getElementById("angle");
//     const clearBtn = document.getElementById("clearBtn");
//     const downloadBtn = document.getElementById("downloadBtn");
    
//     let isDrawing = false;
//     let lastX = 0;
//     let lastY = 0;
//     let hue = 0;
    
//     canvas.width = window.innerWidth - 20;
//     canvas.height = window.innerHeight - 20;
//     ctx.lineJoin = "round";
//     ctx.lineCap = "round";
    
//     function draw(e) {
//         if (!isDrawing) return;
//         ctx.strokeStyle = colorPicker.value;
//         ctx.lineWidth = brushSize.value;
//         ctx.beginPath();
//         ctx.moveTo(lastX, lastY);
//         ctx.lineTo(e.offsetX, e.offsetY);
//         ctx.stroke();
//         [lastX, lastY] = [e.offsetX, e.offsetY];
//         hue++;
//         ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`;
//     }
    
//     canvas.addEventListener("mousedown", (e) => {
//         isDrawing = true;
//         [lastX, lastY] = [e.offsetX, e.offsetY];
//     });
    
//     canvas.addEventListener("mousemove", draw);
//     canvas.addEventListener("mouseup", () => isDrawing = false);
//     canvas.addEventListener("mouseout", () => isDrawing = false);
    
//     clearBtn.addEventListener("click", () => {
//         ctx.clearRect(0, 0, canvas.width, canvas.height);
//     });

//     downloadBtn.addEventListener("click", () => {
//         const dataUrl = canvas.toDataURL('image/png');
//         const link = document.createElement('a');
//         link.href = dataUrl;
//         link.download = 'drawing.png';
//         link.click();
//     });

//     angleInput.addEventListener("input", () => {
//         canvas.style.transform = `rotate(${angleInput.value}deg)`;
//     });
// });


document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const colorPicker = document.getElementById("colorPicker");
    const brushSize = document.getElementById("brushSize");
    const angleInput = document.getElementById("angle");
    const clearBtn = document.getElementById("clearBtn");
    const downloadBtn = document.getElementById("downloadBtn");
    const cursorOverlay = document.createElement("div");
    cursorOverlay.classList.add("cursor-overlay");
    document.body.appendChild(cursorOverlay);

    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
    let hue = 0;
    
    canvas.width = window.innerWidth - 20;
    canvas.height = window.innerHeight - 20;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    
    function draw(e) {
        if (!isDrawing) return;
        ctx.strokeStyle = colorPicker.value;
        ctx.lineWidth = brushSize.value;
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
        [lastX, lastY] = [e.offsetX, e.offsetY];
        hue++;
        ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`;

        // Adjust the cursor position
        cursorOverlay.style.left = `${e.pageX - brushSize.value / 2}px`;
        cursorOverlay.style.top = `${e.pageY - brushSize.value / 2}px`;
    }
    
    canvas.addEventListener("mousedown", (e) => {
        isDrawing = true;
        [lastX, lastY] = [e.offsetX, e.offsetY];
    });
    
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", () => isDrawing = false);
    canvas.addEventListener("mouseout", () => isDrawing = false);
    
    clearBtn.addEventListener("click", () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    // downloadBtn.addEventListener("click", () => {
    //     const dataUrl = canvas.toDataURL('image/png');
    //     const link = document.createElement('a');
    //     link.href = dataUrl;
    //     link.download = 'drawing.png';
    //     link.click();
    // });

    downloadBtn.addEventListener("click", () => {
        const dataUrl = rotateAndExportCanvas();
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'drawing.png';
        link.click();
    });

    function rotateAndExportCanvas() {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');

    // Rotate the temporary canvas context
    tempCtx.translate(canvas.width / 2, canvas.height / 2);
    tempCtx.rotate(angleInput.value * Math.PI / 180);
    tempCtx.translate(-canvas.width / 2, -canvas.height / 2);
    tempCtx.drawImage(canvas, 0, 0);

    // Export the rotated canvas as data URL
    return tempCanvas.toDataURL('image/png');
}

    angleInput.addEventListener("input", () => {
        canvas.style.transform = `rotate(${angleInput.value}deg)`;
    });
});
