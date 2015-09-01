using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using LazyCat.Finance.Core.DataAccess;
using LazyCat.Finance.Core.Managers.Categorizers;
using LazyCat.Finance.Core.Model;

namespace LazyCat.Finance.Core.Managers
{
    public class CategorizationManager
    {
        public void Categorize(bool force = false)
        {
            using (var dbCtx = new DatabaseContext())
            {
                var transactions = dbCtx.Transactions.Where(x => force || x.SubCategory == null).ToList();

                if (!transactions.Any())
                    return;

                var categorizers = InitCategorizers(dbCtx);

                foreach (var transaction in transactions)
                {
                    Categorize(transaction, categorizers);
                }

                dbCtx.SaveChanges();
            }
        }

        private IList<ICategorizer> InitCategorizers(DatabaseContext dbCtx)
        {
            var rules = dbCtx.CategorizeRules.Include(x => x.SubCategory).ToList();

            return new ICategorizer[]
            {
                new ATMWithdrawalCategorizer(GetRules(rules, TransactionType.ATMWithdrawal)),
                new BankPaymentCategorizer(GetRules(rules, TransactionType.BankPayment)),
                new CardMachinePaymentCategorizer(GetRules(rules, TransactionType.CardMachinePayment)),
                new ChipknipWithdrawalCategorizer(GetRules(rules, TransactionType.ChipknipWithdrawal)),
                new iDealCategorizer(GetRules(rules, TransactionType.iDeal)),
                new SepaTransferCategorizer(GetRules(rules, TransactionType.SepaTransfer))
            };
        }

        private IList<CategorizeRule> GetRules(IEnumerable<CategorizeRule> rules, TransactionType type)
        {
            return rules.Where(x => x.TransactionType == type).ToList();
        }

        private void Categorize(Transaction transaction, IEnumerable<ICategorizer> categorizers)
        {
            foreach (var categorizer in categorizers)
            {
                var category = categorizer.FindCategory(transaction.Description);

                if (category != null)
                {
                    transaction.SubCategory = category;
                    return;
                }
            }
        }
    }
}