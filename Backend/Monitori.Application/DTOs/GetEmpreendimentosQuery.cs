using Monitori.Domain.Enums;

namespace Monitori.Application.DTOs;

public class GetEmpreendimentosQuery
{
    public string? Nome { get; set; }
    public StatusEmpreendimento? Status { get; set; }
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string? SortBy { get; set; } = "Nome";
    public string? SortOrder { get; set; } = "asc";
}
