#!/bin/bash

# Android Environment Setup Script for Food Rush

echo "🔧 Setting up Android environment for local builds..."

# Detect Android SDK path
ANDROID_SDK_PATH=""

# Common Android SDK locations
if [ -d "/home/tochukwu/Android/Sdk" ]; then
    ANDROID_SDK_PATH="/home/tochukwu/Android/Sdk"
elif [ -d "$HOME/Android/Sdk" ]; then
    ANDROID_SDK_PATH="$HOME/Android/Sdk"
elif [ -d "/opt/android-sdk" ]; then
    ANDROID_SDK_PATH="/opt/android-sdk"
fi

if [ -z "$ANDROID_SDK_PATH" ]; then
    echo "❌ Android SDK not found. Please install Android Studio first."
    exit 1
fi

echo "✅ Found Android SDK at: $ANDROID_SDK_PATH"

# Export environment variables for current session
export ANDROID_HOME="$ANDROID_SDK_PATH"
export ANDROID_SDK_ROOT="$ANDROID_SDK_PATH"
export PATH="$PATH:$ANDROID_SDK_PATH/emulator"
export PATH="$PATH:$ANDROID_SDK_PATH/platform-tools"
export PATH="$PATH:$ANDROID_SDK_PATH/cmdline-tools/latest/bin"

echo "✅ Environment variables set for current session"

# Add to shell profile for permanent setup
SHELL_PROFILE=""
if [ -f "$HOME/.bashrc" ]; then
    SHELL_PROFILE="$HOME/.bashrc"
elif [ -f "$HOME/.zshrc" ]; then
    SHELL_PROFILE="$HOME/.zshrc"
elif [ -f "$HOME/.profile" ]; then
    SHELL_PROFILE="$HOME/.profile"
fi

if [ -n "$SHELL_PROFILE" ]; then
    echo ""
    echo "📝 Adding to $SHELL_PROFILE for permanent setup..."
    
    # Check if already exists
    if ! grep -q "ANDROID_HOME" "$SHELL_PROFILE"; then
        echo "" >> "$SHELL_PROFILE"
        echo "# Android SDK Environment Variables" >> "$SHELL_PROFILE"
        echo "export ANDROID_HOME=\"$ANDROID_SDK_PATH\"" >> "$SHELL_PROFILE"
        echo "export ANDROID_SDK_ROOT=\"$ANDROID_SDK_PATH\"" >> "$SHELL_PROFILE"
        echo "export PATH=\"\$PATH:\$ANDROID_SDK_PATH/emulator\"" >> "$SHELL_PROFILE"
        echo "export PATH=\"\$PATH:\$ANDROID_SDK_PATH/platform-tools\"" >> "$SHELL_PROFILE"
        echo "export PATH=\"\$PATH:\$ANDROID_SDK_PATH/cmdline-tools/latest/bin\"" >> "$SHELL_PROFILE"
        
        echo "✅ Added Android environment to $SHELL_PROFILE"
        echo "🔄 Run 'source $SHELL_PROFILE' or restart terminal to apply permanently"
    else
        echo "✅ Android environment already configured in $SHELL_PROFILE"
    fi
fi

# Verify setup
echo ""
echo "🔍 Verifying Android setup..."
echo "ANDROID_HOME: $ANDROID_HOME"
echo "ANDROID_SDK_ROOT: $ANDROID_SDK_ROOT"

# Check required tools
if command -v adb &> /dev/null; then
    echo "✅ ADB found: $(which adb)"
else
    echo "❌ ADB not found in PATH"
fi

if [ -f "$ANDROID_SDK_PATH/cmdline-tools/latest/bin/sdkmanager" ]; then
    echo "✅ SDK Manager found"
else
    echo "❌ SDK Manager not found. Install Android Studio command line tools."
fi

echo ""
echo "🚀 Android environment setup complete!"
echo "💡 You can now try: npm run build:android:apk"