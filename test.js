// const fs = require('fs');
// const path = require('path');

// const rootFolder = '/home/mekan/Desktop/abc';

// function getFileSize(filePath) {
//     const stats = fs.statSync(filePath);
//     return stats.size;
// }

// function convertToBinary(filePath) {
//     const content = fs.readFileSync(filePath);
//     const binaryData = content.toString('binary');
//     return binaryData.substring(0, 20);
// }

// function findMatchingFiles(folderPath, referenceBinary) {
//     const folders = fs.readdirSync(folderPath);

//     for (const folder of folders) {
//         const folderPath = path.join(rootFolder, folder);

//         if (fs.statSync(folderPath).isDirectory()) {
//             const files = fs.readdirSync(folderPath);

//             for (const file of files) {
//                 const filePath = path.join(folderPath, file);

//                 if (filePath !== referenceBinary) {
//                     const fileSize = getFileSize(filePath);

//                     if (fileSize <= 20) {
//                         const binaryData = convertToBinary(filePath);
//                         if (binaryData === referenceBinary) {
//                             console.log(`Eşleşen Dosya Bulundu: ${filePath}`);
//                         }
//                     }
//                 }
//             }
//         }
//     }
// }

// function processFolder(folderPath) {
//     const folders = fs.readdirSync(folderPath);

//     for (const folder of folders) {
//         const folderPath = path.join(rootFolder, folder);

//         if (fs.statSync(folderPath).isDirectory()) {
//             const files = fs.readdirSync(folderPath);

//             for (const file of files) {
//                 const filePath = path.join(folderPath, file);
//                 const fileSize = getFileSize(filePath);

//                 // Dosyanın boyutu 20 byte ise
//                 if (fileSize <= 20) {
//                     const referenceBinary = convertToBinary(filePath);
//                     findMatchingFiles(rootFolder, referenceBinary);
//                 }
//             }
//         }
//     }
// }

// processFolder(rootFolder);


// const express = require('express')
// const fs = require('fs')
// const app = express()
// const port = 8000
// const videos = [
//     {
//         id: "100ms video sdk",
//         duration: '42 secs',
//         name: '100ms Video SDK'
//     },
//     {
//         id: "100ms live",
//         duration: '47 mins 52 secs',
//         name: 'Building a Video Conferencing App with 100ms.live'
//     }
// ]

// app.get('/', (req, res) => {
//     res.json(videos)
// })

// app.get('/:id/metadata', (req, res) => {
//     const id = parseInt(req.params.id, 10)
//     res.json(videos[id])
// })

// app.get('/video', (req, res) => {
//     const videoPath = 'Vue.mp4'
//     const videoStat = fs.statSync(videoPath)
//     const fileSize = Number(videoStat.size)
//     console.log('videoSize --> ', fileSize)
//     const videoRange = `bytes=100-20000`
//     if (!videoRange) {
//         const parts = videoRange.replace(/bytes=/, "").split("-")
//         console.log('parts --> ', parts)
//         const start = parseInt(parts[0], 10)
//         console.log('start --> ', start)
//         const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1
//         console.log('end --> ', end)
//         const chunksize = (end - start) + 1
//         console.log('chunSize --> ', chunksize)
//         const file = fs.createReadStream(videoPath, { start, end })
//         const header = {
//             'Content-Range': `bytes ${start}-${end}/${fileSize}`,
//             'Accept-Ranges': 'bytes',
//             'Content-Length': chunksize,
//             'Content-Type': 'video/mp4',
//         }
//         console.log('header --> ', header)
//         res.writeHead(206, header)
//         file.pipe(res)
//         console.log('----------------------------------------')
//     } else {
//         const head = {
//             'Content-Length': fileSize,
//             'Content-Type': 'video/mp4'
//         }
//         res.writeHead(200, head)
//         fs.createReadStream(videoPath).pipe(res)
//     }
// })

// app.listen(port, (err) => {
//     if (err) throw err
//     console.log(`Server is running: http://localhost:8000`)
// })



// const fs = require('fs')

// // async function readBinary() {
// //     try {
// //         const fileList = fs.readdirSync('routers')
// //         for (let i = 0; i < fileList.length; i++) {
// //             console.log(fileList[i]);
// //             const file = fs.readFileSync(`./routers/${fileList[i]}`, 'base64')
// //             console.log('Base64 file ----> ', file, '\n')
// //         }
// //     } catch (error) {
// //         console.log(error)
// //     }
// // }
// // readBinary()

// function generateCombinations(input) {
//     const result = [];

//     function generateHelper(current, remaining) {
//         if (remaining.length === 0) {
//             result.push(current);
//             return;
//         }

//         for (let i = 0; i < remaining.length; i++) {
//             const newCurrent = current + remaining[i];
//             const newRemaining = remaining.slice(0, i) + remaining.slice(i + 1);
//             generateHelper(newCurrent, newRemaining);
//         }
//     }

//     generateHelper('', input);
//     return result;
// }

// const userInput = 'abc';
// const combinations = generateCombinations(userInput);

// console.log(combinations)

// const readline = require('readline');

// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout
// });

// rl.question('Lütfen bir giriş yapın: ', (answer) => {
//   console.log(`Girişiniz: ${answer}`);
//   rl.close();
// });