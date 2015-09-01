using LazyCat.Finance.Core.Model;

namespace LazyCat.Finance.Core.Managers
{
    public class ListOptions
    {
        public int PageSize { get; set; }
        public int PageNumber { get; set; }
        public string Filter { get; set; }
        public SubCategory SubCategoryFilter { get; set; }
    }
}