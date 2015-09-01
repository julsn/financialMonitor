using System.Collections.Generic;
using System.Text.RegularExpressions;
using LazyCat.Finance.Core.Model;

namespace LazyCat.Finance.Core.Managers.Categorizers
{
    public class iDealCategorizer : ICategorizer
    {
        private readonly IList<CategorizeRule> _rules;

        public iDealCategorizer(IList<CategorizeRule> rules)
        {
            _rules = rules;
        }

        public SubCategory FindCategory(string description)
        {
            var regex = new Regex(@"/TRTP/iDEAL/.+?/NAME/(?<name>.+)");
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