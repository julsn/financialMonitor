namespace LazyCat.Finance.Core.Model
{
    public class BalancePerMonth
    {
        public int Year { get; set; }
        public int Month { get; set; }
        public string Period { get; set; }
        public decimal Debit { get; set; }
        public decimal Credit { get; set; }
    }
}