import FileUpload from "@/components/FileUpload";
import Intro from "@/components/Intro";
import Head from 'next/head'
import {useState} from "react";

export default function Home() {
	const [transcript, setTranscript] = useState('')
	return (
		<div className={"bg-[url('/bg.jpg')] object-contain"}>
			<Head>
				<title>EchoScribe - Convert Audio To Text</title>
			</Head>

			<main className={`w-full h-screen`}>
				<div className={"max-w-5xl mx-auto text-primary"}>
					{/*header*/}
					<h1 className={"px-5 lg:px-0 py-4 text-5xl font-bold text-primary"}>EchoScribe</h1>

					{/*content*/}
					<div className={"flex flex-col mt-5 px-5 lg:px-0 h-[calc(100vh-170px)] min-h-[calc(100vh-170px)]"}>

						{/*intro*/}
						<Intro/>

						{/*file upload*/}
						<div className={"w-full w-9/12"}><FileUpload setTranscript={setTranscript}/></div>

						{/*transcript*/}
						<h2 className={"text-lg mb-2"}>Transcript:</h2>
						<div className={"border grow overflow-auto bg-[#f7f5f5] text-black p-3 rounded"}>
							{
								transcript
									? transcript
									: <div className={"flex justify-center items-center h-full"}>No data to display</div>

							}
						</div>
					</div>
				</div>
			</main>
		</div>
	)
}
