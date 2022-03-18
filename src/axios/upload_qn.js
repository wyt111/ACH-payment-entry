//七牛上传插件
import * as qiniu from 'qiniu-js';

export default {

    //Get the current time (mm / DD / yy)
    getCurDate() {
        let d = new Date();
        return d.getFullYear() + "" + (d.getMonth() < 9 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1) + "" + (d.getDate() < 10 ? "0" + d.getDate() : d.getDate());
    },

    /**
     *Upload file to qiniu
     * @param data Qiniu cloud returned by the interface (token)
     * @param fileObj Selected upload file
     * @param mimeTypeCon Upload file type
     * @param saveFileName Upload file name
     * @param callbackFuSucess Upload successful callback method
     * @param callbackFuFailed Upload failure callback method
     * @param callbackFuProgress Upload progress callback method
     */
    uploadFileQN(data, fileObj, mimeTypeCon, saveFileName, callbackFuSucess) {
        let uptoken = data.upToken;
        let file = fileObj; //Blob object，Uploaded files
        // let key = null;  //After uploading, the file resource name is mainly the set key. If the key is null or undefined, the file resource name will take the hash value as the resource name
        let key = saveFileName;

        let config = {
            useCdnDomain: true,   //Indicates whether to use CDN to accelerate the domain name. It is a Boolean value, true indicates to use, and the default is false
            region: null     //Modify the upload region according to the specific prompt. When it is null or undefined, the upload domain name region will be automatically analyzed
        };

        let putExtra = {
            fname: file.name,  //File original file name
            params: {}, //Used to place custom variables
            mimeType: mimeTypeCon  //It is used to limit the type of uploaded file. When null, it means that the file type is not limited; Put the restriction type into the array：["image/png", "image/jpeg", "image/gif"]
        };
        let observable = qiniu.upload(file, key, uptoken, putExtra, config);
        observable.subscribe({
            // next: (result) => {
            //     //It is mainly used to show the progress
            //     callbackFuProgress(result);
            // },
            // error: (errResult) => {
            //     //Failure error message
            //     callbackFuFailed(errResult);
            // },
            complete: (result) => {
                //Information returned after successful reception
                callbackFuSucess(data, result);
            }
        })
    }
}
