using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using LazyCat.Finance.Core.Managers;
using LazyCat.Finance.Core.Model;

namespace Web.Controllers
{
    [RoutePrefix("transactions")]
    public class TransactionsController : ApiController
    {
        [Route("")]
        public IList<Transaction> Get(int pageNumber, int pageSize, string filter)
        {
            var transactionManager = new TransactionManager();
     
            return transactionManager.GetTransactions(new ListOptions
            {
                PageSize = pageSize,
                PageNumber = pageNumber
            });
        }
        
        [Route("{id:int}")]
        public Transaction Get(int id)
        {
            var transactionManager = new TransactionManager();
     
            return transactionManager.GetTransaction(id);
        }

        [HttpGet]
        [Route("uncategorized/{balanceType}/{from}/{to}")]
        public IList<Transaction> GetUncategorizedTransactions(string from, string to, string balanceType)
        {
            var dateFrom = DateTime.ParseExact(from, "yyyyMMdd", CultureInfo.InvariantCulture);
            var dateTo = DateTime.ParseExact(to, "yyyyMMdd", CultureInfo.InvariantCulture);
            var type = (BalanceType)Enum.Parse(typeof(BalanceType), balanceType, true);

            var transactionManager = new TransactionManager();
            var list = transactionManager.GetUncategorizedTransactions(dateFrom, dateTo, type);

            return list;
        }

        [HttpGet]
        [Route("{balanceType}/{from}/{to}/{category}")]
        public IList<Transaction> GetTransactionsByCategory(string from, string to, string balanceType, string category)
        {
            var dateFrom = DateTime.ParseExact(from, "yyyyMMdd", CultureInfo.InvariantCulture);
            var dateTo = DateTime.ParseExact(to, "yyyyMMdd", CultureInfo.InvariantCulture);
            var type = (BalanceType) Enum.Parse(typeof (BalanceType), balanceType, true);

            var transactionManager = new TransactionManager();
            var list = transactionManager.GetTransactions(dateFrom, dateTo, type, category);

            return list;
        }

        [HttpPost]
        [Route("upload")]
        public async void Upload()
        {
            if (!Request.Content.IsMimeMultipartContent())
                throw new HttpResponseException(HttpStatusCode.UnsupportedMediaType);

            var provider = new MultipartMemoryStreamProvider();

            await Request.Content.ReadAsMultipartAsync(provider);

            var httpContent = provider.Contents.First();

            var fileContent = await httpContent.ReadAsStringAsync();

            var importer = new TransactionImporter();

            using (var stringReader = new StringReader(fileContent))
            {
                importer.Import(stringReader);
            }

            var manager = new CategorizationManager();
            manager.Categorize();
        }

        [HttpPost]
        [Route("categorize")]
        public void Categorize()
        {
            var manager = new CategorizationManager();
            manager.Categorize();
        }

        [HttpPost]
        [Route("{id}/updateCategory")]
        public void SetCategory(int id, [FromBody]int categoryId)
        {
            var transactionManager = new TransactionManager();
            transactionManager.SetSubCategory(id, categoryId);
        }
    }
}