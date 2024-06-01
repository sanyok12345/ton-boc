import { Cell, Slice, Transaction, loadTransaction } from "@ton/core";

interface Message {
    source: string;
    destination: string;
    value: bigint;
    body: string;
}

interface DecodedTransaction {
    account: string | null;
    lt: bigint;
    prevTrasHash: string;
    prevTransLt: bigint;
    now: number;
    outMsgCount: number;
    endStatus: number;
    inMsg: Message | null;
    outMsgs: Message[];
    totalFees: bigint;
    stateUpdate: string;
    description: string;
}

export const typeTransaction = (orig: Transaction): DecodedTransaction => {
    const account = orig.address.toString();
    const lt = orig.lt;
    const prevTrasHash = orig.prevTransactionHash.toString();
    const prevTransLt = orig.prevTransactionLt;
    const now = orig.now;
    const outMsgCount = orig.outMessagesCount;
    const endStatus = orig.endStatus === "active" ? 1 : 0;
    
    // @ts-ignore
    const inMsg: Message = orig.inMessage ? {
        source: orig.inMessage?.info.src?.toString() || "",
        destination: orig.inMessage?.info.dest?.toString() || "",
        value: BigInt(0), // не совсем до конца понятно, что тут должно быть
        body: orig.inMessage?.body.toString() || ""
    } : null;

    const outMsgs: Message[] = [];

    for (const msg of orig.outMessages.values()) {
        outMsgs.push({
            source: msg.info.src?.toString() || "",
            destination: msg.info.dest?.toString() || "",
            value: BigInt(0), // не совсем до конца понятно, что тут должно быть
            body: msg.body.toString() || ""
        });
    }

    const totalFees = orig.totalFees.coins;
    const stateUpdate = orig.stateUpdate.newHash.toString(); // и тут не совсем понятно, что должно быть 
    const description = orig.description.type.toString();

    return {
        account,
        lt,
        prevTrasHash,
        prevTransLt,
        now,
        outMsgCount,
        endStatus,
        inMsg,
        outMsgs,
        totalFees,
        stateUpdate,
        description
    }
}

export const decodeTransaction = async (slice: Slice): Promise<DecodedTransaction> => {
    const tx = loadTransaction(slice);

    return typeTransaction(tx);
}