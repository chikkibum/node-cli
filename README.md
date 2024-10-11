
---

# URL Selector CLI

A command-line tool that extracts text content or downloads images from a webpage using a CSS selector. It allows you to extract structured text content, including text hierarchy, and save images in a folder named after the website's domain.

## Features

- Extract text content from a webpage based on a HTML tags.
- Choose between displaying plain text, text with tags, or text with hierarchy.
- Download images and save them into a folder named after the website’s URL.
- Supports various HTML elements (e.g., `h1`, `p`, `img`).

## Requirements

- Node.js (v14+)

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/your-username/url-selector-cli.git
   cd url-selector-cli
   ```

2. Install the required dependencies:
   ```bash
   npm install
   ```


## Usage

### Basic Command
To extract content from a webpage using a specific CSS selector:

```bash
node scraper.js <url> <selector>
```

**Example:**

```bash
node scraper.js https://example.com h1
```

### Options

When running the tool, you will be prompted with options if you are extracting text (non-image selectors):
- **Only Text**: Extracts and displays plain text content without tags.
- **Text with Hierarchy**: Displays text content along with its hierarchy (nested HTML structure).

### Image Extraction

To download images from a webpage:

```bash
node scraper.js <url> img
```

All images are saved in the `images/` directory under a sub-folder named after the website’s domain.

**Example:**

```bash
node scraper.js https://example.com img
```

This will create a folder like `images/example.com/` and download the images there.

## Project Structure

- `scraper.js`: The main CLI script that handles webpage fetching, content extraction, and image downloading.
- `package.json`: Project metadata and dependencies.

## Dependencies

- [axios](https://www.npmjs.com/package/axios): For making HTTP requests to fetch the webpage.
- [cheerio](https://www.npmjs.com/package/cheerio): For parsing and selecting content from the webpage.
- [commander](https://www.npmjs.com/package/commander): For command-line argument parsing.
- [inquirer](https://www.npmjs.com/package/inquirer): For prompting user options in the CLI.
- [chalk](https://www.npmjs.com/package/chalk): For styling terminal output.
- [ora](https://www.npmjs.com/package/ora): For spinner animations in the terminal.


## Contributing

Contributions are welcome! Feel free to submit issues or pull requests to improve this tool.

## Contact

For questions or suggestions, reach out via [Mail](mailto:bhaskarpandeycontacts@gmail.com).

---
