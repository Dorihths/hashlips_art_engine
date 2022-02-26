const basePath = process.cwd();
console.log('const basePath = process.cwd();');
const { NETWORK } = require(`${basePath}/constants/network.js`);
console.log('const { NETWORK } = require(`${basePath}/constants/network.js`);');
const fs = require("fs");
console.log('const fs = require("fs");');
const sha1 = require(`${basePath}/node_modules/sha1`);
console.log('const sha1 = require(`${basePath}/node_modules/sha1`);');
const { createCanvas, loadImage } = require(`${basePath}/node_modules/canvas`);
console.log('const { createCanvas, loadImage } = require(`${basePath}/node_modules/canvas`);');
const buildDir = `${basePath}/build`;
console.log('const buildDir = `${basePath}/build`;');
const layersDir = `${basePath}/layers`;
console.log('const layersDir = `${basePath}/layers`;');

let config;
console.log('let config;');

try {
console.log('try {');
  config = require(`${basePath}/src/config.js`);
console.log('  config = require(`${basePath}/src/config.js`)');
} catch (error) {
console.log('} catch (error) {');
  console.error(`Syntax error: ${error.message} in src/config.js`);
console.log('  console.error(`Syntax error: ${error.message} in src/config.js`);');
  process.exit();
console.log('  process.exit();');
}
console.log('}');

let {
  format,
  baseUri,
  description,
  background,
  uniqueDnaTorrance,
  layerConfigurations,
  rarityDelimiter,
  shuffleLayerConfigurations,
  debugLogs,
  extraMetadata,
  text,
  namePrefix,
  network,
  solanaMetadata,
  gif,
} = config;
console.log('} = config;');

const canvas = createCanvas(format.width, format.height);
console.log('const canvas = createCanvas(format.width, format.height);');
const ctx = canvas.getContext("2d");
console.log('const ctx = canvas.getContext("2d");');
ctx.imageSmoothingEnabled = format.smoothing;
console.log('ctx.imageSmoothingEnabled = format.smoothing;');
var metadataList = [];
console.log('var metadataList = [];');
var attributesList = [];
console.log('var attributesList = [];');
var dnaList = new Set();
console.log('var dnaList = new Set();');
const DNA_DELIMITER = "-";
console.log('const DNA_DELIMITER = "-";');
const HashlipsGiffer = require(`${basePath}/modules/HashlipsGiffer.js`);
console.log('const HashlipsGiffer = require(`${basePath}/modules/HashlipsGiffer.js`);');

let hashlipsGiffer = null;
console.log('let hashlipsGiffer = null;');

const buildSetup = () => {
console.log('const buildSetup = () => {');
  if (!fs.existsSync(buildDir)) {
console.log('  if (!fs.existsSync(buildDir)) {');
    fs.mkdirSync(buildDir);
console.log('    fs.mkdirSync(buildDir);');
  }
console.log('  }');
  if (!fs.existsSync(`${buildDir}/json`)) {
console.log('  if (!fs.existsSync(`${buildDir}/json`)) {');
    fs.mkdirSync(`${buildDir}/json`);
console.log('    fs.mkdirSync(`${buildDir}/json`);');
  }
console.log('  }');
  if (!fs.existsSync(`${buildDir}/images`)) {
console.log('  if (!fs.existsSync(`${buildDir}/images`)) {');
    fs.mkdirSync(`${buildDir}/images`);
console.log('    fs.mkdirSync(`${buildDir}/images`);');
  }
console.log('  }');
  if (gif.export && !fs.existsSync(`${buildDir}/gifs`)) {
console.log('  if (gif.export && !fs.existsSync(`${buildDir}/gifs`)) {');
    fs.mkdirSync(`${buildDir}/gifs`);
console.log('    fs.mkdirSync(`${buildDir}/gifs`);');
  }
console.log('  }');
};
console.log('};');

const getRarityWeight = (_str) => {
console.log('const getRarityWeight = (_str) => {');
  let nameWithoutExtension = _str.slice(0, -4);
console.log('  let nameWithoutExtension = _str.slice(0, -4);');
  var nameWithoutWeight = Number(
    nameWithoutExtension.split(rarityDelimiter).pop()

  );
console.log('  );');
  if (isNaN(nameWithoutWeight)) {
console.log('  if (isNaN(nameWithoutWeight)) {');
    nameWithoutWeight = 1;
console.log('    nameWithoutWeight = 1;');
  }
console.log('  }');
  return nameWithoutWeight;
};
console.log('};');

