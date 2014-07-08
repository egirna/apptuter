package com.pushapps.phonegap;

import java.util.HashMap;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;

import com.groboot.pushapps.PushAppsRegistrationInterface;
import com.groboot.pushapps.PushManager;
import com.groboot.pushapps.SharedData;

public class PushAppsPlugin extends CordovaPlugin {

	public static final String ACTION_REGISTER_USER = "registerUser";
	public static final String ACTION_UNREGISTER_USER = "unRegisterUser";
	public static final String ACTION_GET_DEVICE_ID = "getDeviceId";

	boolean receiversRegistered = false;

	HashMap<String, CallbackContext> callbackIds = new HashMap<String, CallbackContext>();
	PushManager manager;

	@Override
	public void onNewIntent(Intent intent) {
		super.onNewIntent(intent);
		checkIntentExtras(intent);
	}

	// Called when there is need to check current messages
	private void checkIntentExtras(Intent intent) {
		String message = intent.getExtras().getString("Message");
		if (message != null && message.length() > 0) {
			String notificationId = intent.getExtras().getString("Id");
			if (!SharedData
					.getInstance(cordova.getActivity().getApplicationContext())
					.getPrefString("LastPushMessageRead", "")
					.equals(notificationId)) {
				SharedData.getInstance(
						cordova.getActivity().getApplicationContext())
						.setPrefString("LastPushMessageRead", notificationId);
				Bundle params = intent.getExtras();
				internalOnMessage(getJSONStringFromBundle(params));
			}

		}
	}

	private void internalOnMessage(JSONObject message) {
		final String jsStatement = String.format(
				"PushNotification.messageReceive('%s');", message.toString());

		cordova.getActivity().runOnUiThread(new Runnable() {
			@Override
			public void run() {
				webView.loadUrl("javascript:" + jsStatement);
			}
		});
	}

	PushAppsRegistrationInterface pushAppsRegistrationInterface = new PushAppsRegistrationInterface() {

		@Override
		public void onUnregistered(Context paramContext, String paramString) {
			CallbackContext callback = callbackIds.get("unregisterDevice");
			if (callback == null)
				return;

			callback.success(paramString);
			callbackIds.remove("unregisterDevice");
		}

		@Override
		public void onRegistered(Context paramContext, String paramString) {
			CallbackContext callback = callbackIds.get("registerDevice");
			if (callback == null)
				return;

			callback.success(paramString);
			callbackIds.remove("registerDevice");
		}
	};

	// Utility function. convert bundle into JSONObject
	private static JSONObject getJSONStringFromBundle(Bundle bundle) {
		JSONObject jsonObject = new JSONObject();
		for (String key : bundle.keySet()) {
			Object value = bundle.get(key);
			try {
				jsonObject.put(key, value.toString());
			} catch (JSONException e) {
				// Do nothing
			}
		}
		return jsonObject;
	}

	// Main internal function which register a device via the PushApps manager
	private boolean internalRegister(JSONArray data,
			CallbackContext callbackContext) {
		JSONObject params = null;
		try {
			params = data.getJSONObject(0);
		} catch (JSONException e) {
			callbackContext.error(e.getMessage());
			return true;
		}

		callbackIds.put("registerDevice", callbackContext);

		try {
			String googleProjectId = "";
			if (params.has("googleProjectId")) {
				googleProjectId = params.getString("googleProjectId");
			}
			String appToken = "";
			if (params.has("appToken")) {
				appToken = params.getString("appToken");
			}

			PushManager.init(cordova.getActivity().getApplicationContext(),
					googleProjectId, appToken);
			manager = PushManager.getInstance(cordova.getActivity()
					.getApplicationContext());
			manager.setIntentNameToLaunch(cordova.getActivity()
					.getPackageName()
					+ "."
					+ cordova.getActivity().getLocalClassName());
			manager.registerForRegistrationEvents(pushAppsRegistrationInterface);

			checkIntentExtras(cordova.getActivity().getIntent());

		} catch (JSONException e) {
			callbackIds.remove("registerDevice");
			callbackContext.error(e.getMessage());
			return true;
		}

		return true;
	}

	// Call unregister via PushApps manager
	private boolean internalUnregister(JSONArray data,
			CallbackContext callbackContext) {

		callbackIds.put("unregisterDevice", callbackContext);
		manager.unregister();

		return true;
	}
	
	private boolean internalDeviceId(CallbackContext callbackContext) {
		
		callbackContext.success(this.manager.getDeviceId());
		
		return true;
	}

	// Main Phonegap method which convert JS request into native code
	@Override
	public boolean execute(String action, JSONArray args,
			CallbackContext callbackContext) throws JSONException {

		try {
			if (ACTION_REGISTER_USER.equals(action)) {
				return internalRegister(args, callbackContext);
			} else if (ACTION_UNREGISTER_USER.equals(action)) {
				return internalUnregister(args, callbackContext);
			} else if (ACTION_GET_DEVICE_ID.equals(action)) {
				return internalDeviceId(callbackContext);
			}
			callbackContext.error("Invalid action");
			return false;
		} catch (Exception e) {
			callbackContext.error(e.getMessage());
			return false;
		}
	}

}
