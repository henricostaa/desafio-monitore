using System.ComponentModel.DataAnnotations;

namespace Monitori.Application.DTOs;

public class UpdateEmpreendimentoDto
{
    [Required(ErrorMessage = "O nome é obrigatório.")]
    [MinLength(3, ErrorMessage = "O nome deve conter no mínimo 3 caracteres.")]
    public string Nome { get; set; } = null!;

    public string? Endereco { get; set; }
}
