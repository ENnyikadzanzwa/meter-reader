# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# react-native-reanimated
-keep class com.swmansion.reanimated.** { *; }
-keep class com.facebook.react.turbomodule.** { *; }

# Basic ProGuard rules for reducing APK size and obfuscating code

# Preserve React Native and Expo classes
-keep class com.facebook.react.** { *; }
-keep class expo.modules.** { *; }
-keep class org.reactnative.** { *; }

# Keep native methods
-keepclasseswithmembernames class * {
    native <methods>;
}

# Keep serializable classes
-keepclassmembers class * implements java.io.Serializable {
    static final long serialVersionUID;
    private static final java.io.ObjectStreamField[] serialPersistentFields;
    private void writeObject(java.io.ObjectOutputStream);
    private void readObject(java.io.ObjectInputStream);
    java.lang.Object writeReplace();
    java.lang.Object readResolve();
}

# Remove logging
-assumenosideeffects class android.util.Log {
    public static boolean isLoggable(java.lang.String, int);
    public static int v(...);
    public static int i(...);
    public static int w(...);
    public static int d(...);
    public static int e(...);
}

# Reduce size of application
-dontwarn android.support.**
-dontwarn androidx.**
-dontwarn com.google.common.**
-dontwarn javax.annotation.**
-dontwarn org.codehaus.mojo.animal_sniffer.AnnotationMatcher

# Keep application classes
-keep public class com.meterreader.app.** { *; }

# Preserve all public and private methods of React Native
-keepclassmembers class * {
    @com.facebook.react.bridge.ReactMethod *;
}

# Preserve Hermes runtime
-keep class com.facebook.hermes.** { *; }
-keep class com.facebook.jni.** { *; }

# Add any project specific keep options here:
