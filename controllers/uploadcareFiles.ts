import {
  deleteFile,
  UploadcareSimpleAuthSchema,
} from '@uploadcare/rest-client';

export const fileDelete = async (id:string)=>{
    if(!id)return
    try {
      const uploadcareSimpleAuthSchema = new UploadcareSimpleAuthSchema({
        publicKey: process.env.UPLOADCARE_PUBLIC_KEY!,
        secretKey: process.env.UPLOADCARE_SECRET_KEY!,
      });
      const result = await deleteFile(
        {
          uuid: id,
        },
        { authSchema: uploadcareSimpleAuthSchema }
      )
      return {success: true, msg:"photo removed successfully"}
    } catch (error: any) {
      return {success: false, msg:"photo with given id was not found"}
    }
  }

export const filesDelete = async (ids:string[])=>{
    ids.map(async (id)=>{
        await fileDelete(id)
    })
}