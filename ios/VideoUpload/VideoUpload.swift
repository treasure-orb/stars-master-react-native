//
//  VideoUpload.swift
//  Stars
//
//  Created by Dick on 11/26/20.
//

// CalendarManager.swift


import Foundation
import UIKit
import CoreData
import Cloudinary


@objc(VideoUpload)
class VideoUpload: RCTEventEmitter {
  @objc(upload:folder:resourceType:callback:)
  func upload( url: String, folder: String, resourceType: String, callback: RCTResponseSenderBlock ) -> Void {
    print("This is url from Swift")
    print(url);

//    crn_dev
    let config = CLDConfiguration(cloudinaryUrl: "cloudinary://882925219281537:ppqMDgtivesiIut2_uC0rSylJHM@snaplist")!
//    let config = CLDConfiguration(cloudinaryUrl: "cloudinary://971834439273445:vmSnkyUe0U7PGSa0tlHIFn185KM@dickwork")!


    let cloudinary = CLDCloudinary(configuration: config)

    let nowDouble = NSDate().timeIntervalSince1970
    let timestamp =  String(Int64(nowDouble*1000))

    let params = CLDUploadRequestParams()
    params.setResourceType(resourceType)
    _ = params.setFolder(folder)
    params.setPublicId(timestamp)

    cloudinary.createUploader().signedUpload(
      url: NSURL(string:url)! as URL, params: params, progress: { (progress) in
        print("progress.fractionCompleted : \(progress.fractionCompleted)")
        self.sendEvent(withName: "EventUploadProgress", body: ["percent":round(progress.fractionCompleted * 100)])
      }, completionHandler: {(response, error) in
        print("response.url : \(String(describing: response?.url))")
        print("error : \(String(describing: error))")

        if(error != nil){
          self.sendEvent(withName: "EventUploadProgress", body: ["percent":-1])
        } else{
          self.sendEvent(withName: "EventUploadProgress", body: ["percent":100, "url": response?.url ?? ""])
        }


        //        if(error != nil){
        //          callback(["error", []]);
        //        } else{
        //          let respArray = ["This is success result string"];
        //          callback([NSNull(), respArray]);
        //        }
      })
  }
}