const cleanDna = (_str) => {
console.log('const cleanDna = (_str) => {');
  const withoutOptions = removeQueryStrings(_str);
console.log('  const withoutOptions = removeQueryStrings(_str);');
  var dna = Number(withoutOptions.split(":").shift());
console.log('  var dna = Number(withoutOptions.split(":").shift());');
  return dna;
};
console.log('};');

const cleanName = (_str) => {
console.log('const cleanName = (_str) => {');
  let nameWithoutExtension = _str.slice(0, -4);
console.log('  let nameWithoutExtension = _str.slice(0, -4);');
  var nameWithoutWeight = nameWithoutExtension.split(rarityDelimiter).shift();
console.log('  var nameWithoutWeight = nameWithoutExtension.split(rarityDelimiter).shift();');
  return nameWithoutWeight;
};
console.log('};');

const getElements = (path) => {
console.log('const getElements = (path) => {');
  if (!fs.existsSync(path)) {
console.log('  if (!fs.existsSync(path)) {');
     console.error(`{path} doesn't exist, make sure your layers/ folder matches your src/config.js`);
console.log("     console.error(`{path} doesn't exist, make sure your layers/ folder matches your src/config.js`);");
     process.exit();
console.log('     process.exit();');
  }
console.log('  }');
  return fs
    .readdirSync(path)
    .filter((item) => !/(^|\/)\.[^\/\.]/g.test(item))
    .map((i, index) => {
console.log('    .map((i, index) => {');
      if (i.includes(DNA_DELIMITER)) {
console.log('      if (i.includes(DNA_DELIMITER)) {');
        console.error(`layer name can not contain DNA_DELIMITER (${DNA_DELIMITER}), please fix: ${i}`);
console.log('        console.error(`layer name can not contain DNA_DELIMITER (${DNA_DELIMITER}), please fix: ${i}`);');
        process.exit();
console.log('        process.exit();');
      }
console.log('      }');
      if (i.includes("\n")) {
console.log('      if (i.includes("\n")) {');
        console.error(`layer name can not contain newlines, please fix: ${i}`);
console.log('        console.error(`layer name can not contain newlines, please fix: ${i}`);');
        process.exit();
console.log('        process.exit();');
      }
console.log('     }');
      return {
        id: index,
        name: cleanName(i),
        filename: i,
        path: `${path}${i}`,
        weight: getRarityWeight(i),
      };
    });
};
console.log('};');

const layersSetup = (layersOrder) => {
console.log('const layersSetup = (layersOrder) => {');
  const layers = layersOrder.map((layerObj, index) => ({
    id: index,
    elements: getElements(`${layersDir}/${layerObj.name}/`),
    name:
      layerObj.options?.["displayName"] != undefined
        ? layerObj.options?.["displayName"]
        : layerObj.name,
    blend:
      layerObj.options?.["blend"] != undefined
        ? layerObj.options?.["blend"]
        : "source-over",
    opacity:
      layerObj.options?.["opacity"] != undefined
        ? layerObj.options?.["opacity"]
        : 1,
    bypassDNA:
      layerObj.options?.["bypassDNA"] !== undefined
        ? layerObj.options?.["bypassDNA"]
        : false,
  }));
console.log('  }));');
  return layers;
};
console.log('};');

const saveImage = (_editionCount) => {
console.log('const saveImage = (_editionCount) => {');
  fs.writeFileSync(
    `${buildDir}/images/${_editionCount}.png`,
    canvas.toBuffer("image/png")
  );
console.log('  );');
};
console.log('};');

const genColor = () => {
console.log('const genColor = () => {');
  let hue = Math.floor(Math.random() * 360);
console.log('  let hue = Math.floor(Math.random() * 360);');
  let pastel = `hsl(${hue}, 100%, ${background.brightness})`;
console.log('  let pastel = `hsl(${hue}, 100%, ${background.brightness})`;');
  return pastel;
};
console.log('};');

const drawBackground = () => {
console.log('const drawBackground = () => {');
  ctx.fillStyle = background.static ? background.default : genColor();
console.log('  ctx.fillStyle = background.static ? background.default : genColor();');
  ctx.fillRect(0, 0, format.width, format.height);
console.log('  ctx.fillRect(0, 0, format.width, format.height);');
};
console.log('};');

