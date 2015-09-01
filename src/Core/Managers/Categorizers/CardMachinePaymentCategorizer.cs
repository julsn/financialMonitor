using System.Collections.Generic;
using System.Text.RegularExpressions;
using LazyCat.Finance.Core.Model;

namespace LazyCat.Finance.Core.Managers.Categorizers
{
    public class CardMachinePaymentCategorizer : ICategorizer
    {
        private readonly IList<CategorizeRule> _rules;

        public CardMachinePaymentCategorizer(IList<CategorizeRule> rules)
        {
            _rules = rules;
        }

        public SubCategory FindCategory(string description)
        {
            var regex = new Regex(@"BEA\s+\S+\s+\d{2}\.\d{2}\.\d{2}/\d{2}\.\d{2}\s+(?<desc>.+(?=,PAS\d{3}))");
            var match = regex.Match(description);

            if (!match.Success)
                return null;

            var desc = match.Groups["desc"].Value;

            foreach (var rule in _rules)
            {
                regex = new Regex(rule.Data);

                if (regex.IsMatch(desc))
                    return rule.SubCategory;
            }

            return null;
        }
    }
}