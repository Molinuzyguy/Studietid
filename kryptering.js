console.log("Kjører krypteringsalgoritme")

const bcrypt = require("bcrypt");

const saltrunder = 10
const passord = "123456"

function hashing(passord, saltrunder) {
    const hash = bcrypt.hashSync(passord, saltrunder);
    console.log("Hash: " + hash);
    return hash;
}

const hash = hashing(passord, saltrunder);

const b = bcrypt.compareSync(passord, hash);

console.log(b);