document.getElementById("imageInput").addEventListener("change", function(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function() {
        document.getElementById("loading").style.display = "block";

        Tesseract.recognize(reader.result, 'eng', {
            logger: (m) => console.log(m)
        }).then(({ data: { text } }) => {
            document.getElementById("loading").style.display = "none";
            document.getElementById("output").innerHTML = `<h3>Extracted Text:</h3><p>${text}</p>`;
        }).catch(err => {
            document.getElementById("loading").style.display = "none";
            document.getElementById("output").innerHTML = `<p style="color:red;">Error: ${err.message}</p>`;
        });
    };
    reader.readAsDataURL(file);
});
