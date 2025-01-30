document.getElementById('imageInput').addEventListener('change', function (event) {
    let imageFile = event.target.files[0];
    if (imageFile) {
        processImage(imageFile);
    }
});

document.getElementById('fetchBtn').addEventListener('click', function () {
    let imageUrl = document.getElementById('imageUrl').value.trim();
    if (imageUrl) {
        processImage(imageUrl);
    } else {
        alert("Please enter a valid image URL.");
    }
});

function processImage(imageSource) {
    let preview = document.getElementById('preview');
    let output = document.getElementById('output');
    let loader = document.getElementById('loader');

    // Hide Output
    output.classList.add('hidden');
    loader.classList.remove('hidden');

    if (typeof imageSource === "string") {
        // If it's a URL
        let proxyUrl = "https://cors-anywhere.herokuapp.com/";
        let finalUrl = proxyUrl + imageSource; // Use the proxy URL to bypass CORS issue

        preview.src = imageSource;
        preview.classList.remove('hidden');

        // Recognize text from the image using Tesseract.js
        Tesseract.recognize(finalUrl, 'eng', { logger: (m) => console.log(m) })
            .then(({ data: { text } }) => {
                loader.classList.add('hidden');
                output.innerText = text;
                output.classList.remove('hidden');
            })
            .catch(err => {
                loader.classList.add('hidden');
                alert("Error: " + err.message);
            });
    } else {
        // If it's a file (upload image)
        let reader = new FileReader();
        reader.onload = function (e) {
            preview.src = e.target.result;
            preview.classList.remove('hidden');

            Tesseract.recognize(imageSource, 'eng', { logger: (m) => console.log(m) })
                .then(({ data: { text } }) => {
                    loader.classList.add('hidden');
                    output.innerText = text;
                    output.classList.remove('hidden');
                })
                .catch(err => {
                    loader.classList.add('hidden');
                    alert("Error: " + err.message);
                });
        };
        reader.readAsDataURL(imageSource);
    }
}
