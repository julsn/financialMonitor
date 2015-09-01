using System.Collections.Generic;
using LazyCat.Finance.Core.Managers.Categorizers;
using LazyCat.Finance.Core.Model;
using NUnit.Framework;

namespace UnitTests
{
    [TestFixture]
    public class CategorizerTests
    {
        [Test]
        public void CardMachineTest()
        {
            var rule = new CategorizeRule
            {
                SubCategory = new SubCategory {Name = "Shopping"},
                Data = "ALBERT HEIJN"
            };

            var categorizer = new CardMachinePaymentCategorizer(new List<CategorizeRule> {rule});
            var category = categorizer.FindCategory("BEA   NR:LV4ZJ5   29.11.14/12.46 ALBERT HEIJN 1820 AMSTEL,PAS161");

            Assert.NotNull(category);
            Assert.AreEqual("Shopping", category.Name);
        }

        [Test]
        public void ATMWithdrawalTest()
        {
            var rule = new CategorizeRule
            {
                SubCategory = new SubCategory { Name = "ATM Withdrawal" },
            };

            var categorizer = new ATMWithdrawalCategorizer(new List<CategorizeRule> { rule });
            var category = categorizer.FindCategory("GEA   NR:S5A080   01.12.14/18.33 ING AMSTELVEEN,PAS161");

            Assert.NotNull(category);
            Assert.AreEqual("ATM Withdrawal", category.Name);
        }

        [Test]
        public void ChipknipWithdrawalTest()
        {
            var rule = new CategorizeRule
            {
                SubCategory = new SubCategory { Name = "Chipknip Withdrawal" },
            };

            var categorizer = new ChipknipWithdrawalCategorizer(new List<CategorizeRule> { rule });
            var category = categorizer.FindCategory("CHIP  NR:01202142 05.12.14/12.03 Oplaadpunt Chipknip,PAS151       ! CHIPKNIP STOPT PER 1-1-2015 !                                  ");

            Assert.NotNull(category);
            Assert.AreEqual("Chipknip Withdrawal", category.Name);
            
        }

        [Test]
        public void DirectDebitTest()
        {
            var rule = new CategorizeRule
            {
                SubCategory = new SubCategory { Name = "Health" },
                Data = "Delta Lloyd Zorgverzekeringen"
            };

            var categorizer = new SepaTransferCategorizer(new List<CategorizeRule> { rule });
            var category = categorizer.FindCategory("/TRTP/SEPA Incasso algemeen doorlopend/CSID/NL02ZZZ271189120000 /NAME/Delta Lloyd Zorgverzekeringen/MARF/453616488004001001/REMI/ kenmerk 1081611143255648 Rel.nr. 453616488 Periode 01-12-2014/31- 12-2014 Delta Lloyd Zorgverzekering/IBAN/NL55INGB0657442720/BIC/I NGBNL2A/EREF/SDD025618392/ULTD//NAME/ABN                       ");

            Assert.NotNull(category);
            Assert.AreEqual("Health", category.Name);
        }

        [Test]
        public void DirectDebitTest1()
        {
            var rule = new CategorizeRule
            {
                SubCategory = new SubCategory { Name = "Gas" },
                Data = "UNITEDCONSUMERS.*Gas"
            };

            var categorizer = new SepaTransferCategorizer(new List<CategorizeRule> { rule });
            var category = categorizer.FindCategory("/TRTP/SEPA Incasso algemeen doorlopend/CSID/NL44ZZZ050571480000 /NAME/UNITEDCONSUMERS ENERGIE/MARF/570974/REMI/Gas met korting -  Voorschot dec. 2014 (Incl. BTW) - 1188CZ 22/IBAN/NL56RABO01579367 75/BIC/RABONL2U/EREF/11565637                                  ");

            Assert.NotNull(category);
            Assert.AreEqual("Gas", category.Name);
        }

        [Test]
        public void iDealTest()
        {
            var rule = new CategorizeRule
            {
                SubCategory = new SubCategory { Name = "Mobile Phone" },
                Data = "Lebara"
            };

            var categorizer = new iDealCategorizer(new List<CategorizeRule> { rule });
            var category = categorizer.FindCategory("/TRTP/iDEAL/IBAN/NL51ABNA0565668625/BIC/ABNANL2A/NAME/STG ADYEN/REMI/1714311683393307 0030001153379018 36404 001057Lebara/EREF/09-05-2015 12:46 0030001153379018");

            Assert.NotNull(category);
            Assert.AreEqual("Mobile Phone", category.Name);
        }

        [Test]
        public void BankPaymentCategorizer()
        {
            var rule = new CategorizeRule
            {
                SubCategory = new SubCategory { Name = "Bank payment" },
            };

            var categorizer = new BankPaymentCategorizer(new List<CategorizeRule> { rule });
            var category = categorizer.FindCategory("ABN AMRO Bank N.V.               For curr POS                0,15 Prive pakket                3,10 Debit card                  0,70");

            Assert.NotNull(category);
            Assert.AreEqual("Bank payment", category.Name);
            
        }

        [Test]
        public void SepaTransferTest()
        {
            var rule = new CategorizeRule
            {
                SubCategory = new SubCategory { Name = "Salary" },
                Data = "AERDATA B.V."
            };

            var categorizer = new SepaTransferCategorizer(new List<CategorizeRule> { rule });
            var category = categorizer.FindCategory("/TRTP/SEPA OVERBOEKING/IBAN/NL36RABO0129560464/BIC/RABONL2U/NAME/ AERDATA B.V./REMI/SALARISBETALING PERIODE 12/EREF/29-39202-01-50");

            Assert.NotNull(category);
            Assert.AreEqual("Salary", category.Name);
        }
    }
}