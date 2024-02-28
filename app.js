document.addEventListener('DOMContentLoaded', function () {
  const drawingArea = document.getElementById('drawingArea');
  const colorPicker = document.getElementById('colorPicker');
  const brushSize = document.getElementById('brushSize');
  const angleInput = document.getElementById('angle');
  const clearBtn = document.getElementById('clearBtn');
  const downloadBtn = document.getElementById('downloadBtn');
  const colorButtons = document.querySelectorAll('.color-btn');

  let isDrawing = false;
  let currentColor = colorPicker.value;
  let currentFontSize = brushSize.value;
  let points = [];
  let pathString = ''; // Declare pathString outside of any function

  function startDrawing(e) {
      isDrawing = true;
      const point = getEventPoint(e);
      points.push(point); // Add the initial point
      pathString = `M ${point.x},${point.y} `; // Move to the initial point
  }

  function draw(e) {
      e.preventDefault();
      if (!isDrawing) return;
      const point = getEventPoint(e);
      points.push(point); // Add the current point
      updatePathString(point); // Update the path string
      redraw(); // Redraw all paths
  }

  function endDrawing() {
      isDrawing = false;
  }

  function updatePathString(point) {
      // Calculate control points for Bezier curve
      const lastPoint = points[points.length - 2];
      if (lastPoint) {
          const xc = (lastPoint.x + point.x) / 2;
          const yc = (lastPoint.y + point.y) / 2;
          pathString += `Q ${lastPoint.x},${lastPoint.y} ${xc},${yc} `;
      }
  }

  function redraw() {
      // Clear the drawing area
      drawingArea.innerHTML = '';

      // Create a new path element
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("stroke", currentColor);
      path.setAttribute("stroke-width", currentFontSize);
      path.setAttribute("fill", "none");
      path.setAttribute("d", pathString);
      path.setAttribute("transform", `rotate(${angleInput.value} ${drawingArea.clientWidth / 2} ${drawingArea.clientHeight / 2})`); // Apply rotation

      // Append the path to the SVG
      drawingArea.appendChild(path);
  }

  function getEventPoint(e) {
      const svgPoint = drawingArea.createSVGPoint();
      svgPoint.x = e.clientX || e.touches[0].clientX;
      svgPoint.y = e.clientY || e.touches[0].clientY;
      return svgPoint.matrixTransform(drawingArea.getScreenCTM().inverse());
  }

  drawingArea.addEventListener('mousedown', startDrawing);
  drawingArea.addEventListener('touchstart', startDrawing);
  drawingArea.addEventListener('mousemove', draw);
  drawingArea.addEventListener('touchmove', draw);
  drawingArea.addEventListener('mouseup', endDrawing);
  drawingArea.addEventListener('touchend', endDrawing);
  drawingArea.addEventListener('mouseleave', endDrawing); // Stop drawing when cursor leaves drawing area

  clearBtn.addEventListener('click', function () {
    // Reset color to default
    colorPicker.value = '#000000'; // Set default color
    currentColor = colorPicker.value;
    
    // Reset brush size to default
    brushSize.value = '5'; // Set default brush size
    currentFontSize = brushSize.value;
    
    // Reset rotation angle to default
    angleInput.value = '0'; // Set default angle
    redraw(); // Redraw with default angle
    
    // Clear the path string and points array
    pathString = '';
    points = [];
    
    // Clear the drawing area
    drawingArea.innerHTML = '';
});


  downloadBtn.addEventListener('click', function () {
      const svgData = new XMLSerializer().serializeToString(drawingArea);
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      const img = new Image();

      img.onload = function () {
          canvas.width = drawingArea.getBoundingClientRect().width;
          canvas.height = drawingArea.getBoundingClientRect().height;
          context.drawImage(img, 0, 0);

          const dataUrl = canvas.toDataURL('image/png');
          const link = document.createElement('a');
          link.href = dataUrl;
          link.download = 'drawing.png';
          link.click();
      };

      img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  });

  colorPicker.addEventListener('input', function () {
      currentColor = colorPicker.value;
      redraw(); // Redraw to update the color
  });

  brushSize.addEventListener('input', function () {
      currentFontSize = brushSize.value;
      redraw(); // Redraw to update the brush size
  });

  angleInput.addEventListener('input', function () {
      redraw(); // Redraw to update the rotation angle
  });

  colorButtons.forEach((button) => {
      button.addEventListener('click', function () {
          currentColor = button.style.backgroundColor;
          redraw(); // Redraw to update the color
      });
  });
});
