

const inputText = document.getElementById('inputText');
const fontType = document.getElementById('fontType');
const colorPicker = document.getElementById('colorPicker');
const signatureList = document.getElementById('signatureList');
const colorButtons = document.querySelectorAll('.color-btn'); // Select all color buttons

const serifFonts = [
    'Bad Script', 'Bilbo Swash Caps', 'Caveat', 'Covered By Your Grace',
    'Dancing Script', 'La Belle Aurore', 'Marck Script', 'Nothing You Could Do', 'Stalemate'
];

const sansSerifFonts = [
    'Dm Sans', 'Dosis', 'Inter', 'Karla', 'Lato', 'Manjari', 'Monrope', 'Montserrat', 'Mulish'
];

function generateSignatures() {
    signatureList.innerHTML = '';
    const text = inputText.value.trim();
    const color = colorPicker.value;
    const selectedFont = fontType.value;

    let fontsToUse = [];
    if (selectedFont === 'handwriting') {
        fontsToUse = serifFonts;
    } else if (selectedFont === 'sans-serif') {
        fontsToUse = sansSerifFonts;
    }

    if (text.length > 0) {
        fontsToUse.forEach(font => {
            const signatureItem = document.createElement('div');
            signatureItem.classList.add('signature-item');

            const header = document.createElement('div');
            header.classList.add('header');

            const signatureTitle = document.createElement('div');
            signatureTitle.classList.add('signature-title');
            signatureTitle.textContent = font;
            header.appendChild(signatureTitle);

            const signature = document.createElement('div');
            signature.style.fontFamily = font; // Set font dynamically
            signature.style.fontSize = '56.25px';
            signature.textContent = text;
            signature.style.color = color; // Apply custom color
            signature.classList.add('signature-description');
            header.appendChild(signature);

            signatureItem.appendChild(header);


            const footer = document.createElement('div');
            footer.classList.add('footer');

            const downloadLink = document.createElement('a');
            // Convert text to PNG image with specified color
            downloadLink.href = `data:image/png;base64,${generatePNG(text, font, color)}`;
            downloadLink.download = `signature_${font.replaceAll(' ', '_')}.png`;
            downloadLink.textContent = 'Download Signature';
            downloadLink.classList.add('download-btn');
            footer.appendChild(downloadLink);

            signatureItem.appendChild(footer);

            signatureList.appendChild(signatureItem);
        });
    }
}

function generatePNG(text, font, color) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    // Set font size and style
    context.font = `56.25px ${font}`; // Include font family here

    // Measure text dimensions
    const textMetrics = context.measureText(text);

    // Add padding to the canvas width and height
    const padding = 24; // Adjust as needed
    

    // Clear canvas and draw text
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = color;
    context.font = `${font}`; // Include font family here
    context.fillText(text, padding, canvas.height / 2);

    return canvas.toDataURL().replace(/^data:image\/(png|jpg);base64,/, '');
}

function clearData() {
    inputText.value = '';
    signatureList.innerHTML = '';
}

inputText.addEventListener('input', generateSignatures);
fontType.addEventListener('change', generateSignatures);
colorPicker.addEventListener('input', generateSignatures);
// Add event listeners to color buttons
colorButtons.forEach(button => {
    button.addEventListener('click', function() {
        const buttonColor = button.style.backgroundColor;
        const hexColor = rgbToHex(buttonColor); // Convert RGB to hex color
        colorPicker.value = hexColor; // Update color picker value with hex color
        generateSignatures(); // Regenerate signatures with the new color
    });
});

// Function to convert RGB color to hexadecimal format
function rgbToHex(rgb) {
    // Split the RGB values and convert them to hexadecimal
    const [r, g, b] = rgb.match(/\d+/g);
    return "#" + ((1 << 24) + (parseInt(r) << 16) + (parseInt(g) << 8) + parseInt(b)).toString(16).slice(1);
}

// Initial signature generation on page load
generateSignatures();
