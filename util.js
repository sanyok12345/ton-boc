const intToIPv4 = (int) => {
    const part1 = int & 255;
    const part2 = ((int >> 8) & 255);
    const part3 = ((int >> 16) & 255);
    const part4 = ((int >> 24) & 255);

    return part4 + "." + part3 + "." + part2 + "." + part1;
}

const bigIntToBuffer = (bigInt) => {
    const hex = bigInt.toString(16);
    return Buffer.from(hex.length % 2 ? `0${hex}` : hex, 'hex');
}

module.exports = {
    intToIPv4,
    bigIntToBuffer
}