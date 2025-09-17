# 📱 Android Build Guide for Food Rush

## 🎯 **Overview**
This guide will help you build an Android APK that you can install directly on your phone instead of using Expo Go.

## 🔧 **Prerequisites Setup**

### ✅ **Already Configured:**
- ✅ EAS CLI installed (`eas-cli/16.10.0`)
- ✅ Logged in as `mr_calculus`
- ✅ Project ID configured: `08bd6b92-2717-47f7-b11c-ed37f5126c0e`
- ✅ `eas.json` configuration created
- ✅ Android package name: `com.mrcalculus.foodrush`

## 🚀 **Build Options**

### **Option 1: Quick APK Build (Recommended for Testing)**
```bash
# Build APK locally (fastest, for testing on your phone)
npm run build:android:apk
```

### **Option 2: Cloud Preview Build**
```bash
# Build APK on EAS servers (slower but doesn't require local setup)
npm run build:android:preview
```

### **Option 3: Development Build**
```bash
# Development build with debugging capabilities
npm run build:android:dev
```

### **Option 4: Production Build**
```bash
# Production build (AAB format for Play Store)
npm run build:android:production
```

## 📋 **Step-by-Step Build Process**

### **Step 1: Choose Your Build Type**

For testing on your phone, I recommend starting with the **preview build**:

```bash
npm run build:android:preview
```

### **Step 2: Monitor Build Progress**

The build process will:
1. 📦 Upload your project to EAS servers
2. 🔧 Install dependencies and configure Android environment
3. 🏗️ Compile your React Native code
4. 📱 Generate the APK file
5. ⬇️ Provide download link

### **Step 3: Download and Install**

Once the build completes:
1. 📥 Download the APK from the provided link
2. 📲 Transfer to your Android phone
3. 🔓 Enable "Install from unknown sources" in Android settings
4. 📱 Install the APK

## ⚙️ **Build Configuration Details**

### **EAS Build Profiles:**

```json
{
  "development": {
    "developmentClient": true,
    "distribution": "internal",
    "android": {
      "gradleCommand": ":app:assembleDebug",
      "buildType": "apk"
    }
  },
  "preview": {
    "distribution": "internal", 
    "android": {
      "buildType": "apk"  // APK for direct installation
    }
  },
  "production": {
    "android": {
      "buildType": "aab"  // AAB for Play Store
    }
  }
}
```

### **Android Configuration:**
- **Package Name**: `com.mrcalculus.foodrush`
- **Version Code**: `1`
- **Target SDK**: Latest (handled by Expo)
- **Permissions**: Location, Internet, Notifications

## 🔍 **Build Commands Explained**

| Command | Purpose | Output | Use Case |
|---------|---------|---------|----------|
| `npm run build:android:preview` | Standard APK build | `.apk` file | Testing on your phone |
| `npm run build:android:dev` | Development build | `.apk` with debugging | Development/debugging |
| `npm run build:android:production` | Production build | `.aab` file | Play Store submission |
| `npm run build:android:apk` | Local APK build | `.apk` file | Fastest local testing |

## 📱 **Installing on Your Phone**

### **Method 1: Direct Download**
1. Build completes → Get download link
2. Open link on your phone
3. Download APK directly
4. Install when prompted

### **Method 2: Transfer via USB/Cloud**
1. Download APK to computer
2. Transfer to phone via USB or cloud storage
3. Open file manager on phone
4. Tap APK file to install

### **Method 3: QR Code (if available)**
1. EAS provides QR code after build
2. Scan with phone camera
3. Download and install

## 🔧 **Android Settings for Installation**

### **Enable Unknown Sources:**
1. Go to **Settings** → **Security** (or **Privacy**)
2. Enable **"Install unknown apps"** or **"Unknown sources"**
3. Allow your browser/file manager to install apps

### **For Android 8+ (API 26+):**
1. Go to **Settings** → **Apps & notifications**
2. Select **Special app access**
3. Choose **Install unknown apps**
4. Enable for your browser/file manager

## 🚨 **Troubleshooting**

### **Common Issues:**

#### **Build Fails:**
```bash
# Check EAS status
npx eas build:list

# View build logs
npx eas build:view [BUILD_ID]
```

#### **Installation Fails:**
- ✅ Check if "Unknown sources" is enabled
- ✅ Ensure sufficient storage space
- ✅ Try uninstalling any previous version

#### **App Crashes:**
- ✅ Check if all required permissions are granted
- ✅ Ensure device meets minimum requirements
- ✅ Check device logs: `adb logcat` (if ADB installed)

### **Build Optimization:**
```bash
# Clear EAS cache if builds are failing
npx eas build --clear-cache

# Check project configuration
npx eas config
```

## 📊 **Build Time Estimates**

| Build Type | Time | Size | Use Case |
|------------|------|------|----------|
| Preview | 5-10 min | ~50MB | Phone testing |
| Development | 8-15 min | ~60MB | Debugging |
| Production | 10-20 min | ~30MB | Play Store |
| Local | 15-30 min | ~50MB | Offline build |

## 🎯 **Recommended Workflow**

### **For Testing:**
1. 🚀 Start with: `npm run build:android:preview`
2. 📱 Install on your phone
3. 🧪 Test all features
4. 🔄 Iterate and rebuild as needed

### **For Production:**
1. ✅ Test thoroughly with preview builds
2. 🚀 Build production: `npm run build:android:production`
3. 📤 Submit to Play Store

## 📋 **Pre-Build Checklist**

- ✅ All dependencies installed (`npm install`)
- ✅ No TypeScript errors (`npm run lint`)
- ✅ App runs in Expo Go
- ✅ All required assets present
- ✅ Permissions configured correctly
- ✅ EAS account has sufficient credits

## 🔗 **Useful Commands**

```bash
# Check build status
npx eas build:list

# View specific build
npx eas build:view [BUILD_ID]

# Cancel running build
npx eas build:cancel [BUILD_ID]

# Check account info
npx eas whoami

# View project configuration
npx eas config
```

## 🎉 **Next Steps After Build**

1. 📱 **Install and test** on your phone
2. 🧪 **Test all features** (location, notifications, etc.)
3. 👥 **Share with beta testers** if needed
4. 🔄 **Iterate** based on feedback
5. 🚀 **Prepare for Play Store** when ready

---

## 🚀 **Quick Start Command**

To build your APK right now, run:

```bash
npm run build:android:preview
```

This will create an APK that you can install directly on your Android phone!

---

**Build Time**: ~5-10 minutes  
**Output**: APK file for direct installation  
**Perfect for**: Testing on your phone without Expo Go