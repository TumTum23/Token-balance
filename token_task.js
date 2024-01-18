const axios = require('axios');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fs = require('fs');
const path = require('path');
const Web3 = require('web3');

const etherscanAPI = 'https://api.etherscan.io/api?module=account&action=tokentx&startblock=0&endblock=999999999&sort=asc&apikey=2V5X1VTN268X42XV1NZQMIKT8YIVY52XMG';

async function getEOATokenDetails(eoaHash) {
    try {
        const dir = path.join(__dirname, 'results');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }

        const existingFiles = fs.readdirSync(dir).filter(file => file.startsWith('balances_v') && file.endsWith('.csv'));
        const highestVersion = Math.max(...existingFiles.map(file => parseInt(file.slice(10, -4))), 0);

        const csvWriter = createCsvWriter({
            path: path.join(dir, `balances_v${highestVersion + 1}.csv`),
            header: [
                {id: 'contractAddress', title: 'CONTRACT_ADDRESS'},
                {id: 'balance', title: 'BALANCE_WEI'}
            ]
        });

        const response = await axios.get(`${etherscanAPI}&address=${eoaHash}`);
        const receivedTransactions = response.data.result.filter(tx => tx.to.toLowerCase() === eoaHash.toLowerCase() && tx.value > 0);

        const uniqueTokens = [...new Set(receivedTransactions.map(tx => tx.contractAddress))];
        const records = [];

        for (let address of uniqueTokens) {
            const balanceResponse = await axios.get(`https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=${address}&address=${eoaHash}&tag=latest&apikey=2V5X1VTN268X42XV1NZQMIKT8YIVY52XMG`);
            const balanceInWei = balanceResponse.data.result;

            records.push({
                contractAddress: address,
                balance: balanceInWei
            });
        }

        await csvWriter.writeRecords(records);
        console.log('CSV file written successfully');
    } catch (error) {
        if (error.response) {
            console.log('Error with Etherscan API');
        } else if (error.request) {
            console.log('Error whilst creating CSV');
        } else {
            console.log('Error', error.message);
        }
    }
}

getEOATokenDetails('addAddressOfEAO');
