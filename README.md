# Tailwind CSS Swatches

Generate a macOS color palette from your Tailwind CSS config.

<img src="http://f.pb.io/twswatches-screenshot.png" alt="Screenshot of a generated color palette" width="228" height="678" />

The file will be created in `~/Libary/Colors` where the system-native color picker will pick it up automatically. (Note: you may need to restart your application for the generated palette to show up.)

## Installation

```bash
$ npm install -g tailwind-swatches
```

## Requirements

- macOS
- Node 8+
- Xcode Command Line Tools [^1]
- a working Tailwind CSS project set-up

## Usage

```bash
$ twswatches --help
Options:
  --help        Show help                                              [boolean]
  --version     Show version number                                    [boolean]
  -n, --name    Name of the generated color palette
                                              [string] [default: "Tailwind CSS"]
  -c, --config  Path to the Tailwind CSS config[default: "./tailwind.config.js"]
```

Example:

```bash
$ twswatches -c /path/to/tailwind.config.js -n "My Project"
```

[^1]: We create and execute a temporary Swift file that generates the actual color palette file.
