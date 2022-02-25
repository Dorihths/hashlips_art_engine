const console = require("console");
console.log('const console = require("console");');
const fs = require("fs");
console.log('const fs = require("fs");');
const path = require("path");
console.log('const path = require("path");');
const { createCanvas, loadImage } = require("canvas");
console.log('const { createCanvas, loadImage } = require("canvas");');
const basePath = process.cwd();
console.log('const basePath = process.cwd();');
const buildDir = `${basePath}/build/json`;
console.log('const buildDir = `${basePath}/build/json`;');
const inputDir = `${basePath}/build/images`;
console.log('const inputDir = `${basePath}/build/images`;');
const {
  format,
  namePrefix,
  description,
  baseUri,
} = require(`${basePath}/src/config.js`);
console.log('} = require(`${basePath}/src/config.js`);');
const canvas = createCanvas(format.width, format.height);
console.log('const canvas = createCanvas(format.width, format.height);');
const ctx = canvas.getContext("2d");
console.log('const ctx = canvas.getContext("2d");');
const metadataList = [];
console.log('const metadataList = [];');

const buildSetup = () => {
console.log('const buildSetup = () => {');
  if (fs.existsSync(buildDir)) {
console.log('  if (fs.existsSync(buildDir)) {');
    fs.rm(buildDir, { recursive: true });
console.log('    fs.rm(buildDir, { recursive: true });');
  }
console.log('  }');
  fs.mkdirSync(buildDir);
console.log('  fs.mkdirSync(buildDir);');
};
console.log('};');

const getImages = (_dir) => {
console.log('const getImages = (_dir) => {');
  try {
console.log('  try {');
    return fs
      .readdirSync(_dir)
      .filter((item) => {
console.log('      .filter((item) => {');
        let extension = path.extname(`${_dir}${item}`);
console.log('        let extension = path.extname(`${_dir}${item}`);');
        if (extension == ".png" || extension == ".jpg") {
console.log('        if (extension == ".png" || extension == ".jpg") ');
          return item;
        }
      })
      .map((i) => {
console.log('      .map((i) => {');
        return {
          filename: i,
          path: `${_dir}/${i}`,
        };
      });
console.log('      });');
  } catch {
console.log('  } catch {');
    return null;
  }
};
console.log('};');

const loadImgData = async (_imgObject) => {
console.log('const loadImgData = async (_imgObject) => {');
  try {
console.log('  try {');
    const image = await loadImage(`${_imgObject.path}`);
console.log('    const image = await loadImage(`${_imgObject.path}`);');
    return {
      imgObject: _imgObject,
      loadedImage: image,
    };
  } catch (error) {
console.log('  } catch (error) {');
    console.error("Error loading image:", error);
console.log('    console.error("Error loading image:", error);');
  }
console.log('  }');
};
console.log('};');

const draw = (_imgObject) => {
console.log('const draw = (_imgObject) => {');
  let w = canvas.width;
console.log('  let w = canvas.width;');
  let h = canvas.height;
console.log('  let h = canvas.height;');
  ctx.drawImage(_imgObject.loadedImage, 0, 0, w, h);
console.log('  ctx.drawImage(_imgObject.loadedImage, 0, 0, w, h);');
};
console.log('};');

const addRarity = () => {
console.log('const addRarity = () => {');
  let w = canvas.width;
console.log('  let w = canvas.width;');
  let h = canvas.height;
console.log('  let h = canvas.height;');
  let i = -4;
console.log('  let i = -4;');
  let count = 0;
console.log('  let count = 0;');
  let imgdata = ctx.getImageData(0, 0, w, h);
console.log('  let imgdata = ctx.getImageData(0, 0, w, h);');
  let rgb = imgdata.data;
console.log('  let rgb = imgdata.data;');
  let newRgb = { r: 0, g: 0, b: 0 };
console.log('  let newRgb = { r: 0, g: 0, b: 0 };');
  const tolerance = 15;
console.log('  const tolerance = 15;');
  const rareColorBase = "NOT a Hot Dog";
console.log('  const rareColorBase = "NOT a Hot Dog";');
  const rareColor = [
    { name: "Hot Dog", rgb: { r: 192, g: 158, b: 131 } },
    { name: "Hot Dog", rgb: { r: 128, g: 134, b: 90 } },
    { name: "Hot Dog", rgb: { r: 113, g: 65, b: 179 } },
    { name: "Hot Dog", rgb: { r: 162, g: 108, b: 67 } },
  ];
console.log('  ];');

  while ((i += 10 * 4) < rgb.length) {
console.log('while ((i += 10 * 4) < rgb.length) {');
    ++count;
console.log('    ++count;');
    newRgb.r += rgb[i];
console.log('    newRgb.r += rgb[i];');
    newRgb.g += rgb[i + 1];
console.log('    newRgb.g += rgb[i + 1];');
    newRgb.b += rgb[i + 2];
console.log('    newRgb.b += rgb[i + 2];');
  }
console.log('  }');

  newRgb.r = ~~(newRgb.r / count);
console.log('  newRgb.r = ~~(newRgb.r / count);');
  newRgb.g = ~~(newRgb.g / count);
console.log('  newRgb.g = ~~(newRgb.g / count);');
  newRgb.b = ~~(newRgb.b / count);
console.log('  newRgb.b = ~~(newRgb.b / count);');

  let rarity = rareColorBase;
console.log(1);

  rareColor.forEach((color) => {
console.log('  let rarity = rareColorBase;');
    if (isNeighborColor(newRgb, color.rgb, tolerance)) {
console.log('    if (isNeighborColor(newRgb, color.rgb, tolerance)) {');
      rarity = color.name;
console.log('      rarity = color.name;');
    }
console.log('    }');
  });
console.log('  });');

  console.log(newRgb);
console.log('  console.log(newRgb);');
  console.log(rarity);
console.log('  console.log(rarity);');

  return [
    {
      trait_type: "average color",
      value: `rgb(${newRgb.r},${newRgb.g},${newRgb.b})`,
    },
    {
      trait_type: "What is this?",
      value: rarity,
    },
    {
      trait_type: "date",
      value: randomIntFromInterval(1500, 1900),
    },
  ];
};
console.log('};');

