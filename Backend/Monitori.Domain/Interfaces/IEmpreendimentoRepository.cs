using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Monitori.Domain.Entities;
using Monitori.Domain.Enums;

namespace Monitori.Domain.Interfaces;

public interface IEmpreendimentoRepository
{
    Task AddAsync(Empreendimento empreendimento);
    Task UpdateAsync(Empreendimento empreendimento);
    Task<Empreendimento?> GetByIdAsync(Guid id);
    Task<Empreendimento?> GetByCnpjAsync(string cnpj);
    Task<(IEnumerable<Empreendimento> Items, int TotalCount)> ListAsync(
        string? nome,
        StatusEmpreendimento? status,
        string? sortBy,
        string? sortOrder,
        int pageNumber,
        int pageSize);
}
