import {useState} from 'react';
import toast from "react-hot-toast";

const ALLOWED_FILE_TYPES = [
	'audio/mpeg',
	'audio/mp4',
	'audio/wav',
	'audio/m4a',
	'audio/webm',
]

export default function FileUpload({setTranscript}) {
	const [file, setFile] = useState();
	const [uploading, setUploading] = useState(false)

	const handleFileChange = (e) => {
		if (e.target.files) {
			let file = e.target.files[0]

			if (ALLOWED_FILE_TYPES.indexOf(file.type) === -1) {
				toast.error('Only mp3, mp4, mpeg, mpga, m4a, wav, or webm files are allowed')
				return
			}
			setFile(file);
		}
	};

	const handleUploadClick = async () => {
		if (!file) {
			return;
		}
		setUploading(true)

		const formData = new FormData();
		formData.append('file', file);

		let response = await fetch('/api/process', {
			method: 'POST',
			body: formData
		})
		if (response.ok) {
			response = await response.json()
			setTranscript(response.message)
			toast.success('Transcript is ready!')
		} else {
			response = await response.json()
			toast.error(response.message)
		}
		setUploading(false)
	};

	return (
		<div className="mb-1">
			<div>
				<label htmlFor="formFile" className="mb-2 inline-block">
					Upload a PDF File
				</label>
				<input
					className="relative file:bg-secondary file:uppercase text-xs file:text-xs file:px-6 file:pb-2 file:pt-2.5 text-secondary m-0 block w-full min-w-0 flex-auto rounded border border-solid border-[#DEF2F1] bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:px-3 file:py-[0.32rem] file:text-white file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem]"
					type="file"
					id="formFile"
					onChange={handleFileChange}
				/>
			</div>

			<div className={"text-right py-3"}>
				<button
					type="button"
					onClick={handleUploadClick}
					disabled={uploading}
					className="inline-block rounded bg-secondary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-primary shadow-sm transition duration-150 ease-in-out hover:bg-dark hover:shadow-md disabled:bg-light disabled:cursor-not-allowed">
					{uploading ? 'Please wait...' : 'Upload'}
				</button>
			</div>
		</div>
	)
}