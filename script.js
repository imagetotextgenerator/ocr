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
        };
        reader.readAsDataURL(imageFile);

        // Show Loader
        loader.classList.remove('hidden');
        output.classList.add('hidden');

        // Process OCR
        Tesseract.recognize(
            imageFile,
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
    } else {
        alert("Please select an image.");
    }
});
