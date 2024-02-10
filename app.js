document.addEventListener("DOMContentLoaded", function() {
    const drawingArea = document.getElementById("drawingArea");
    const colorPicker = document.getElementById("colorPicker");
    const brushSize = document.getElementById("brushSize");
    const angleInput = document.getElementById("angle"); // New: Angle input element
    const clearBtn = document.getElementById("clearBtn");
    const downloadBtn = document.getElementById("downloadBtn");
    const colorButtons = document.querySelectorAll('.color-btn');

    let isDrawing = false;
    let currentColor = colorPicker.value;
    let currentAngle = angleInput.value; // New: Store current angle
    let currentFontSize = brushSize.value; // New: Store current font size
    let lastX = 0; // Initialize lastX
    let lastY = 0; // Initialize lastY
    let paths = []; // Store path elements

    // function startDrawing(e) {
    //     isDrawing = true;
    //     const svgPoint = drawingArea.createSVGPoint();
    //     svgPoint.x = e.clientX;
    //     svgPoint.y = e.clientY;
    //     const point = svgPoint.matrixTransform(drawingArea.getScreenCTM().inverse());
    //     lastX = point.x; // Update lastX
    //     lastY = point.y; // Update lastY

    //     // Create path element and set its attributes
    //     const pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
    //     pathElement.setAttribute("stroke", currentColor);
    //     pathElement.setAttribute("stroke-width", currentFontSize);
    //     pathElement.setAttribute("stroke-linecap", "round");
    //     pathElement.setAttribute("fill", "none");
    //     pathElement.setAttribute("d", `M ${lastX},${lastY}`); // Initialize path data
    //     drawingArea.appendChild(pathElement); // Append path element to drawing area
    //     paths.push(pathElement); // Add path element to the array
    // }
    function startDrawing(e) {
        isDrawing = true;
        const svgPoint = drawingArea.createSVGPoint();
        svgPoint.x = e.clientX;
        svgPoint.y = e.clientY;
        const point = svgPoint.matrixTransform(drawingArea.getScreenCTM().inverse());
        lastX = point.x; // Update lastX
        lastY = point.y; // Update lastY
    
        // Create path element and set its attributes
        const pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
        pathElement.setAttribute("stroke", currentColor);
        pathElement.setAttribute("stroke-width", currentFontSize);
        pathElement.setAttribute("stroke-linecap", "round");
        pathElement.setAttribute("fill", "none");
        pathElement.setAttribute("d", `M ${lastX},${lastY}`); // Initialize path data
        drawingArea.appendChild(pathElement); // Append path element to drawing area
        paths.push(pathElement); // Add path element to the array
    }

    function draw(e) {
        if (!isDrawing) return;

        const svgPoint = drawingArea.createSVGPoint();
        svgPoint.x = e.clientX;
        svgPoint.y = e.clientY;
        const point = svgPoint.matrixTransform(drawingArea.getScreenCTM().inverse());

        // Update the path data for the ongoing drawing
        const newPathData = `${paths[paths.length - 1].getAttribute("d")} L ${point.x},${point.y}`;
        paths[paths.length - 1].setAttribute("d", newPathData);

        // Update lastX and lastY for the next stroke
        lastX = point.x;
        lastY = point.y;
    }

    function endDrawing() {
        isDrawing = false;
    }

    function clearDrawing() {
        // Remove all path elements from the drawing area
        drawingArea.innerHTML = '';
        paths = []; // Clear the paths array
    }

    function downloadDrawing() {
        const svgData = new XMLSerializer().serializeToString(drawingArea);
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        const img = new Image();

        img.onload = function() {
            canvas.width = drawingArea.getBoundingClientRect().width;
            canvas.height = drawingArea.getBoundingClientRect().height;
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
        paths.forEach(path => {
            path.setAttribute("stroke", currentColor); // Update stroke color
        });
    }

    function setColorFromButton(button) {
        currentColor = button.style.backgroundColor;
        paths.forEach(path => {
            path.setAttribute("stroke", currentColor); // Update stroke color
        });
    }

    function updateAngle() {
        currentAngle = angleInput.value;
        rotatePaths(currentAngle); // Rotate all paths when angle changes
    }

    function updateFontSize() {
        currentFontSize = brushSize.value;
        paths.forEach(path => {
            path.setAttribute("stroke-width", currentFontSize); // Update stroke width
        });
    }

    //  function rotatePaths(angle) {
    //     drawingArea.style.transform = `rotate(${angle}deg)`;
    //  }

    function rotatePaths(angle) {
        // Calculate the center of the drawing area
        const centerX = drawingArea.clientWidth / 2;
        const centerY = drawingArea.clientHeight / 2;
    
        // Apply the rotation to each path around the center of the drawing area
        paths.forEach(path => {
            path.style.transformOrigin = `${centerX}px ${centerY}px`; // Set rotation origin
            path.style.transform = `rotate(${angle}deg)`; // Apply rotation to each path
        });
    }
    // function rotatePaths(angle) {
    //     // Calculate the bounding box of all paths
    //     const bbox = drawingArea.getBBox();
    //     const centerX = bbox.x + bbox.width / 2;
    //     const centerY = bbox.y + bbox.height / 2;
    
    //     // Set the rotation origin to the center of the bounding box
    //     drawingArea.setAttribute("transform", `rotate(${angle}, ${centerX}, ${centerY})`);
    // }


    
    drawingArea.addEventListener("mousedown", startDrawing);
    drawingArea.addEventListener("mousemove", draw);
    drawingArea.addEventListener("mouseup", endDrawing);
    drawingArea.addEventListener("mouseleave", endDrawing);
    clearBtn.addEventListener("click", clearDrawing);
    downloadBtn.addEventListener("click", downloadDrawing);
    colorPicker.addEventListener("input", setColorFromPicker); // Update stroke color on input change
    angleInput.addEventListener("input", updateAngle); // New: Listen for angle input changes
    brushSize.addEventListener("input", updateFontSize); // New: Listen for font size input changes
    colorButtons.forEach(button => {
        button.addEventListener("click", () => setColorFromButton(button));
    });
});
