import formidable from 'formidable-serverless';
import fs from 'fs'
import * as FormData from "form-data"
import fetch from 'node-fetch'

const WHISPER_URL = 'https://api.openai.com/v1/audio/transcriptions'

export const config = {
	api: {
		bodyParser: false,
	},
};

export default async function handler(req, res) {
	// 1. only allow POST methods
	if (req.method !== 'POST') {
		return res.status(400).send('method not supported')
	}

	try {
		// 2. initialize formidable
		let form = new formidable.IncomingForm();

		// 3. save the file locally
		form.on('fileBegin', (name, file) => {
			file.path = `./files/${file.name}`
		})

		// 4. parse form by formidable
		form.parse(req, async (error, fields, files) => {
			// 5. handle error
			if (error) {
				console.error('Failed to parse form data:', error);
				return res.status(500).json({message: 'Failed to parse form data'});
			}

			const file = files.file;

			// 6. Check if the file object exists
			if (!file) {
				return res.status(400).json({message: 'No file uploaded'});
			}

			// 7. Check if the necessary file properties are available
			if (!file.name || !file.path || !file.type) {
				return res.status(400).json({message: 'Invalid file data'});
			}

			// 8. Build form data to send to openai
			const formData = new FormData();

			formData.append("file", fs.createReadStream(file.path));
			formData.append("model", "whisper-1");
			formData.append("language", "en");

			// 9. make a post call
			let response = await fetch(WHISPER_URL, {
				method: 'POST',
				body: formData,
				headers: {
					"Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
					'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
				},
			})

			if (response.ok) {
				// 10. if all good
				response = await response.json()
				// 11. delete the file
				fs.unlink(file.path, () => console.log('file deleted'))
				return res.status(200).json({message: response.text});
			} else {
				// 11. delete the file
				fs.unlink(file.path, () => console.log('file deleted'))
				return res.status(400).json({message: 'error in generating transcription'});
			}
		})
	} catch (e) {
		// 12. if error
		return res.status(500).send({message: e.message})
	}
}
