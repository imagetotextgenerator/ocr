document.getElementById('imageInput').addEventListener('change', function (event) {
    let imageFile = event.target.files[0];
    let preview = document.getElementById('preview');
    let output = document.getElementById('output');
    let loader = document.getElementById('loader');

    if (imageFile) {
        let reader = new FileReader();
        reader.onload = function (e) {
            preview.src = e.target.result;
            preview.classList.remove('hidden');

            // Process the image after loading OpenCV
            preview.onload = function () {
                processImage(preview);
            };
        };
        reader.readAsDataURL(imageFile);

        // Show Loader
        loader.classList.remove('hidden');
        output.classList.add('hidden');
    } else {
        alert("Please select an image.");
    }
});

function processImage(imageElement) {
    let output = document.getElementById('output');
    let loader = document.getElementById('loader');

    let src = cv.imread(imageElement);
    let dst = new cv.Mat();

    // Convert to grayscale
    cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);

    // Apply sharpening filter
    let kernel = cv.matFromArray(3, 3, cv.CV_32F, [-1, -1, -1, -1, 9, -1, -1, -1, -1]);
    cv.filter2D(dst, dst, -1, kernel);

    // Apply adaptive thresholding
    cv.adaptiveThreshold(dst, dst, 255, cv.ADAPTIVE_THRESH_GAUSSIAN_C, cv.THRESH_BINARY, 11, 2);

    // Save enhanced image to canvas for OCR
    cv.imshow(imageElement, dst);

    // Cleanup
    src.delete();
    dst.delete();
    kernel.delete();

    // Start OCR
    Tesseract.recognize(
        imageElement,
        'eng',
        { logger: (m) => console.log(m) }
    ).then(({ data: { text } }) => {
        loader.classList.add('hidden');
        output.innerText = text;
        output.classList.remove('hidden');
    }).catch(err => {
        loader.classList.add('hidden');
        alert("Error: " + err.message);
    });
}
