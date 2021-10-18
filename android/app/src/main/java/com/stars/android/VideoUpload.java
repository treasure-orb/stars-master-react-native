package com.stars.android;

import android.Manifest;
import android.content.pm.PackageManager;
import android.content.res.AssetManager;
import android.graphics.Typeface;
import android.net.Uri;
import android.os.Environment;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import android.widget.ImageView;
import android.widget.Toast;

import androidx.annotation.Nullable;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.cloudinary.android.MediaManager;
import com.cloudinary.android.callback.ErrorInfo;
import com.cloudinary.android.callback.UploadCallback;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.Map;
import java.util.HashMap;

import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;

public class VideoUpload extends ReactContextBaseJavaModule {
    private static ReactApplicationContext reactContext;

    private static final String DURATION_SHORT_KEY = "SHORT";
    private static final String DURATION_LONG_KEY = "LONG";

    private static long curSent;
    private static boolean isSent;

    @Override
    public String getName() {
        return "VideoUpload";
    }

    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        constants.put(DURATION_SHORT_KEY, Toast.LENGTH_SHORT);
        constants.put(DURATION_LONG_KEY, Toast.LENGTH_LONG);
        return constants;
    }

    private void sendEvent(ReactContext reactContext,
                           String eventName,
                           @Nullable WritableMap params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }

    @ReactMethod
    public void upload(String uri, String folder, String resource_type, Callback successCallback, Callback errorCallback) {

//        File originFile = new File(originFilePath);
//        String dirPath = originFile.getParent();
//        String newFilePath = dirPath + "/new_" + originFile.getName();
//        String fontPath = "/system/fonts/Roboto-Bold.ttf";
//
//        String watermarkPath = reactContext.getFilesDir() + "/watermark.png";
//        AssetManager assetManager = reactContext.getAssets();
//        boolean res = copyAsset(assetManager, "watermark.png", watermarkPath);
//        String username = "Test User";
//        String parameter = "-y -i " + originFilePath + " -i " + watermarkPath + " -filter_complex \"[1]scale=iw*0.15:-1[wm];[0][wm]overlay=x=20:y=20,drawtext=text=\'" + username + "\':x=10:y=70:fontfile=" + fontPath + ":fontsize=16:fontcolor=white\" " + newFilePath;
//        int rc = FFmpeg.execute(parameter);
//        if (rc == RETURN_CODE_SUCCESS) {
//            Log.i(Config.TAG, "Command execution completed successfully.");
//        } else if (rc == RETURN_CODE_CANCEL) {
//            Log.i(Config.TAG, "Command execution cancelled by user.");
//        } else {
//            Log.i(Config.TAG, String.format("Command execution failed with rc=%d and the output below.", rc));
//            Config.printLastCommandOutput(Log.INFO);
//        }

        Long curTimeStamp = System.currentTimeMillis();
        String curTimeStampString = String.format("%015d", curTimeStamp);
        long unit = 100 * 1000;
        curSent = 0;
        MediaManager.get().upload(uri)
                .option("resource_type", resource_type)
                //.unsigned("dmljgqvn")
                .option("folder", folder)
                .option("public_id", curTimeStampString)
                .callback(new UploadCallback() {
                    @Override
                    public void onStart(String requestId) {
                        Log.d("011 =------------", "start");
                    }

                    @Override
                    public void onProgress(String requestId, long bytes, long totalBytes) {
                        Log.d("012 =------------", "Uploading bytes: " + Long.toString(bytes) + "   totalBytes: " + Long.toString(totalBytes));

                        if (totalBytes > unit) {
                            if (bytes > (curSent + unit)) {
                                curSent = bytes;
                                WritableMap params = Arguments.createMap();
                                int percent = Math.round(bytes * 100 / totalBytes);
                                params.putString("percent", String.valueOf(percent));
                                sendEvent(reactContext, "EventUploadProgress", params);
                            }
                        }
                    }

                    @Override
                    public void onSuccess(String requestId, Map resultData) {
                        Log.d("013 =------------", "Video URL: " + resultData.get("secure_url").toString());
                        successCallback.invoke(resultData.get("url").toString());
                    }

                    @Override
                    public void onError(String requestId, ErrorInfo error) {
                        Log.d("014 =------------", "error: " + error.getDescription());
                        errorCallback.invoke(error.getDescription());
                    }

                    @Override
                    public void onReschedule(String requestId, ErrorInfo error) {
                        Log.d("015 =------------", "Reshedule: " + error.getDescription());
                    }
                }).dispatch();
    }

    VideoUpload(ReactApplicationContext context) {
        super(context);
        reactContext = context;
    }

    private static boolean copyAssetFolder(AssetManager assetManager,
                                           String fromAssetPath, String toPath) {
        try {
            String[] files = assetManager.list(fromAssetPath);
            new File(toPath).mkdirs();
            boolean res = true;
            for (String file : files)
                if (file.contains("."))
                    res &= copyAsset(assetManager,
                            fromAssetPath + "/" + file,
                            toPath + "/" + file);
                else
                    res &= copyAssetFolder(assetManager,
                            fromAssetPath + "/" + file,
                            toPath + "/" + file);
            return res;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    private static boolean copyAsset(AssetManager assetManager,
                                     String fromAssetPath, String toPath) {
        InputStream in = null;
        OutputStream out = null;
        try {
            in = assetManager.open(fromAssetPath);
            new File(toPath).createNewFile();
            out = new FileOutputStream(toPath);
            copyFile(in, out);
            in.close();
            in = null;
            out.flush();
            out.close();
            out = null;
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    private static void copyFile(InputStream in, OutputStream out) throws IOException {
        byte[] buffer = new byte[1024];
        int read;
        while ((read = in.read(buffer)) != -1) {
            out.write(buffer, 0, read);
        }
    }
}
