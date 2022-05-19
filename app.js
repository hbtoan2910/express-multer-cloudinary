const express = require("express");
const app = express();
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const fs = require("fs");

//Initially, we use Multer to upload files to 'uploads' folder - our local directory
//which we created in advance
//After that, we upload these files from our local directory to Cloudinary.com and
//get responses.

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); //file.orginName included extension
  },
});

const fileFilter = (req, file, cb) => {
  if (
    //or we can use regular expression here, something like if
    //(!/\S+\.(jpeg||png||jpg)/gi.test(file.originName)) {do something}
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb({ message: "Unsupported file format" }, false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 20000000 }, //limit file size upload to Multer server to 20MB
  fileFilter: fileFilter,
});

//Cloudinary config to link with cloudinary.com
cloudinary.config({
  cloud_name: "hbtoan29101985",
  api_key: "644395972175867",
  api_secret: "24gqdfulqxroVYrFRhb0qXFhhug",
});

const uploads = async (file, folder) => {
  //able to upload local file, a remote URL, or a private storage URL (Amazon S3 or Google Cloud)
  return await cloudinary.uploader.upload(
    file,
    { folder: folder , transformation: { width: 2000, height: 1000, crop: "limit" } },
    (err, result) => {
      if (err) console.log("Error occured: ", err);
      return result;
    }
  );
};
//Create a POST request & pass a Multer middleware by using upload.single()
//fieldName in function single() must be same with value of attribute 'name'
//in element input of the HTML form
app.post("/upload_image", upload.single("image"), async (req, res) => {
  if (req.method === "POST") {
    const file = req.file;
    const newFile = await uploads(
      file.path,
      "ToanHuynh Single Image Collection"
    );
    fs.unlinkSync(file.path); //remove files in local directory to save memory
    res.status(200).redirect(newFile.url);
  } else {
    res.status(405).json({
      err: `${req.method} method is not allowed`,
    });
  }
});

//Create a POST request & pass a Multer middleware by using upload.array()
//fieldName in function array() must be same with value of attribute 'name'
//in element input of the HTML form
app.post("/upload_images", upload.array("images"), async (req, res) => {
  if (req.method === "POST") {
    const fileUploaded = [];
    const files = req.files;

    for (const file of files) {
      //'path' is a property of 'file', it shows file's location after uploaded (uploads\filename...)
      const { path } = file;
      //need to create folder in Cloudinary in advance, in this
      //case named 'ToanHuynh Multiple Images Collection' folder
      const newFile = await uploads(
        path,
        "ToanHuynh Multiple Images Collection"
      );

      fileUploaded.push(newFile);
      fs.unlinkSync(path); //remove files in local directory to save memory
    }
    res.status(200).json({
      message: "Images uploaded successfully",
      data: fileUploaded,
    });
  } else {
    res.status(405).json({
      err: `${req.method} method is not allowed`,
    });
  }
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.listen(5000, "localhost", () => {
  console.log("Server listening to localhost:5000 for connections...");
});
