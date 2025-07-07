# Production
eas.json
{
  "cli": { "version": ">= 2.7.1" },
  "build": {
    "preview": { "android": { "buildType": "apk" } },
    "preview2": { "android": { "gradleCommand": ":app:assembleRelease" } },
    "preview3": { "developmentClient": true },
    "production": {}
  }
}

#Installation:
eas build -p android --profile preview

# Development
eas.json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {}
  }
}
#Installation:
eas build --profile development --platform android
