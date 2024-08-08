const puppeteer = require('puppeteer');
const sharp = require('sharp');
const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

async function getAppIcon(packageName, width = 42, height = 42) {
    googlePlayUrl = `https://play.google.com/store/apps/details?id=${packageName}`;
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(googlePlayUrl);
    const iconUrl = await page.evaluate(() => {
        const img = document.querySelector('img.T75of');
        return img ? img.src : null;
    });
    if (!iconUrl) {
        throw new Error('App icon not found');
    }
    const response = await page.goto(iconUrl);
    const buffer = await response.buffer();
    
    const resizedImage = await sharp(buffer)
            .resize(width, height)
            .toBuffer();

    const tempFilePath = path.join(__dirname, `${packageName}.png`);
    fs.writeFileSync(tempFilePath, resizedImage);
    await browser.close();
}

//test

const packageNames = [
    'com.facebook.katana',
    'com.whatsapp',
    'com.instagram.android',
    'com.snapchat.android',
    'com.twitter.android',
    'com.google.android.youtube',
    'com.spotify.music',
    'com.netflix.mediaclient',
    'com.reddit.frontpage',
    'com.linkedin.android'
];

async function processPackages() {
    for (const packageName of packageNames) {
        try {
            const cdnUrl = await getAppIcon(packageName);
            console.log(`CDN URL for ${packageName}: ${cdnUrl}`);
        } catch (err) {
            console.error(`Error processing ${packageName}:`, err);
        }
    }
}

processPackages();