const addMetadata = (_dna, _edition) => {
console.log('const addMetadata = (_dna, _edition) => {');
  let dateTime = Date.now();
console.log('  let dateTime = Date.now();');
  let tempMetadata = {
    name: `${namePrefix} #${_edition}`,
    description: description,
    image: `${baseUri}/${_edition}.png`,
    dna: sha1(_dna),
    edition: _edition,
    date: dateTime,
    ...extraMetadata,
    attributes: attributesList,
    compiler: "HashLips Art Engine",
  };
console.log('  };');
  if (network == NETWORK.sol) {
console.log('  if (network == NETWORK.sol) {');
    tempMetadata = {
      //Added metadata for solana
      name: tempMetadata.name,
      symbol: solanaMetadata.symbol,
      description: tempMetadata.description,
      //Added metadata for solana
      seller_fee_basis_points: solanaMetadata.seller_fee_basis_points,
      image: `${_edition}.png`,
      //Added metadata for solana
      external_url: solanaMetadata.external_url,
      edition: _edition,
      ...extraMetadata,
      attributes: tempMetadata.attributes,
      properties: {
        files: [
          {
            uri: `${_edition}.png`,
            type: "image/png",
          },
        ],
        category: "image",
        creators: solanaMetadata.creators,
      },
    };
console.log('    };');
  }
console.log('  }');
  metadataList.push(tempMetadata);
console.log('  metadataList.push(tempMetadata);');
  attributesList = [];
console.log('  attributesList = [];');
};
console.log('};');

const addAttributes = (_element) => {
console.log('const addAttributes = (_element) => {');
  let selectedElement = _element.layer.selectedElement;
console.log('  let selectedElement = _element.layer.selectedElement;');
  attributesList.push({
    trait_type: _element.layer.name,
    value: selectedElement.name,
  });
console.log('  });');
};
console.log('};');

const loadLayerImg = async (_layer) => {
console.log('const loadLayerImg = async (_layer) => {');
  return new Promise(async (resolve) => {
console.log('  return new Promise(async (resolve) => {');
    const image = await loadImage(`${_layer.selectedElement.path}`);
console.log('    const image = await loadImage(`${_layer.selectedElement.path}`);');
    resolve({ layer: _layer, loadedImage: image });
  }).catch(error => {
console.log('  }).catch(error => {');
    console.error("Error loading image:", error, _layer.selectedElement.path);
console.log('    console.error("Error loading image:", error, _layer.selectedElement.path);');
  });
};
console.log('};');

const addText = (_sig, x, y, size) => {
console.log('const addText = (_sig, x, y, size) => {');
  ctx.fillStyle = text.color;
console.log('  ctx.fillStyle = text.color;');
  ctx.font = `${text.weight} ${size}pt ${text.family}`;
console.log('  ctx.font = `${text.weight} ${size}pt ${text.family}`;');
  ctx.textBaseline = text.baseline;
console.log('  ctx.textBaseline = text.baseline;');
  ctx.textAlign = text.align;
console.log('  ctx.textAlign = text.align;');
  ctx.fillText(_sig, x, y);
console.log('  ctx.fillText(_sig, x, y);');
};
console.log('};');

const drawElement = (_renderObject, _index, _layersLen) => {
console.log('const drawElement = (_renderObject, _index, _layersLen) => {');
  ctx.globalAlpha = _renderObject.layer.opacity;
console.log('  ctx.globalAlpha = _renderObject.layer.opacity;');
  ctx.globalCompositeOperation = _renderObject.layer.blend;
console.log('  ctx.globalCompositeOperation = _renderObject.layer.blend;');
  text.only
    ? addText(
        `${_renderObject.layer.name}${text.spacer}${_renderObject.layer.selectedElement.name}`,
        text.xGap,
        text.yGap * (_index + 1),
        text.size
      )
    : ctx.drawImage(
        _renderObject.loadedImage,
        0,
        0,
        format.width,
        format.height
      );
console.log('      );');

  addAttributes(_renderObject);
console.log('  addAttributes(_renderObject);');
};
console.log('};');

