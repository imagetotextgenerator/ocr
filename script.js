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

            // Wait for OpenCV to load, then process the image
            setTimeout(() => {
                processImage(preview);
            }, 500);
        };
        reader.readAsDataURL(imageFile);
    } else {
        alert("Please select an image.");
    }
});

function processImage(imgElement) {
    let output = document.getElementById('output');
    let loader = document.getElementById('loader');

    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");

    canvas.width = imgElement.width;
    canvas.height = imgElement.height;
    ctx.drawImage(imgElement, 0, 0, canvas.width, canvas.height);

    let src = cv.imread(canvas);
    let dst = new cv.Mat();

    // **Apply Grayscale Conversion**
    cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY, 0);

    // **Increase Contrast**
    cv.equalizeHist(dst, dst);

    // **Thresholding (Better OCR Readability)**
    cv.threshold(dst, dst, 0, 255, cv.THRESH_BINARY | cv.THRESH_OTSU);

    // Convert back to canvas
    cv.imshow(canvas, dst);

    // Cleanup OpenCV memory
    src.delete();
    dst.delete();

    let processedImg = canvas.toDataURL("image/png");

    // **Run OCR on Processed Image**
    loader.classList.remove('hidden');
    output.classList.add('hidden');

    Tesseract.recognize(
        processedImg,
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
