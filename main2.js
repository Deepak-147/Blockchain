/***
 * Proof of work
 */

const SHA256 = require('crypto-js/sha256');

class Block {
    constructor(index, timeStamp, data, previousHash) {
        this.index = index;
        this.timeStamp = timeStamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timeStamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    mineBlock(difficulty) {
        /**Keep calculating the hash till it starts with certain fixed nnumber of 0's. This fixed numnber is called difficulty. */
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            /**nonce increment is required as calculateHash will keep producing same hash again and again for the same data. So we introduced a nonce and update it. */
            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log("Block mined: "+this.hash);
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 5;
    }

    createGenesisBlock() {
        return new Block(0, "01/01/2021", "Genesis Block", "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        // newBlock.hash = newBlock.calculateHash();
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

console.log("Mining block 1...");
ldeepakCoin.addBlock(new Block(1, "10/ 01/2021", { amount: 4 }));

console.log("Mining block 2...");
ldeepakCoin.addBlock(new Block(2, "11/01/2021", { amount: 14 }));
