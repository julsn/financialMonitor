namespace LazyCat.Finance.Core.Model
{
    public class CategorizeRule
    {
        public int Id { get; set; }

        public string Data { get; set; }

        public SubCategory SubCategory { get; set; }

        public TransactionType TransactionType { get; set; }
    }
}