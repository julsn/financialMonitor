using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using LazyCat.Finance.Core.Model;

namespace LazyCat.Finance.Core.Managers.Categorizers
{
    public class BankPaymentCategorizer : ICategorizer
    {
        private readonly IList<CategorizeRule> _rules;

        public BankPaymentCategorizer(IList<CategorizeRule> rules)
        {
            _rules = rules;
        }

        public SubCategory FindCategory(string description)
        {
            var regex = new Regex(@"ABN AMRO Bank");
            var match = regex.Match(description);

            if (!match.Success)
                return null;

            return _rules.First().SubCategory;
        }
    }
}