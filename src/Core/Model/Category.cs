using System.Collections.Generic;
using System.Runtime.Serialization;

namespace LazyCat.Finance.Core.Model
{
    public class Category
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int DisplayOrder { get; set; }

        [IgnoreDataMember]
        public IList<SubCategory> SubCategories { get; set; }
    }
}