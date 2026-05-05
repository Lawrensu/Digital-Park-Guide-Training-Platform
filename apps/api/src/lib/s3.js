import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';


const s3 = new S3Client({
	region: process.env.AWS_REGION,
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
		// Learner Lab issues temporary credentials; sessionToken is required when present
		...(process.env.AWS_SESSION_TOKEN && { sessionToken: process.env.AWS_SESSION_TOKEN }),
	},
});

const BUCKET = process.env.AWS_S3_BUCKET;


async function getPresignedUploadUrl(key, contentType, expiresIn = 300) {
	const command = new PutObjectCommand({
		Bucket: BUCKET,
		Key: key,
		ContentType: contentType,
	});

	const url = await getSignedUrl(s3, command, { expiresIn });
	return { url, key };
}


async function getPresignedDownloadUrl(key, expiresIn = 900) {
	const command = new GetObjectCommand({
		Bucket: BUCKET,
		Key: key,
	});

	return getSignedUrl(s3, command, { expiresIn });
}


async function uploadBuffer(key, buffer, contentType) {
	const command = new PutObjectCommand({
		Bucket: BUCKET,
		Key: key,
		Body: buffer,
		ContentType: contentType,
	});

	await s3.send(command);
}


async function deleteObject(key) {
	const command = new DeleteObjectCommand({
		Bucket: BUCKET,
		Key: key,
	});

	await s3.send(command);
}


export { getPresignedUploadUrl, getPresignedDownloadUrl, uploadBuffer, deleteObject };
