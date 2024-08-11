const puppeteer = require("puppeteer");
const sharp = require("sharp");
const AWS = require("aws-sdk");
const fs = require("fs");
const path = require("path");

// Configure AWS SDK
const s3 = new AWS.S3({
  accessKeyId: "",
  secretAccessKey: "",
  region: "",
});

// Replace with your valid bucket name
const BUCKET_NAME = "";

async function getAppIcon(packageName, width = 42, height = 42) {
  let browser;
  try {
    // Launch Puppeteer
    browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Navigate to the Google Play Store page
    const url = `https://play.google.com/store/apps/details?id=${packageName}`;
    await page.goto(url);

    // Scrape the app icon URL
    const iconUrl = await page.evaluate(() => {
      const img = document.querySelector("img.T75of");
      return img ? img.src : null;
    });

    if (!iconUrl) {
      throw new Error("App icon not found");
    }

    // Fetch the icon image
    const response = await page.goto(iconUrl);
    const buffer = await response.buffer();

    // Resize the image
    const resizedImage = await sharp(buffer).resize(width, height).toBuffer();

    // Save the image to a temporary file
    const tempFilePath = path.join(__dirname, `${packageName}.png`);
    fs.writeFileSync(tempFilePath, resizedImage);

    // Upload to S3
    const s3Params = {
      Bucket: BUCKET_NAME,
      Key: `${packageName}.png`,
      Body: resizedImage,
      ContentType: "image/png",
      //   ACL: "public-read",
    };

    const uploadResult = await s3.upload(s3Params).promise();

    // Delete the temporary file
    fs.unlinkSync(tempFilePath);

    console.log(uploadResult.Location);
    return uploadResult.Location; // CDN URL of the uploaded image
  } catch (error) {
    console.error("Error fetching app icon:", error);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

//test
// const packageNames = [
//   "com.facebook.katana",
//   "com.whatsapp",
//   "com.instagram.android",
//   "com.snapchat.android",
//   "com.twitter.android",
//   "com.google.android.youtube",
//   "com.spotify.music",
//   "com.netflix.mediaclient",
//   "com.reddit.frontpage",
//   "com.linkedin.android",
// ];

// async function processPackages() {
//   for (const packageName of packageNames) {
//     try {
//       const cdnUrl = await getAppIcon(packageName);
//       console.log(`CDN URL for ${packageName}: ${cdnUrl}`);
//     } catch (err) {
//       console.error(`Error processing ${packageName}:`, err);
//     }
//   }
// }

// processPackages();
