//
//  CDVPushApps.m
//  PushAppsPhonegapPlugin
//
//  Created by Asaf Ron on 11/21/13.
//
//

#import "CDVPushApps.h"

@interface CDVPushApps()

@end

@implementation CDVPushApps

- (CDVPlugin*)initWithWebView:(UIWebView*)theWebView
{
    self = [super initWithWebView:theWebView];
    if (self) {
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(checkForLaunchOptions:) name:@"UIApplicationDidFinishLaunchingNotification" object:nil];
    }
    return self;
}

#define LastPushMessageDictionary @"PUSHAPPSSDK_LastPushMessageDictionary"

- (void)checkForLaunchOptions:(NSNotification *)notification
{
    NSDictionary *launchOptions = [notification userInfo] ;
    
    // This code will be called immediately after application:didFinishLaunchingWithOptions:.
    NSDictionary *notifDictionary = [launchOptions objectForKey:UIApplicationLaunchOptionsRemoteNotificationKey];
    if (notifDictionary) {
        [[NSUserDefaults standardUserDefaults] setObject:notifDictionary forKey:LastPushMessageDictionary];
        [[NSUserDefaults standardUserDefaults] synchronize];
    }
}

#define Callback_RegisterUser @"PUSHAPPSSDK_Callback_RegisterUser"

- (void)registerUser:(CDVInvokedUrlCommand *)command
{
    NSString *appToken = [[command.arguments objectAtIndex:0] objectForKey:@"appToken"];
    
    if ([appToken isKindOfClass:[NSString class]]) {
        
        // Saving callback to user defaults
        [self saveCallbackWithName:Callback_RegisterUser andId:command.callbackId];
        
        // Starting the push apps manager
        [[PushAppsManager sharedInstance] setDelegate:self];
        [[PushAppsManager sharedInstance] startPushAppsWithAppToken:appToken withLaunchOptions:nil];
        
    } else {
        
        // Clear callback to user defaults
        [self saveCallbackWithName:Callback_RegisterUser andId:@""];
        
        // Throw error to JS
        CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"App Token must be supplied"];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }
}

- (void)unregisterUser:(CDVInvokedUrlCommand*)command
{
    // TODO: implement
}

- (void)saveCallbackWithName:(NSString *)name andId:(NSString *)callbackId
{
    // Saving callback to user defaults
    [[NSUserDefaults standardUserDefaults] setObject:callbackId forKey:name];
    [[NSUserDefaults standardUserDefaults] synchronize];
}

- (NSString *)getCallbackIdForAction:(NSString *)action
{
    return [[NSUserDefaults standardUserDefaults] objectForKey:action];
}

#pragma mark - push apps delegate

- (void)pushApps:(PushAppsManager *)manager didReceiveRemoteNotification:(NSDictionary *)pushNotification whileInForeground:(BOOL)inForeground
{
    [self updateWithMessageParams:pushNotification];
}

- (void)updateWithMessageParams:(NSDictionary *)pushNotification
{
    // Clear application badge
    [[PushAppsManager sharedInstance] clearApplicationBadge];
    
    NSError *error;
    NSData *jsonData = [NSJSONSerialization dataWithJSONObject:pushNotification options:0 error:&error];
    
    NSString *jsonString = @"{}";
    if (jsonData) {
        jsonString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
    }
    
    // Update JS
    NSString *javascripCode = [NSString stringWithFormat:@"PushNotification.messageReceive('%@')", jsonString];
    [self performSelectorOnMainThread:@selector(writeJavascript:) withObject:javascripCode waitUntilDone:YES];
}

- (void)pushApps:(PushAppsManager *)manager didUpdateUserToken:(NSString *)pushToken
{
    // Update JS
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:pushToken];
    
    NSString *callbackId = [self getCallbackIdForAction:Callback_RegisterUser];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:callbackId];
    
    NSDictionary *checkForLastMessage = [[NSUserDefaults standardUserDefaults] objectForKey:LastPushMessageDictionary];
    if (checkForLastMessage) {
        [self updateWithMessageParams:checkForLastMessage];
        
        // Clear last message
        [[NSUserDefaults standardUserDefaults] removeObjectForKey:LastPushMessageDictionary];
        [[NSUserDefaults standardUserDefaults] synchronize];
    }
}

@end
