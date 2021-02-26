const xlsx = require('node-xlsx');
const fs = require('fs');

const convertFileToCSV = () => {
    const obj = xlsx.parse(__dirname + '/data.xlsx');

    const rows = obj[0].data;
    const writeStr = rows.map(row => `${row.join(',')}\n`)

    fs.writeFileSync(__dirname + "/data.csv", writeStr.join(''));
}

const removeLettersAndWriteToFile = () => {
    const fileData = fs.readFileSync(__dirname + "/data.csv", 'utf-8');

    const arr = fileData.split('\n');

    const mapped = arr.map(item => {
        const divided = item.split(',')
        return divided.map(item => item.match(/\d{0,}/g).filter(i => i).join('|')).join('|||')
    })

    fs.writeFileSync(__dirname + "/onlyNumDivided.csv", mapped.join('\n'));
}

const removeUselessLines = () => {
    const fileData = fs.readFileSync(__dirname + "/onlyNumDivided.csv", 'utf-8');

    const arr = fileData.split('\n');

    const mapped = arr.filter(item => {
        return item.trim() && item.match(/\d{0,}/g).filter(i => i).join('').length > 8;
    })

    fs.writeFileSync(__dirname + "/withoutUseless.csv", mapped.join('\n'));
}

const checkDividedNumericData = () => {
    const fileData = fs.readFileSync(__dirname + "/withoutUseless.csv", 'utf-8');

    const arr = fileData.split('\n');

    const mapped = arr.map(line => {
        const subNumbers = line.split(/\|{3,}/);
        const filtered = subNumbers
            .map(item => item.match(/\d{0,}/g).filter(i => i).join(''))
            .filter(item => item.length > 8);

        if(filtered.length === 1) {
            return filtered[0];
        } else if(filtered.length > 1) {
            return filtered.join('\n')
        } else {
            return ''
        }
    });

    fs.writeFileSync(__dirname + "/onlyThatLookLikeNumbers.csv", mapped.join('\n'));
}

const adjustNumbersFormatting = () => {
    const fileData = fs.readFileSync(__dirname + "/onlyThatLookLikeNumbers.csv", 'utf-8');

    const arr = fileData.split('\n');

    const mapped = arr.map(item => {
        const trimmed = item.trim();

        if(trimmed.length === 12 && trimmed[0] == '3') {
            return `+${trimmed}`;
        } else if(trimmed.length === 11 && trimmed[0] == '8') {
            return `+3${trimmed}`;
        } else if(trimmed.length === 10 && trimmed[0] == '0') {
            return `+38${trimmed}`;
        } else if(trimmed.length === 9) {
            return `+380${trimmed}`;
        } if(trimmed.length > 12 || trimmed.length < 9) {
            return '';
        }
    })

    fs.writeFileSync(__dirname + "/result-number.csv", mapped.join('\n'));
}

convertFileToCSV();
removeLettersAndWriteToFile();
removeUselessLines();
checkDividedNumericData();
adjustNumbersFormatting();

