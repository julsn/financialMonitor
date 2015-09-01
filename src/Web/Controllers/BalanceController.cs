using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Web.Http;
using LazyCat.Finance.Core.Managers;
using LazyCat.Finance.Core.Model;

namespace Web.Controllers
{
    [RoutePrefix("balance")]
    public class BalanceController : ApiController
    {
        [HttpGet]
        [Route("{dates}")]
        public dynamic GetDates()
        {
            var transactionManager = new BalanceManager();

            DateTime? dateFrom, dateTo;
            transactionManager.GetBalanceDates(out dateFrom, out dateTo);

            if (dateFrom.HasValue && dateTo.HasValue)
                return new
                {
                    FirstDate = dateFrom.Value,
                    LastDate = dateTo.Value
                };

            return null;
        }
        
        [HttpGet]
        [Route("{from}/{to}")]
        public IList<BalancePerMonth> GetBalancePerMonth(string from, string to)
        {
            var dateFrom = DateTime.ParseExact(from, "yyyyMMdd", CultureInfo.InvariantCulture);
            var dateTo = DateTime.ParseExact(to, "yyyyMMdd", CultureInfo.InvariantCulture);
            
            var transactionManager = new BalanceManager();
            return transactionManager.GetBalancePerMonth(dateFrom, dateTo);
        }

        [HttpGet]
        [Route("{from}/{to}/{balanceType}")]
        public dynamic GetBalancePerCategory(string from, string to, string balanceType)
        {
            var dateFrom = DateTime.ParseExact(from, "yyyyMMdd", CultureInfo.InvariantCulture);
            var dateTo = DateTime.ParseExact(to, "yyyyMMdd", CultureInfo.InvariantCulture);
            var type = (BalanceType)Enum.Parse(typeof(BalanceType), balanceType, true);

            var transactionManager = new BalanceManager();
            return transactionManager.GetBalancePerCategory(dateFrom, dateTo, type)
                .Select(x => new
                {
                    CategoryId = x.Category.Id,
                    CategoryName = x.Category.Name,
                    Amount = x.Amount
                })
                .ToList();
        }

        [HttpGet]
        [Route("{from}/{to}/{balanceType}/{category}")]
        public dynamic GetBalancePerSubCategory(string from, string to, string balanceType, string category)
        {
            var dateFrom = DateTime.ParseExact(from, "yyyyMMdd", CultureInfo.InvariantCulture);
            var dateTo = DateTime.ParseExact(to, "yyyyMMdd", CultureInfo.InvariantCulture);
            var type = (BalanceType)Enum.Parse(typeof(BalanceType), balanceType, true);

            var transactionManager = new BalanceManager();
            var list = transactionManager.GetBalancePerSubCategory(dateFrom, dateTo, type, category)
                .Select(x => new
                {
                    SubCategoryId = x.SubCategory.Id,
                    SubCategoryName = x.SubCategory.Name,
                    Amount = x.Amount
                })
                .ToList();

            return list;
        }
    }
}