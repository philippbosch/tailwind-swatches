# Tailwind CSS Swatches

Generate a macOS color palette from your Tailwind CSS config.

<img src="http://f.pb.io/twswatches-screenshot.png" alt="Screenshot of a generated color palette" width="228" height="678" />

## Installation

```bash
$ npm install tailwindcss-swatches
```

## Requirements

- macOS
- Node 8+
- Xcode Command Line Tools
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
