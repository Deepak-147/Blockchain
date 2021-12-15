/***
 * Mining and rewards
 */

const SHA256 = require('crypto-js/sha256');

class Transaction {
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}

class Block {
    constructor(timeStamp, transactions, previousHash) {
        this.timeStamp = timeStamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
        return SHA256(this.previousHash + this.timeStamp + JSON.stringify(this.transactions) + this.nonce).toString();
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
        this.difficulty = 2;
        this.pendingTransactions = []; /**Holds transactions that are required to be added in the new block. Usually miner has the choice to pick the transactions. */
        this.miningReward = 100;
    }

    createGenesisBlock() {
        return new Block("01/01/2021", "Genesis Block", "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    minePendingTransactions(miningRewardAddress) {
        let block = new Block(Date.now(), this.pendingTransactions);
        block.mineBlock(this.difficulty);

        console.log("Block successfully mined!");
        this.chain.push(block);

        /**Create a new transaction to reward the miner and push into the pending list. 
         * This will be used in next mining and miner will be rewarded. */
        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ];
    }

    createTransaction(transaction) {
        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address) {
        let balance = 0;

        for (const block of this.chain) {
            for (const trxns of block.transactions) {
                if (trxns.fromAddress === address) {
                    balance -= trxns.amount;
                }

                if (trxns.toAddress === address) {
                    balance += trxns.amount;
                }
            }
        }

        return balance;
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

ldeepakCoin.createTransaction(new Transaction('Address1', 'Address2', 100));
ldeepakCoin.createTransaction(new Transaction('Address3', 'Address4', 500));
ldeepakCoin.createTransaction(new Transaction('Address2', 'Address3', 250));

console.log('\n Starting the miner...');
ldeepakCoin.minePendingTransactions('miners_address');

console.log('\n Balance of Miner is', ldeepakCoin.getBalanceOfAddress('miners_address'));

console.log('\n Starting the miner again...');
ldeepakCoin.minePendingTransactions('miners_address');

console.log('\n Balance of Miner is', ldeepakCoin.getBalanceOfAddress('miners_address'));