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

            console.log("Starting OCR...");
            Tesseract.recognize(
                imageFile,
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
        };
        reader.readAsDataURL(imageFile);
    } else {
        alert("Please select an image.");
    }
});
