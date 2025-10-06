# Food Rush ProGuard Rules for Production
# Keep React Native core classes
-keep class com.facebook.react.** { *; }
-keep class com.facebook.hermes.** { *; }
-keep class com.facebook.jni.** { *; }

# Keep Expo classes
-keep class expo.** { *; }
-keep class versioned.host.exp.exponent.** { *; }

# Keep React Navigation
-keep class com.reactnavigation.** { *; }

# Keep Reanimated
-keep class com.swmansion.reanimated.** { *; }

# Keep Gesture Handler
-keep class com.swmansion.gesturehandler.** { *; }

# Keep Paper (Material Design)
-keep class com.callstack.** { *; }

# Keep AsyncStorage
-keep class com.reactnativecommunity.asyncstorage.** { *; }

# Keep Location services
-keep class expo.modules.location.** { *; }

# Keep Notifications
-keep class expo.modules.notifications.** { *; }

# Keep Image Picker
-keep class expo.modules.imagepicker.** { *; }

# Keep Secure Store
-keep class expo.modules.securestore.** { *; }

# Keep WebBrowser
-keep class expo.modules.webbrowser.** { *; }

# Keep Font loading
-keep class expo.modules.font.** { *; }

# Keep Haptics
-keep class expo.modules.haptics.** { *; }

# Keep Device info
-keep class expo.modules.device.** { *; }

# Keep Constants
-keep class expo.modules.constants.** { *; }

# Keep File System
-keep class expo.modules.filesystem.** { *; }

# Keep Linear Gradient
-keep class expo.modules.lineargradient.** { *; }

# Keep Localization
-keep class expo.modules.localization.** { *; }

# Keep Status Bar
-keep class expo.modules.statusbar.** { *; }

# Keep Splash Screen
-keep class expo.modules.splashscreen.** { *; }

# Keep Image
-keep class expo.modules.image.** { *; }

# Keep NetInfo
-keep class com.reactnativecommunity.netinfo.** { *; }

# Keep DateTimePicker
-keep class com.reactnativecommunity.datetimepicker.** { *; }

# Keep Picker
-keep class com.reactnativepicker.** { *; }

# Keep Toast Message
-keep class com.calendarevents.** { *; }

# Keep Bottom Sheet
-keep class com.gorhom.bottomsheet.** { *; }

# Keep Dropdown
-keep class com.hieuvp.fingerprint.** { *; }

# Keep Carousel
-keep class com.reactnativereanimatedcarousel.** { *; }

# Keep Worklets
-keep class com.reactnativeworklets.** { *; }

# Keep Safe Area Context
-keep class com.th3rdwave.safeareacontext.** { *; }

# Keep Screens
-keep class com.swmansion.rnscreens.** { *; }

# Keep NativeWind/Tailwind
-keep class com.nativewind.** { *; }

# Keep Zustand (state management)
-keep class zustand.** { *; }

# Keep React Query/TanStack Query
-keep class com.tanstack.** { *; }

# Keep Axios
-keep class axios.** { *; }

# Keep i18next
-keep class i18next.** { *; }

# Keep React Hook Form
-keep class react.hook.form.** { *; }

# Keep Yup validation
-keep class yup.** { *; }

# Keep date-fns
-keep class date.fns.** { *; }

# General rules for React Native
-keepattributes *Annotation*
-keepattributes SourceFile,LineNumberTable
-keepattributes Signature
-keepattributes InnerClasses
-keepattributes EnclosingMethod

# Keep native methods
-keepclassmembers class * {
    native <methods>;
}

# Keep enums
-keepclassmembers enum * {
    public static **[] values();
    public static ** valueOf(java.lang.String);
}

# Keep Parcelable implementations
-keep class * implements android.os.Parcelable {
    public static final android.os.Parcelable$Creator *;
}

# Keep Serializable classes
-keepclassmembers class * implements java.io.Serializable {
    static final long serialVersionUID;
    private static final java.io.ObjectStreamField[] serialPersistentFields;
    private void writeObject(java.io.ObjectOutputStream);
    private void readObject(java.io.ObjectInputStream);
    java.lang.Object writeReplace();
    java.lang.Object readResolve();
}

# Remove logging in production
-assumenosideeffects class android.util.Log {
    public static boolean isLoggable(java.lang.String, int);
    public static int v(...);
    public static int i(...);
    public static int w(...);
    public static int d(...);
    public static int e(...);
}

# Optimization settings
-optimizations !code/simplification/arithmetic,!code/simplification/cast,!field/*,!class/merging/*
-optimizationpasses 5
-allowaccessmodification
-dontpreverify

# Keep line numbers for crash reports
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile