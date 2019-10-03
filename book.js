const mdpdf = require('mdpdf')
const path = require('path')
const fs = require('fs')

const outputMd = 'output/combined.md'
const outputPdf = 'output/combined.pdf'

const cleanFile = async () =>
	await fs.writeFileSync(outputMd, '', () => {
		console.log('done')
	})

const combinedMdStream = async text =>
	await fs.appendFileSync(outputMd, text, err => {
		if (err) {
			console.log(err)
		} else {
			console.log('Added')
		}
	})

let options = {
	source: path.join(__dirname, outputMd),
	destination: path.join(__dirname, outputPdf),
	// styles: path.join(__dirname, 'md-styles.css'),
	pdf: {
		format: 'A4',
		orientation: 'portrait'
	}
}

const getChapters = async () => {
	return fs
		.readdirSync('./chapters/')
		.filter(file => file.startsWith('chapter') && file.endsWith('.md'))
}

const combineFiles = async () => {
	const chapters = await getChapters()

	for (const file of chapters) {
		const content = fs.readFileSync(`chapters/${file}`, 'utf8')

		await combinedMdStream(
			'\n<div style="page-break-after: always;"></div>\n'
		)
		await combinedMdStream(content)
	}
}

const generatePdf = async () => {
	await cleanFile()
	await combineFiles()

	await mdpdf
		.convert(options)
		.then(pdfPath => {
			console.log('PDF Generated!')
		})
		.catch(err => {
			console.error(err)
		})
}

generatePdf()
