# App Icon Scraper

## Overview

This project is a Node.js script that uses Puppeteer to scrape app icons from the Google Play Store. The icons are then resized using the `sharp` library and uploaded to an Amazon S3 bucket. The script is useful for obtaining app icons for various applications in a specified size and storing them in cloud storage.

## Features

- **Scrapes App Icons:** Retrieves app icons from the Google Play Store using Puppeteer.
- **Image Resizing:** Uses `sharp` to resize the app icons to the desired dimensions.
- **AWS S3 Integration:** Uploads the resized icons to an Amazon S3 bucket.

## Prerequisites 

- Node.js installed on your machine
- AWS SDK configured with appropriate access (`accessKeyId`, `secretAccessKey`, and `region`)
- An S3 bucket available for storing the icons
- `npm` for installing required packages

## Installation

1. Clone the repository:
   git clone https://github.com/avri-kaufman/app-icon-scraper.git
   cd app-icon-scraper
2. npm install puppeteer sharp aws-sdk
3. Configure the AWS S3 bucket in the script by setting the BUCKET_NAME, accessKeyId, secretAccessKey, and region variables.

## Usage

To scrape an app icon from the Google Play Store, call the getAppIcon function with the package name of the app.

## Configuration

-AWS S3 Configuration: Ensure that the accessKeyId, secretAccessKey, and region are correctly set up in your AWS configuration for the S3 SDK.
-Image Dimensions: You can adjust the width and height parameters in the getAppIcon function call to get icons of different sizes.
