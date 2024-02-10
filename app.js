
document.addEventListener("DOMContentLoaded", function() {
    const drawingArea = document.getElementById("drawingArea");
    const svgWrapper = document.getElementById("svgWrapper"); // New: Get svgWrapper element
    const colorPicker = document.getElementById("colorPicker");
    const brushSize = document.getElementById("brushSize");
    const angleInput = document.getElementById("angle"); // New: Angle input element
    const clearBtn = document.getElementById("clearBtn");
    const downloadBtn = document.getElementById("downloadBtn");
    const colorButtons = document.querySelectorAll('.color-btn');

    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
    let currentColor = colorPicker.value;
    let currentAngle = angleInput.value; // New: Store current angle
    let currentFontSize = brushSize.value; // New: Store current font size
    
    function startDrawing(e) {
        isDrawing = true;
        const svgPoint = drawingArea.createSVGPoint();
        svgPoint.x = e.clientX;
        svgPoint.y = e.clientY;
        const point = svgPoint.matrixTransform(drawingArea.getScreenCTM().inverse());
        lastX = point.x;
        lastY = point.y;
    }

    function draw(e) {
        if (!isDrawing) return;
        
        const svgPoint = drawingArea.createSVGPoint();
        svgPoint.x = e.clientX;
        svgPoint.y = e.clientY;
        const point = svgPoint.matrixTransform(drawingArea.getScreenCTM().inverse());
        
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", lastX);
        line.setAttribute("y1", lastY);
        line.setAttribute("x2", point.x);
        line.setAttribute("y2", point.y);
        line.setAttribute("stroke", currentColor);
        line.setAttribute("stroke-width", currentFontSize); // Updated: Use current font size
        line.setAttribute("stroke-linecap", "round");
        
        drawingArea.appendChild(line);

        lastX = point.x;
        lastY = point.y;
    }

    function endDrawing() {
        isDrawing = false;
    }

    function clearDrawing() {
        drawingArea.innerHTML = '';
    }
    function downloadDrawing() {
        const svgData = new XMLSerializer().serializeToString(svgWrapper.querySelector("svg")); // Change to select the svg element within svgWrapper
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        const img = new Image();
    
        img.onload = function() {
            canvas.width = svgWrapper.getBoundingClientRect().width; // Change to svgWrapper
            canvas.height = svgWrapper.getBoundingClientRect().height; // Change to svgWrapper
            context.drawImage(img, 0, 0);
    
            const dataUrl = canvas.toDataURL("image/png");
            const link = document.createElement("a");
            link.href = dataUrl;
            link.download = "drawing.png";
            link.click();
        };
    
        img.src = "data:image/svg+xml;base64," + btoa(svgData);
    }

    function setColorFromPicker() {
        currentColor = colorPicker.value;
        updateStrokeColor();
    }

    function setColorFromButton(button) {
        currentColor = button.style.backgroundColor;
        updateStrokeColor();
    }

    function updateStrokeColor() {
        const lines = drawingArea.querySelectorAll("line");
        lines.forEach(line => {
            line.setAttribute("stroke", currentColor);
        });
    }

    function updateAngle() {
        currentAngle = angleInput.value;
        drawingArea.style.transform = `rotate(${currentAngle}deg)`; // Apply rotation to drawing area
    }

    function updateFontSize() {
        currentFontSize = brushSize.value;
    }

    drawingArea.addEventListener("mousedown", startDrawing);
    drawingArea.addEventListener("mousemove", draw);
    drawingArea.addEventListener("mouseup", endDrawing);
    drawingArea.addEventListener("mouseleave", endDrawing);
    clearBtn.addEventListener("click", clearDrawing);
    downloadBtn.addEventListener("click", downloadDrawing);
    colorPicker.addEventListener("input", setColorFromPicker);
    angleInput.addEventListener("input", updateAngle); // New: Listen for angle input changes
    brushSize.addEventListener("input", updateStrokeWidth);
    function updateStrokeWidth() {
        currentFontSize = brushSize.value;
        const lines = drawingArea.querySelectorAll("line");
        lines.forEach(line => {
            line.setAttribute("stroke-width", currentFontSize);
        });
    }
    colorButtons.forEach(button => {
        button.addEventListener("click", () => setColorFromButton(button));
    });
});
