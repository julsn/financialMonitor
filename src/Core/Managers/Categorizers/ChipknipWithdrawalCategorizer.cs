using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using LazyCat.Finance.Core.Model;

namespace LazyCat.Finance.Core.Managers.Categorizers
{
    public class ChipknipWithdrawalCategorizer : ICategorizer
    {
        private readonly IList<CategorizeRule> _rules;

        public ChipknipWithdrawalCategorizer(IList<CategorizeRule> rules)
        {
            _rules = rules;
        }

        public SubCategory FindCategory(string description)
        {
            var regex = new Regex(@"CHIP\s+.*");
            var match = regex.Match(description);

            if (!match.Success)
                return null;

            return _rules.First().SubCategory;
        }
    }
}