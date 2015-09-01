using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;
using LazyCat.Finance.Core.Model;

namespace LazyCat.Finance.Core.DataAccess
{
    public class DatabaseContext : DbContext
    {
        public DatabaseContext()
            : base("financeDb")
        {
            Configuration.LazyLoadingEnabled = false; 
        }

        public DbSet<Category> Category { get; set; }
        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<CategorizeRule> CategorizeRules { get; set; }
        public DbSet<SubCategory> SubCategories { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
        }
    }

}