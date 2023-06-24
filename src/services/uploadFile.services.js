require('dotenv').config();

const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const uuidV4 = require("uuidv4")

const AWS_ENDPOINT = process.env.AWS_ENDPOINT
const DEFAULT_REGION = process.env.AWS_LOCATION;
const ACCESS_KEY_ID = process.env.AWS_SECRET_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const BUCKET_NAME = process.env.AWS_BUCKET_NAME
// Set up the app and S3 config

exports.uploadFile = function uploadFile() {
    AWS.config.update({
        endpoint: AWS_ENDPOINT,
        region: DEFAULT_REGION,
        accessKeyId: ACCESS_KEY_ID,
        secretAccessKey: SECRET_ACCESS_KEY,
        s3ForcePathStyle: true, // Required for MinIO
        signatureVersion: 'v4', // Required for MinIO
    });
    const s3 = new AWS.S3();

    // Check if the bucket already exists before creating a new one
    s3.headBucket({ Bucket: BUCKET_NAME }, (err, data) => {
        if (err) {
            s3.createBucket({ Bucket: BUCKET_NAME, ACL: 'public-read' }, function (err, data) {
                if (err) console.log(err, err.stack);
                else console.log('Bucket created successfully:', data.Location);
            });
        }
    });

    // Set up the multer middleware to handle the file upload
    const storage = multerS3({
        s3: s3,
        bucket: BUCKET_NAME,
        acl: 'public-read',
        key: function (req, file, cb) {
            const uniqueId = uuidV4.uuid();
            cb(null, 'uploads/' + uniqueId + '-' + file.originalname);
        }
    });

    const upload = multer({ storage: storage });
    return upload;
}

// Set up the route to handle the file upload

