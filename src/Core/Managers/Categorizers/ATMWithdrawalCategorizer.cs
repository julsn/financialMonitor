using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using LazyCat.Finance.Core.Model;

namespace LazyCat.Finance.Core.Managers.Categorizers
{
    public class ATMWithdrawalCategorizer : ICategorizer
    {
        private readonly IList<CategorizeRule> _rules;

        public ATMWithdrawalCategorizer(IList<CategorizeRule> rules)
        {
            _rules = rules;
        }

        public SubCategory FindCategory(string description)
        {
            var regex = new Regex(@"GEA\s+.*");
            var match = regex.Match(description);

            if (!match.Success)
                return null;

            return _rules.First().SubCategory;
        }
    }
}