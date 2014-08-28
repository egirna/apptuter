//
//  PushManager.h
//
//  Created by Asaf Ron on 7/18/13.
//  Copyright (c) 2013 Groboot. All rights reserved.
// 

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

@class PushAppsManager;

@protocol PushAppsDelegate <NSObject>

@optional
- (void)pushApps:(PushAppsManager *)manager didReceiveRemoteNotification:(NSDictionary *)pushNotification whileInForeground:(BOOL)inForeground;

@optional
- (void)pushApps:(PushAppsManager *)manager didUpdateUserToken:(NSString *)pushToken;


@end

@interface PushAppsManager : NSObject

@property (nonatomic, strong) id<PushAppsDelegate> delegate;

#pragma mark - Initialization

/**
 *  Designated method to create a shared PushAppsManager.
 *
 *  @return A shared instance of PushAppsManager.
 */
+ (PushAppsManager *)sharedInstance;

#pragma mark - Handle Push Actions

/**
 *  A method to identify an application with PushApps. Method is critical since it starts the registration to Push Notification message services.
 *
 *  @param appToken an NSString "hard coded" token retrived from PushApps web site, under "My Apps", "setting". each app token is a unique token, designated to be used in a single application.
 *  @param launchOptions An NSDictionary object passed as a parameter with in the delegate method application:didFinishLaunchingWithOptions.
 *
 */
- (void)startPushAppsWithAppToken:(NSString *)appToken withLaunchOptions:(NSDictionary *)launchOptions;

/**
 *  A method to finalize the registration to PushApps. Method is critical since it provides the device ID.
 *
 *  @param data an NSData object which encapsulates device data.
 *
 */
- (void)updatePushToken:(NSData *)data;

/**
 *  A method to unregister a device by it's device ID (UDID).
 *
 *  @param deviceID an NSString containing the device UDID uniqu identifier.
 *
 */
- (void)unregisterFromPushNotificationsByDeviceId:(NSString *)deviceID;

/**
 *  A method to report a new push notification event.
 *
 *  @param eventId an NSString value which serves as an ID to identify a new push notification event.
 *
 */
- (void)reportEventwithEventId:(NSString *)eventId;

/**
 *  A method to Handle a Notification Received while app in foreground
 *
 *  @param launchOptions an NSDictionary containing user info.
 *
 */
- (void)handlePushMessageOnForeground:(NSDictionary *)launchOptions;

/**
 *  Method to update a Push Notification status
 *
 *  @param options an NSDictionary object that holds the NSRemoteNotification data.
 *
 *  @discussion Use this method to update the status of an NSNotification sent to a client. Updating the status of the notification will be visible via PushApps web interface.
 */
- (void)updateNotificationReadStatus:(NSDictionary *)options;

#pragma mark - Helper Methods

/**
 *  A method to clear all application badges.
 *
 */
- (void)clearApplicationBadge;

/**
 *  Method to retrive the device UDID
 *
 *  @return an NSString containing the device UDID.
 */
- (NSString *)getDeviceId;

/**
 *  Method to retrive the device name
 *
 *  @return an NSString containing the device name (i.e. iPhone5c).
 */
- (NSString *)getDeviceName;

/**
 *  Method to retrive the SDK version of PushApps SDK
 *
 *  @return an NSNumber object, with a float representation of the SDK version.
 */
- (NSNumber *)getSDKVersion;

/**
 *  Method to retrive the AppVersion of the SDK.
 *
 *  @return an NSString containing the app version.
 */
- (NSString *)getAppVersion;

@end