const constructLayerToDna = (_dna = "", _layers = []) => {
console.log('const constructLayerToDna = (_dna = "", _layers = []) => {');
  let mappedDnaToLayers = _layers.map((layer, index) => {
console.log('  let mappedDnaToLayers = _layers.map((layer, index) => {');
    let selectedElement = layer.elements.find(
      (e) => e.id == cleanDna(_dna.split(DNA_DELIMITER)[index])
    );
console.log('    );');
    return {
      name: layer.name,
      blend: layer.blend,
      opacity: layer.opacity,
      selectedElement: selectedElement,
    };
  });
console.log('  });');
  return mappedDnaToLayers;
};
console.log('};');

/**
 * In some cases a DNA string may contain optional query parameters for options
 * such as bypassing the DNA isUnique check, this function filters out those
 * items without modifying the stored DNA.
 *
 * @param {String} _dna New DNA string
 * @returns new DNA string with any items that should be filtered, removed.
 */
const filterDNAOptions = (_dna) => {
console.log('const filterDNAOptions = (_dna) => {');
  const dnaItems = _dna.split(DNA_DELIMITER);
console.log('  const dnaItems = _dna.split(DNA_DELIMITER);');
  const filteredDNA = dnaItems.filter((element) => {
console.log('  const filteredDNA = dnaItems.filter((element) => {');
    const query = /(\?.*$)/;
console.log('    const query = /(\?.*$)/;');
    const querystring = query.exec(element);
console.log('    const querystring = query.exec(element);');
    if (!querystring) {
console.log('    if (!querystring) {');
      return true;
    }
console.log('    }');
    const options = querystring[1].split("&").reduce((r, setting) => {
console.log('    const options = querystring[1].split("&").reduce((r, setting) => {');
      const keyPairs = setting.split("=");
console.log('      const keyPairs = setting.split("=");');
      return { ...r, [keyPairs[0]]: keyPairs[1] };
    }, []);
console.log('    }, []);');

    return options.bypassDNA;
  });
console.log('  });');

  return filteredDNA.join(DNA_DELIMITER);
};
console.log('};');

/**
 * Cleaning function for DNA strings. When DNA strings include an option, it
 * is added to the filename with a ?setting=value query string. It needs to be
 * removed to properly access the file name before Drawing.
 *
 * @param {String} _dna The entire newDNA string
 * @returns Cleaned DNA string without querystring parameters.
 */
const removeQueryStrings = (_dna) => {
console.log('const removeQueryStrings = (_dna) => {');
  const query = /(\?.*$)/;
console.log('  const query = /(\?.*$)/;');
  return _dna.replace(query, "");
};
console.log('};');

const isDnaUnique = (_DnaList = new Set(), _dna = "") => {
console.log('const isDnaUnique = (_DnaList = new Set(), _dna = "") => {');
  const _hashedDNA = sha1(_dna);
console.log('  const _hashedDNA = sha1(_dna);');
  return !_DnaList.has(_hashedDNA);
};
console.log('};');

const createDna = (_layers) => {
console.log('const createDna = (_layers) => {');
  let randNum = [];
console.log('  let randNum = [];');
  _layers.forEach((layer) => {
console.log('  _layers.forEach((layer) => {');
    var totalWeight = 0;
console.log('    var totalWeight = 0;');
    layer.elements.forEach((element) => {
console.log('    layer.elements.forEach((element) => {');
      totalWeight += element.weight;
console.log('      totalWeight += element.weight;');
    });
console.log('    });');
    // if totalWeight is 0, this stops it from erroring
    if (totalWeight == 0) {
console.log('    if (totalWeight == 0) {');
      let random = Math.floor(Math.random() * layer.elements.length);
console.log('      let random = Math.floor(Math.random() * layer.elements.length);');
      return randNum.push(
        `${layer.elements[random].id}:${layer.elements[random].filename}${
          layer.bypassDNA ? "?bypassDNA=true" : ""
        }`
      );
    }
console.log('    }');
    // number between 0 - totalWeight
    let random = Math.floor(Math.random() * totalWeight);
console.log('    let random = Math.floor(Math.random() * totalWeight);');
    for (var i = 0; i < layer.elements.length; i++) {
console.log('    for (var i = 0; i < layer.elements.length; i++) {');
      // subtract the current weight from the random weight until we reach a sub zero value.
      random -= layer.elements[i].weight;
console.log('      random -= layer.elements[i].weight;');
      if (random < 0) {
console.log('      if (random < 0) {');
        return randNum.push(
          `${layer.elements[i].id}:${layer.elements[i].filename}${
            layer.bypassDNA ? "?bypassDNA=true" : ""
          }`
        );
      }
    }
  });
console.log('  });');
  return randNum.join(DNA_DELIMITER);
};
console.log('};');