randomIntFromInterval = (min, max) => {
console.log('randomIntFromInterval = (min, max) => {');
  return Math.floor(Math.random() * (max - min + 1) + min);
};
console.log('};');

isNeighborColor = (color1, color2, tolerance) => {
console.log('isNeighborColor = (color1, color2, tolerance) => {');
  return (
    Math.abs(color1.r - color2.r) <= tolerance &&
    Math.abs(color1.g - color2.g) <= tolerance &&
    Math.abs(color1.b - color2.b) <= tolerance
  );
};
console.log('};');

const saveMetadata = (_loadedImageObject) => {
console.log('const saveMetadata = (_loadedImageObject) => {');
  let shortName = _loadedImageObject.imgObject.filename.replace(
    /\.[^/.]+$/,
    ""
  );
console.log('  );');

  let tempAttributes = [];
console.log('  let tempAttributes = [];');
  tempAttributes.push(addRarity());
console.log('  tempAttributes.push(addRarity());');

  let tempMetadata = {
    name: `${namePrefix} #${shortName}`,
    description: description,
    image: `${baseUri}/${shortName}.png`,
    edition: Number(shortName),
    attributes: tempAttributes,
    compiler: "HashLips Art Engine",
  };
console.log('  };');
  fs.writeFileSync(
    `${buildDir}/${shortName}.json`,
    JSON.stringify(tempMetadata, null, 2)
  );
console.log('  );');
  metadataList.push(tempMetadata);
console.log('  metadataList.push(tempMetadata);');
};
console.log('};');

const writeMetaData = (_data) => {
console.log('const writeMetaData = (_data) => {');
  fs.writeFileSync(`${buildDir}/_metadata.json`, _data);
console.log('  fs.writeFileSync(`${buildDir}/_metadata.json`, _data);');
};
console.log('};');

const startCreating = async () => {
console.log('const startCreating = async () => {');
  const images = getImages(inputDir);
console.log('  const images = getImages(inputDir);');
  if (images == null) {
console.log('  if (images == null) {');
    console.log("Please generate collection first.");
console.log('    console.log("Please generate collection first.");');
    return;
console.log('    return;');
  }
console.log('  }');
  let loadedImageObjects = [];
console.log('  let loadedImageObjects = [];');
  images.forEach((imgObject) => {
console.log('  images.forEach((imgObject) => {');
    loadedImageObjects.push(loadImgData(imgObject));
console.log('    loadedImageObjects.push(loadImgData(imgObject));');
  });
console.log('  });');
  await Promise.all(loadedImageObjects).then((loadedImageObjectArray) => {
console.log('  await Promise.all(loadedImageObjects).then((loadedImageObjectArray) => {');
    loadedImageObjectArray.forEach((loadedImageObject) => {
console.log('    loadedImageObjectArray.forEach((loadedImageObject) => {');
      draw(loadedImageObject);
console.log('      draw(loadedImageObject);');
      saveMetadata(loadedImageObject);
console.log('      saveMetadata(loadedImageObject);');
      console.log(
        `Created metadata for image: ${loadedImageObject.imgObject.filename}`
      );
console.log('      );');
    });
console.log('    });');
  });
console.log('  });');
  writeMetaData(JSON.stringify(metadataList, null, 2));
console.log('  writeMetaData(JSON.stringify(metadataList, null, 2));');
};
console.log('};');

buildSetup();
console.log('buildSetup();');
startCreating();
console.log('startCreating();');
