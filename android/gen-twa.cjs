// Generates twa-manifest.json non-interactively using Bubblewrap's own core lib.
const path = require("path");
const CORE = path.join(
  process.env.APPDATA,
  "npm/node_modules/@bubblewrap/cli/node_modules/@bubblewrap/core/dist/index.js"
);
const { TwaManifest } = require(CORE);
const Color = require(path.join(
  process.env.APPDATA,
  "npm/node_modules/@bubblewrap/cli/node_modules/color"
));

const WEB_MANIFEST_URL = "https://s-maps.netlify.app/manifest.webmanifest";
const KEYSTORE = path.resolve(__dirname, "smaps-release.keystore");

(async () => {
  const twa = await TwaManifest.fromWebManifest(WEB_MANIFEST_URL);

  // Play Store identity
  twa.packageId = "com.johnjesuoj.smaps";
  twa.name = "Project Maps";
  twa.launcherName = "S-Maps";
  twa.host = "s-maps.netlify.app";
  twa.startUrl = "/";
  twa.display = "standalone";
  twa.orientation = "portrait";

  // Nocturne colors
  twa.themeColor = Color("#060E16");
  twa.themeColorDark = Color("#060E16");
  twa.navigationColor = Color("#060E16");
  twa.navigationColorDark = Color("#060E16");
  twa.backgroundColor = Color("#060E16");

  // Our release signing key
  twa.signingKey = { path: KEYSTORE, alias: "smaps" };

  // Versioning + our asset-links fingerprint
  twa.appVersion = "1.0.0";
  twa.appVersionCode = 1;
  twa.fingerprints = [
    {
      name: "smaps-release",
      value:
        "55:03:14:79:61:51:A3:93:61:46:09:6E:C7:A7:9B:71:FF:C6:7B:A2:D3:0B:A5:7D:53:26:B0:A1:76:3D:7B:03",
    },
  ];

  twa.generatorApp = "bubblewrap-cli";
  twa.webManifestUrl = WEB_MANIFEST_URL;
  twa.splashScreenFadeOutDuration = 300;
  twa.enableNotifications = false;
  twa.enableSiteSettingsShortcut = true;
  twa.minSdkVersion = 21;

  await twa.saveToFile(path.resolve(__dirname, "twa-manifest.json"));
  console.log("WROTE twa-manifest.json");
  console.log("packageId:", twa.packageId);
  console.log("host:", twa.host);
  console.log("iconUrl:", twa.iconUrl);
  console.log("maskableIconUrl:", twa.maskableIconUrl);
  console.log("signingKey:", JSON.stringify(twa.signingKey));
})().catch((err) => {
  console.error("FAILED:", err.message || err);
  process.exit(1);
});