const writeMetaData = (_data) => {
console.log('const writeMetaData = (_data) => {');
  fs.writeFileSync(`${buildDir}/json/_metadata.json`, _data);
console.log('  fs.writeFileSync(`${buildDir}/json/_metadata.json`, _data);');
};
console.log('};');

const saveMetaDataSingleFile = (_editionCount) => {
console.log('const saveMetaDataSingleFile = (_editionCount) => {');
  let metadata = metadataList.find((meta) => meta.edition == _editionCount);
console.log('  let metadata = metadataList.find((meta) => meta.edition == _editionCount);');
  debugLogs
    ? console.log(
        `Writing metadata for ${_editionCount}: ${JSON.stringify(metadata)}`
      )
    : null;
console.log('    : null;');
  fs.writeFileSync(
    `${buildDir}/json/${_editionCount}.json`,
    JSON.stringify(metadata, null, 2)
  );
console.log('  );');
};
console.log('};');

function shuffle(array) {
console.log('function shuffle(array) {');
  let currentIndex = array.length,
    randomIndex;
console.log('    randomIndex;');
  while (currentIndex != 0) {
console.log('  while (currentIndex != 0) {');
    randomIndex = Math.floor(Math.random() * currentIndex);
console.log('    randomIndex = Math.floor(Math.random() * currentIndex);');
    currentIndex--;
console.log('    currentIndex--;');
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
console.log('    ];');
  }
console.log('  }');
  return array;
}
console.log('}');

