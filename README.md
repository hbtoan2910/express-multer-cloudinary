# express-multer-cloudinary
1. Install dependencies:

    Express,
    
    Multer,
    Fs,
    
    Cloudinary.
    
2. Create an app with Express

3. Multer section:

    Create storage by using function multer.diskStorage() 
    
    => declare destination (local directory to store uploaded file) and filename (customed name of uploaded file in local directory)
    
    Create fileFilter to filter file types to upload
    
    Create function upload with storage, limits (limit file size to upload to Multer server), and fileFilter
    
4. Cloudinary section:
    
    Config Cloudinary (to be able to link with cloudinary.com)
    
    Create function uploads by using function cloudinary.uploader.upload
    
    => declare file, folder (transformation if needed)
    
5.  Create app.post:
    
     Single upload use function upload.single(), then use uploads to upload file to Cloudinary server
     
     Multiple upload use function upload.array(), then use uploads to upload file to Cloudinary server
     
     Use function fs.unlinksync() to remove local files (uploaded with Multer) to save local memory.
     
