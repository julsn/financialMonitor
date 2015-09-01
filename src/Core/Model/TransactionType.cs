namespace LazyCat.Finance.Core.Model
{
    public enum TransactionType
    {
        CardMachinePayment = 0,
        ATMWithdrawal = 1,
        ChipknipWithdrawal = 2,
        SepaTransfer = 3,
        iDeal = 4,
        BankPayment = 5,
    }
}