const startCreating = async () => {
console.log('const startCreating = async () => {');
  let failedCount = 0;
console.log('  let failedCount = 0;');
  let abstractedIndexes = [];
console.log('  let abstractedIndexes = [];');
  let layerArray = [];
console.log('  let layerArray = [];');
  let dnaHashList = new Set();
console.log('  let dnaHashList = new Set();');
  let existingEditions = new Set();
console.log('  let existingEditions = new Set();');
  if (fs.existsSync(`${basePath}/build/json/_metadata.json`)) {
console.log('  if (fs.existsSync(`${basePath}/build/json/_metadata.json`)) {');
    let rawdata = fs.readFileSync(`${basePath}/build/json/_metadata.json`);
console.log('    let rawdata = fs.readFileSync(`${basePath}/build/json/_metadata.json`);');
    let data = JSON.parse(rawdata);
console.log('    let data = JSON.parse(rawdata);');
    data.forEach(element => {
console.log('    data.forEach(element => {');
      existingEditions.add(element.edition);
console.log('      existingEditions.add(element.edition);');
      dnaHashList.add(element.dna);
console.log('      dnaHashList.add(element.dna);');
      metadataList.push(element);
console.log('      metadataList.push(element);');
    });
console.log('    });');
  }
console.log('  }');

  for (layerconfiguration of layerConfigurations) {
console.log('  for (layerconfiguration of layerConfigurations) {');
    const layers = layersSetup(layerconfiguration.layersOrder);
console.log('    const layers = layersSetup(layerconfiguration.layersOrder);');

    const offset = abstractedIndexes.length;
console.log('    const offset = abstractedIndexes.length;');
    for (
      let i =
        network == NETWORK.sol
          ? 0
          : (layerconfiguration.startEditionFrom || 1)
        + offset;
      i <= layerconfiguration.growEditionSizeTo + offset;
      i++
    ) {
console.log('    ) {');
      if (existingEditions.has(i)) {
console.log('      if (existingEditions.has(i)) {');
        console.log("Edition exists!");
console.log('        console.log("Edition exists!");');
      } else {
console.log('      } else {');
        abstractedIndexes.push(i);
console.log('        abstractedIndexes.push(i);');
        layerArray[i] = layers;
console.log('        layerArray[i] = layers;');
      }
console.log('      }');
    }
console.log('    }');
  }
console.log('  }');

  if (shuffleLayerConfigurations) {
console.log('  if (shuffleLayerConfigurations) {');
    abstractedIndexes = shuffle(abstractedIndexes);
console.log('    abstractedIndexes = shuffle(abstractedIndexes);');
  }
console.log('  }');

  debugLogs
    ? console.log("Editions left to create: ", abstractedIndexes)
    : null;
console.log('    : null;');

  for (let abstractedIndex = 0; abstractedIndex < abstractedIndexes.length;) {
console.log('  for (let abstractedIndex = 0; abstractedIndex < abstractedIndexes.length;) {');
    const i = abstractedIndexes[abstractedIndex];
console.log('    const i = abstractedIndexes[abstractedIndex];');
    const layers = layerArray[i];
console.log('    const layers = layerArray[i];');

    let newDna = createDna(layers);
console.log('    let newDna = createDna(layers);');
    if (isDnaUnique(dnaHashList, newDna)) {
console.log('    if (isDnaUnique(dnaHashList, newDna)) {');
      let results = constructLayerToDna(newDna, layers);
console.log('      let results = constructLayerToDna(newDna, layers);');
      let loadedElements = [];
console.log('      let loadedElements = [];');

      results.forEach((layer) => {
console.log('      results.forEach((layer) => {');
        loadedElements.push(loadLayerImg(layer));
console.log('        loadedElements.push(loadLayerImg(layer));');
      });
console.log('      });');

      await Promise.all(loadedElements).then((renderObjectArray) => {
console.log('      await Promise.all(loadedElements).then((renderObjectArray) => {');
        debugLogs ? console.log("Clearing canvas") : null;
console.log('        debugLogs ? console.log("Clearing canvas") : null;');
        ctx.clearRect(0, 0, format.width, format.height);
console.log('        ctx.clearRect(0, 0, format.width, format.height);');
        if (gif.export) {
console.log('        if (gif.export) {');
          hashlipsGiffer = new HashlipsGiffer(
            canvas,
            ctx,
            `${buildDir}/gifs/${i}.gif`,
            gif.repeat,
            gif.quality,
            gif.delay
          );
console.log('          );');
          hashlipsGiffer.start();
console.log('          hashlipsGiffer.start();');
        }
console.log('        }');
        if (background.generate) {
console.log('        if (background.generate) {');
          drawBackground();
console.log('          drawBackground();');
        }
console.log('        }');
        renderObjectArray.forEach((renderObject, index) => {
console.log('        renderObjectArray.forEach((renderObject, index) => {');
          drawElement(
            renderObject,
            index,
            layerconfiguration.layersOrder.length
          );
console.log('          );');
          if (gif.export) {
console.log('          if (gif.export) {');
            hashlipsGiffer.add();
console.log('            hashlipsGiffer.add();');
          }
console.log('          }');
        });
console.log('        });');
        if (gif.export) {
console.log('        if (gif.export) {');
          hashlipsGiffer.stop();
console.log('          hashlipsGiffer.stop();');
        }
console.log('        }');
        saveImage(i);
console.log('        saveImage(i);');
        addMetadata(newDna, i);
console.log('        addMetadata(newDna, i);');
        saveMetaDataSingleFile(i);
console.log('        saveMetaDataSingleFile(i);');
        console.log(
          `Created edition: ${i}, with DNA: ${sha1(
            newDna
          )}`
        );
console.log('        );');
      });
console.log('      });');
      dnaList.add(filterDNAOptions(newDna));
console.log('      dnaList.add(filterDNAOptions(newDna));');
      dnaHashList.add(sha1(filterDNAOptions(newDna)));
console.log('      dnaHashList.add(sha1(filterDNAOptions(newDna)));');
      abstractedIndex++;
console.log('      abstractedIndex++;');
    } else {
console.log('    } else {');
      console.log("DNA exists!");
console.log('      console.log("DNA exists!");');
      failedCount++;
console.log('      failedCount++;');
      if (failedCount >= uniqueDnaTorrance) {
console.log('      if (failedCount >= uniqueDnaTorrance) {');
        console.log(
          `You need more layers or elements to grow your edition to ${layerconfiguration.growEditionSizeTo} artworks!`
        );
console.log('        );');
        writeMetaData(JSON.stringify(metadataList, null, 2));
console.log('        writeMetaData(JSON.stringify(metadataList, null, 2));');
        process.exit();
console.log('        process.exit();');
      }
console.log('      }');
    }
console.log('    }');
  }
console.log('  }');
  writeMetaData(JSON.stringify(metadataList, null, 2));
console.log('  writeMetaData(JSON.stringify(metadataList, null, 2));');
};
console.log('};');

module.exports = { startCreating, buildSetup, getElements };
console.log('module.exports = { startCreating, buildSetup, getElements };');
