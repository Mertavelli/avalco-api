const Transfer = require("../models/Transfer");
const User = require("../models/User");

const getAllTransfers = async (req, res) => {
    try {
        const { _id } = req.user || {};

        const query = {
            $or: [{ receiver: _id }, { sender: _id }],
        };

        const [invoicesArray, invoices30Array, installmentsArray] = await Promise.all([
            Invoice.find(query).populate("receiver").populate("sender"),
            Invoice30.find(query).populate("receiver").populate("sender"),
            Installment.find(query).populate("receiver").populate("sender"),
        ]);

        // Kombinieren der drei Arrays in einem
        const allInvoices = [...invoicesArray, ...invoices30Array, ...installmentsArray];

        // Erstellen Sie eine Kopie des allInvoices-Arrays und sortieren Sie diese Kopie
        const sortedInvoices = [...allInvoices].sort((a, b) => Number(b?.createdDate) - Number(a?.createdDate));

        res.status(200).json(sortedInvoices);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Server error occurred!!",
        });
    }
};

const getTransferByIdController = async (req, res) => {
    try {
        const { id } = req.params || {};
        const invoice = await Invoice.findById(id)
            .populate("receiver")
            .populate("sender");
        res.status(200).json(invoice);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Server error occurred!!",
        });
    }
};

const createNewTransferController = async (req, res) => {
    console.log("Body", req.body);
    try {
        const { receiver, sender, brutto, netto, fee, description, selectedRate } = req.body || {};

        const newTransfer = new Transfer({
            receiver: receiver?._id,
            sender: sender?._id,
            netto: netto,
            brutto: brutto,
            fee: fee,
            description: description,
            createdDate: Date.now(),
            processed: false,
            rates: selectedRate
        });

        await newTransfer.save();


        /*                      const debtor = await User.findById(newTransfer?.receiver);
                            const creditor = await User.findById(newTransfer?.sender);
                        
                            debtor.balance += amountNumber;
                            creditor.balance -= amountNumber;
                        
                            await debtor.save();
                            await creditor.save(); */

        const transfer = await Transfer.findById(newTransfer?._id)
            .populate({
                path: "receiver",
                select: "_id name email"
            })
            .populate({
                path: "sender",
                select: "_id name email"
            });

        console.log("transfer", transfer);

        res.status(201).json(transfer);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Server error occurred!!",
        });
    }
};

module.exports = {
    getAllTransfers,
    getTransferByIdController,
    createNewTransferController,
};
