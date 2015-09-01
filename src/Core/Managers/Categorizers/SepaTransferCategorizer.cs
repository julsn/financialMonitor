using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using LazyCat.Finance.Core.Model;

namespace LazyCat.Finance.Core.Managers.Categorizers
{
    public class SepaTransferCategorizer : ICategorizer
    {
        private readonly IList<CategorizeRule> _rules;

        public SepaTransferCategorizer(IList<CategorizeRule> rules)
        {
            _rules = rules;
        }

        public SubCategory FindCategory(string description)
        {
            var regex = new Regex(@"/TRTP/SEPA\s.+?/NAME/(?<name>.+)");
            var match = regex.Match(description);

            if (!match.Success)
                return null;

            var desc = match.Groups["name"].Value;

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