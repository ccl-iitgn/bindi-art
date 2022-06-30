let img;
let scl = 0.4;
let size;
let noOfBindis = 3;
let block;
let num = 0;
let mode;

function preload() {
  // img = loadImage("Skull.png");
  img = loadImage("gandhiji.png");
  // img = loadImage("Gandhiji.png");
  // img = loadImage("woman.png");
  // img = loadImage("Monkey.png");
  // img = loadImage("Sandeep.png");
}

function setup() {
  frameRate(1);
  let cnv = createCanvas((w = 2478 * scl), (h = 3504 * scl));
  cnv.position(300, 0);

  img.resize(img.width <= img.height ? w : 0, img.width > img.height ? w : 0);
  img.loadPixels();
  img.updatePixels();

  settings = QuickSettings.create(0, 0, "Settings");
  settings.setWidth(300);

  settings.addHTML(
    "Choose Image",
    "<input accept='.png, .jpg, .jpeg' type='file' id='upload' onchange='handleFile()'/>"
  );
  settings.addDropDown("Sizes", [5, 4, 3, 2, 1], restart);
  settings.addDropDown("Output", ["Bindis", "Sizes"], restart);
  settings.addBoolean("Fill", 1, restart);
  settings.addButton("Export", exportA4);
  settings.overrideStyle("Export", "width", "280px");
  settings.overrideStyle("Export", "background-color", "#000000");
  settings.overrideStyle("Export", "color", "white");

  textAlign(CENTER, CENTER);
  textSize(14);
}

function draw() {
  background(255);
  makeBindiArt();
  console.log(num);
  num = 0;
  noLoop();
}

function makeBindiArt() {
  img.resize(img.width <= img.height ? w : 0, img.width > img.height ? w : 0);
  img.loadPixels();
  img.updatePixels();

  size = 60 * scl;
  noOfBindis = int(settings.getValue("Sizes").value);
  block = size / (noOfBindis + 1);

  //---------------------------------------------------------//
  //---------------------👇🏼SUB-FUNCTIONS👇🏼---------------------//
  //---------------------------------------------------------//

  let decideRadd = function (oldRad, noOfBindis) {
    let newRad;
    let block = size / (noOfBindis + 1);
    for (let i = 0; i < noOfBindis + 1; i++) {
      if (oldRad >= i * block && oldRad < (i + 1) * block) {
        newRad = i * block;
        break;
      } else {
        newRad = i * block;
      }
    }
    return newRad;
  };

  let drawBindis = function (x, y, rad) {
    noFill();
    settings.showControl("Fill");
    if (settings.getValue("Fill") == 1) {
      fill(255, 0, 0);
    }
    stroke(255, 0, 0);
    circle(x + size / 2, y + size / 2, rad);
  };

  let drawText = function (x, y, rad) {
    noStroke();
    settings.hideControl("Fill");
    fill(255, 0, 0);
    if (rad != 0) {
      text(rad / block, x + size / 2, y + size / 2);
      num++;
    }
  };

  //---------------------------------------------------------//
  //---------------------👆🏼SUB-FUNCTIONS👆🏼---------------------//
  //---------------------------------------------------------//

  for (let starty = 0; starty < img.height; starty += size) {
    for (let startx = 0; startx < img.width; startx += size) {
      let index = (startx + starty * img.width) * 4;
      let r = img.pixels[index + 0];
      let g = img.pixels[index + 1];
      let b = img.pixels[index + 2];

      let bright = floor(0.3 * r + 0.59 * g + 0.11 * b);
      let rad = map(bright, 255, 0, 0, size);
      rad = decideRadd(rad, noOfBindis);

      mode = settings.getValue("Output").value;

      if (mode == "Sizes") {
        drawText(startx, starty, rad);
      } else {
        drawBindis(startx, starty, rad);
      }

      if (rad != 0) {
        num++;
      }
    }
  }

  for (let j = 1; j < noOfBindis + 1; j++) {
    fill(255, 0, 0);
    circle(j * 30, h - 50, (j * size) / (noOfBindis + 1));
    noStroke();
    text(j, j * 30, h - 25);
  }
}

function restart() {
  loop();
}

function exportA4() {
  let c = get();
  c.resize(2478, 0);
  c.save("photo", "png");
}

function handleFile(file) {
  const selectedFile = document.getElementById("upload");
  const myImageFile = selectedFile.files[0];
  let urlOfImageFile = URL.createObjectURL(myImageFile);
  img = loadImage(urlOfImageFile);

  loop();
  restart();
}
