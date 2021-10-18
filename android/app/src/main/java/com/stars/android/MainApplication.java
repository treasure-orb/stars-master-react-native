package com.stars.android;

import com.stars.android.generated.BasePackageList;

import android.app.Application;
import android.content.Context;

import androidx.multidex.MultiDexApplication;

import com.bugsnag.android.Bugsnag;
import com.cloudinary.android.MediaManager;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.soloader.SoLoader;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import io.branch.rnbranch.RNBranchModule;

import java.lang.reflect.InvocationTargetException;
import java.util.HashMap;
import java.util.List;
import java.util.Arrays;

import java.util.Map;

import org.unimodules.adapters.react.ModuleRegistryAdapter;
import org.unimodules.adapters.react.ReactModuleRegistryProvider;

public class MainApplication extends MultiDexApplication implements ReactApplication {
    private final ReactModuleRegistryProvider mModuleRegistryProvider = new ReactModuleRegistryProvider(new BasePackageList().getPackageList(), null);
    private final ReactNativeHost mReactNativeHost =
            new ReactNativeHost(this) {
                @Override
                public boolean getUseDeveloperSupport() {
                    return BuildConfig.DEBUG;
                }

                @Override
                protected List<ReactPackage> getPackages() {
                    @SuppressWarnings("UnnecessaryLocalVariable")
                    List<ReactPackage> packages = new PackageList(this).getPackages();
                    // Packages that cannot be autolinked yet can be added manually here, for example:
                    // packages.add(new MyReactNativePackage());
                    packages.add(new VideoUploadPackage()); // <-- Add this line with your package name.
                    List<ReactPackage> unimodules = Arrays.<ReactPackage>asList(
                            new ModuleRegistryAdapter(mModuleRegistryProvider)
                    );
                    packages.addAll(unimodules);
                    return packages;
                }

                @Override
                protected String getJSMainModuleName() {
                    return "index";
                }
            };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this, /* native exopackage */ false);
        initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
        RNBranchModule.getAutoInstance(this);

//        crn_dev
        Map config = new HashMap();
        config.put("cloud_name", "snaplist");
        config.put("api_key", "882925219281537");
        config.put("api_secret", "ppqMDgtivesiIut2_uC0rSylJHM");
        MediaManager.init(this, config);
        Bugsnag.start(this);
    }

    /**
     * Loads Flipper in React Native templates. Call this in the onCreate method with something like
     * initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
     *
     * @param context
     * @param reactInstanceManager
     */
    private static void initializeFlipper(
            Context context, ReactInstanceManager reactInstanceManager) {
        if (BuildConfig.DEBUG) {
            try {
        /*
         We use reflection here to pick up the class that initializes Flipper,
        since Flipper library is not available in release mode
        */
                Class<?> aClass = Class.forName("com.stars.android.ReactNativeFlipper");
                aClass
                        .getMethod("initializeFlipper", Context.class, ReactInstanceManager.class)
                        .invoke(null, context, reactInstanceManager);
            } catch (ClassNotFoundException | NoSuchMethodException | IllegalAccessException | InvocationTargetException e) {
                e.printStackTrace();
            }
        }
    }
}
