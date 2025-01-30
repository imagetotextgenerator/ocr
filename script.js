function processImage(imageElement) {
    console.log("Processing Image...");
    let output = document.getElementById('output');
    let loader = document.getElementById('loader');

    let src = cv.imread(imageElement);
    let dst = new cv.Mat();

    console.log("Applying Grayscale...");
    cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);

    console.log("Applying Sharpening...");
    let kernel = cv.matFromArray(3, 3, cv.CV_32F, [-1, -1, -1, -1, 9, -1, -1, -1, -1]);
    cv.filter2D(dst, dst, -1, kernel);

    console.log("Applying Thresholding...");
    cv.adaptiveThreshold(dst, dst, 255, cv.ADAPTIVE_THRESH_GAUSSIAN_C, cv.THRESH_BINARY, 11, 2);

    console.log("Showing Processed Image...");
    cv.imshow(imageElement, dst);

    src.delete();
    dst.delete();
    kernel.delete();

    console.log("Starting OCR...");
    Tesseract.recognize(
        imageElement,
        'eng',
        { logger: (m) => console.log(m) }
    ).then(({ data: { text } }) => {
        console.log("OCR Result:", text);
        loader.classList.add('hidden');
        output.innerText = text;
        output.classList.remove('hidden');
    }).catch(err => {
        console.error("OCR Error:", err.message);
        loader.classList.add('hidden');
        alert("Error: " + err.message);
    });
}
