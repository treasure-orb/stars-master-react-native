//
//  VideoUploadBridge.m
//  Stars
//
//  Created by Dick on 11/26/20.
//

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(VideoUpload, NSObject)

- (NSArray<NSString *> *)supportedEvents
{
  return @[@"EventUploadProgress"];
}

RCT_EXTERN_METHOD(upload:(NSString*)uri folder:(NSString*)folder resourceType:(NSString*)resourceType callback:(RCTResponseSenderBlock)callback)

@end
