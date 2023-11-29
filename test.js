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
