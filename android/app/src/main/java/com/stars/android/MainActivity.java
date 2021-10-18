package com.stars.android;
import io.branch.rnbranch.*; // <-- add this
import android.content.Intent; // <-- and this
import io.branch.rnbranch.RNBranchModule;

import android.content.Context;
import android.content.pm.PackageManager;
import android.content.res.AssetManager;
import android.os.Bundle;
import androidx.core.app.ActivityCompat;

import com.facebook.react.ReactActivity;
import org.devio.rn.splashscreen.SplashScreen;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

public class MainActivity extends ReactActivity {

    private static final int PERMISSION_CODE = 1;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        //SplashScreen.show(this, R.style.SplashScreenTheme);
        super.onCreate(savedInstanceState);

        String watermarkPath = getApplicationContext().getFilesDir() + "/watermark.png";
        AssetManager assetManager = getApplicationContext().getAssets();
        boolean res = copyAsset(assetManager, "watermark.png", watermarkPath);

        //requestPermission();
    }

    @Override
    public void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        RNBranchModule.onNewIntent(intent);
    }

    @Override
    protected void onStart() {
        super.onStart();
        RNBranchModule.initSession(getIntent().getData(), this);
    }
    /**
     * Returns the name of the main component registered from JavaScript. This is used to schedule
     * rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "Stars";
    }


    public static boolean hasPermissions(Context context, String... permissions) {
        if (context != null && permissions != null) {
            for (String permission : permissions) {
                if (ActivityCompat.checkSelfPermission(context, permission) != PackageManager.PERMISSION_GRANTED) {
                    return false;
                }
            }
        }
        return true;
    }

    private void requestPermission() {
        int PERMISSION_ALL = 1;
        String[] PERMISSIONS = {
                android.Manifest.permission.READ_EXTERNAL_STORAGE,
                android.Manifest.permission.WRITE_EXTERNAL_STORAGE,
                android.Manifest.permission.CAMERA,
                android.Manifest.permission.RECORD_AUDIO,
                android.Manifest.permission.INTERNET,
        };

        if (!hasPermissions(this, PERMISSIONS)) {
            ActivityCompat.requestPermissions(this, PERMISSIONS, PERMISSION_ALL);
        }

//        if (ContextCompat.checkSelfPermission
//                (MainActivity.this,
//                        Manifest.permission.READ_EXTERNAL_STORAGE
//                ) == PackageManager.PERMISSION_GRANTED
//        ) {
//        } else {
//            ActivityCompat.requestPermissions(
//                    MainActivity.this,
//                    new String[]{Manifest.permission.READ_EXTERNAL_STORAGE},
//                    PERMISSION_CODE
//            );
//        }
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
