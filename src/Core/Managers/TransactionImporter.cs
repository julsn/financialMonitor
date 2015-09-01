using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using LazyCat.Finance.Core.DataAccess;
using LazyCat.Finance.Core.Model;

namespace LazyCat.Finance.Core.Managers
{
    public class TransactionImporter
    {
        public TransactionImportResult Import(TextReader reader)
        {
            var parsed = new List<Transaction>();
            var failed = new List<string>();

            var line = reader.ReadLine();

            while (line != null)
            {
                if (!string.IsNullOrEmpty(line))
                {
                    Transaction transaction;

                    if (TryParseTransaction(line, out transaction))
                        parsed.Add(transaction);
                    else
                        failed.Add(line);
                }

                line = reader.ReadLine();
            }

            if (parsed.Count > 0)
            {
                ImportTransactions(parsed);
            }

            return new TransactionImportResult
            {
                TotalRecordCount = parsed.Count + failed.Count,
                TotalImported = parsed.Count,
                Failed = failed
            };
        }

        private bool TryParseTransaction(string line, out Transaction transaction)
        {
            transaction = null;

            var parts = line.Split('\t');

            if (parts.Length != 8)
                return false;

            var data = new
            {
                AccountNumber = parts[0],
                Corrency = parts[1],
                Date1 = DateTime.ParseExact(parts[2], "yyyyMMdd", CultureInfo.InvariantCulture),
                BalanceBefore = decimal.Parse(parts[3], new NumberFormatInfo { NumberDecimalSeparator = "," }),
                BalanceAfter = decimal.Parse(parts[4], new NumberFormatInfo { NumberDecimalSeparator = "," }),
                Date2 = DateTime.ParseExact(parts[5], "yyyyMMdd", CultureInfo.InvariantCulture),
                Amount = decimal.Parse(parts[6], new NumberFormatInfo { NumberDecimalSeparator = ","}),
                Description = parts[7]
            };

            transaction = new Transaction
            {
                AccountNumber = data.AccountNumber,
                Date = data.Date1,
                BalanceBefore = data.BalanceBefore,
                BalanceAfter = data.BalanceAfter,
                Debit = data.Amount > 0 ? data.Amount : 0,
                Credit = data.Amount < 0 ? Math.Abs(data.Amount) : 0,
                Description = data.Description
            };

            return true;
        }

        private void ImportTransactions(IEnumerable<Transaction> transactions)
        {
            using (var dbContext = new DatabaseContext())
            {
                dbContext.Transactions.AddRange(transactions);
                dbContext.SaveChanges();
            }
        }
    }
}