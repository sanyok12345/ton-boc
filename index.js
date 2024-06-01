const client = require("./client");
const config = require("./config");

const { Address, Cell, loadTransaction } = require("@ton/core");
const { bigIntToBuffer } = require("./util");
const { decodeTransaction } = require("./boc");

const main = async () => {
    const master = await client.getMasterchainInfo();

    const address = Address.parse(config.address);

    const account = await client.getAccountState(address, master.last);

    const lastTxLt = account.lastTx.lt.toString();
    const lastTxHash = bigIntToBuffer(account.lastTx.hash);

    const rawHistory = await client.getAccountTransactions(
        address,
        lastTxLt,
        lastTxHash,
        10 // 10 transactions limit
    );

    const decodedHistory = Cell.fromBoc(
        rawHistory.transactions
    );

    for (const txRaw of decodedHistory) {
        const tx = await decodeTransaction(
            txRaw.beginParse() // Begin parsing the transaction
        );

        console.log(tx); // Parsed transaction ura
    }
}

main();