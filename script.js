function processImage(imageSrc) {
    let output = document.getElementById('output');
    let loader = document.getElementById('loader');

    let img = new Image();
    img.src = imageSrc;
    img.onload = function () {
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Convert to OpenCV Mat
        let src = cv.imread(canvas);
        let dst = new cv.Mat();

        // Convert to Grayscale
        cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY, 0);

        // Apply Thresholding to enhance text
        cv.adaptiveThreshold(dst, dst, 255, cv.ADAPTIVE_THRESH_GAUSSIAN_C, cv.THRESH_BINARY, 11, 2);

        // Convert back to Image
        cv.imshow(canvas, dst);

        // Run OCR on processed image
        let processedImg = canvas.toDataURL("image/png");

        // Clean up OpenCV Mats
        src.delete();
        dst.delete();

        // Show loader
        loader.classList.remove('hidden');
        output.classList.add('hidden');

        Tesseract.recognize(
            processedImg,
            'eng',
            {
                logger: (m) => console.log(m)
            }
        ).then(({ data: { text } }) => {
            loader.classList.add('hidden');
            output.innerText = text;
            output.classList.remove('hidden');
        }).catch(err => {
            loader.classList.add('hidden');
            alert("Error: " + err.message);
        });
    };
}
