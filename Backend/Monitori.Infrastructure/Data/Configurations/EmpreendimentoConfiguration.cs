using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Monitori.Domain.Entities;

namespace Monitori.Infrastructure.Data.Configurations;

public class EmpreendimentoConfiguration : IEntityTypeConfiguration<Empreendimento>
{
    public void Configure(EntityTypeBuilder<Empreendimento> builder)
    {
        builder.ToTable("Empreendimentos");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Nome)
            .IsRequired()
            .HasMaxLength(150);

        builder.Property(e => e.CNPJ)
            .IsRequired()
            .HasMaxLength(14);

        builder.HasIndex(e => e.CNPJ)
            .IsUnique();

        builder.Property(e => e.Endereco)
            .HasMaxLength(250)
            .IsRequired(false);

        builder.Property(e => e.Status)
            .IsRequired()
            .HasConversion<string>()
            .HasMaxLength(20);

        builder.Property(e => e.DataCriacao)
            .IsRequired();
    }
}
