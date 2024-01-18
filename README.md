# Token Balance

A script to fetch the balance of all unique ERC20 tokens for a specified Ethereum EOA in wei and writes the results to a CSV file.

## Usage

Make sure you have the latest versions of Node and npm installed, change the 'addAddressOfEAO' on L56 in the 'token_task.js' file to the desired EOA and then do the following:

1. Install the required libraries:
```bash
   npm install axios csv-writer fs path
```
2. Run the script:
```bash
   node token_task.js
```

You will see a new folder named 'results' in the directory from where you called this script, inside will be a CSV containing all of the token balances for the specified EOA.

## License

[MIT](https://choosealicense.com/licenses/mit/)