namespace LazyCat.Finance.Core.Model
{
    public class BalancePerSubCategory
    {
        public SubCategory SubCategory { get; set; }
        public decimal Amount { get; set; }
    }

    public class BalancePerCategory
    {
        public Category Category { get; set; }
        public decimal Amount { get; set; }
    }
}