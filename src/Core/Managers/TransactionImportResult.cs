using System.Collections.Generic;

namespace LazyCat.Finance.Core.Managers
{
    public class TransactionImportResult
    {
        public int TotalRecordCount { get; set; }

        public int TotalImported { get; set; }

        public IList<string> Failed { get; set; }
    }
}