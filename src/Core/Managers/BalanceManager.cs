using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using LazyCat.Finance.Core.DataAccess;
using LazyCat.Finance.Core.Model;

namespace LazyCat.Finance.Core.Managers
{
    public class BalanceManager
    {
        public IList<BalancePerMonth> GetBalancePerMonth(DateTime dateFrom, DateTime dateTo)
        {
            using (var dbContext = new DatabaseContext())
            {
                return
                    (from t in dbContext.Transactions
                        where t.Date >= dateFrom && t.Date < dateTo 
                        group t by new { t.Date.Year, t.Date.Month }
                        into gr
                        select new
                        {
                            gr.Key.Year,
                            gr.Key.Month,
                            Debit = gr.Sum(x => x.Debit),
                            Credit = gr.Sum(x => x.Credit),
                        })
                        .ToList()
                        .Select(x => new BalancePerMonth
                        {
                            Year = x.Year,
                            Month = x.Month,
                            Period = new DateTime(x.Year, x.Month, 1).ToString("MMM yyyy"),
                            Debit = x.Debit,
                            Credit = x.Credit
                        })
                        .OrderBy(x => x.Year)
                        .ThenBy(x => x.Month)
                        .ToList()
                        ;
            }
        }

        public IList<BalancePerCategory> GetBalancePerCategory(DateTime dateFrom, DateTime dateTo, BalanceType type)
        {
            using (var dbContext = new DatabaseContext())
            {
                var transactions = dbContext.Transactions.Include(x => x.SubCategory.Category);
                return
                    (from t in transactions
                        where t.Date >= dateFrom && t.Date < dateTo
                        group t by t.SubCategory.Category
                        into gr
                        select new
                        {
                            Category = gr.Key,
                            Debit = gr.Sum(x => x.Debit),
                            Credit = gr.Sum(x => x.Credit),
                        })
                        .ToList()
                        .Where(x => type == BalanceType.Credit ? x.Credit > 0 : x.Debit > 0)
                        .Select(x => new BalancePerCategory
                        {
                            Category = x.Category ?? new Category { Name = "Uncategorized" },
                            Amount = type == BalanceType.Credit ? x.Credit : x.Debit
                        })
                        .OrderBy(x => x.Category.DisplayOrder)
                        .ToList();
            }
        }

        public IList<BalancePerSubCategory> GetBalancePerSubCategory(DateTime dateFrom, DateTime dateTo, BalanceType type, string categoryName)
        {
            using (var dbContext = new DatabaseContext())
            {
                var category = dbContext.Category.FirstOrDefault(x => x.Name == categoryName);
                if (category == null)
                    return new List<BalancePerSubCategory>();

                var transactions = dbContext.Transactions.Include(x => x.SubCategory);
                return
                    (from t in transactions
                        where t.Date >= dateFrom && t.Date < dateTo && t.SubCategory.Category.Id == category.Id
                        group t by t.SubCategory
                        into gr
                        select new
                        {
                            SubCategory = gr.Key,
                            Debit = gr.Sum(x => x.Debit),
                            Credit = gr.Sum(x => x.Credit)
                        })
                        .ToList()
                        .Where(x => type == BalanceType.Credit ? x.Credit > 0 : x.Debit > 0)
                        .Select(x => new BalancePerSubCategory
                        {
                            SubCategory = x.SubCategory,
                            Amount = type == BalanceType.Credit ? x.Credit : x.Debit
                        })
                        .OrderBy(x => x.SubCategory.DisplayOrder)
                        .ToList();
            }
        }

        public void GetBalanceDates(out DateTime? dateFrom, out DateTime? dateTo)
        {
            dateFrom = null;
            dateTo = null;

            using (var dbContext = new DatabaseContext())
            {
                if (!dbContext.Transactions.Any())
                    return;
                
                dateFrom = dbContext.Transactions.Min(x => x.Date);
                dateTo = dbContext.Transactions.Max(x => x.Date);
            }
        }
    }
}