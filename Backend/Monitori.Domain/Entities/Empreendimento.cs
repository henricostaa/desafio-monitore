using System;
using System.Linq;
using Monitori.Domain.Enums;
using Monitori.Domain.Exceptions;

namespace Monitori.Domain.Entities;

public class Empreendimento
{
    public Guid Id { get; private set; }
    public string Nome { get; private set; } = null!;
    public string CNPJ { get; private set; } = null!;
    public string? Endereco { get; private set; }
    public StatusEmpreendimento Status { get; private set; }
    public DateTime DataCriacao { get; private set; }

    private Empreendimento() { }

    public Empreendimento(string nome, string cnpj, string? endereco)
    {
        Id = Guid.NewGuid();
        DataCriacao = DateTime.UtcNow;
        Status = StatusEmpreendimento.Ativo;
        
        SetNome(nome);
        SetCnpj(cnpj);
        SetEndereco(endereco);
    }

    public void AtualizarDados(string nome, string? endereco)
    {
        if (Status != StatusEmpreendimento.Ativo)
        {
            throw new DomainException("Edição permitida APENAS para empreendimentos ativos.");
        }

        SetNome(nome);
        SetEndereco(endereco);
    }

    public void Inativar()
    {
        Status = StatusEmpreendimento.Inativo;
    }

    private void SetNome(string nome)
    {
        if (string.IsNullOrWhiteSpace(nome))
        {
            throw new DomainException("O nome do empreendimento é obrigatório.");
        }

        if (nome.Trim().Length < 3)
        {
            throw new DomainException("O nome do empreendimento deve conter no mínimo 3 caracteres.");
        }

        Nome = nome.Trim();
    }

    private void SetCnpj(string cnpj)
    {
        if (string.IsNullOrWhiteSpace(cnpj))
        {
            throw new DomainException("O CNPJ do empreendimento é obrigatório.");
        }

        string apenasNumeros = new string(cnpj.Where(char.IsDigit).ToArray());

        if (apenasNumeros.Length != 14)
        {
            throw new DomainException("CNPJ inválido. O CNPJ deve conter exatamente 14 dígitos.");
        }

        CNPJ = apenasNumeros;
    }

    private void SetEndereco(string? endereco)
    {
        Endereco = string.IsNullOrWhiteSpace(endereco) ? null : endereco.Trim();
    }
}
