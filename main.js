/***
 * Basic Example
 */

const SHA256 = require('crypto-js/sha256');

class Block {
    constructor(index, timeStamp, data, previousHash) {
        this.index = index;
        this.timeStamp = timeStamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timeStamp + JSON.stringify(this.data)).toString();
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
    }

    createGenesisBlock() {
        return new Block(0, "01/01/2021", "Genesis Block", "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currBlock = this.chain[i];
            const prevBlock = this.chain[i-1];

            if (currBlock.hash !== currBlock.calculateHash()) {
                return false;
            }
            
            if (currBlock.previousHash !== prevBlock.hash) {
                return false;
            }
        }
        return true;
    }
}


let ldeepakCoin = new Blockchain();
ldeepakCoin.addBlock(new Block(1, "10/ 01/2021", { amount: 4 }));
ldeepakCoin.addBlock(new Block(2, "11/01/2021", { amount: 14 }));
ldeepakCoin.addBlock(new Block(3, "15/01/2021", { amount: 9 }));

console.log(JSON.stringify(ldeepakCoin, null, 4));

console.log('Is Blockchain valid? '+ ldeepakCoin.isChainValid());

/**Data tempering */
ldeepakCoin.chain[1].data = { amount: 100 };
ldeepakCoin.chain[1].hash = ldeepakCoin.chain[1].calculateHash();

console.log(JSON.stringify(ldeepakCoin, null, 4));

console.log('Is Blockchain valid? '+ ldeepakCoin.isChainValid());
