using LazyCat.Finance.Core.Model;

namespace LazyCat.Finance.Core.Managers
{
    public interface ICategorizer
    {
        SubCategory FindCategory(string description);
    }
}