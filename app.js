document.addEventListener('DOMContentLoaded', function () {
  const drawingArea = document.getElementById('drawingArea')
  const colorPicker = document.getElementById('colorPicker')
  const brushSize = document.getElementById('brushSize')
  const angleInput = document.getElementById('angle')
  const clearBtn = document.getElementById('clearBtn')
  const downloadBtn = document.getElementById('downloadBtn')
  const colorButtons = document.querySelectorAll('.color-btn')

  let isDrawing = false
  let currentColor = colorPicker.value
  let currentAngle = angleInput.value
  let currentFontSize = brushSize.value
  let lastX = 0
  let lastY = 0
  let paths = []
  function startDrawing(e) {
    isDrawing = true
    const svgPoint = drawingArea.createSVGPoint()
    svgPoint.x = e.clientX
    svgPoint.y = e.clientY
    const point = svgPoint.matrixTransform(drawingArea.getScreenCTM().inverse())
    lastX = point.x
    lastY = point.y

    const pathElement = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'path',
    )
    pathElement.setAttribute('stroke', currentColor)
    pathElement.setAttribute('stroke-width', currentFontSize)
    pathElement.setAttribute('stroke-linecap', 'round')
    pathElement.setAttribute('fill', 'none')
    pathElement.setAttribute('d', `M ${lastX},${lastY}`)
    drawingArea.appendChild(pathElement)
    paths.push(pathElement)
  }

  function draw(e) {
    if (!isDrawing) return

    const svgPoint = drawingArea.createSVGPoint()
    svgPoint.x = e.clientX
    svgPoint.y = e.clientY
    const point = svgPoint.matrixTransform(drawingArea.getScreenCTM().inverse())
    const newPathData = `${paths[paths.length - 1].getAttribute('d')} L ${
      point.x
    },${point.y}`
    paths[paths.length - 1].setAttribute('d', newPathData)
    lastX = point.x
    lastY = point.y
  }

  function endDrawing() {
    isDrawing = false
  }

  function clearDrawing() {
    drawingArea.innerHTML = ''
    paths = []
  }

  function downloadDrawing() {
    const svgData = new XMLSerializer().serializeToString(drawingArea)
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    const img = new Image()

    img.onload = function () {
      canvas.width = drawingArea.getBoundingClientRect().width
      canvas.height = drawingArea.getBoundingClientRect().height
      context.drawImage(img, 0, 0)

      const dataUrl = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.href = dataUrl
      link.download = 'drawing.png'
      link.click()
    }

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData)
  }

  function setColorFromPicker() {
    currentColor = colorPicker.value
    paths.forEach((path) => {
      path.setAttribute('stroke', currentColor)
    })
  }

  function setColorFromButton(button) {
    currentColor = button.style.backgroundColor
    paths.forEach((path) => {
      path.setAttribute('stroke', currentColor)
    })
  }

  function updateAngle() {
    currentAngle = angleInput.value
    rotatePaths(currentAngle)
  }

  function updateFontSize() {
    currentFontSize = brushSize.value
    paths.forEach((path) => {
      path.setAttribute('stroke-width', currentFontSize)
    })
  }

  function rotatePaths(angle) {
    const centerX = drawingArea.clientWidth / 2
    const centerY = drawingArea.clientHeight / 2
    paths.forEach((path) => {
      path.style.transformOrigin = `${centerX}px ${centerY}px`
      path.style.transform = `rotate(${angle}deg)`
    })
  }

  drawingArea.addEventListener('mousedown', startDrawing)
  drawingArea.addEventListener('mousemove', draw)
  drawingArea.addEventListener('mouseup', endDrawing)
  drawingArea.addEventListener('mouseleave', endDrawing)
  clearBtn.addEventListener('click', clearDrawing)
  downloadBtn.addEventListener('click', downloadDrawing)
  colorPicker.addEventListener('input', setColorFromPicker)
  angleInput.addEventListener('input', updateAngle)
  brushSize.addEventListener('input', updateFontSize)
  colorButtons.forEach((button) => {
    button.addEventListener('click', () => setColorFromButton(button))
  })
})
