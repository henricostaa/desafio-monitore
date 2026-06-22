using System;

namespace Monitori.Application.DTOs;

public class EmpreendimentoDto
{
    public Guid Id { get; set; }
    public string Nome { get; set; } = null!;
    public string CNPJ { get; set; } = null!;
    public string? Endereco { get; set; }
    public string Status { get; set; } = null!;
    public DateTime DataCriacao { get; set; }
}
