var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
var imageData;
var widthInput = document.getElementById("widthInput");
var heightInput = document.getElementById("heightInput");
var imageComponent = document.getElementById("selectedImage");
var inputWidth = 0;
var inputHeight = 0;
document.getElementById("fileInput").onchange = function (evt) {
    var tgt = evt.target || window.event.srcElement,
        files = tgt.files;
    // FileReader support
    if (FileReader && files && files.length) {
        var fr = new FileReader();
        fr.onload = () => showImage(fr);
        fr.readAsDataURL(files[0]);
    }
}

document.getElementById("widthInput").onchange = function (evt) {
    setImageDimensions();
}

document.getElementById("heightInput").onchange = function (evt) {
    setImageDimensions();
}

function showImage(fileReader) {
    imageComponent.onload = () => getImageData(imageComponent);
    imageComponent.src = fileReader.result;
}

function setImageDimensions() {
    imageComponent.width = outputWidth = parseInt(widthInput.value);
    imageComponent.height = outputHeight = parseInt(heightInput.value);
}

function getImageData(image) {
    setImageDimensions();
    ctx.drawImage(imageComponent, 0, 0, outputWidth, outputHeight);
    imageData = ctx.getImageData(0, 0, outputWidth, outputHeight);
}

function generateBlueprint(evt) {
    if(imageData) {
        getImageData();
        var blocks = [];
        var pixels = imageData.data;
        var imageWidth = imageData.width;
        for(var i = 0; i < pixels.length; i += 4) {
            var x = (i / 4) % imageWidth;
            var y = Math.floor((i / 4) / imageWidth);
            var r = pixels[i].toString(16);
            if(r.length == 1) r = "0" + r;
            var g = pixels[i + 1].toString(16);
            if(g.length == 1) g = "0" + g;
            var b = pixels[i + 2].toString(16);
            if(b.length == 1) b = "0" + b;
            blocks.push(getBlock(x, y, r + g + b));
        }
        var base = getBase(blocks);
        document.getElementById("result").value = JSON.stringify(base);
    }
}

function getBlock(x, y, color) {
    return {
      bounds: {
        x: 1,
        y: 1,
        z: 1
      },
      color: "#" + color,
      pos: {
        x: x,
        y: y,
        z: 0
      },
      shapeId: "f0cba95b-2dc4-4492-8fd9-36546a4cb5aa",
      xaxis: 1,
      zaxis: 3
    };
}

function getBase(blocks) {
    return {
            bodies: [
               {
                   childs: blocks
               }
            ],
            version: 3
          };
}
