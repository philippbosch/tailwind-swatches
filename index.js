#!/usr/bin/env node

const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');

const chalk = require('chalk');
const parseColor = require('color-parser');
const tempy = require('tempy');
const yargs = require('yargs');
const warning = chalk.keyword('orange');

const resolveConfig = require('tailwindcss/resolveConfig');

// Try to get the project name from package.json
let package, projectName;
try {
  package = require(path.resolve('package.json'));
  projectName = package.name;
} catch (e) {
  projectName = 'Tailwind CSS';
}

// Command line arguments
const { name, config } = yargs
    .option('n', {
      alias: 'name',
      default: projectName,
      describe: 'Name of the generated color palette',
      type: 'string',
    })
    .option('c', {
      alias: 'config',
      default: './tailwind.config.js',
      describe: 'Path to the Tailwind CSS config',
    }).argv;

// Read Tailwind config
let customConfig;
try {
  customConfig = require(path.resolve(config));
} catch (e) {
  console.error(`Unable to find config file: ${config}`);
  process.exit(1);
}
const {
  theme: { colors },
} = resolveConfig(customConfig);

// Generate color swatches
const swatches = [];

function upperCaseFirst(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function createSwatch(name, color) {
  if (color === 'currentColor') {
    console.log(warning(`Skipping: ${name} : ${color} - not a color!`));
  } else {
    const {r, g, b, a} = parseColor(color);
    console.log(
        `Processing: ${name} :`+` ${chalk.hex(color)(color)}`+` ${chalk.bgHex(color)(color)}`
    );
    return `list.setColor(NSColor.init(red: ${r / 255}, green:${g /
    255}, blue:${b / 255}, alpha:${a}), forKey: "${upperCaseFirst(name)}")`;
  }
}

for (const [key, value] of Object.entries(colors)) {
  if (typeof value === 'object') {
    for (const [subkey, subvalue] of Object.entries(value)) {
      swatches.push(createSwatch(`${key} ${subkey}`, subvalue));
    }
  } else {
    if (key === 'transparent') continue;
    swatches.push(createSwatch(key, value));
  }
}

// Generate Swift code that creates the color palette file
const tempFileName = tempy.file({ extension: 'swift' });
const tempFile = fs.openSync(tempFileName, 'w');
const swiftCode = `import Cocoa
var list = NSColorList.init(name: "${name}")
${swatches.join('\n')}
try! list.write(to: nil) // 'nil' means the file will be written to ~/Library/Colors (see https://developer.apple.com/documentation/appkit/nscolorlist/2269695-write)
`;
fs.writeSync(tempFile, swiftCode);
fs.closeSync(tempFile);

// Execute the generated Swift code
exec(`/usr/bin/env swift ${tempFileName}`, function(err) {
  if (err) {
    if (err.code === 127) {
      console.log(
          chalk.red(
              'Unable to find Swift interpreter. You may need to install Xcode command line tools.'
          )
      );
      process.exit(2);
    }
    console.error(chalk.red(err));
    process.exit(3);
  }
  console.log(chalk.green(`Color palette '${name}' has been generated.`));
  console.log(
      'Please find it under the third tab in your macOS color picker.\nNOTE: You may need to restart your application for the palette to show up.'
  );
});
