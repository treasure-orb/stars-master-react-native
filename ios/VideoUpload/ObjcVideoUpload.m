//
//  ObjcVideoUpload.m
//  Stars
//
//  Created by Dick on 11/26/20.
//

#import "ObjcVideoUpload.h"
#import <React/RCTLog.h>

@implementation ObjcVideoUpload

RCT_EXPORT_MODULE();

- (NSArray<NSString *> *)supportedEvents
{
  return @[@"ObjcEventUploadProgress"];
}

RCT_EXPORT_METHOD(objcUpload:(NSString*)uri folder:(NSString*)folder resourceType:(NSString*)resourceType callback:(RCTResponseSenderBlock)callback)
{
  RCTLogInfo(@"--------- uri : %@", uri);
  
  NSString *percentValue = @"percent value";
  [self sendEventWithName:@"ObjcEventUploadProgress" body:@{@"percent": percentValue}];
  
  NSArray * respArray = @[@"This is success result string"];
//  callback(@[@"error occured", respArray]);
  callback(@[[NSNull null], respArray]);
}

@end
