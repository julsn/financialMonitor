using System;
using System.Collections.Generic;
using System.Linq;
using LazyCat.Finance.Core.DataAccess;
using LazyCat.Finance.Core.Model;
using System.Data.Entity;

namespace LazyCat.Finance.Core.Managers
{
    public class TransactionManager
    {
        public IList<Transaction> GetTransactions(ListOptions opt)
        {
            using (var dbContext = new DatabaseContext())
            {
                var query = dbContext.Transactions
                    .Include(x => x.SubCategory)
                    .OrderByDescending(x => x.Date)
                    .Skip(opt.PageNumber * opt.PageSize)
                    .Take(opt.PageSize)
                    ;
                
                return query.ToList();
            }
        }

        public IList<Transaction> GetTransactions(DateTime dateFrom, DateTime dateTo, BalanceType type, string categoryName)
        {
            using (var dbContext = new DatabaseContext())
            {
                var category = dbContext.SubCategories.FirstOrDefault(x => x.Name == categoryName);
                if (category == null)
                    return new List<Transaction>();

                var transactions = dbContext.Transactions.Include(x => x.SubCategory.Category);
                return 
                    (from t in transactions
                     where t.Date >= dateFrom && t.Date < dateTo 
                        && t.SubCategory.Id == category.Id
                        && (type == BalanceType.Credit ? t.Credit > 0 : t.Debit > 0)
                     select t)
                     .ToList();
            }
        }

        public IList<Transaction> GetUncategorizedTransactions(DateTime dateFrom, DateTime dateTo, BalanceType type)
        {
            using (var dbContext = new DatabaseContext())
            {
                var transactions = dbContext.Transactions;
                return
                    (from t in transactions
                     where t.Date >= dateFrom && t.Date <= dateTo
                        && t.SubCategory == null
                        && (type == BalanceType.Credit ? t.Credit > 0 : t.Debit > 0)
                     select t)
                     .ToList();
            }
            
        }

        public Transaction GetTransaction(int id)
        {
            using (var dbContext = new DatabaseContext())
            {
                var transactions = dbContext.Transactions.Include(x => x.SubCategory.Category);
                return transactions.FirstOrDefault(x => x.Id == id);
            }
        }

        public IList<SubCategory> GetSubCategories()
        {
            using (var dbContext = new DatabaseContext())
            {
                return dbContext.SubCategories
                    .Include(x => x.Category)
                    .ToList();
            }
        }

        public SubCategory GetSubCategory(int id)
        {
            using (var dbContext = new DatabaseContext())
            {
                return dbContext.SubCategories
                    .Single(x => x.Id == id);
            }
        }

        public IList<CategorizeRule> GetCategorizeRules()
        {
            using (var dbContext = new DatabaseContext())
            {
                return dbContext.CategorizeRules
                    .Include(x => x.SubCategory)
                    .Include(x => x.SubCategory.Category)
                    .ToList();
            }
        }
        
        public CategorizeRule GetCategorizeRule(int id)
        {
            using (var dbContext = new DatabaseContext())
            {
                return dbContext.CategorizeRules
                    .Include(x => x.SubCategory)
                    .Include(x => x.SubCategory.Category)
                    .Single(x => x.Id == id);
            }
        }

        public void SetSubCategory(int id, int subCategoryId)
        {
            using (var dbContext = new DatabaseContext())
            {
                var transaction = dbContext.Transactions.First(x => x.Id == id);
                transaction.SubCategory = dbContext.SubCategories.First(x => x.Id == subCategoryId);

                dbContext.SaveChanges();
            }
        }

        public void SaveRule(CategorizeRule rule)
        {
            using (var dbContext = new DatabaseContext())
            {
                if (rule.Id == 0)
                {
                    var categorizeRule = new CategorizeRule
                    {
                        Data = rule.Data,
                        SubCategory = dbContext.SubCategories.First(c => c.Id == rule.SubCategory.Id),
                        TransactionType = rule.TransactionType
                    };

                    dbContext.CategorizeRules.Add(categorizeRule);
                }
                else
                {
                    var categorizeRule = dbContext.CategorizeRules.First(r => r.Id == rule.Id);

                    categorizeRule.Data = rule.Data;
                    categorizeRule.SubCategory = dbContext.SubCategories.First(c => c.Id == rule.SubCategory.Id);
                    categorizeRule.TransactionType = rule.TransactionType;
                }

                dbContext.SaveChanges();
            }
        }

        public void RemoveCategorizeRule(int id)
        {
            using (var dbContext = new DatabaseContext())
            {
                var rule = dbContext.CategorizeRules.First(x => x.Id == id);
                dbContext.CategorizeRules.Remove(rule);

                dbContext.SaveChanges();
            }
        }
    }
}