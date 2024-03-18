const XLSX = require('xlsx');
const FS = require('fs')

async function arrayToExcel(data, sheetName, filePath) {
  // Yangi ish kitobini yaratish
  const workbook = XLSX.utils.book_new();
  
  // Ma'lumotlarni Excel varag'iga aylantirish
  const worksheet = XLSX.utils.aoa_to_sheet(data);
  
  // Varaqni ish kitobiga qo'shish
  const  a = XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
//   let fileBuffer =  Buffer.from(workbook, 'base64')  rs

  const buffer = await XLSX.write(workbook, {type:'buffer' ,bookType: 'xlsx' ,} );


return buffer
}

module.exports ={
    arrayToExcel
}