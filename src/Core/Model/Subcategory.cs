namespace LazyCat.Finance.Core.Model
{
    public class SubCategory
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public int DisplayOrder { get; set; }

        public virtual Category Category { get; set; }
    }
}