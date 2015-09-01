using System;

namespace LazyCat.Finance.Core.Model
{
    public class Transaction
    {
        public int Id { get; set; }

        public string AccountNumber { get; set; }

        public DateTime Date { get; set; }

        public decimal Debit { get; set; }

        public decimal Credit { get; set; }

        public decimal BalanceBefore { get; set; }

        public decimal BalanceAfter { get; set; }

        public string Description { get; set; }

        public virtual SubCategory SubCategory { get; set; }
    }
}