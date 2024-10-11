#!/usr/bin/env node

import axios from 'axios';
import * as cheerio from 'cheerio';
import { program } from 'commander';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import ora from 'ora';
import inquirer from 'inquirer';
import { URL } from 'url'; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const asciiArt = `
 _   _ ____  _       ____       _           _             
| | | |  _ \\| |     / ___|  ___| | ___  ___| |_ ___  _ __ 
| | | | |_) | |     \\___ \\ / _ \\ |/ _ \\/ __| __/ _ \\| '__|
| |_| |  _ <| |___   ___) |  __/ |  __/ (__| || (_) | |   
 \\___/|_| \\_\\_____| |____/ \\___|_|\\___|\\___|\\__\\___/|_|   
`;

program
  .version('1.0.0')
  .description('A CLI tool to extract content from a webpage using a CSS selector')
  .argument('<url>', 'URL of the webpage')
  .argument('<selector>', 'CSS selector to match the element')
  .action(async (pageUrl, selector) => {
    console.log(chalk.cyan(asciiArt));
    console.log(chalk.yellow('URL Selector CLI - Extract content or download images\n'));

    const spinner = ora('Fetching webpage...').start();

    try {
      const response = await axios.get(pageUrl);
      spinner.succeed('Webpage fetched successfully');

      const $ = cheerio.load(response.data);
      const elements = $(selector);

      if (elements.length === 0) {
        console.error(chalk.red('No elements found matching the given selector.'));
        process.exit(1);
      }

      // Check if the selector is for an image
      if (selector.toLowerCase() === 'img' || elements.prop('tagName')?.toLowerCase() === 'img') {
        // Handle image downloads directly, no need for content format prompt
        await handleImages($, elements, pageUrl);
      } else {
        // Prompt the user for the output format if it's not an image selector
        const { outputFormat } = await inquirer.prompt([
          {
            type: 'list',
            name: 'outputFormat',
            message: 'How would you like to display the content?',
            choices: [
              'Only Text',
              'Text with Hierarchy',
              'Both Text and Tags'
            ]
          }
        ]);

        console.log(chalk.green('\nExtracted content:'));
        elements.each((index, element) => {
          const textContent = $(element).text().trim();

          if (textContent) { // Only output elements with text
            if (outputFormat === 'Only Text') {
              console.log(chalk.cyan(`${textContent}`));
            } else if (outputFormat === 'Text with Hierarchy') {
              console.log(chalk.yellow(`\n${index + 1}. <${element.tagName}>`));
              processElementWithHierarchy($, element, 1);
            } else if (outputFormat === 'Both Text and Tags') {
              console.log(chalk.yellow(`\n${index + 1}. <${element.tagName}>`));
              processElementWithTags($, element);
            }
          }
        });
      }
    } catch (error) {
      spinner.fail(`An error occurred: ${error.message}`);
      process.exit(1);
    }
  });

function processElementWithHierarchy($, element, depth) {
  const indent = '  '.repeat(depth);
  const elementText = $(element).text().trim();

  if (elementText) { /
    console.log(chalk.cyan(`${indent}<${element.tagName}> - ${chalk.white(elementText)}`));
  }

  $(element).children().each((_, el) => {
    const childText = $(el).text().trim();
    if (childText) { // 
      processElementWithHierarchy($, el, depth + 1);
    }
  });
}


function processElementWithTags($, element) {
  const tagName = element.tagName;
  const ownText = $(element).contents().filter(function() {
    return this.type === 'text' && $(this).text().trim() !== '';
  }).text().trim();

  if (ownText) {
    console.log(chalk.cyan(`<${tagName}> - ${chalk.white(ownText)}`));
  }

  $(element).children().each((_, el) => {
    const childText = $(el).contents().filter(function() {
      return this.type === 'text' && $(this).text().trim() !== '';
    }).text().trim();
    if (childText) {
      processElementWithTags($, el);
    }
  });
}


async function handleImages($, elements, pageUrl) {
  const urlObj = new URL(pageUrl);
  const hostname = urlObj.hostname.replace('www.', ''); 
  const imagesDir = path.join(process.cwd(), 'images', hostname);

  
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }

  console.log(chalk.green(`\nFound ${elements.length} image(s). Downloading into folder: ${imagesDir}\n`));

  for (let i = 0; i < elements.length; i++) {
    const imgSrc = $(elements[i]).attr('src');
    if (imgSrc) {
      try {
        const absoluteUrl = new URL(imgSrc, pageUrl).href;
        const filename = path.basename(absoluteUrl.split('?')[0]); 
        const filePath = path.join(imagesDir, filename);

        const spinner = ora(`Downloading image ${i + 1}/${elements.length}: ${filename}`).start();

        const response = await axios.get(absoluteUrl, { responseType: 'arraybuffer' });
        fs.writeFileSync(filePath, response.data);
        spinner.succeed(`Image saved: ${filePath}`);
      } catch (error) {
        ora().fail(`Failed to download image ${imgSrc}: ${error.message}`);
      }
    }
  }

  console.log(chalk.green('\nDownload process completed.'));
}

program.parse(process.argv);
