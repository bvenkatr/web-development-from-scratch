const mdpdf = require('mdpdf')
const path = require('path')
const fs = require('fs')
var promises = []
var readline = require('readline')
const outputFileMd = 'output/combined.md'
const outputFilePdf = 'output/combined.pdf'

// let chapters = fs
// 	.readdirSync('./chapters/')
// 	.filter(fn => fn.startsWith('chapter') && fn.endsWith('.md'))

let options = {
	source: path.join(__dirname, outputFileMd),
	destination: path.join(__dirname, outputFilePdf),
	pdf: {
		format: 'A4',
		orientation: 'portrait'
	}
}

// chapters.sort()

// combineFiles(chapters)
// //generatePdf()

// function combineFiles(chapters) {
// 	let combinedFile = ''

// 	for (const file of chapters) {
// 		fs.readFile(path.join(__dirname, `chapters/${file}`), 'utf8', function(
// 			err,
// 			data
// 		) {
// 			console.log([err, data])
// 			combinedFile +=
// 				'\n<div style="page-break-after: always;"></div>\n' +
// 				data.toString()
// 		})
// 	}

// 	console.log([combinedFile])
// }

let generatePdf = () => {
	mdpdf
		.convert(options)
		.then(pdfPath => {
			console.log('PDF Path:', pdfPath)
		})
		.catch(err => {
			console.error(err)
		})
}

var readFile = file => {
	return new Promise((resolve, reject) => {
		var lines = []
		var rl = readline.createInterface({
			input: fs.createReadStream('./chapters/' + file)
		})

		rl.on('line', line => {
			lines.push(line)
		})

		rl.on('close', function() {
			// Add newlines to lines
			lines = lines.join('\n')
			resolve(lines)
		})
	})
}

var writeFile = data => {
	return new Promise((resolve, reject) => {
		fs.appendFile(outputFileMd, data, 'utf8', err => {
			if (err) {
				reject('Writing file error!')
			} else {
				resolve('Generated combined Markdown!')
			}
		})
	})
}

fs.readdir('./chapters', (err, files) => {
	for (var i = 0; i < files.length; i++) {
		promises.push(readFile(files[i]))

		if (i == files.length - 1) {
			var results = Promise.all(promises)

			results
				.then(writeFile)
				.then(data => {
					console.log(data)
				})
				.then(generatePdf)
				.catch(err => {
					console.log(err)
				})
		}
	}
})
