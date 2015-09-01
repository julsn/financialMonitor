using System;
using System.Linq;
using System.Web.Http;
using LazyCat.Finance.Core.Managers;
using LazyCat.Finance.Core.Model;

namespace Web.Controllers
{
    [RoutePrefix("categories")]
    public class CategoryController : ApiController
    {
        [HttpGet]
        [Route("")]
        public dynamic GetSubCategories()
        {
            var transactionManager = new TransactionManager();
            return transactionManager
                .GetSubCategories()
                .OrderBy(x => x.Category.DisplayOrder)
                .ThenBy(x => x.DisplayOrder)
                .Select(x => new
                {
                    x.Id,
                    Name = x.Name,
                    Category = x.Category.Name
                })
                .ToList();
        }

        [HttpGet]
        [Route("categorizeRules")]
        public dynamic GetCategoryRules()
        {
            var transactionManager = new TransactionManager();
            return transactionManager
                .GetCategorizeRules()
                .OrderBy(x => x.SubCategory.Category.DisplayOrder)
                .ThenBy(x => x.SubCategory.DisplayOrder)
                .ThenBy(x => x.Data)
                .Select(x => new
                {
                    x.Id,
                    x.Data,
                    Category = x.SubCategory,
                    TransactionType = x.TransactionType.ToString()
                })
                .ToList();
        }
        
        [HttpGet]
        [Route("categorizeRules/transactionTypes")]
        public dynamic GetTransactionTypes()
        {
            return Enum.GetNames(typeof (TransactionType));
        }

        [HttpGet]
        [Route("categorizeRules/{id}")]
        public dynamic GetCategorizeRule(int id)
        {
            var transactionManager = new TransactionManager();
            var rule = transactionManager.GetCategorizeRule(id);

            return new
            {
                rule.Id,
                rule.Data,
                Category = rule.SubCategory,
                TransactionType = rule.TransactionType.ToString()
            };
        }

        [HttpPost]
        [Route("categorizeRules")]
        public void SaveCategorizeRule(dynamic data)
        {
            var transactionManager = new TransactionManager();

            var rule = new CategorizeRule
            {
                Data = data.data,
                TransactionType = Enum.Parse(typeof (TransactionType), data.transactionType.ToString()),
                SubCategory = transactionManager.GetSubCategory((int) data.category.id)
            };

            transactionManager.SaveRule(rule);

        }

        [HttpPut]
        [Route("categorizeRules/{id}")]
        public void SaveCategorizeRule(int id, dynamic data)
        {
            var transactionManager = new TransactionManager();
            var rule = transactionManager.GetCategorizeRule(id);

            rule.Data = data.data;
            rule.TransactionType = Enum.Parse(typeof (TransactionType), data.transactionType.ToString());
            rule.SubCategory = transactionManager.GetSubCategory((int)data.category.id);

            transactionManager.SaveRule(rule);
        }
        
        [HttpDelete]
        [Route("categorizeRules/{id}")]
        public void RemoveCategorizeRule(int id)
        {
            var transactionManager = new TransactionManager();
            transactionManager.RemoveCategorizeRule(id);

        }
    }
}