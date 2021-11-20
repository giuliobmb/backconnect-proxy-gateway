var fs = require("fs");

let readArr = (fileName) => {
    let data = fs.readFileSync(fileName);
    let arr = data.toString().replace(/\r\n/g,'\n').split('\n');
    for(i=0;i<arr.length;i++){
        let s = arr[i].split(':');
        let news = 'http://' + s[2] + ':' + s[3] + '@' + s[0] + ':' + s[1];
        arr[i] = news;
    }
    return arr;
}

module.exports = readArr; 
    
